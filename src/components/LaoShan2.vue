
<template>
  <div id="map"></div>
</template>

<style>
#map {
  width: 100%;
  height: 800px;
}
</style>
<script setup>
import { onMounted } from "vue";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";  
import { register } from "ol/proj/proj4";
import { transform, get } from "ol/proj";
import proj4 from "proj4";
import WMTSCapabilities from 'ol/format/WMTSCapabilities'
import { optionsFromCapabilities } from 'ol/source/WMTS'
import WMTS from 'ol/source/WMTS'

const capabilitiesUrl = 'http://10.134.65.85:34668/laoshancimMetasSvcs/interact/meta/wmts/1.0.0/WMTSCapabilities.xml?id=fa0e33f1-48f1-4d58-9af2-26d45a17b904&model=1';

fetch(capabilitiesUrl)
  .then(function (response) {

    return response.text();
  })
  .then(function (text) {
    var parses = new WMTSCapabilities();
    var result = parses.read(text);

    console.log('result', result)
    if (result && result.Contents) {
      for (let i = 0; i < result.Contents.Layer.length; i++) {

        const options = optionsFromCapabilities(result, {
          layer: result.Contents.Layer[i].Identifier
        });
        console.log('options', options)

        const map = new Map({
          target: 'map',
          view: new View({
            projection: get("EPSG:4326"),

            center: [120.534375, 36.18671875],

            zoom: 11,

          }),
          layers: [
            new TileLayer({
            source: new WMTS(options)
          })
          ]
        });

        console.log("加载wmts 成功！！！")
      }
    }
  });
</script>
