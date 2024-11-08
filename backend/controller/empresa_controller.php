<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/empresa_repository.php';
require_once '../backend/utils/update.php';
require_once '../backend/enums/status.php';

class EmpresaController {

    public static function route($segment) {
        return match ($segment) {
            'login' => self::login(
                json_decode(file_get_contents('php://input'))
            ),
            'create' => self::create(
                json_decode(file_get_contents('php://input'))
            ),
            'collect' => self::collect(
                $_GET['id_empresa']
            ),
            'modify' => self::modify(
                json_decode(file_get_contents('php://input'))
            ),
            'delete' => self::delete(
                $_GET['id_empresa']
            ),
            default => http_response_code(Status::NOT_FOUND->value)
        };
    }
    private static function login($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "cnpj", $request->cnpj,
            "senha", $request->senha
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::login(
            $request->cnpj, 
            $request->senha
        );

        if (!$empresa) {

            ResponseClass::answer(
                "Cnpj ou senha incorretos", 
                Status::UNAUTHORIZED
            );
            return;

        }

        ResponseClass::answerWithBody(
            $empresa,
            Status::OK
        );

    }

    private static function create($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "nome_empresa", $request->nome_empresa,
            "nome_criador", $request->nome_criador,
            "cnpj", $request->cnpj,
            "cpf", $request->cpf,
            "senha", $request->senha
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::login(
            $request->cnpj, 
            $request->senha
        );

        if ($empresa) {

            ResponseClass::answer(
                "Cnpj ou senha ja utilizados", 
                Status::CONFLICT
            );
            return;

        }

        $created = EmpresaRepository::create(
            $request->nome_empresa,
            $request->nome_criador,
            $request->cnpj,
            $request->cpf,
            $request->senha
        );

        if (!$created) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto o usuario era criado",
                Status::INTERNAL_SERVER_ERROR
            );
            return;

        }

        ResponseClass::answerWithBody(
            EmpresaRepository::login(
                $request->cnpj,
                $request->senha
            ),
            Status::CREATED
        );

    }

    private static function collect($id_empresa) {

        $esta_valido = ResponseClass::ifNull(
            "id_empresa", $id_empresa
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::one($id_empresa);

        if (!$empresa) {

            ResponseClass::answer(
                "Nenhuma empresa foi encontrado com este id",
                Status::NOT_FOUND
            );

            return;

        }

        ResponseClass::answerWithBody(
            $empresa,
            Status::OK
        );

    }

    private static function modify($request) {

        $esta_valido = ResponseClass::ifNull(
            "id_empresa", $request->id_empresa
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::one(
            $request->id_empresa
        );

        if (!$empresa) {

            ResponseClass::answer(
                "Nenhuma empresa foi encontrado com este id",
                Status::NOT_FOUND
            );

        }

        if ((isset($request->cnpj) && $request->cnpj !== null) || (isset($request->senha) && $request->senha !== null)) {

            $count = EmpresaRepository::validate(
                $request->id_empresa,
                isset($request->cnpj) ? $request->cnpj : null,
                isset($request->senha) ? $request->senha : null
            );

            if ($count['contagem'] > 0) {

                ResponseClass::answer(
                    "Os campos cnpj ou senha ja estao sendo utilizados",
                    Status::UNAUTHORIZED
                );

                return;
            }

        }

        Utils::format(
            "nome_empresa = :nome_empresa", $request->nome_empresa
        );

        $funcionou = EmpresaRepository::modify(
            $request,
            Utils::format(
                "nome_empresa = :nome_empresa", $request->nome_empresa,
                "nome_criador = :nome_criador", $request->nome_criador,
                "cnpj = :cnpj", $request->cnpj,
                "cpf = :cpf", $request->cpf,
                "senha = :senha", $request->senha,
                "modificado = UTC_TIMESTAMP()", "UTC_TIMESTAMP()"
            )
        );

        if (!$funcionou) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto a empresa era modificada",
                Status::INTERNAL_SERVER_ERROR
            );

            return;

        }

        ResponseClass::answerWithBody(
            EmpresaRepository::one(
                $request->id_empresa
            ),
            Status::OK
        );

    }

    private static function delete($id_empresa) {

        $esta_valido = ResponseClass::ifNull(
            "id_empresa", $id_empresa
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::one($id_empresa);

        if (!$empresa) {

            ResponseClass::answer(
                "Nenhuma empresa foi encontrado com este id",
                Status::NOT_FOUND
            );

            return;

        }

        EmpresaRepository::delete($id_empresa);

        $empresa = EmpresaRepository::one($id_empresa);

        if ($empresa) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto a empresa era deletada",
                Status::INTERNAL_SERVER_ERROR
            );

            return;

        }

        ResponseClass::answer(
            "Empresa deletada com sucesso",
            Status::OK
        );

    }

}

?>
