// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodataSource.url= 'geojson/RegionsSimplificat_ID.geojson';

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Create map polygon series
var RegionsSeries = chart.series.push(new am4maps.MapPolygonSeries());
RegionsSeries.useGeodata = true;
RegionsSeries.calculateVisualCenter = true;

/* 
    RegionsSeriesTemplate per assignarli un nom i un color a cada regio sanitaria.
*/

var RegionsSeriesTemplate = RegionsSeries.mapPolygons.template;
RegionsSeriesTemplate.tooltipText = "{NOMRS}";
RegionsSeriesTemplate.fill = am4core.color("#3dbbff");


/* 
    RegionsSeriesTemplateHover es crear aquesta variable per donar-li un hover al passar
    per cada regio del mapa i que aixi es noti per on pasa.
*/

var RegionsSeriesTemplateHover = RegionsSeriesTemplate.states.create("hover");
RegionsSeriesTemplateHover.properties.fill = am4core.color("#2894c9");

/*
    backZoom.events.on entrara en funcionament quan es cliki el boto backZoom.
    com que el mapa estara amb un zoom aumentat el que fara es retrocedir al punt inicial
    de RegionsSeries.
*/

var ABSSeries = chart.series.push(new am4maps.MapPolygonSeries());
    ABSSeries.useGeodata = true;
    ABSSeries.hide();
    ABSSeries.geodataSource.events.on("done", function(ev) {
    //RegionsSeries.hide(); //si es vol que quan carregui ABSSeries no apareguin les regions descomentar aixo.
    ABSSeries.show();
});


var ABSSeriesTemplate = ABSSeries.mapPolygons.template;
ABSSeriesTemplate.tooltipText = "{NOMABS}";
ABSSeriesTemplate.fill = am4core.color("#2894c9");

var backZoom = chart.createChild(am4core.ZoomOutButton);
    backZoom.align = "right";
    backZoom.margin(20, 20, 20, 20);
    backZoom.hide();
    backZoom.events.on("hit", function(ev) {
            RegionsSeries.show();
            ABSSeries.hide();
            chart.goHome();
            backZoom.hide();
        });

chart.events.on("ready", cargarArxiuAbs);
function cargarArxiuAbs(){
    var dataSource = new am4core.DataSource();
    dataSource.url = "geojson/ABSSimplificat_ID.geojson";
    dataSource.events.on("parseended", function(ev) {
    var data = ev.target.data;
    //info es pasa a una funcio
    informacioServiceABS(data);
    });
    dataSource.load();
}


/* 
    RegionsSeries.mapPolygons.template.events.on event que entra en funcionament quan 
    l'usuari clicka a una de les regions sanitarie de catalunya.
    Un cop clickat s'aumentara el zoom de la regio sanitaria en questio.
*/


    RegionsSeries.mapPolygons.template.events.on("hit", function(ev) {
    //var drill_down
    var drill_down = ev.target.series.chart;
    drill_down.zoomToMapObject(ev.target);

    /*
        Si es clica a una regio sanitaria i aquesta te un id diferent a undefined, entrera
        a la funcio de backzoom i realitzara un zoom de la regio enconcret.
    */

    var map = ev.target.dataItem.dataContext.NOMRS;
    console.log(map);
    if (map != undefined) {
        map = map.replace(/ /g, "");
        //console.log(map);
        ABSSeries.geodataSource.url = "geojson/regions/" + map + ".geojson";
        ABSSeries.geodataSource.load();
        backZoom.show();
    }

});
