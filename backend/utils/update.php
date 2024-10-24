<?php

class Utils {

    public static function format(...$values) {

        $update_statement = "";

        for ($i = 0; $i < count($values); $i += 2) {

            $statement = $values[$i];
            $value = $values[$i + 1];

            if ($value !== null) {  

                $update_statement .= $statement;  

            }
        }
        
        return rtrim($update_statement, ",\n") . "\n";

    }

}

?>
