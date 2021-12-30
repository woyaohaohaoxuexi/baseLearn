<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import { register } from "ol/proj/proj4";
import proj4 from "proj4";
import { getLayer } from "./tianditu";

proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
register(proj4);

onMounted(() => {
  const map = new Map({
    target: "map",
    view: new View({
      center: [116.391478, 39.903185],
      projection: "EPSG:4490",
      zoom: 15,
      maxZoom: 18,
      minZoom: 1,
    }),
  });

  const oneDitu = getLayer({
    type: "矢量底图",
    proj: "经纬度投影",
    key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  });

  // const twoDitu = getLayer({
  //   type: "影像底图",
  //   proj: "球面墨卡托投影",
  //   key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  // });

  map.addLayer(oneDitu);
  // map.addLayer(twoDitu);
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