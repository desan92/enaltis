<template>
<p>{{ name }}</p>
  <div class="chartdiv" ref="chartdiv"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4maps from "@amcharts/amcharts4/maps";
import axios from "axios";

am4core.useTheme(am4themes_animated);


export default {
  name: 'HelloWorld',
  data: () => ({
    name: "Hola",
    regionsSanitarias: []
  }),
  methods: {
    dadesregionsSanitarias(){
        axios.get("RegionsSimplificat_ID.geojson")
        .then(res=>{
            this.regionsSanitarias = res.data 
            console.log(this.regionsSanitarias)
        })
    }
  },
  mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4maps.MapChart)

    chart.geodataSource.url = "http://ipa.enaltis.com/storage/img/RegionsSimplificat_ID.geojson";

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
        per cada regio del mapa i que aixi es noti per on pasa.*/
    

    var RegionsSeriesTemplateHover = RegionsSeriesTemplate.states.create("hover");
    RegionsSeriesTemplateHover.properties.fill = am4core.color("#2894c9");

  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background-color: #ffffff;
  overflow: hidden;
  margin: 0;
}

.chartdiv {
  width: 100%;
  height: 100vh;
}
</style>