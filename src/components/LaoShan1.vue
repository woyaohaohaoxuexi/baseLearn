<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { register } from "ol/proj/proj4";
import { transform, get } from "ol/proj";
import proj4 from "proj4";
import { getLayer } from "./WgsXms";

// proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
// register(proj4);

// [120.235061645508, 35.8600616455078], [120.55, 35.9]
const center = transform(
  [120.635061645508, 36.1900616455078],
  "EPSG:4326",
  "EPSG:3857"
);

const init = () => {
  getLayer({
    layer: "fbce564d-3b25-4b73-b3f9-21e606ab8ea5",
    matrixSet: "GoogleMapsCompatible",
    url: "http://10.134.65.85:34668/laoshancimMetaSvc/interact/meta/wmts/1.0.0/WMTSCapabilities.xml?id=fa0e33f1-48f1-4d58-9af2-26d45a17b904&model=0",
  }).then((res) => {
    console.log("layer", res);

    if (res) {
      const map = new Map({
        target: "map",
        view: new View({
          center: center, //[120.55, 35.86], //, // center, //[120.235061645508, 35.8600616455078], // [116.391478, 39.903185],
          projection: get("EPSG:3857"),
          zoom: 11,
          maxZoom: 17,
          minZoom: 4,
        }),
        layers: [res],
      });
    }
    // map.addLayer(res);
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div id="map"></div>
</template>

<style>
#map {
  width: 100%;
  height: 800px;
}
</style>