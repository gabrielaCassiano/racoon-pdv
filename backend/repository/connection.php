<?php

$host = '127.0.0.1';
$db = 'racoon';
$user = 'root';
$pass = 'pw';
// $pass = '';

try {

    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    echo "Erro na conexão: " . $e->getMessage();
}

?>
