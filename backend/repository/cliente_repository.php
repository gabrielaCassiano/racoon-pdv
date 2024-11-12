<?php

require_once 'connection.php';
require_once '../backend/utils/update.php';

class ClienteRepository {

    public static function all($nome_ou_cpf) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                id,
                nome,
                cpf,        
                criado,
                atualizado 
            FROM
                cliente 
            WHERE
                (
                    nome LIKE :nome_ou_cpf
                    OR cpf LIKE :nome_ou_cpf
                )
                AND excluido IS NULL
        ");

        $stmt->bindParam(":nome_ou_cpf", "%" . $nome_ou_cpf . "%");

        return $stmt->fetchAll();

    }

    public static function delete($id_cliente) {

        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE 
                cliente 
            SET 
                excluido = UTC_TIMESTAMP()
            WHERE 
                id = :id
                AND excluido IS NULL
        ");

        $stmt->bindParam(":id", $id_cliente);

        return $stmt->execute();

    }

    public static function modify($request, $update_statement) {

        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE 
                cliente
            SET 
                {$update_statement}
            WHERE 
                id = :id,
                AND excluido IS NULL
        ");

        Utils::bind(
            ":id", $request->id,
            ":nome", $request->nome,
            ":cpf", $request->cpf
        );

        return $stmt->execute();
    
    }

    public static function one($id_cliente) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT
                id,
                nome,
                cpf,        
                criado,
                atualizado
            FROM 
                cliente
            WHERE 
                id = :id
                AND excluido IS NULL    
        ");

        $stmt->bindParam(":id", $id_cliente);

        return $stmt->fetchAll();

    }

    public static function collect($cpf) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT
                id,
                nome,
                cpf,     
                criado,
                atualizado   
            FROM 
                cliente
            WHERE 
                cpf = :cpf
                AND excluido IS NULL
        ");

        $stmt->bindParam(":cpf", $cpf);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);

    }

    public static function create($cpf, $nome) {

        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO cliente (
                nome,
                cpf,
                criado
            )
            VALUES (
                :nome,
                :cpf,
                UTC_TIMESTAMP()
            )
        ");

        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":cpf", $cpf);

        return $stmt->execute();

    }

}

?>
