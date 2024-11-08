<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/empresa_repository.php';
require_once '../backend/enums/status.php';

class FuncionarioController {

    public static function route($segment) {

        return match($segment) {
            'login' => self::login(
                json_decode(file_get_contents('php://input'))
            ),//TODO test
            'create' => self::create(
                json_decode(file_get_contents('php://input'))
            ),//TODO test
            'collect' => self::collect(
                $_GET['id_empresa'], 
                $_GET['id_funcionario']
            ),//TODO test
            'modify' => self::modify(
                json_decode(file_get_contents('php://input'))
            ),//TODO test
            'delete' => self::delete(
                $_GET['id_empresa']
            ),//TODO test
            default => http_response_code(Status::NOT_FOUND->value)
        };

    }

    private static function modify($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id", $request->id
        );

        if (!$esta_valido) {

            return;

        }

        $funcionario = FuncionarioRepository::one($request->id);

        if (!$funcionario) {

            return ResponseClass::answer(
                "Nenhum funcionario foi encontrado com este id",
                Status::NOT_FOUND
            );

        }

        $funcionou = FuncionarioRepository::modify(
            $request,
            Utils::format(
                "id_empresa", $request->id_empresa,
                "nome", $request->nome,
                "cpf", $request->cpf,
                "senha", $request->senha,
                "atualizado", ""
            )
        );

        if (!$funcionou) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o funcionario era atualizado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        $funcionario = FuncionarioRepository::one($request->id);

        if (!$funcionario) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o funcionario era coletado",
                Status::INTERNAL_SERVER_ERROR
            );

        } 

        return ResponseClass::answerWithBody(
            $funcionario,
            Status::OK
        );

    }

    private static function delete($id_funcionario) {

        $esta_valido = ResponseClass::ifNull(
            "id_funcionario", $id_funcionario
        );

        if (!$esta_valido) {

            return;

        }

        $funcionario = FuncionarioRepository::one($id_funcionario);

        if (!$funcionario) {

            return ResponseClass::answer(
                "Nenhum funcionario foi encontrado com este id",
                Status::NOT_FOUND
            );

        }

        FuncionarioRepository::delete($id_funcionario);

        $funcionario = FuncionarioRepository::one($id_funcionario);

        if ($funcionario) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o funcionario era deletado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        return ResponseClass::answer(
            "Funcionario deletado com sucesso",
            Status::INTERNAL_SERVER_ERROR
        );

    }

    private static function collect($id_empresa, $id_funcionario) {

        $esta_valido = ResponseClass::ifNull(
            "id_empresa", $id_empresa,
            "id_funcionario", $id_funcionario
        );

        if (!$esta_valido) {

            return;

        }

        $funcionario = null;

        if ($id_empresa != null) {

            $funcionario = FuncionarioRepository::all($id_empresa);

        } else if ($id_funcionario) {

            $funcionario = FuncionarioRepository::one($id_funcionario);

        }

        if (!$funcionario) {

            return ResponseClass::answer(
                "Nenhum funcionario foi encontrado",
                Status::NO_CONTENT
            );

        }

        return ResponseClass::answerWithBody(
            $funcionario,
            Status::OK
        );

    }

    private static function login($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "cpf", $request->cpf,
            "senha", $request->senha
        );

        if (!$esta_valido) {

            return;

        }

        $funcionario = FuncionarioRepository::login(
            $request->cpf, 
            $request->senha
        );

        if (!$funcionario) {

            return ResponseClass::answer(
                "Nenhum funcionario foi encontrado com este cpf e senha",
                Status::NO_CONTENT
            );

        }

        return ResponseClass::answerWithBody(
            $funcionario,
            Status::OK
        );

    }

    private static function create($request) {

    
        if (is_null($request)) {
            return ResponseClass::answer(
                "Erro ao decodificar o JSON",
                Status::BAD_REQUEST
            );
        }
    
        // var_dump($request);
    
        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id_empresa", $request->id_empresa,
            "nome", $request->nome,
            "cpf", $request->cpf,
            "senha", $request->senha
        );
    
        if (!$esta_valido) {
            return ResponseClass::answer(
                "Dados insuficientes no request",
                Status::BAD_REQUEST
            );
        }
    
        $empresa = EmpresaRepository::one($request->id_empresa);
        if (!$empresa) {
            return ResponseClass::answer(
                "Nenhuma empresa encontrada com este ID",
                Status::NOT_FOUND
            );
        }
    
        try {
            $funcionou = FuncionarioRepository::create(
                $request->id_empresa,
                $request->nome,
                $request->cpf,
                $request->senha
            );
    
            if (!$funcionou) {
                return ResponseClass::answer(
                    "Erro ao criar o funcionário",
                    Status::INTERNAL_SERVER_ERROR
                );
            }
        } catch (Exception $e) {
            return ResponseClass::answer(
                "Erro: " . $e->getMessage(),
                Status::INTERNAL_SERVER_ERROR
            );
        }
    
        $funcionario = FuncionarioRepository::login($request->cpf, $request->senha);
        if (!$funcionario) {
            return ResponseClass::answer(
                "Erro ao coletar o funcionário após criação",
                Status::INTERNAL_SERVER_ERROR
            );
        }
    
        return ResponseClass::answerWithBody(
            $funcionario,
            Status::CREATED
        );
    }

}

?>
