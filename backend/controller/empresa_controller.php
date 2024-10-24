<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/empresa_repository.php';
require_once '../backend/utils/update.php';

class EmpresaController {

    public static function login($request) {

        $body = json_decode($request);

        $esta_valido = ResponseClass::validate()->ifNull(
            "request", $body,
            "cnpj", $body->cnpj,
            "senha", $body->senha
        );

        if (!$esta_valido) {

            return;

        }

        $id_empresa = EmpresaRepository::login(
            $body->cnpj, 
            $body->senha
        );

        if (!$id_empresa) {

            ResponseClass::answer(
                "Cnpj ou senha incorretos", 
                401
            );
            return;

        }

        ResponseClass::answerWithBody(
            json_encode(
                [
                    'id_empresa' => $id_empresa
                ]
            ),
            201
        );

    }

    public static function create($request) {

        $body = json_decode($request);

        $esta_valido = ResponseClass::validate()->ifNull(
            "request", $body,
            "nome_empresa", $body->nome_empresa,
            "nome_criador", $body->nome_criador,
            "cnpj", $body->cnpj,
            "cpf", $body->cpf,
            "senha", $body->senha
        );

        if (!$esta_valido) {

            return;

        }

        $id_empresa = EmpresaRepository::login(
            $body->cnpj, 
            $body->senha
        );

        if ($id_empresa) {

            ResponseClass::answer(
                "Cnpj ou senha ja utilizados", 
                409
            );
            return;

        }

        $created = EmpresaRepository::create(
            $body->nome_empresa,
            $body->nome_criador,
            $body->cnpj,
            $body->cpf,
            $body->senha
        );

        if (!$created) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto o usuario era criado",
                500
            );
            return;

        }

        ResponseClass::answerWithBody(
            json_encode(
                EmpresaRepository::login(
                    $body->cnpj,
                    $body->senha
                )
            ),
            201
        );

    }

    public static function collect($id_empresa) {

        $esta_valido = ResponseClass::validate()->ifNull(
            "id_empresa", $id_empresa
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::one($id_empresa);

        if (!$empresa) {

            ResponseClass::answer(
                "Nenhuma empresa foi encontrado com este id",
                404
            );

            return;

        }

        ResponseClass::answerWithBody(
            json_encode($empresa),
            200
        );

    }

    public static function modify($request) {

        $body = json_decode($request);

        $esta_valido = ResponseClass::validate()->ifNull(
            "id_empresa", $body->id_empresa
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::one(
            $body->id_empresa
        );

        if (!$empresa) {

            ResponseClass::answer(
                "Nenhuma empresa foi encontrado com este id",
                404
            );

        }

        if ((isset($body->cnpj) && $body->cnpj !== null) || (isset($body->senha) && $body->senha !== null)) {

            $count = EmpresaRepository::validate(
                $body->id_empresa,
                isset($body->cnpj) ? $body->cnpj : null,
                isset($body->senha) ? $body->senha : null
            );

            if ($count['contagem'] > 0) {

                ResponseClass::answer(
                    "Os campos cnpj ou senha ja estao sendo utilizados",
                    401
                );

                return;
            }

        }

        $funcionou = EmpresaRepository::modify(
            $body,
            Utils::format(
                isset($body->nome_empresa) ? "nome_empresa = :nome_empresa,\n" : "", $body->nome_empresa ?? "",
                isset($body->nome_criador) ? "nome_criador = :nome_criador,\n" : "", $body->nome_criador ?? "",
                isset($body->cnpj) ? "cnpj = :cnpj,\n" : "", $body->cnpj ?? "",
                isset($body->cpf) ? "cpf = :cpf,\n" : "", $body->cpf ?? "",
                isset($body->senha) ? "senha = :senha,\n" : "", $body->senha ?? "",
                "modificado = UTC_TIMESTAMP()", "UTC_TIMESTAMP()"
            )
        );

        if (!$funcionou) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto a empresa era modificada",
                500
            );

            return;

        }

        ResponseClass::answerWithBody(
            json_encode(
                EmpresaRepository::one(
                    $body->id_empresa
                )
            ),
            200
        );

    }

    public static function delete($id_empresa) {

        $esta_valido = ResponseClass::validate()->ifNull(
            "id_empresa", $id_empresa
        );

        if (!$esta_valido) {

            return;

        }

        $empresa = EmpresaRepository::one($id_empresa);

        if (!$empresa) {

            ResponseClass::answer(
                "Nenhuma empresa foi encontrado com este id",
                404
            );

            return;

        }

        EmpresaRepository::delete($id_empresa);

        $empresa = EmpresaRepository::one($id_empresa);

        if ($empresa) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto a empresa era deletada",
                500
            );

            return;

        }

        ResponseClass::answer(
            "Empresa deletada com sucesso",
            200
        );

    }

}

?>
