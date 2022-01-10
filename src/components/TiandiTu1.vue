<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import { register } from "ol/proj/proj4";
import { transform } from "ol/proj";
import proj4 from "proj4";
import Overlay from "ol/Overlay";
import { getLayer } from "./tianditu";
import getVector from "./VectorLayer";
import { points } from "./Point";

proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
register(proj4);

const center = transform(
  [120.635061645508, 36.1900616455078],
  "EPSG:4326",
  "EPSG:3857"
);

onMounted(() => {
  const markDom = document.getElementById("label");
  const map = new Map({
    target: "map",
    view: new View({
      center: center, // [116.391478, 39.903185],
      projection: "EPSG:3857",
      zoom: 12,
      maxZoom: 18,
      minZoom: 1,
    }),
  });

  const oneDitu = getLayer({
    type: "矢量底图",
    proj: "经纬度投影",
    key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  });

  console.log("one ditu", oneDitu);
  const vectorLayer = getVector(points);

  const LabelMarker = new Overlay({ element: markDom });

  map.on("pointermove", (evt) => {
    // console.log("point move", evt);
    vectorLayer.getFeatures(evt.pixel).then((result) => {
      // console.log("move result", result);
      if (result.length) {
        const features = result[0].get("features");
        // const point = result[0].get("geometry");
        // const properties = features.getCoordinates();
        // console.log("坐标", point.getCoordinates());
        // console.log("move feature", features);
        // console.log("feature properties", features[0].getProperties());
        const featureData = features[0].getProperties();
        if (featureData) {
          const coordinates = featureData.geometry.getCoordinates();
          const name = featureData.name;

          markDom.innerText = name;
          LabelMarker.setPosition(coordinates);

          map.addOverlay(LabelMarker);
        }
      } else {
        map.removeOverlay(LabelMarker);
      }
    });
  });

  // const twoDitu = getLayer({
  //   type: "影像底图",
  //   proj: "球面墨卡托投影",
  //   key: "6f6b7b33fd1c3cd2cecac73dae4b54fe",
  // });

  map.addLayer(oneDitu);
  map.addLayer(vectorLayer);
  // map.addLayer(twoDitu);
});
</script>

<template>
  <div id="map"></div>
  <div id="label"></div>
</template>

<style>
#map {
  width: 100%;
  height: 800px;
}
#label {
  color: red;
  font-size: 16px;
}
</style>