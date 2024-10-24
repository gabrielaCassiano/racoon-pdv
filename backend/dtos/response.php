<?php 

class ResponseClass {

    public static function answerWithBody($message, $code) {
        header('Content-Type: application/json');
        http_response_code($code);
        echo $message;
    }

    public static function answer($message, $code) {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode(['message' => $message]);
    } 

    public static function validate() {

        return new ResponseClass();

    }

    public function ifNull(...$values) {

        for ($i = 0 ; $i < count($values) ; $i+=2) {

            $key = $values[$i];
            $value = $values[$i + 1];
            
            if ($value == null) {

                ResponseClass::answer("A variavel $key nao pode ser null", 400);

                return false;

            }

        }

        return true;

    }

}

?>
