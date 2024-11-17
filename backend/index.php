<?php

require 'controller/empresa_controller.php';
require 'controller/funcionario_controller.php';
require 'controller/produto_controller.php';
require 'controller/cliente_controller.php';
require 'controller/caixa_controller.php';
require 'controller/compras_controller.php';

require_once 'enums/status.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); 
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$segments = explode('/', trim($uri, '/'));  

if (isset($segments[1])) {

    match ($segments[1]) {
        'empresa' => EmpresaController::route($segments[2]),
        'produto' => ProdutoController::route($segments[2]),
        'funcionario' => FuncionarioController::route($segments[2]),
        'cliente' => ClienteController::route($segments[2]),
        'caixa' => CaixaController::routes($segments[2]),
        'compras' => ComprasController::routes($segments[2]),
        default => http_response_code(Status::NOT_FOUND->value) 
    };

}

?>