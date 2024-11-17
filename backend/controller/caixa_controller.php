<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/caixa_repository.php';
require_once '../backend/repository/empresa_repository.php';
require_once '../backend/repository/funcionario_repository.php';
require_once '../backend/repository/compras_repository.php';
require_once '../backend/utils/update.php';
require_once '../backend/enums/status.php';

class CaixaController {

    public static function routes($segment) {

        return match($segment) {
            'open' => self::open(
                json_decode(file_get_contents('php://input')) 
            ),
            'close' => self::close(
                json_decode(file_get_contents('php://input')) 
            ),
            'collect' => self::collect(
                $_GET['id_caixa'] ?? null, $_GET['id_empresa']
            ),
            default => http_response_code(Status::NOT_FOUND->value)
        };

    }

    public static function open($request) {
        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id_funcionario", $request->id_funcionario,
            "id_empresa", $request->id_empresa
        );
    
        if (!$esta_valido) {
            return;
        }
    
        $funcionario = FuncionarioRepository::one(
            $request->id_funcionario
        );
    
        if (!$funcionario) {
            return ResponseClass::answer(
                "Nenhum funcionario foi encontrado com este id",
                Status::NOT_FOUND
            );
        }
    
        $empresa = EmpresaRepository::one(
            $request->id_empresa
        );
    
        if (!$empresa) {
            return ResponseClass::answer(
                "Nenhuma empresa foi encontrada com este id",
                Status::NOT_FOUND
            );
        }
    
        $hoje = new DateTime('now', new DateTimeZone('UTC'));
    
         
        $caixa = CaixaRepository::one(
            $request->id_empresa, 
            $hoje->format("Y-m-d")
        );
    
        if ($caixa && $caixa['fechado'] === null) {
            return ResponseClass::answer(
                "Já existe um caixa aberto para esta empresa",
                Status::CONFLICT
            );
        }
    
         
        $ultimo_caixa = CaixaRepository::last($request->id_empresa);
        $valor_inicial = $ultimo_caixa ? $ultimo_caixa['valor_final'] : 0;
    
        $funcionou = CaixaRepository::open(
            $request->id_empresa, 
            $request->id_funcionario, 
            $valor_inicial
        );
    
        if (!$funcionou) {
            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o caixa era aberto",
                Status::INTERNAL_SERVER_ERROR
            );
        }
    
        $novo_caixa = CaixaRepository::one(
            $request->id_empresa, 
            $hoje->format("Y-m-d")
        );
    
        if (!$novo_caixa) {
            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o caixa era coletado",
                Status::INTERNAL_SERVER_ERROR
            );
        }
    
        return ResponseClass::answerWithBody(
            $novo_caixa,
            Status::CREATED
        );
    }

    private static function close($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id_funcionario", $request->id_funcionario,
            "id_empresa", $request->id_empresa
        );

        if (!$esta_valido) {

            return; 

        }

        $funcionario = FuncionarioRepository::one(
            $request->id_funcionario
        );

        if (!$funcionario) {

            return ResponseClass::answer(
                "Nenhum funcionario foi encontrado com este id",
                Status::NOT_FOUND
            );

        }

        $empresa = EmpresaRepository::one(
            $request->id_empresa
        );

        if (!$empresa) {

            return ResponseClass::answer(
                "Nenhuma empresa foi encontrada com este id",
                Status::NOT_FOUND
            );

        }

        $hoje = new DateTime('now', new DateTimeZone('UTC'));

        $caixa = CaixaRepository::one(
            $request->id_empresa, 
            $hoje->format("Y-m-d")
        );

        if (!$caixa) {

            return ResponseClass::answer(
                "O caixa não foi aberto hoje",
                Status::NOT_FOUND
            );

        }

        $valor = ComprasRepository::close(
            $request->id_empresa, 
            $hoje->format("Y-m-d")
        );

        $funcionou = CaixaRepository::close(
            $caixa['id'],
            $valor ? $valor['soma'] : $caixa['valor_inicial']
        );

        if (!$funcionou) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o caixa era fechado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        $caixa = CaixaRepository::one(
            $request->id_empresa, 
            $hoje->format("Y-m-d")
        ); 

        if (!$caixa) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o caixa era fechado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        return ResponseClass::answerWithBody(
            $caixa,
            Status::OK
        );

    }

    private static function collect($id_caixa, $id_empresa) {

        $caixa = null;

        if ($id_empresa) {
             $caixa = CaixaRepository::all($id_empresa);
        } else if ($id_caixa) {
             $caixa = CaixaRepository::specific($id_caixa);
        }
        if ($caixa == null) {

            return ResponseClass::answer(
                "Nenhum caixa foi encontrado",
                Status::NO_CONTENT
            );

        }

        return ResponseClass::answerWithBody(
            $caixa,
            Status::OK
        );

    }

}

?>
