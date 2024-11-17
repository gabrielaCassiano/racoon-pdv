<?php

require_once '../backend/utils/update.php';

class ProdutoRepository {

    public static function create($id_empresa, $categoria, $nome, $codigo_barras, $valor, $porcentagem_cashback) {

        global $pdo;

        $stmt = $pdo->prepare("
            INSERT INTO produto (   
                id_empresa, 
                categoria, 
                nome, 
                codigo_barras, 
                valor,
                porcentagem_cashback,
                criado
            )
            VALUES (
                :id_empresa,
                :categoria,
                :nome,
                :codigo_barras,
                :valor,
                :porcentagem_cashback,
                UTC_TIMESTAMP()
            )
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":categoria", $categoria);
        $stmt->bindParam(":nome", $nome);
        $stmt->bindParam(":codigo_barras", $codigo_barras);
        $stmt->bindParam(":valor", $valor);
        $stmt->bindParam(":porcentagem_cashback", $porcentagem_cashback);

        return $stmt->execute();

    }

     

     

     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     

     

     
     
     

     

     

     

     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     

     

     
     
     

     


   

        public static function one($codigo_barras) {
            global $pdo;
    
            $stmt = $pdo->prepare("
                SELECT 
                    id,
                    id_empresa, 
                    categoria, 
                    nome, 
                    codigo_barras, 
                    valor,
                    porcentagem_cashback,
                    criado 
                FROM
                    produto 
                WHERE 
                    codigo_barras = :codigo
                    AND excluido IS NULL
            ");
            $stmt->bindValue(":codigo", $codigo_barras);
            $stmt->execute();
    
            return $stmt->fetch(PDO::FETCH_ASSOC);
        }
    
        public static function all($id_empresa) {
            global $pdo;
    
            $stmt = $pdo->prepare("
                SELECT 
                    id,
                    id_empresa, 
                    categoria, 
                    nome, 
                    codigo_barras, 
                    valor,
                    porcentagem_cashback,
                    criado 
                FROM
                    produto 
                WHERE 
                    id_empresa = :id_empresa
                    AND excluido IS NULL
            ");
            $stmt->bindParam(":id_empresa", $id_empresa);
            $stmt->execute();
    
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }


    public static function collect($id_empresa, $codigo_barras) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                id,
                id_empresa, 
                categoria, 
                nome, 
                codigo_barras, 
                valor,
                porcentagem_cashback,
                criado 
            FROM
                produto 
            WHERE 
                id_empresa = :id_empresa
                AND codigo_barras = :codigo_barras
                AND excluido IS NULL
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":codigo_barras", $codigo_barras);
        $stmt->execute();
         
        return $stmt->fetch(PDO::FETCH_ASSOC);
         

    }

    public static function delete($id_produto) {

        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE 
                produto
            SET 
                excluido = UTC_TIMESTAMP()
            WHERE 
                id = :id_produto
                AND excluido IS NULL
        ");

        $stmt->bindParam(":id_produto", $id_produto);

        return $stmt->execute();

    }

    public static function modify($body, $update_statement) {
        global $pdo;
        
        try {
            $query = "UPDATE produto 
                     SET $update_statement 
                     WHERE codigo_barras = :codigo_barras 
                     AND excluido IS NULL";
                    
            
            $stmt = $pdo->prepare($query);
            
            $stmt->bindParam(":codigo_barras", $body->codigo_barras);
            $stmt->bindParam(":id_empresa", $body->id_empresa);
            $stmt->bindParam(":categoria", $body->categoria);
            $stmt->bindParam(":nome", $body->nome);
            $stmt->bindParam(":valor", $body->valor);
            $stmt->bindParam(":porcentagem_cashback", $body->porcentagem_cashback);
            
            $result = $stmt->execute();
            
            if (!$result) {
                error_log("Erro PDO: " . json_encode($stmt->errorInfo()));
            }
            
            return $result;
            
        } catch (PDOException $e) {
            error_log("Erro na query: " . $e->getMessage());
            return false;
        }
    }
}

?>
