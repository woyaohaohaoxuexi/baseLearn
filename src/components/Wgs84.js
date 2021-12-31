import {getWidth, getTopLeft, applyTransform} from "ol/extent";
import WMTSGrid from "ol/tilegrid/WMTS";
import WMTSSource from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import {get as getProjection} from "ol/proj";

export const getLayer = async (options) => {
  const projection = getProjection(options.proj);
  const layer = options.layer;
  const matrixSet = options.matrixSet;
  const projectionExtent = projection.getExtent();
  const origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90];
  const width = getWidth(projectionExtent);

  const resolutions = [];
  const matrixIds = [];

  console.log("width", width);
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
    url: "http://10.134.65.85:34668/laoshancimMapSvc/service/map/wmts",
    layer,
    version: "1.0.0",
    matrixSet,
    projection,
    requestEncoding: "KVP",
    format: "image/png",
    style: "default",
    tileGrid: wmtsTileGrid,
    // tilePixelRatio: 2,
    tileLoadFunction: function (imageTile, src) {
      src = src
        .replace("TileMatrix", "z")
        .replace("TileCol", "x")
        .replace("TileRow", "y");
      src +=
        "&token=uQFqT2wITSjTa1TdYyGx0DhN8Z5wIA5Y-v0EOhqN2jndtbBw_NK6kfBdB1RQ8CKEHFK9dwethGbQ199sq7MuE4KB53G3kdOryLYpBSohGZ_XHTjfKOVf6-08UgucfTOwc1CB_lUaLwK4CcyNAdozTs6WYExG1f3bWEiEg8LyXrqxaRSp3UBzhtEccUgJuCEm2CjTLiW-vnWLF1CaP2FCjCGvxKqv7ddj1utanZ-8fTcR9SbmJCOsN28JKNvBC-A5";
      imageTile.getImage().src = src;
    },
  });

  const wmtsLayer = new TileLayer({
    source: wmtsSource,
  });

  return wmtsLayer;
};
