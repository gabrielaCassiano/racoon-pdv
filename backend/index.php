<?php

require 'controller/empresa_controller.php';
require 'controller/funcionario_controller.php';

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); 
header("Access-Control-Allow-Headers: Content-Type"); 

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No content
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$segments = explode('/', trim($uri, '/'));  

if (isset($segments[0])) {

    match ($segments[0]) {

        'empresa' => match ($segments[1]) {
            'login' => EmpresaController::login(file_get_contents('php://input')),
            'create' => EmpresaController::create(file_get_contents('php://input')),
            'collect' => EmpresaController::collect($_GET['id_empresa']),
            'modify' => EmpresaController::modify(file_get_contents('php://input')),
            'delete' => EmpresaController::delete($_GET['id_empresa']),
            default => http_response_code(404)
        },

//        'funcionario' => match($segments[1]) {
//            'login' => FuncionarioController::login(file_get_contents('php://input')),
//            'create' => FuncionarioController::create(file_get_contents('php://input')),
//            'collect' => FuncionarioController::collect($_GET['id_funcionario']),
//            'modify' => FuncionarioController::modify(file_get_contents('php://input')),
//            'delete' => FuncionarioController::delete($_GET['id_empresa']),
//            default => http_response_code(404)
//        },

        default => http_response_code(404) 

    };

}

?>
