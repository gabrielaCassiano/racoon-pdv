<?php

require_once '../backend/dtos/response.php';
require_once '../backend/repository/produto_repository.php';
require_once '../backend/utils/update.php';
require_once '../backend/enums/status.php';

class ProdutoController {

    public static function route($segment) {

        return match($segment) {
            'create' => self::create(
                json_decode(file_get_contents('php://input'))
            ),//TODO test
            'collect' => self::collect(
                $_GET['id_empresa'], $_GET['codigo_barras'] ?? null
            ),//TODO test
            'modify' => self::modify(
                json_decode(file_get_contents('php://input'))
            ),//TODO test 
            'delete' => self::delete(
                $_GET['codigo_barras']
            ),//TODO test
            default => http_response_code(Status::NOT_FOUND->value)
        };

    }

    private static function create($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id_empresa", $request->id_empresa,
            "categoria", $request->categoria,
            "nome", $request->nome,
            "codigo_barras", $request->codigo_barras,
            "valor", $request->valor,
            "porcentagem_cashback", $request->porcentagem_cashback
        );

        if (!$esta_valido) {

            return;

        }

        $foi_inserido = ProdutoRepository::create(
            $request->id_empresa,
            $request->categoria,
            $request->nome,
            $request->codigo_barras,
            $request->valor,
            $request->porcentagem_cashback
        );

        if (!$foi_inserido) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto o produto era criado",
                Status::INTERNAL_SERVER_ERROR
            );

            return;

        }

        $produto = ProdutoRepository::collect(
            $request->id_empresa,
            $request->codigo_barras
        );
        
        if (!$produto) {

            ResponseClass::answer(
                "Algum erro ocorreu enquanto o produto era coletado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        return ResponseClass::answerWithBody(
            $produto,
            Status::CREATED
        );

    }

    // private static function collect($id_empresa, $codigo_barras) {

    //     $produtos = null;

    //     if ($id_empresa != null) {

    //         $produtos = ProdutoRepository::all($id_empresa);

    //     } else if ($codigo_barras != null) {

    //         $produtos = ProdutoRepository::one($codigo_barras);

    //     }

    //     if (!$produtos) {

    //         return ResponseClass::answer(
    //             "Nenhum produto foi encontrado",
    //             Status::NO_CONTENT
    //         );

    //     }

    //     return ResponseClass::answerWithBody(
    //         $produtos,
    //         Status::OK
    //     );

    // }


    private static function collect($id_empresa, $codigo_barras) {
        header('Content-Type: application/json; charset=utf-8');
        
        if (!$id_empresa) {
            return ResponseClass::answer(
                "ID da empresa é necessário",
                Status::BAD_REQUEST
            );
        }

        $codigo_barras = isset($_GET['codigo_barras']) ? $_GET['codigo_barras'] : null;
    
        if ($codigo_barras) {
            $produto = ProdutoRepository::one($codigo_barras);
            if (!$produto) {
                return ResponseClass::answer(
                    "Nenhum produto encontrado",
                    Status::NO_CONTENT
                );
            }
            return ResponseClass::answerWithBody([$produto], Status::OK);
        }

        $produtos = ProdutoRepository::all($id_empresa);
    
        if (empty($produtos)) {
            return ResponseClass::answer(
                "Nenhum produto encontrado",
                Status::NO_CONTENT
            );
        }
    
        return ResponseClass::answerWithBody($produtos, Status::OK);
    }
    































    private static function modify($request) {

        $esta_valido = ResponseClass::ifNull(
            "request", $request,
            "id", $request->id
        );

        if (!$esta_valido) {

            return; 

        }

        $produto = ProdutoRepository::one(
            $request->id
        );

        if ($produto) {

            return ResponseClass::answer(
                "Nenhum produto existe com este id",
                Status::NOT_FOUND
            );

        }

        $functionou = ProdutoRepository::modify(
            $request,
            Utils::format(
                "id_empresa = :id_empresa", $request->id_empresa,
                "categoria = :categoria", $request->categoria,
                "nome = :nome", $request->nome,
                "codigo_barras = :codigo_barras", $request->codigo_barras,
                "valor = :valor", $request->valor,
                "porcentagem_cashback = :porcentagem_cashback", $request->porcentagem_cashback,
                "modificado = UTC_TIMESTAMP()", ""
            )
        );

        if (!$functionou) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o produto era atualizado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        $produto = ProdutoRepository::one(
            $request->id
        );    

        if (!$produto) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto os produto era coletado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        return ResponseClass::answerWithBody(
            $produto,
            Status::OK
        );

    }

    private static function delete($codigo_barras) {

        $esta_valido = ResponseClass::ifNull(
            "codigo_barras", $codigo_barras
        );

        if (!$esta_valido) {

            return;

        }

        $produto = ProdutoRepository::one($codigo_barras);

        if (!$produto) {

            return ResponseClass::answer(
                "Nenhum produto foi encontrado com este id",
                Status::NOT_FOUND
            );

        }

        ProdutoRepository::delete($codigo_barras);

        $produto = ProdutoRepository::one($codigo_barras);

        if ($produto) {

            return ResponseClass::answer(
                "Algum erro ocorreu enquanto o produto era deletado",
                Status::INTERNAL_SERVER_ERROR
            );

        }

        return ResponseClass::answer(
            "Produto deletado com sucesso",
            Status::OK
        );

    }

}

?>
