// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
//chart.geodataSource.url= 'ABS_2018.geojson';
//chart.geodataSource.url= 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/spain-provinces.geojson';
chart.geodataSource.url= 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson';
//chart.geodataSource.url= 'https://raw.githubusercontent.com/anshver92/walruswondersitaly/master/italian-regions.geojson';
//chart.geodataSource.url= 'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/1_deutschland/1_sehr_hoch.geo.json';
chart.homeZoomLevel = 50;

// Set projection
chart.projection = new am4maps.projections.Mercator();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.calculateVisualCenter = true;

var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.tooltipText = "{NOMABS}";
polygonTemplate.fill = am4core.color("#74B266");

