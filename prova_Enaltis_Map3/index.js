
am4core.ready(function() {

  am4core.useTheme(am4themes_animated);
// Themes end

// es crear una instancia del mapa que sera mostrat al div chartdiv
var chart = am4core.create("chartdiv", am4maps.MapChart);
chart.maxZoomLevel = 64;

// s'agafa el mapa worldLow
chart.geodata = am4geodata_worldLow;

// Projeccio que te de tenir el mapa
chart.projection = new am4maps.projections.Mercator(); //representacio del mapa

var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.calculateVisualCenter = true;

// s'especifican els paisos que volen que visualitzarse al mapa.
polygonSeries.include = ["IT", "CH", "FR", "DE", "GB", "ES", "PT", "IE", "NL", "LU", "BE", "AT", "DK"]

// country area look and behavior
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.strokeOpacity = 1;
polygonTemplate.stroke = am4core.color("#ffffff");//color de linies entre paisos
polygonTemplate.fillOpacity = 0.5;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#74B266");

//color quan es pasa per sobre del pais amb el ratoli
var polygonTemplatehs = polygonTemplate.states.create("hover");
polygonTemplatehs.properties.fill = am4core.color("#367B25");


// Create image series
var imageSeries = chart.series.push(new am4maps.MapImageSeries());

// Create image
var imageSeriesTemplate = imageSeries.mapImages.template;
    var marker = imageSeriesTemplate.createChild(am4core.Image);
    marker.href = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-160/marker.svg";
    marker.width = 20;
    marker.height = 20;
    marker.nonScaling = true;
    marker.tooltipText = "{title}";
    marker.horizontalCenter = "middle";
    marker.verticalCenter = "bottom";

    imageSeriesTemplate.propertyFields.latitude = 43.4234324; 
    imageSeriesTemplate.propertyFields.longitude = -3.43424;


  var dataSource = new am4core.DataSource();
  dataSource.url = "capital.json";
  dataSource.events.on("done", function(ev) {
    // Data loaded and parsed
    return ev.target.data;
  });

    


});
  