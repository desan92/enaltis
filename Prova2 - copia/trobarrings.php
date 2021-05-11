<?php

$dades = json_decode(file_get_contents("geojson/RegionsSimplificat_ID.geojson"));

$dades = json_decode(json_encode($dades), true);

$coordenades = count($dades["features"][5]["geometry"]["coordinates"][0]);
//echo $coordenades . "<br>";

//contador utilitzat per contar les regions sanitarias.
$count = count($dades["features"]);

$aux_json_coordenades = array();
$aux_json_dades = array();
$json_dades = array();

    for($i = 0; $i < $count; $i++)
    {
        //es conten els elements que hi han al primer array.
        $primerLoop = count($dades["features"][$i]["geometry"]["coordinates"]);
        //es conten els elements que hi han al segon array.
        $segonLoop = count($dades["features"][$i]["geometry"]["coordinates"][0]);
        
        for($p = 0; $p < $primerLoop; $p++)
        {
            for($s = 0; $s < $segonLoop; $s++)
            {
                //contador utilitzat per a contar la quantitat de coordenades que hi han per regio.
                $coordenades = count($dades["features"][$i]["geometry"]["coordinates"][$p][$s]);
                for($j = 0; $j < $coordenades; $j++)
                {
                    $aux_json_coordenades[] = $dades["features"][$i]["geometry"]["coordinates"][$p][$s][$j]; 
                    //array que acumula tots els valors de un apartat. Ex. Regio sanitaria de Girona.
                    $aux_json_dades = array(
                                            "id" => $dades["features"][$i]["properties"]["id"],
                                            "NOMRS" => $dades["features"][$i]["properties"]["NOMRS"],
                                            "coordenades" => array($aux_json_coordenades)); 
                }
                
            }
        }
        //array que separa les coordenades de cada regio.
        $json_dades[] = $aux_json_dades;
        
        
        //s'elimina la variable auxiliar $aux_json_dades, perque no acumuli les dades dels arrays anteriors.
        unset($aux_json_dades);
    }

    echo "<pre>";
    var_dump($json_dades);
    echo "</pre>";

    

?>