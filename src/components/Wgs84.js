import {getWidth, getTopLeft, applyTransform} from "ol/extent";
import WMTSGrid from "ol/tilegrid/WMTS";
import WMTSSource from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import {get as getProjection} from "ol/proj";

export const getLayer = (options) => {
  const projection = getProjection(options.proj);
  const layer = options.layer;
  const matrixSet = options.matrixSet;
  const projectionExtent = projection.getExtent();
  const origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90];
  const width = getWidth(projectionExtent);

  const resolutions = [];
  const matrixIds = [];

  for (let z = 4; z < 18; ++z) {
    resolutions[z] = width / (256 * Math.pow(2, z + 1));
    matrixIds[z] = z;
  }

  const wmtsTileGrid = new WMTSGrid({
    origin,
    resolutions,
    matrixIds,
  });

  const wmtsSource = new WMTSSource({
    // url: "http://10.134.65.85:34668/laoshancimMetasSvcs/interact/meta/wmts/1.0.0/WMTSCapabilities.xml?id=fa0e33f1-48f1-4d58-9af2-26d45a17b904&model=1",
    url: 'http://10.134.65.85:34668/laoshancimMapSvc/service/map/wmts',
    // layer,
    // version: "1.0.0",
    // matrixSet,
    // projection,
    // requestEncoding: "KVP",
    // format: "image/png",
    // style: "default",
    tileGrid: wmtsTileGrid,
    // tilePixelRatio: 2,
    tileLoadFunction: function (imageTile, src) {
      
      src = src
        .replace("TileMatrix", "z")
        .replace("TileCol", "x")
        .replace("TileRow", "y");
      src +=
        "&token=uQFqT2wITSjTa1TdYyGx0DhN8Z5wIA5Y-v0EOhqN2jndtbBw_NK6kfBdB1RQ8CKEgEW2_23uohKRtC60A48Cp1ms5PyD3tGCjf6nzZ8iSTwFjs3wch_i-ScqpWECGICbKDZv7-4cXPkSiSYdFwOems6WYExG1f3bWEiEg8LyXrolXFyQpEYzfpY_zykvNdA_Ntl-8nq9Cjx8CacExKIPkBup1rOW3HxC4FCvp4ziwrXpfH1IS_npYqTrtUdpC5NO";
      imageTile.getImage().src = src;
      console.log('src', src)
    },
  });

  const wmtsLayer = new TileLayer({
    source: wmtsSource,
  });

  return wmtsLayer;
};
