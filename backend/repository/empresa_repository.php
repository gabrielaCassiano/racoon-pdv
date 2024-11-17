<?php

require_once 'connection.php';
require_once '../backend/utils/update.php';

class EmpresaRepository {

    public static function delete($id_empresa) {

        global $pdo; 

        $stmt = $pdo->prepare("
            UPDATE 
                empresa
            SET 
                excluido = UTC_TIMESTAMP()
            WHERE 
                id = :id_empresa
                AND excluido IS NULL
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);

        return $stmt->execute();

    }

    public static function modify($request, $update_statement) {

        global $pdo; 

        $stmt = $pdo->prepare("
            UPDATE 
                empresa
            SET 
                $update_statement
            WHERE 
                id = :id
                AND excluido IS NULL
        ");

        if (isset($request->nome_empresa) && $request->nome_empresa !== null) {
            $stmt->bindParam(':nome_empresa', $request->nome_empresa);
        }

        if (isset($request->nome_criador) && $request->nome_criador !== null) {
            $stmt->bindParam(':nome_criador', $request->nome_criador);
        }

        if (isset($request->cnpj) && $request->cnpj !== null) {
            $stmt->bindParam(':cnpj', $request->cnpj);
        }
        
        if (isset($request->cpf) && $request->cpf !== null) {
            $stmt->bindParam(':cpf', $request->cpf);
        }

        if (isset($request->senha) && $request->senha !== null) {
            $stmt->bindParam(':senha', $request->senha);
        }

        $stmt->bindParam(":id", $request->id_empresa);

        return $stmt->execute();

    }

    public static function one($id_empresa) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                id,
                nome_empresa,
                nome_criador,
                cnpj,
                cpf,
                plano,
                criado
            FROM 
                empresa 
            WHERE 
                id = :id_empresa
                AND excluido IS NULL
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);

        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);



    }




    public static function validate($id_empresa, $cnpj, $senha) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                COUNT(id) AS contagem
            FROM 
                empresa 
            WHERE 
                id != :id_empresa
                AND (
                    cnpj = :cnpj 
                    OR senha = :senha
                )
                AND excluido IS NULL
        ");

        $stmt->bindParam(":cnpj", $cnpj);
        $stmt->bindParam(":senha", $senha);
        $stmt->bindParam(":id_empresa", $id_empresa);

        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);

    }

    public static function login($cnpj, $senha) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                id,
                nome_empresa,
                nome_criador,
                cnpj,
                cpf,
                criado
            FROM 
                empresa 
            WHERE 
                cnpj = :cnpj 
                AND senha = :senha
                AND excluido IS NULL
        ");

        $stmt->bindParam(":cnpj", $cnpj);
        $stmt->bindParam(":senha", $senha);

        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);

    }


    public static function create($nome_empresa, $nome_criador, $cnpj, $cpf, $senha, $plano) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            INSERT INTO empresa (nome_empresa, nome_criador, cnpj, cpf, senha, plano, criado)
            VALUES (:nome_empresa, :nome_criador, :cnpj, :cpf, :senha, :plano, UTC_TIMESTAMP())
        ");
    
        $stmt->bindParam(":nome_empresa", $nome_empresa);
        $stmt->bindParam(":nome_criador", $nome_criador);
        $stmt->bindParam(":cnpj", $cnpj);
        $stmt->bindParam(":cpf", $cpf);
        $stmt->bindParam(":senha", $senha);
        $stmt->bindParam(":plano", $plano);
    
        return $stmt->execute();
    }


    
    public static function existsByCnpj($cnpj) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            SELECT id 
            FROM empresa 
            WHERE cnpj = :cnpj 
            AND excluido IS NULL
        ");
        $stmt->bindParam(":cnpj", $cnpj);
        $stmt->execute();
    
        return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
    }
    
    public static function existsByCpf($cpf) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            SELECT id 
            FROM empresa 
            WHERE cpf = :cpf 
            AND excluido IS NULL
        ");
        $stmt->bindParam(":cpf", $cpf);
        $stmt->execute();
    
        return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
    }
    
    

    public static function updatePlano($id_empresa, $plano) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            UPDATE empresa
            SET plano = :plano, modificado = UTC_TIMESTAMP()
            WHERE id = :id_empresa AND excluido IS NULL
        ");
        $stmt->bindParam(':plano', $plano);
        $stmt->bindParam(':id_empresa', $id_empresa);
    
        return $stmt->execute();
    }
    

    

}
    






?>
