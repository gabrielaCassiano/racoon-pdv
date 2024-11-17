<?php
 

require_once 'connection.php';
require_once '../backend/utils/update.php';

class FuncionarioRepository {
    
    public static function loginBySenha($senha, $id_empresa) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                nome,
                cpf,
                senha,
                criado
            FROM 
                funcionario
            WHERE 
                senha = :senha
                AND id_empresa = :id_empresa
                AND excluido IS NULL
        ");
    
        $stmt->bindParam(":senha", $senha);
        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->execute();
    
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function login($cpf, $senha) {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                nome,
                cpf,
                senha,
                criado
            FROM 
                funcionario
            WHERE 
                cpf = :cpf
                AND senha = :senha
                AND excluido IS NULL
        ");

        $stmt->bindParam(":cpf", $cpf);
        $stmt->bindParam(":senha", $senha);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function one($id_funcionario) {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                nome,
                cpf,
                senha,
                criado 
            FROM 
                funcionario
            WHERE 
                id = :id_funcionario
                AND excluido IS NULL
        ");

        $stmt->bindParam(":id_funcionario", $id_funcionario);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function all($id_empresa) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                nome,
                cpf,
                senha,
                criado
            FROM 
                funcionario
            WHERE 
                id_empresa = :id_empresa
                AND excluido IS NULL
        ");
        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->execute();
    
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function create($id_empresa, $nome, $cpf, $senha) {
        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO funcionario (
                id_empresa,
                nome,
                cpf,
                senha,
                criado
            )
            VALUES (
                :id_empresa,
                :nome,
                :cpf,
                :senha,
                UTC_TIMESTAMP()
            )
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":cpf", $cpf);
        $stmt->bindParam(":senha", $senha);

        return $stmt->execute();
    }

    public static function modify($request, $update_statement) {
        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE 
                funcionario
            SET 
                {$update_statement}
            WHERE 
                id = :id
        ");

        Utils::bind(
            $stmt,
            ":id", $request->id,
            ":id_empresa", $request->id_empresa,
            ":nome", $request->nome,
            ":cpf", $request->cpf,
            ":senha", $request->senha
        );

        return $stmt->execute();
    }

    public static function delete($id_funcionario) {
        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE 
                funcionario
            SET 
                excluido = UTC_TIMESTAMP()
            WHERE 
                id = :id_funcionario
        ");

        $stmt->bindParam(":id_funcionario", $id_funcionario);

        return $stmt->execute();
    }
}