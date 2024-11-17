<?php
class ComprasRepository {
    public static function create($dados) {
        global $pdo;
        
         
        $stmtCaixa = $pdo->prepare("
            SELECT id FROM caixa 
            WHERE id_empresa = (
                SELECT id_empresa FROM funcionario WHERE id = :id_funcionario
            )
            AND fechado IS NULL 
            ORDER BY aberto DESC 
            LIMIT 1
        ");
        
        $stmtCaixa->execute([':id_funcionario' => $dados['id_funcionario']]);
        $caixa = $stmtCaixa->fetch(PDO::FETCH_ASSOC);
        
        if (!$caixa) {
            throw new Exception("Nenhum caixa aberto encontrado");
        }
        
        $stmt = $pdo->prepare("
            SELECT id, valor, porcentagem_cashback 
            FROM produto 
            WHERE codigo_barras = :codigo_barras AND excluido IS NULL
        ");
        $stmt->execute([':codigo_barras' => $dados['codigo_barras']]);
        $produto = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$produto) throw new Exception("Produto não encontrado");

        $valor_cashback = floatval($produto['porcentagem_cashback']);
        $valor_cashback_total = $valor_cashback * floatval($dados['quantidade']);
        $valor_cashback_final = $valor_cashback_total;

        $stmt = $pdo->prepare("
            INSERT INTO compras (
                id_cliente, id_produto, id_funcionario, id_caixa,
                quantidade, valor_cashback, valor_total, 
                metodo_pagamento, compra, status_cashback
            ) VALUES (
                :id_cliente, :id_produto, :id_funcionario, :id_caixa,
                :quantidade, :valor_cashback, :valor_total,
                :metodo_pagamento, NOW(), 'DISPONIVEL'
            )
        ");

        $params = [
            ':id_cliente' => $dados['id_cliente'],
            ':id_produto' => $produto['id'],
            ':id_funcionario' => $dados['id_funcionario'],
            ':id_caixa' => $caixa['id'],
            ':quantidade' => $dados['quantidade'],
            ':valor_cashback' => $valor_cashback_final,
            ':valor_total' => $dados['valor_total'],
            ':metodo_pagamento' => $dados['metodo_pagamento']
        ];

        $stmt->execute($params);
        
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

    public static function getComprasPorCaixa($id_empresa, $id_caixa) {
        global $pdo;
        try {
            $stmt = $pdo->prepare("
                SELECT 
                    c.*,
                    p.nome AS produto_nome,
                    p.valor AS produto_valor,
                    cl.nome AS cliente_nome,
                    cl.cpf AS cliente_cpf
                FROM compras c
                JOIN produto p ON c.id_produto = p.id
                JOIN cliente cl ON c.id_cliente = cl.id
                WHERE p.id_empresa = :id_empresa 
                AND c.id_caixa = :id_caixa
                ORDER BY c.compra DESC
            ");
            
            $stmt->execute([
                ':id_empresa' => $id_empresa,
                ':id_caixa' => $id_caixa
            ]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch (PDOException $e) {
            error_log("Erro na query de compras por caixa: " . $e->getMessage());
            return false;
        }
    }

    public static function close($id_empresa, $hoje) {
        global $pdo;
        $stmt = $pdo->prepare("
            SELECT SUM(p.valor * c.quantidade) soma
            FROM compras c 
            INNER JOIN produto p ON c.id_produto = p.id 
            WHERE p.id_empresa = :id_empresa AND c.compra >= :hoje
        ");
        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":hoje", $hoje);
        return $stmt->fetch();
    }

    public static function getCashbackDisponivel($cpf) {
        global $pdo;
        $stmt = $pdo->prepare("
            SELECT c.*, p.nome as produto_nome, p.valor as produto_valor,
                   cl.nome as cliente_nome, cl.cpf as cliente_cpf
            FROM compras c
            JOIN produto p ON c.id_produto = p.id
            JOIN cliente cl ON c.id_cliente = cl.id
            WHERE cl.cpf = :cpf AND c.status_cashback = 'DISPONIVEL' AND cl.excluido IS NULL
        ");
        $stmt->execute([':cpf' => $cpf]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function updateCashbackStatus($id_compra, $novo_status) {
        global $pdo;
        $stmt = $pdo->prepare("
            UPDATE compras 
            SET status_cashback = :status,
                data_resgate_cashback = CASE 
                    WHEN :status = 'RESGATADO' THEN UTC_TIMESTAMP()
                    ELSE data_resgate_cashback 
                END
            WHERE id = :id_compra AND status_cashback = 'DISPONIVEL'
        ");
        return $stmt->execute([
            ':id_compra' => $id_compra,
            ':status' => $novo_status
        ]);
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
            WHERE c.id = :numero_compra
        ");
        $stmt->execute([':numero_compra' => $numero_compra]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function getComprasPorEmpresaHoje($id_empresa) {
        global $pdo;+
        date_default_timezone_set('America/Sao_Paulo');
        $hoje = date('Y-m-d');
    
        try {
            $checkStmt = $pdo->prepare("
                SELECT COUNT(*) as total 
                FROM compras c 
                JOIN produto p ON c.id_produto = p.id 
                WHERE p.id_empresa = :id_empresa
            ");
            $checkStmt->execute([':id_empresa' => $id_empresa]);
            $total = $checkStmt->fetch(PDO::FETCH_ASSOC)['total'];
            error_log("Total de compras para empresa {$id_empresa}: {$total}");
    
            $stmt = $pdo->prepare("
                SELECT 
                    c.*,
                    p.nome AS produto_nome,
                    p.valor AS produto_valor,
                    cl.nome AS cliente_nome,
                    cl.cpf AS cliente_cpf
                FROM compras c
                JOIN produto p ON c.id_produto = p.id
                JOIN cliente cl ON c.id_cliente = cl.id
                WHERE p.id_empresa = :id_empresa 
                AND c.compra BETWEEN :hoje_inicio AND :hoje_fim
            ");
            
            $hoje_inicio = $hoje . ' 00:00:00';
            $hoje_fim = $hoje . ' 23:59:59';
            
            $stmt->execute([
                ':id_empresa' => $id_empresa,
                ':hoje_inicio' => $hoje_inicio,
                ':hoje_fim' => $hoje_fim
            ]);
            
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $results;
        } catch (PDOException $e) {
            error_log("Erro na query de compras: " . $e->getMessage());
            return false;
        }
    }
    public static function getComprasPorData($id_empresa, $data = null) {
        global $pdo;
        date_default_timezone_set('America/Sao_Paulo');
        
        try {
            $query = "
                SELECT 
                    c.*,
                    p.nome AS produto_nome,
                    p.valor AS produto_valor,
                    cl.nome AS cliente_nome,
                    cl.cpf AS cliente_cpf
                FROM compras c
                JOIN produto p ON c.id_produto = p.id
                JOIN cliente cl ON c.id_cliente = cl.id
                WHERE p.id_empresa = :id_empresa";
    
            $params = [':id_empresa' => $id_empresa];
    
             
            if ($data) {
                $data_inicio = $data . ' 00:00:00';
                $data_fim = $data . ' 23:59:59';
                $query .= " AND c.compra BETWEEN :data_inicio AND :data_fim";
                $params[':data_inicio'] = $data_inicio;
                $params[':data_fim'] = $data_fim;
            }
    
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            return $results;
        } catch (PDOException $e) {
            error_log("Erro na query de compras: " . $e->getMessage());
            return false;
        }
    }
 
 
 
 
            
 
 
 
 
 
 
 
            
 
 
 
 
            
 
            
 
 
 
 

 

 
 
 
 
 
 
 
 
 
 
 
 
 
 
            
 
 
 
 
            
 
 
            
 
            
 
 
 
 
 
}