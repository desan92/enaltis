
am4core.ready(function() {

// Themes begin
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

var circle = imageSeriesTemplate.createChild(am4core.Circle);
  circle.radius = 10;
  circle.fillOpacity = 0.7;
  circle.verticalCenter = "middle";
  circle.tooltipText = "{title}";
  circle.horizontalCenter = "middle";
  circle.nonScaling = true;

  var label = imageSeriesTemplate.createChild(am4core.Label);
  label.text = "{count}";
  label.fill = am4core.color("#fff");
  label.verticalCenter = "middle";
  label.horizontalCenter = "middle";
  label.nonScaling = true;

// Set property fields
imageSeriesTemplate.propertyFields.latitude = "latitude";
imageSeriesTemplate.propertyFields.longitude = "longitude";

// Add data for the three cities
imageSeries.data = [{
  "latitude": 48.856614,
  "longitude": 2.352222,
  "title": "Paris",
  "state": "FR",
  "count": 1
}, {
  "latitude": 40.4378698,
  "longitude": -3.8196207,
  "title": "Madrid",
  "state": "ES",
  "count": 2
}, {
  "latitude": 51.528308,
  "longitude": -0.3817841,
  "title": "Londres",
  "state": "GB", 
  "count": 3
}, {
  "latitude": 41.909986,
  "longitude": 12.3959118,
  "title": "Roma",
  "state": "IT",
  "count": 4
}];

console.log(imageSeries.data);

imageSeries.mapImages.template.events.on("hit", function(ev) {

  alert('EVENT CLICK');
  console.log(imageSeries.data.state)
  var statePolygon = polygonSeries.getPolygonById("ES");//variable de l'array.
      chart.zoomToMapObject(statePolygon);

});
}); // end am4core.ready()
