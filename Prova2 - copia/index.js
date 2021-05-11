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

chart.events.on("ready", loadStores);
// Loads store data
//carrega amb format json el nombre de botiges que hi ha per ciutat
function loadStores() {
  var loader = new am4core.DataSource();
  loader.url = "regions.json";
  loader.events.on("parseended", function(ev) {
    setUp(ev.target.data);//es enviat a la funcio setupStores
    //console.log(ev.target.data);//ev.target.data recull la informacio de url.
  });
  loader.load();
}

function createSeries(heatfield, data)
{
    var series = chart.series.push(new am4maps.MapImageSeries());
    series.dataFields.value = heatfield;
    series.data = data;
    series.show();

    var template = series.mapImages.template;
    template.verticalCenter = "middle";
    template.horizontalCenter = "middle";
    template.propertyFields.latitude = "latitude";
    template.propertyFields.longitude = "longitude";
    template.tooltipText = "{NOMRS}:\n[bold]{count} ABS[/]";

    var circle = template.createChild(am4core.Circle);
    circle.radius = 15;
    circle.fillOpacity = 0.7;
    circle.verticalCenter = "middle";
    circle.horizontalCenter = "middle";
    circle.nonScaling = true;

    var label = template.createChild(am4core.Label);
    label.text = "{count}";
    label.fill = am4core.color("#fff");
    label.verticalCenter = "middle";
    label.horizontalCenter = "middle";
    label.nonScaling = true;

    /* 
    series.mapImages.template.events.on event que entra en funcionament quan 
    l'usuari clicka a un dels cercles de les regions sanitaries de catalunya.
    Un cop clickat s'aumentara el zoom de la regio sanitaria en questio.
    */

    series.mapImages.template.events.on("hit", function(ev) {
    var data = ev.target.dataItem.dataContext;
    
    /*
        Si es clica a una regio sanitaria i aquesta te un type igual a regions, entrera
        a la funcio de backzoom i realitzara un zoom de la regio enconcret.
    */
    
    if(data.type == "regions")
    {
        var drill_down = ev.target.series.chart;
        drill_down.zoomToMapObject(ev.target);

        var map = ev.target.dataItem.dataContext.NOMRS;
        var mapUrl = map.replace(/ /g, "");
        ABSSeries.geodataSource.url = "geojson/regions/" + mapUrl + ".geojson";
        ABSSeries.geodataSource.load();
        backZoom.show();
        createSeries("abs", data.abs)

    }
    })
    
}

function setUp(data)
{
    RegioSeries = {
    data: [],
    series:createSeries("regions", data)
    };
    console.log(RegioSeries)
    
}
