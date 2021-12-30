<script setup>
import { ref, onMounted } from "vue";
import { Map, View } from "ol";
import { Tile } from "ol/layer";
// import { OSM, WMTS } from "ol/source";
import { get as getProjection } from "ol/proj";
import { getWidth, getTopLeft } from "ol/extent";
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";

const projection = getProjection("EPSG:4490");
const projectionExtent = projection.getExtent();
const size = getWidth(projectionExtent) / 256;
const resolutions = new Array(19);
const matrixIds = new Array(19);

for (let z = 0; z < 19; ++z) {
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}

onMounted(() => {
  const map = new Map({
    target: "map",
    layers: [
      new Tile({
        source: new WMTS({
          url: "http://t0.tianditu.gov.cn/vec_c/wmts?tk=6f6b7b33fd1c3cd2cecac73dae4b54fe",
          layer: "vec",
          matrixSet: "c",
          format: "tiles",
          style: "default",
          projection,
          tileGrid: new WMTSTileGrid({
            origin: getTopLeft(projectionExtent),
            resolutions,
            matrixIds,
          }),
          wrapX: true,
        }),
      }),
    ],
    view: new View({
      center: [-11158582, 4813697],
      zoom: 4,
    }),
  });
});
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 800px;
}
</style>
