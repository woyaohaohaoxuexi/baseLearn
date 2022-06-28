<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { register } from "ol/proj/proj4";
import { transform, get } from "ol/proj";
import proj4 from "proj4";
import { getLayer } from "./Wgs84";

// proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
// register(proj4);

// [120.235061645508, 35.8600616455078], [120.55, 35.9]
const center = transform(
  [120.635061645508, 36.1900616455078],
  "EPSG:4326",
  "EPSG:3857"
);

onMounted(() => {
  const map = new Map({
    target: "map",
    view: new View({
      center: center, //[120.55, 35.86], //, // center, //[120.235061645508, 35.8600616455078], // [116.391478, 39.903185],
      projection: get("EPSG:3857"),
      zoom: 11,
      maxZoom: 17,
      minZoom: 4,
    }),
  });

  // const diLayer = new TileLayer({
  //   source: new OSM(),
  // });

  const layer = getLayer({
    proj: "EPSG:3857",
    layer: "崂山卫图_标注4",
    matrixSet: "b01a6d80-0f41-4f1a-927b-95dfa806b4f7",
  });

  // const oneDitu = getLayer({
  //   type: "矢量底图",
  //   proj: "经纬度投影",
  //   key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  // });

  // const twoDitu = getLayer({
  //   type: "影像底图",
  //   proj: "球面墨卡托投影",
  //   key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  // });
  // map.addLayer(diLayer);
  console.log("layer", layer);
  map.addLayer(layer);
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