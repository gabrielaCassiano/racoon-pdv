<?php

require 'controller/empresa_controller.php';
require 'controller/funcionario_controller.php';
require 'controller/produto_controller.php';
require 'controller/cliente_controller.php';
require 'controller/caixa_controller.php';

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

if (isset($segments[0])) {

    match ($segments[0]) {

        'empresa' => EmpresaController::route($segments[1]), //TEST
        'produto' => ProdutoController::route($segments[1]), //TEST
        'funcionario' => FuncionarioController::route($segments[1]), //TEST
        'cliente' => ClienteController::route($segments[1]), //TEST
        'caixa' => CaixaController::routes($segments[1]),
//        'compras' => match($segments[1]) {
//            'create',
//            'collect',
//            default => http_response_code(404)
//        },

        default => http_response_code(Status::NOT_FOUND->value) 

    };

}

?>
