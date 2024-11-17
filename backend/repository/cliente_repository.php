<?php
require_once 'connection.php';
require_once '../backend/utils/update.php';

class ClienteRepository {
    public static function all($nome_ou_cpf, $id_empresa) {
        global $pdo;
        
        $stmt = $pdo->prepare("
            SELECT 
                id, nome, cpf, criado, atualizado, id_empresa
            FROM cliente 
            WHERE id_empresa = :id_empresa
            AND (nome LIKE :nome_ou_cpf OR cpf LIKE :nome_ou_cpf)
            AND excluido IS NULL
        ");

        $stmt->execute([
            ':id_empresa' => $id_empresa,
            ':nome_ou_cpf' => "%$nome_ou_cpf%"
        ]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

   public static function delete($id_cliente) {
       global $pdo;

       $stmt = $pdo->prepare("
           UPDATE cliente 
           SET excluido = UTC_TIMESTAMP()
           WHERE id = :id AND excluido IS NULL
       ");

       return $stmt->execute([':id' => $id_cliente]);
   }

   public static function modify($request) {
       global $pdo;

       $stmt = $pdo->prepare("
           UPDATE cliente
           SET 
               nome = :nome,
               cpf = :cpf,
               atualizado = UTC_TIMESTAMP()
           WHERE 
               id = :id 
               AND id_empresa = :id_empresa
               AND excluido IS NULL
       ");

       return $stmt->execute([
           ':id' => $request->id,
           ':nome' => $request->nome,
           ':cpf' => $request->cpf,
           ':id_empresa' => $request->id_empresa
       ]);
   }

   public static function one($id_cliente, $id_empresa) {
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT
            id, nome, cpf, criado, atualizado, id_empresa
        FROM cliente
        WHERE 
            id = :id
            AND id_empresa = :id_empresa 
            AND excluido IS NULL    
    ");

    $stmt->execute([
        ':id' => $id_cliente,
        ':id_empresa' => $id_empresa
    ]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}


   public static function collect($cpf, $id_empresa) {
    global $pdo;

    $stmt = $pdo->prepare("
        SELECT
            id, nome, cpf, criado, atualizado, id_empresa
        FROM cliente
        WHERE 
            cpf = :cpf
            AND id_empresa = :id_empresa
            AND excluido IS NULL
    ");

    $stmt->execute([
        ':cpf' => $cpf,
        ':id_empresa' => $id_empresa
    ]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

   public static function create($cpf, $nome, $id_empresa) {
       global $pdo;

       $stmt = $pdo->prepare("
           INSERT INTO cliente (
               nome,
               cpf,
               id_empresa,
               criado,
               atualizado
           ) VALUES (
               :nome,
               :cpf,
               :id_empresa,
               UTC_TIMESTAMP(),
               UTC_TIMESTAMP()
           )
       ");

       return $stmt->execute([
           ':nome' => $nome,
           ':cpf' => $cpf,
           ':id_empresa' => $id_empresa
       ]);
   }
}