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
            'create' => self::create(
                json_decode(file_get_contents('php://input'))
            ),
            'collect' => self::collect(
                $_GET['numero_compra'] ?? null,
                $_GET['cpf_cliente'] ?? null
            ),
            'cashback' => self::resgatarCashback(
                json_decode(file_get_contents('php://input'))
            ),
            default => http_response_code(Status::NOT_FOUND->value)
        };
    }

    private static function create($request) {
        global $pdo;

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "cpf_cliente", $request->cpf_cliente,
            "id_funcionario", $request->id_funcionario,
            "produtos", $request->produtos,
            "pagamentos", $request->pagamentos,
            "cashback_utilizado", $request->cashback_utilizado
        );

        if (!$esta_valido) return;

        $cliente = ClienteRepository::collect($request->cpf_cliente);
        if (!$cliente) {
            return ResponseClass::answer("Cliente não encontrado", Status::NOT_FOUND);
        }

        try {
            $pdo->beginTransaction();

            $compras = [];
            foreach ($request->produtos as $produto) {
                $prod = ProdutoRepository::one($produto->codigo_barras);
                if (!$prod) {
                    throw new Exception("Produto não encontrado: " . $produto->codigo_barras);
                }

                $valor_total = $prod['valor'] * $produto->quantidade;
                
                $funcionou = ComprasRepository::create(
                    $cliente['id'],
                    $produto->codigo_barras,
                    $request->id_funcionario,
                    $produto->quantidade,
                    $request->pagamentos,
                    $valor_total
                );

                if (!$funcionou) {
                    throw new Exception("Erro ao registrar produto na compra");
                }
                
                $compras[] = $funcionou;
            }

            if ($request->cashback_utilizado) {
                foreach ($request->cashback_utilizado as $cashback) {
                    $resgatado = ComprasRepository::resgatarCashback($cashback->id_compra);
                    if (!$resgatado) {
                        throw new Exception("Erro ao resgatar cashback");
                    }
                }
            }

            $pdo->commit();
            return ResponseClass::answerWithBody($compras, Status::CREATED);

        } catch (Exception $e) {
            $pdo->rollBack();
            return ResponseClass::answer($e->getMessage(), Status::INTERNAL_SERVER_ERROR);
        }
    }

    private static function collect($numero_compra, $cpf_cliente) {

        if ($numero_compra) {
            $compra = ComprasRepository::getCompra($numero_compra);
            if (!$compra) {
                return ResponseClass::answer(
                    "Compra não encontrada",
                    Status::NOT_FOUND
                );
            }
            return ResponseClass::answerWithBody(
                $compra,
                Status::OK
            );
        }

        if ($cpf_cliente) {
            $cliente = ClienteRepository::collect($cpf_cliente);
            if (!$cliente) {
                return ResponseClass::answer(
                    "Cliente não encontrado",
                    Status::NOT_FOUND
                );
            }

            $cashbacks = ComprasRepository::getCashbackDisponivel($cpf_cliente);
            return ResponseClass::answerWithBody(
                $cashbacks,
                Status::OK
            );
        }

        return ResponseClass::answer(
            "Parâmetros inválidos",
            Status::BAD_REQUEST
        );
    }

    private static function resgatarCashback($request) {
        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id_compra", $request->id_compra
        );

        if (!$esta_valido) {
            return;
        }

        try {
            $funcionou = ComprasRepository::resgatarCashback($request->id_compra);
            
            if (!$funcionou) {
                return ResponseClass::answer(
                    "Erro ao resgatar cashback",
                    Status::INTERNAL_SERVER_ERROR
                );
            }

            return ResponseClass::answer(
                "Cashback resgatado com sucesso",
                Status::OK
            );

        } catch (Exception $e) {
            return ResponseClass::answer(
                $e->getMessage(),
                Status::INTERNAL_SERVER_ERROR
            );
        }
    }
}

?>