    <?php
    // FuncionarioController.php

    require_once '../backend/dtos/response.php';
    require_once '../backend/repository/empresa_repository.php';
    require_once '../backend/enums/status.php';

    class FuncionarioController {

        public static function route($segment) {
            return match($segment) {
                'login' => self::login(
                    json_decode(file_get_contents('php://input'))
                ),
                'loginBySenha' => self::loginBySenha(
                json_decode(file_get_contents('php://input'))
                ),
                'create' => self::create(
                    json_decode(file_get_contents('php://input'))
                ),
                'collect' => self::collect(
                    $_GET['id_empresa']
                ),
                'modify' => self::modify(
                    json_decode(file_get_contents('php://input'))
                ),
                'delete' => self::delete(
                    $_GET['id_empresa']
                ),
                default => http_response_code(Status::NOT_FOUND->value)
            };
        }

        private static function loginBySenha($request) {
            $esta_valido = ResponseClass::ifNull(
                "request", $request,
                "senha", $request->senha,
                "id_empresa", $request->id_empresa
            );
        
            if (!$esta_valido) {
                return;
            }
        
            $funcionario = FuncionarioRepository::loginBySenha(
                $request->senha,
                $request->id_empresa
            );
        
            if (!$funcionario) {
                return ResponseClass::answer(
                    "Senha inválida",
                    Status::UNAUTHORIZED
                );
            }
        
            return ResponseClass::answerWithBody(
                $funcionario,
                Status::OK
            );
        }

        private static function login($request) {
            $esta_valido = ResponseClass::ifNull(
                "request", $request,
                "cpf", $request->cpf,
                "senha", $request->senha
            );

            if (!$esta_valido) {
                return;
            }

            $funcionario = FuncionarioRepository::login(
                $request->cpf, 
                $request->senha
            );

            if (!$funcionario) {
                return ResponseClass::answer(
                    "Credenciais inválidas",
                    Status::UNAUTHORIZED
                );
            }

            return ResponseClass::answerWithBody(
                $funcionario,
                Status::OK
            );
        }

        private static function collect($id_empresa) {
            if (!$id_empresa) {
                return ResponseClass::answer(
                    "ID da empresa é necessário",
                    Status::BAD_REQUEST
                );
            }

            $id_funcionario = isset($_GET['id_funcionario']) ? $_GET['id_funcionario'] : null;
        
            if ($id_funcionario) {
                $funcionario = FuncionarioRepository::one($id_funcionario);
                if (!$funcionario) {
                    return ResponseClass::answer(
                        "Funcionário não encontrado",
                        Status::NOT_FOUND
                    );
                }
                return ResponseClass::answerWithBody($funcionario, Status::OK);
            }
        
            $funcionarios = FuncionarioRepository::all($id_empresa);
        
            if (empty($funcionarios)) {
                return ResponseClass::answer(
                    "Nenhum funcionário encontrado",
                    Status::NOT_FOUND
                );
            }
        
            return ResponseClass::answerWithBody($funcionarios, Status::OK);
        }

        private static function create($request) {
            if (is_null($request)) {
                return ResponseClass::answer(
                    "Dados inválidos",
                    Status::BAD_REQUEST
                );
            }
        
            $esta_valido = ResponseClass::ifNull(
                "request", $request,
                "id_empresa", $request->id_empresa,
                "nome", $request->nome,
                "cpf", $request->cpf,
                "senha", $request->senha
            );
        
            if (!$esta_valido) {
                return;
            }
        
            $empresa = EmpresaRepository::one($request->id_empresa);
            if (!$empresa) {
                return ResponseClass::answer(
                    "Empresa não encontrada",
                    Status::NOT_FOUND
                );
            }
        
            try {
                $funcionou = FuncionarioRepository::create(
                    $request->id_empresa,
                    $request->nome,
                    $request->cpf,
                    $request->senha
                );
        
                if (!$funcionou) {
                    throw new Exception("Erro ao criar funcionário");
                }

                $funcionario = FuncionarioRepository::login($request->cpf, $request->senha);
                return ResponseClass::answerWithBody(
                    $funcionario,
                    Status::CREATED
                );

            } catch (Exception $e) {
                return ResponseClass::answer(
                    $e->getMessage(),
                    Status::INTERNAL_SERVER_ERROR
                );
            }
        }

        private static function modify($request) {
            $esta_valido = ResponseClass::ifNull(
                "request", $request,
                "id", $request->id
            );

            if (!$esta_valido) {
                return;
            }

            $funcionario = FuncionarioRepository::one($request->id);
            if (!$funcionario) {
                return ResponseClass::answer(
                    "Funcionário não encontrado",
                    Status::NOT_FOUND
                );
            }

            try {
                $funcionou = FuncionarioRepository::modify(
                    $request,
                    Utils::format(
                        "id_empresa = :id_empresa", $request->id_empresa,
                        "nome = :nome", $request->nome,
                        "cpf = :cpf", $request->cpf,
                        "senha = :senha", $request->senha,
                        "modificado = UTC_TIMESTAMP()", null
                    )
                );

                if (!$funcionou) {
                    throw new Exception("Erro ao atualizar funcionário");
                }

                $funcionario = FuncionarioRepository::one($request->id);
                return ResponseClass::answerWithBody(
                    $funcionario,
                    Status::OK
                );

            } catch (Exception $e) {
                return ResponseClass::answer(
                    $e->getMessage(),
                    Status::INTERNAL_SERVER_ERROR
                );
            }
        }

        private static function delete($id_funcionario) {
            if (!$id_funcionario) {
                return ResponseClass::answer(
                    "ID do funcionário é necessário",
                    Status::BAD_REQUEST
                );
            }

            $funcionario = FuncionarioRepository::one($id_funcionario);
            if (!$funcionario) {
                return ResponseClass::answer(
                    "Funcionário não encontrado",
                    Status::NOT_FOUND
                );
            }

            try {
                $funcionou = FuncionarioRepository::delete($id_funcionario);
                if (!$funcionou) {
                    throw new Exception("Erro ao deletar funcionário");
                }

                return ResponseClass::answer(
                    "Funcionário deletado com sucesso",
                    Status::OK
                );

            } catch (Exception $e) {
                return ResponseClass::answer(
                    $e->getMessage(),
                    Status::INTERNAL_SERVER_ERROR
                );
            }
        }
    }