// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodataSource.url= 'https://raw.githubusercontent.com/anshver92/walruswondersitaly/master/italian-regions.geojson';

// Set projection
chart.projection = new am4maps.projections.Miller();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.calculateVisualCenter = true;

// Configure series
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#74B266");
polygonTemplate.propertyFields.id = "name";
polygonTemplate.propertyFields.url = "url";

// Configure label series
var labelSeries = chart.series.push(new am4maps.MapImageSeries());
var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
labelTemplate.horizontalCenter = "middle";
labelTemplate.verticalCenter = "middle";
labelTemplate.fontSize = 8;
labelTemplate.interactionsEnabled = false;
labelTemplate.nonScaling = true;

var ids = ['lombardia','toscana','umbria','lazio'];

// Set up label series to populate
// Set up label series to populate
polygonSeries.events.on("datavalidated", function () {
  for(var i = 0; i < ids.length; i++){
  	var polygon = polygonSeries.map.getKey(ids[i]);
  	if(polygon){
	    var label = labelSeries.mapImages.create();
	    var state = polygon.dataItem.dataContext.name;
	    label.latitude = polygon.visualLatitude;
	    label.longitude = polygon.visualLongitude;
	    label.children.getIndex(0).text = state;
	}
  }
});