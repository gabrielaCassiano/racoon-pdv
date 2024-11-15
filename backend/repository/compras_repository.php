<?php

require_once 'connection.php';

class ComprasRepository {

    public static function close($id_empresa, $hoje) {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                SUM(p.valor * c.quantidade) soma
            FROM 
                compras c 
                INNER JOIN produto p ON c.id_produto = p.id 
            WHERE 
                p.id_empresa = :id_empresa
                AND c.compra >= :   hoje
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":hoje", $hoje);

        return $stmt->fetch();
    }

    public static function create($id_cliente, $codigo_barras, $id_funcionario, $quantidade, $pagamentos, $valor_total) {
        global $pdo;
    
        $stmt = $pdo->prepare("
            SELECT id, valor, porcentagem_cashback 
            FROM produto 
            WHERE codigo_barras = :codigo_barras AND excluido IS NULL
        ");
        $stmt->execute([':codigo_barras' => $codigo_barras]);
        $produto = $stmt->fetch(PDO::FETCH_ASSOC);
    
        $valor_cashback = $produto['valor'] * ($produto['porcentagem_cashback']/100) * $quantidade;
    
        $stmt = $pdo->prepare("
            INSERT INTO compras (
                id_cliente, id_produto, id_funcionario, quantidade,
                valor_cashback, valor_total, metodo_pagamento
            ) VALUES (
                :id_cliente, :id_produto, :id_funcionario, :quantidade,
                :valor_cashback, :valor_total, :metodo_pagamento
            )
        ");
    
        $params = [
            ':id_cliente' => $id_cliente,
            ':id_produto' => $produto['id'],
            ':id_funcionario' => $id_funcionario,
            ':quantidade' => $quantidade,
            ':valor_cashback' => $valor_cashback,
            ':valor_total' => $valor_total,
            ':metodo_pagamento' => implode(',', array_column($pagamentos, 'metodo'))
        ];
    
        $stmt->execute($params);
        
        // Retorna os dados da compra criada
        $id_compra = $pdo->lastInsertId();
        $stmt = $pdo->prepare("
            SELECT 
                c.*,
                p.nome as produto_nome,
                p.valor as produto_valor,
                cl.nome as cliente_nome
            FROM compras c
            JOIN produto p ON c.id_produto = p.id
            JOIN cliente cl ON c.id_cliente = cl.id
            WHERE c.id = :id_compra
        ");
    
        $stmt->execute([':id_compra' => $id_compra]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    public static function getCompra($numero_compra) {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                c.*,
                p.nome as produto_nome,
                p.valor as produto_valor,
                cl.nome as cliente_nome,
                cl.cpf as cliente_cpf
            FROM compras c
            JOIN produto p ON c.id_produto = p.id
            JOIN cliente cl ON c.id_cliente = cl.id
            WHERE c.numero_compra = :numero_compra
        ");

        $stmt->bindParam(":numero_compra", $numero_compra);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getCashbackDisponivel($cpf_cliente) {
        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                c.*,
                p.nome as produto_nome,
                p.valor as produto_valor,
                cl.nome as cliente_nome,
                cl.cpf as cliente_cpf
            FROM compras c
            JOIN produto p ON c.id_produto = p.id
            JOIN cliente cl ON c.id_cliente = cl.id
            WHERE 
                cl.cpf = :cpf_cliente 
                AND c.status_cashback = 'DISPONIVEL'
                AND cl.excluido IS NULL
        ");

        $stmt->bindParam(":cpf_cliente", $cpf_cliente);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function resgatarCashback($id_compra) {
        global $pdo;

        $stmt = $pdo->prepare("
            UPDATE compras 
            SET 
                status_cashback = 'RESGATADO',
                data_resgate_cashback = UTC_TIMESTAMP()
            WHERE id = :id_compra
            AND status_cashback = 'DISPONIVEL'
        ");

        $stmt->bindParam(":id_compra", $id_compra);
        return $stmt->execute();
    }
}

?>