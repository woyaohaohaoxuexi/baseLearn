import {getWidth, getTopLeft, applyTransform} from "ol/extent";
import WMTSGrid from "ol/tilegrid/WMTS";
import WMTSSource from "ol/source/WMTS";
import TileLayer from "ol/layer/Tile";
import {get as getProjection, getTransform} from "ol/proj";

export const getLayer = (options) => {
  const layers = {
    矢量底图: "vec",
    矢量注记: "cva",
    影像底图: "img",
    影像注记: "cia",
  };

  const projs = {
    经纬度投影: "EPSG:4490",
    球面墨卡托投影: "EPSG:900913",
  };
  const matrixSets = {
    经纬度投影: "c",
    球面墨卡托投影: "w",
  };

  const projection = getProjection(projs[options.proj]);
  console.log("prjection", projection);
  const projectionExtent = projection.getExtent();
  console.log("project extent", projectionExtent);
  const origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90];
  const fromLonLat = getTransform("EPSG:4326", projection);
  const width = projectionExtent
    ? getWidth(projectionExtent)
    : getWidth(applyTransform([-180.0, -85.05, 180.0, 85.05], fromLonLat));
  console.log("width", width);
  const resolutions = [];
  const matrixIds = [];
  for (let z = 1; z <= 19; z++) {
    resolutions[z] = width / (256 * Math.pow(2, z));
    matrixIds[z] = z;
  }

  const wmtsTileGrid = new WMTSGrid({
    origin,
    resolutions,
    matrixIds,
  });

  const wmtsSource = new WMTSSource({
    url: `http://t0.tianditu.gov.cn/${layers[options.type]}_${
      matrixSets[options.proj]
    }/wmts?tk=${options.key}`,
    layer: layers[options.type],
    version: "1.0.0",
    matrixSet: matrixSets[options.proj],
    format: "tiles",
    projection,
    requestEncoding: "KVP",
    style: "default",
    tileGrid: wmtsTileGrid,
  });

  const wmtsLayer = new TileLayer({
    source: wmtsSource,
  });

  return wmtsLayer;
};
