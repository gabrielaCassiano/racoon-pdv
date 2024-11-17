<?php
require_once '../backend/dtos/response.php';
require_once '../backend/repository/compras_repository.php';
require_once '../backend/repository/cliente_repository.php';
require_once '../backend/repository/produto_repository.php';
require_once '../backend/repository/funcionario_repository.php';
require_once '../backend/enums/status.php';

class ComprasController {
    public static function routes($segment) {
        return match($segment) {
            'create' => self::create(json_decode(file_get_contents('php://input'))),
            'collect' => self::collect($_GET['numero_compra'] ?? null, $_GET['cpf_cliente'] ?? null, $_GET['id_empresa'] ?? null, $_GET['data'] ?? null, $_GET['id_caixa'] ?? null),
            'cashback' => self::updateCashbackStatus(json_decode(file_get_contents('php://input'))),
            default => http_response_code(Status::NOT_FOUND->value)
        };
    }

    public static function create($request) {
        global $pdo;

        if (!$request) {
            return ResponseClass::answer("Dados inválidos", Status::BAD_REQUEST);
        }

        if (!isset($request->cashback_utilizado)) {
            $request->cashback_utilizado = [];
        }

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "cpf_cliente", $request->cpf_cliente,
            "id_funcionario", $request->id_funcionario,
            "produtos", $request->produtos,
            "pagamentos", $request->pagamentos
        );

        if (!$esta_valido || empty($request->produtos) || empty($request->pagamentos)) {
            return ResponseClass::answer("Dados inválidos", Status::BAD_REQUEST);
        }

        try {
            $pdo->beginTransaction();
            $funcionario = FuncionarioRepository::one($request->id_funcionario);
            if (!$funcionario) {
                throw new Exception("Funcionário não encontrado");
            }

            $cliente = ClienteRepository::collect($request->cpf_cliente, $funcionario['id_empresa']);
            if (!$cliente) {
                throw new Exception("Cliente não encontrado");
            }

            $compras = [];
            $valor_total_compra = 0;

            foreach ($request->produtos as $produto) {
                $prod_info = ProdutoRepository::one($produto->codigo_barras);
                if (!$prod_info) throw new Exception("Produto não encontrado");

                $valor_item = $prod_info['valor'] * $produto->quantidade;
                $valor_total_compra += $valor_item;

                $dados_compra = [
                    'id_cliente' => $cliente['id'],
                    'codigo_barras' => $produto->codigo_barras,
                    'id_funcionario' => $request->id_funcionario,
                    'quantidade' => $produto->quantidade,
                    'valor_total' => $valor_item,
                    'metodo_pagamento' => implode(',', array_column($request->pagamentos, 'metodo'))
                ];

                $compra = ComprasRepository::create($dados_compra);
                if (!$compra) throw new Exception("Erro ao registrar compra");
                $compras[] = $compra;
            }

            if (!empty($request->cashback_utilizado)) {
                foreach ($request->cashback_utilizado as $cashback) {
                    $atualizado = ComprasRepository::updateCashbackStatus($cashback->id_compra, 'RESGATADO');
                    if (!$atualizado) throw new Exception("Erro ao atualizar cashback");
                }
            }

            $pdo->commit();
            return ResponseClass::answerWithBody(['compras' => $compras, 'valor_total' => $valor_total_compra], Status::CREATED);

        } catch (Exception $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            return ResponseClass::answer($e->getMessage(), Status::INTERNAL_SERVER_ERROR);
        }
    }

    public static function collect($numero_compra = null, $cpf_cliente = null, $id_empresa = null, $data = null, $id_caixa = null) {
        if ($cpf_cliente) {
            $cashbacks = ComprasRepository::getCashbackDisponivel($cpf_cliente);
            return $cashbacks ? ResponseClass::answerWithBody($cashbacks, Status::OK) : 
                                ResponseClass::answer("Nenhum cashback disponível", Status::NO_CONTENT);
        }
        
        if ($id_empresa) {
            $compras = null;
             
            if ($id_caixa) {
                $compras = ComprasRepository::getComprasPorCaixa($id_empresa, $id_caixa);
            } else if ($data) {
                $compras = ComprasRepository::getComprasPorData($id_empresa, $data);
            } else {
                return ResponseClass::answer("Parâmetros insuficientes", Status::BAD_REQUEST);
            }
            
            if ($compras === false) {
                return ResponseClass::answer("Erro ao buscar compras", Status::INTERNAL_SERVER_ERROR);
            }
            
            if (empty($compras)) {
                return ResponseClass::answer("Nenhuma compra encontrada", Status::NO_CONTENT);
            }
            
            return ResponseClass::answerWithBody($compras, Status::OK);
        }
        
        return ResponseClass::answer("Parâmetros inválidos", Status::BAD_REQUEST);
    }

    public static function updateCashbackStatus($request) {
        $esta_valido = ResponseClass::ifNull("request", $request, "id_compra", $request->id_compra);
        if (!$esta_valido) return;

        try {
            $atualizado = ComprasRepository::updateCashbackStatus($request->id_compra, 'RESGATADO');
            return $atualizado ? ResponseClass::answer("Cashback atualizado", Status::OK) : 
                               ResponseClass::answer("Erro ao atualizar", Status::INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return ResponseClass::answer($e->getMessage(), Status::INTERNAL_SERVER_ERROR);
        }
    }
}