<?php

$dades = json_decode(file_get_contents("geojson/regions/RegióSanitàriaTerresdel'Ebre.geojson"));

$dades = json_decode(json_encode($dades), true);

//contador utilitzat per contar les regions sanitarias.
$count = count($dades["features"]);

$aux_json_coordenades = array();
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
                    //array que acumula tots els valors de un apartat. Ex. Regio sanitaria de Girona.
                    $aux_json_coordenades[] = $dades["features"][$i]["geometry"]["coordinates"][$p][$s][$j];
                }
                
            }
        }
        //array que separa les coordenades de cada regio.
        $json_dades[] = $aux_json_coordenades;
        
        
        //s'elimina la variable auxiliar $aux_json_dades, perque no acumuli les dades dels arrays anteriors.
        unset($aux_json_coordenades);
    }

function getAreaOfPolygon($geometry)
{

    $area = 0;
    for ($ri=0, $rl=sizeof($geometry->rings); $ri<$rl; $ri++) {
        $ring = $geometry->rings[$ri];

        for ($vi=0, $vl=sizeof($ring); $vi<$vl; $vi++) {
            $thisx = $ring[ $vi ][0];
            $thisy = $ring[ $vi ][1];
            $nextx = $ring[ ($vi+1) % $vl ][0];
            $nexty = $ring[ ($vi+1) % $vl ][1];
            $area += ($thisx * $nexty) - ($thisy * $nextx);
        }
    }

    // done with the rings: "sign" the area and return it
    $area = abs(($area / 2));
    return $area;

}

function getCentroidOfPolygon($geometry)
{

    $cx = 0;
    $cy = 0;

    for ($ri=0, $rl=sizeof($geometry->rings); $ri<$rl; $ri++) {
        $ring = $geometry->rings[$ri];

        for ($vi=0, $vl=sizeof($ring); $vi<$vl; $vi++) {
            $thisx = $ring[ $vi ][0];
            $thisy = $ring[ $vi ][1];
            $nextx = $ring[ ($vi+1) % $vl ][0];
            $nexty = $ring[ ($vi+1) % $vl ][1];

            $p = ($thisx * $nexty) - ($thisy * $nextx);
            $cx += ($thisx + $nextx) * $p;
            $cy += ($thisy + $nexty) * $p;
        }
    }

    // last step of centroid: divide by 6*A
    $area = getAreaOfPolygon($geometry);
    $cx = -$cx / ( 6 * $area);
    $cy = -$cy / ( 6 * $area);

    // done!
    return array($cx,$cy);

}

for($i = 0; $i < count($json_dades); $i++)
{
    $polygon = new stdClass();
    $polygon->rings = array($json_dades[$i]);
    $centroid[] = getCentroidOfPolygon($polygon);
}

echo "<pre>";
print_r($centroid);
echo "</pre>";

?>