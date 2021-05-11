<?php

//es pasa tot l'arxiu geojson a un string.
$dades = json_decode(file_get_contents("geojson/ABSSimplificat_ID.geojson"));

$dades = json_decode(json_encode($dades), true);

//es contan els camps de features per despres utilitzar-ho al for.
$count = count($dades["features"]);

$json_dades = '';
/*
 * Es realitza un for per trobar tots els abs de cada regio sanitaria.
 * Este de canviar la variable del if == manualment.
 */

for($i = 0; $i < $count; $i++)
{
    if($dades["features"][$i]["properties"]["NOMRS"] == "Regió Sanitària Terres de l'Ebre")
    {
        //variable que agafa tota l'informacio dels abs trobats.
        $json_dades = $json_dades . json_encode($dades["features"][$i]) . ", ";
    }
}
//trec la ultima coma que hi ha despres de la ultima variable per que no dongui despres error.
$json_dades = substr($json_dades, 0, -2);
//var_dump($json_dades);

//es crea el fitxer i s'escriu el contingut de la variable.
$f = fopen("geojson/regions/RegióSanitàriaTerresdel'Ebre.geojson", "w+");
fwrite($f, '{
        "type": "FeatureCollection",
        "name": "ABSsimplificat",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [' .
            $json_dades .
        ']}')
        ;

fclose($f);

?>