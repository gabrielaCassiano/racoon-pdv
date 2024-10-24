<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/empresa_repository.php';

class FuncionarioController {

    public static function login($request) {

        $body = json_decode($request);

        $esta_valido = ResponseClass::validate()->ifNull(
            "request"
        );

    }

}

?>
