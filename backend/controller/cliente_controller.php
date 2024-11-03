<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/cliente_repository.php';
require_once '../backend/utils/update.php';
require_once '../backend/enums/status.php';

class ClienteController {

    public static function route($segment) {

        return match($segment) {
            'create' => self::create(
                json_encode(file_get_contents('php://input'))
            ), //TODO Test
            'modify' => self::modify(
                json_encode(file_get_contents('php://input'))
            ), //TODO Test
            'delete' => self::delete(
                $_GET['id_cliente']
            ), //TODO Test
            'collect' => self::collect(
                $_GET['id_cliente'], $_GET['nome_ou_cpf']
            ), //TODO Test
            default => http_response_code(Status::NOT_FOUND->value)
        };

    }

    private static function collect($id_cliente, $nome_ou_cpf) {

        $cliente = null;

        if ($id_cliente != null) {

            $cliente = ClienteRepository::one(
                $id_cliente
            );

        } else {

            $id_cliente = ClienteRepository::all(
                $nome_ou_cpf
            );

        }

        if (!$cliente) {

            return ResponseClass::answer(
                "Nenhum cliente foi encontrado",
                Status::NO_CONTENT
            );

        }

        return ResponseClass::answerWithBody(
            $cliente,
            Status::OK
        );

    }

    private static function delete($id_cliente) {

        $esta_valido = ResponseClass::ifNull(
            "id_cliente", $id_cliente
        );

        if (!$esta_valido) {

            return;

        }

        $cliente = ClienteRepository::one(
            $id_cliente
        );

        if (!$cliente) {

            return ResponseClass::answer(
                "Nenhum usuario encontrado com este id",
                Status::NOT_FOUND
            );

        }

        $funcionou = ClienteRepository::delete($id_cliente);

        if (!$funcionou) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o cliente era deletado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        $cliente = ClienteRepository::one($id_cliente);

        if ($cliente) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o cliente era deletado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        return ResponseClass::answer(
            "Usuario cliente com sucesso",
            Status::OK
        );

    }

    private static function modify($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id", $request->id,
            "cpf", $request->cpf,
            "nome", $request->nome
        );

        if (!$esta_valido) {

            return;

        }

        $cliente = ClienteRepository::one(
            $request->id
        );

        if (!$cliente) {

            return ResponseClass::answer(
                "Nenhum cliente foi encontraco com este id",
                404
            );

        }

        $funcionou = ClienteRepository::modify(
            $request,
            Utils::format(
                "nome = :nome", $request->nome,
                "cpf = :cpf", $request->cpf,
                "atualizado = UTC_TIMESTAMP()", ""
            )
        );

        if (!$funcionou) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o cliente era atualizado",
                500
            );

        }

        $cliente = ClienteRepository::one(
            $request->id
        );

        if (!$cliente) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o cliente era coletado",
                500
            );

        }

        return ResponseClass::answerWithBody(
            $cliente,
            200
        );

    }

    private static function create($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "cpf", $request->cpf,
            "nome", $request->nome
        );

        if (!$esta_valido) {

            return;

        }

        $cliente = ClienteRepository::collect($request->cpf);

        if (!$cliente) {

            return ResponseClass::answer(
                "Cliente ja esta cadastrado",
                409
            );

        }

        $funcionou = ClienteRepository::create(
            $request->cpf,
            $request->nome
        );

        if (!$funcionou) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o cliente era criado",
                500
            );

        }

        $cliente = ClienteRepository::collect($request->cpf);

        if (!$cliente) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o cliente era criado",
                500
            );

        }

        return ResponseClass::answerWithBody(
            $cliente,
            201
        );

    }

}

?>
