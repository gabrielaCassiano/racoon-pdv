<?php

require_once 'connection.php';

class ComprasRepository {

    public static function close($id_empresa, $hoje) {

        global $pdo;

        $stmt = $pdo->prepare("
            SELECT 
                SUM(p.valor) soma
            FROM 
                compras c 
                INNER JOIN produto p ON c.id_produto = p.id 
            WHERE 
                p.id_empresa = :id_empresa
                AND c.compra >= :hoje
        ");

        $stmt->bindParam(":id_empresa", $id_empresa);
        $stmt->bindParam(":hoje", $hoje);

        return $stmt->fetch();

    }

}

?>
