<?php

require_once 'connection.php';
require_once '../backend/utils/update.php';

class CaixaRepository {

    public static function all($id_empresa) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                id_funcionario,
                aberto,
                fechado,
                valor_inicial,
                valor_final
            FROM 
                caixa
            WHERE 
                id_empresa = :id_empresa
            ORDER BY 
                aberto DESC
        ");
    
        $stmt->execute([':id_empresa' => $id_empresa]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function specific($id_caixa) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                id_funcionario,
                aberto,
                fechado,
                valor_inicial,
                valor_final
            FROM 
                caixa
            WHERE 
                id = :id
        ");

        $stmt->bindParam("id", $id_caixa);
        $stmt->execute();

        return $stmt->fetchAll();

    }

    public static function one($id_empresa, $hoje) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT
                id,
                id_empresa,
                id_funcionario,
                aberto,
                fechado,
                valor_inicial,
                valor_final
            FROM 
                caixa
            WHERE 
                id_empresa = :id_empresa
                AND aberto >= :hoje
        ");

        $stmt->bindParam("id_empresa", $id_empresa);
        $stmt->bindParam("hoje", $hoje);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);

    }

    public static function last($id_empresa) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                id,
                id_empresa,
                id_funcionario,
                aberto,
                fechado,
                valor_inicial,
                valor_final
            FROM 
                caixa
            WHERE 
                id_empresa = :id_empresa
            ORDER BY 
                fechado DESC
            LIMIT 1
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);

        return $stmt->fetch();

    }

    public static function open($id_empresa, $id_funcionario, $valor_inicial) {

        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO caixa (
                id_empresa,
                id_funcionario,
                aberto,
                valor_inicial
            )
            VALUES (
                :id_empresa,
                :id_funcionario,
                UTC_TIMESTAMP(),
                :valor_inicial
            )
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":id_funcionario", $id_funcionario);
        $stmt->bindParam(":valor_inicial", $valor_inicial);

        return $stmt->execute();    

    }

    public static function close($id, $valor_final) {

        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE 
                caixa
            SET 
                fechado = UTC_TIMESTAMP(),
                
                valor_final = :valor_final
            WHERE 
                id = :id
        ");

        $stmt->bindParam(":valor_final", $valor_final);
        $stmt->bindParam(":id", $id);

        return $stmt->execute();

    }

}

?>
