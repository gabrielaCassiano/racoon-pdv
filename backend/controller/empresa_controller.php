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
            "senha", $request->senha,
            "plano", $request->plano
        );

        if (!$esta_valido) {
            return;
        }
    
        if (empty($request->plano)) {
            ResponseClass::answer([
                "erro" => "Plano não selecionado",
                "planos_disponiveis" => ["basico", "medio", "avancado"]
            ], Status::BAD_REQUEST);
            return;
        }
    
        if (EmpresaRepository::existsByCnpj($request->cnpj)) {
            ResponseClass::answer([
                "erro" => "CNPJ já cadastrado",
                "cnpj" => $request->cnpj
            ], Status::CONFLICT);
            return;
        }
    
        if (EmpresaRepository::existsByCpf($request->cpf)) {
            ResponseClass::answer([
                "erro" => "CPF já cadastrado", 
                "cpf" => $request->cpf
            ], Status::CONFLICT);
            return;
        }
    
        try {
            $created = EmpresaRepository::create(
                $request->nome_empresa,
                $request->nome_criador,
                $request->cnpj, 
                $request->cpf,
                $request->senha,
                $request->plano
            );
    
            if (!$created) {
                throw new Exception("Falha ao inserir no banco de dados");
            }
    
            ResponseClass::answerWithBody(
                EmpresaRepository::login($request->cnpj, $request->senha),
                Status::CREATED
            );
    
        } catch (Exception $e) {
            ResponseClass::answer([
                "erro" => "Erro ao criar empresa",
                "detalhes" => $e->getMessage()
            ], Status::INTERNAL_SERVER_ERROR);
        }
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

    public static function modify($request) {
        global $pdo;
    
        if (empty($request->id_empresa)) {
            ResponseClass::answer(['message' => 'ID da empresa não fornecido'], Status::BAD_REQUEST);
            return;
        }
    
        $updateFields = [];
        $params = [':id' => $request->id_empresa];
    
        if (!empty($request->plano)) {
            $updateFields[] = "plano = :plano";
            $params[':plano'] = $request->plano;
        }
        if (!empty($request->nome_empresa)) {
            $updateFields[] = "nome_empresa = :nome_empresa";
            $params[':nome_empresa'] = $request->nome_empresa;
        }
        if (!empty($request->cnpj)) {
            $updateFields[] = "cnpj = :cnpj";
            $params[':cnpj'] = $request->cnpj;
        }
    
        if (empty($updateFields)) {
            ResponseClass::answer(['message' => 'Nenhum campo para atualizar'], Status::BAD_REQUEST);
            return;
        }
    
        $query = "UPDATE empresa SET " . implode(", ", $updateFields) . " WHERE id = :id AND excluido IS NULL";
        $stmt = $pdo->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
    
        $result = $stmt->execute();
    
        if ($result) {
            ResponseClass::answer(['message' => 'Empresa atualizada com sucesso'], Status::OK);
        } else {
            ResponseClass::answer(['message' => 'Erro ao atualizar empresa'], Status::INTERNAL_SERVER_ERROR);
        }
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