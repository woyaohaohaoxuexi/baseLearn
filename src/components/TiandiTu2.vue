<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { register } from "ol/proj/proj4";
import { transform, get } from "ol/proj";
import proj4 from "proj4";
import { getLayer } from "./WgsXms";
import defaultLayer from "./tianditu";

proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
register(proj4);
// [120.235061645508, 35.8600616455078], [120.55, 35.9]
const center = transform(
  [120.635061645508, 36.1900616455078],
  "EPSG:4326",
  "EPSG:3857"
);

const init = () => {
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

  const oneDitu = defaultLayer({
    type: "矢量底图",
    proj: "经纬度投影",
    key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  });

  map.addLayer(oneDitu);
  console.log("oneDitu", oneDitu);

  getLayer({
    layer: "ter",
    matrixSet: "c",
    url: "http://t0.tianditu.gov.cn/ter_c/wmts?request=GetCapabilities&service=wmts",
    tileUrl: `http://t0.tianditu.gov.cn/ter_c/wmts?tk=6f6b7b33fd1c3cd2cecac73dae4b54fe`,
  }).then((res) => {
    console.log("layer", res);
    map.addLayer(res);
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