<?php

    //es pasa tot l'arxiu geojson a un string.
    $dades = json_decode(file_get_contents("../public/api/cirurgies.json"));

    $dades = json_decode(json_encode($dades), true);
    if(isset($_GET["event"]))
    {
        //es contan els camps de features per despres utilitzar-ho al for.
        $count = count($dades);

        $aux_event = [];
        $array_event = [];

        for($i = 0; $i < $count; $i++)
        {
            if($dades[$i]["Data"] != "")
            {
                $aux_event = $dades[$i];
                $array_event[] = $aux_event;
            }
        }


        for($i = 0; $i < count($array_event); $i++)
        {
            $data = $array_event[$i]["Data"];
            $date_format_start = str_replace('/', '-', $data);
            $date_format_start = date('Y-m-d', strtotime($date_format_start)) . ", " . $array_event[$i]["Hora"];
            $array_event[$i]["start"] = $date_format_start;

            $date_format_end = strtotime("+" . $array_event[$i]["Durada"] . ' minute', strtotime($date_format_start)); 
            $date_format_end = date ( 'Y-m-d, H:i:s' , $date_format_end );
            $array_event[$i]["end"] = $date_format_end;

        }

        echo json_encode($array_event);
    }
    elseif(isset($_GET["drag"]))
    {
        //es contan els camps de features per despres utilitzar-ho al for.
        $count = count($dades);

        $aux_draggable = [];
        $array_draggable = [];

        for($i = 0; $i < $count; $i++)
        {
            if($dades[$i]["Data"] == "")
            {
                $aux_draggable = $dades[$i];
                $array_draggable[] = $aux_draggable;
            }
        }

        echo json_encode($array_draggable);
    }
    





?>