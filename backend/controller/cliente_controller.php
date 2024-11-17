<?php
class ClienteController {
    public static function route($segment) {
        return match($segment) {
            'create' => self::create(json_decode(file_get_contents('php://input'))),
            'modify' => self::modify(json_decode(file_get_contents('php://input'))),
            'delete' => self::delete($_GET['id_cliente'], $_GET['id_empresa']),
            'collect' => self::collect($_GET['id_empresa'], $_GET['id_cliente'] ?? null, $_GET['nome_ou_cpf'] ?? null),
            default => http_response_code(Status::NOT_FOUND->value)
        };
    }

    public static function collect($id_empresa, $id_cliente, $nome_ou_cpf) {
        if (!$id_empresa) {
            return ResponseClass::answer("ID da empresa é obrigatório", Status::BAD_REQUEST);
        }

        $cliente = $id_cliente ? 
            ClienteRepository::one($id_cliente, $id_empresa) : 
            ClienteRepository::all($nome_ou_cpf, $id_empresa);

        if (!$cliente) {
            return ResponseClass::answer("Nenhum cliente encontrado", Status::NO_CONTENT);
        }
        return ResponseClass::answerWithBody($cliente, Status::OK);
    }

    public static function delete($id_cliente, $id_empresa) {
        $esta_valido = ResponseClass::ifNull("id_cliente", $id_cliente, "id_empresa", $id_empresa);
        if (!$esta_valido) return;

        $cliente = ClienteRepository::one($id_cliente, $id_empresa);
        if (!$cliente) {
            return ResponseClass::answer("Cliente não encontrado", Status::NOT_FOUND);
        }

        $funcionou = ClienteRepository::delete($id_cliente);
        if (!$funcionou) {
            return ResponseClass::answer("Erro ao deletar cliente", Status::INTERNAL_SERVER_ERROR);
        }

        return ResponseClass::answer("Cliente deletado com sucesso", Status::OK);
    }

    public static function modify($request) {
        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id", $request->id,
            "cpf", $request->cpf,
            "nome", $request->nome,
            "id_empresa", $request->id_empresa
        );
        if (!$esta_valido) return;

        $cliente = ClienteRepository::one($request->id, $request->id_empresa);
        if (!$cliente) {
            return ResponseClass::answer("Cliente não encontrado", Status::NOT_FOUND);
        }

        $funcionou = ClienteRepository::modify($request);
        if (!$funcionou) {
            return ResponseClass::answer("Erro ao atualizar cliente", Status::INTERNAL_SERVER_ERROR);
        }

        $cliente_atualizado = ClienteRepository::one($request->id, $request->id_empresa);
        return ResponseClass::answerWithBody($cliente_atualizado, Status::OK);
    }

    public static function create($request) {
        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "cpf", $request->cpf,
            "nome", $request->nome,
            "id_empresa", $request->id_empresa
        );
        if (!$esta_valido) return;
   
        $cliente_existe = ClienteRepository::collect($request->cpf, $request->id_empresa);
        if ($cliente_existe) {
            return ResponseClass::answer("Cliente já cadastrado", Status::CONFLICT);
        }
   
        $funcionou = ClienteRepository::create(
            $request->cpf,
            $request->nome,
            $request->id_empresa
        );
        if (!$funcionou) {
            return ResponseClass::answer("Erro ao criar cliente", Status::INTERNAL_SERVER_ERROR);
        }
        
        $cliente = ClienteRepository::collect($request->cpf, $request->id_empresa);
        return ResponseClass::answerWithBody($cliente, Status::CREATED);
    }
}
?>