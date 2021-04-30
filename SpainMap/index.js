am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// es crear una instancia del mapa que sera mostrat al div chartdiv
var chart = am4core.create("chartdiv", am4maps.MapChart);
chart.maxZoomLevel = 64;

// es carrega el mapa de provincies d'espanya
chart.geodata = am4geodata_spainProvincesLow;

// Projeccio que te de tenir el mapa
chart.projection = new am4maps.projections.Mercator(); //representacio del mapa

var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;
polygonSeries.calculateVisualCenter = true;
    
//caracteristiques que seran implementades al mapa color nom quan es pasa per sobre d'una zona etc.
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.strokeOpacity = 1;
polygonTemplate.stroke = am4core.color("#ffffff");//color de linies entre paisos
polygonTemplate.fillOpacity = 0.5;
polygonTemplate.tooltipText = "{name}";
polygonTemplate.fill = am4core.color("#74B266");

//color quan es pasa per sobre del pais amb el ratoli
var polygonTemplatehs = polygonTemplate.states.create("hover");
polygonTemplatehs.properties.fill = am4core.color("#367B25");

//funcio on es crea el zoom.
var zoomOut = chart.tooltipContainer.createChild(am4core.ZoomOutButton);
//caracteristiques que se li dona al boto zoom
zoomOut.align = "right";//es coloca a la dreta
zoomOut.valign = "top";//adalt
zoomOut.margin(20, 20, 20, 20);//es dona un marges.
//quan s'apreta al boto s'oculta currentseries.
zoomOut.events.on("hit", function() {
  if (currentSeries) {
    currentSeries.hide();
  }
  chart.goHome();
  zoomOut.hide();
  currentSeries = provinciesSeries.series;
  currentSeries.show();
});
//inicialment ocult.
zoomOut.hide();

chart.events.on("ready", cargarArxiuStore);
//funcio on es carrega l'arxiu json.
function cargarArxiuStore(){
    var dataSource = new am4core.DataSource();
    dataSource.url = "store.json";
    dataSource.events.on("parseended", function(ev) {
    var data = ev.target.data;
    //console.log(data);
    //info es pasa a una funcio
    informacioService(data);
    });
    dataSource.load();
}

function createSeries(heatfield) {
    var series = chart.series.push(new am4maps.MapImageSeries());
    series.dataFields.value = heatfield;
    console.log(series.dataFields.value);
  
    var template = series.mapImages.template;
    template.verticalCenter = "middle";
    template.horizontalCenter = "middle";
    template.propertyFields.latitude = "lat";
    template.propertyFields.longitude = "long";
  
    var circle = template.createChild(am4core.Circle);
    circle.radius = 10;
    circle.fillOpacity = 0.7;
    circle.verticalCenter = "middle";
    circle.horizontalCenter = "middle";
    circle.nonScaling = true;
  
    var label = template.createChild(am4core.Label);
    label.text = "{stores}";
    label.fill = am4core.color("#fff");
    label.verticalCenter = "middle";
    label.horizontalCenter = "middle";
    label.nonScaling = true;
  
    var heat = series.heatRules.push({
      target: circle,
      property: "radius",
      min: 10,
      max: 30
    });

    series.mapImages.template.events.on("hit", function(ev) {

        // Determine what we've clicked on
        var data = ev.target.dataItem.dataContext;
        //console.log(ev.target.dataItem.dataContext);
    
        // No id? Individual store - nothing to drill down to further
        if (!data.target) {
          return;
        }
    
        // Create actual series if it hasn't been yet created
        if (!provinciesSeries[data.target].series) {
            provinciesSeries[data.target].series = createSeries("count");
            provinciesSeries[data.target].series.data = data.markerData;
        }
    
        // Hide current series
        if (currentSeries) {
          currentSeries.hide();
        }
    
        // Control zoom
        if (data.type == "state") {
          var statePolygon = polygonSeries.getPolygonById("ES-" + data.state);
          chart.zoomToMapObject(statePolygon);
        }
        else if (data.type == "Municipi") {
          chart.zoomToGeoPoint({
            latitude: data.lat,
            longitude: data.long
          }, 64, true);
        }
        zoomOut.show();
    
        // Show new targert series
        currentSeries = provinciesSeries[data.target].series;
        currentSeries.show();
      });
    
      return series;
}

var provinciesSeries = {};
var currentSeries;

function informacioService(data){

    //es crea un objecte on despres es posaran les dades i les series.
    provinciesSeries = {
        markerData: [],
        series: createSeries("stores")
      };

    currentSeries = provinciesSeries.series;

    //console.log(data.query_results);
    //aqui es pasen totes les dades obtingudes del arxiu.
    am4core.array.each(data.query_results, function(store) {

        // Get store data
        var store = {
          long: am4core.type.toNumber(store.longitude),
          lat: am4core.type.toNumber(store.latitude),
          state: store.state,
          provincia: store.Provincia,
          city: store.Municipi,
          count: am4core.type.toNumber(store.count)
        };
        console.log(provinciesSeries.markerData);

        //si provinciesSeries[store.state] es indefinit s'entra i es crea un nou statePoligon, 
        //en cas contrari s'incrementa el valor de store
        if (provinciesSeries[store.state] == undefined) {
            var statePolygon = polygonSeries.getPolygonById("ES-" + store.state);
            console.log(statePolygon);
            if (statePolygon) {
      
              // Add state data
              provinciesSeries[store.state] = {
                target: store.state,
                type: "state",
                count: store.count,
                stores: 1,
                lat: statePolygon.visualLatitude,
                long: statePolygon.visualLongitude,
                state: store.state,
                markerData: []
              };
              //console.log(provinciesSeries[store.state]);
              provinciesSeries.markerData.push(provinciesSeries[store.state]);
      
            }
            else {
              // State not found
              return;
            }
          }
          else {
            provinciesSeries[store.state].stores++;
            provinciesSeries[store.state].count += store.count;
          }

          //si la ciutat no conte cap altre botiga es fa una de nova i s'afegeix al markerdata en cas contarari
          if (provinciesSeries[store.city] == undefined) {
            provinciesSeries[store.city] = {
              target: store.city,
              type: "city",
              name: store.city,
              count: store.count,
              stores: 1,
              lat: store.lat,
              long: store.long,
              state: store.state,
              markerData: []
            };
            provinciesSeries[store.state].markerData.push(provinciesSeries[store.city]);
            //console.log(provinciesSeries[store.city]);
          }
          else {
            provinciesSeries[store.city].stores++;
            provinciesSeries[store.city].count += store.count;
          }
      
          // Process individual store
          provinciesSeries[store.city].markerData.push({
            name: store.city,
            count: store.count,
            stores: 1,
            lat: store.lat,
            long: store.long,
            state: store.state
          });
          provinciesSeries.series.data = provinciesSeries.markerData;

    });
    
}
    
});