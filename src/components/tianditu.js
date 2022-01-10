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

  // CRS:84: EPSG4326Projection2 {code_: 'CRS:84', units_: 'degrees', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // EPSG:3857: EPSG3857Projection2 {code_: 'EPSG:3857', units_: 'm', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // EPSG:4326: EPSG4326Projection2 {code_: 'EPSG:4326', units_: 'degrees', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'neu', …}
  // EPSG:102100: EPSG3857Projection2 {code_: 'EPSG:102100', units_: 'm', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // EPSG:102113: EPSG3857Projection2 {code_: 'EPSG:102113', units_: 'm', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // EPSG:900913: EPSG3857Projection2 {code_: 'EPSG:900913', units_: 'm', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // http://www.opengis.net/def/crs/EPSG/0/3857: EPSG3857Projection2 {code_: 'http://www.opengis.net/def/crs/EPSG/0/3857', units_: 'm', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // http://www.opengis.net/def/crs/EPSG/0/4326: EPSG4326Projection2 {code_: 'http://www.opengis.net/def/crs/EPSG/0/4326', units_: 'degrees', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'neu', …}
  // http://www.opengis.net/def/crs/OGC/1.3/CRS84: EPSG4326Projection2 {code_: 'http://www.opengis.net/def/crs/OGC/1.3/CRS84', units_: 'degrees', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // http://www.opengis.net/gml/srs/epsg.xml#3857: EPSG3857Projection2 {code_: 'http://www.opengis.net/gml/srs/epsg.xml#3857', units_: 'm', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // http://www.opengis.net/gml/srs/epsg.xml#4326: EPSG4326Projection2 {code_: 'http://www.opengis.net/gml/srs/epsg.xml#4326', units_: 'degrees', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'neu', …}
  // urn:ogc:def:crs:OGC:1.3:CRS84: EPSG4326Projection2 {code_: 'urn:ogc:def:crs:OGC:1.3:CRS84', units_: 'degrees', extent_: Array(4), worldExtent_: Array(4), axisOrientation_: 'enu', …}
  // urn:ogc:def:crs:OGC:2:84:
  // 获取投影坐标系，如果不是上面列出来的这几个坐标系，就一定要自己先注册。
  const projection = getProjection(projs[options.proj]);
  console.log("prjection", projection);
  const projectionExtent = projection.getExtent();
  console.log("project extent", projectionExtent);
  const origin = projectionExtent ? getTopLeft(projectionExtent) : [-180, 90];
  console.log("origin", origin);
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
  console.log("resolutions", resolutions);
  const wmtsTileGrid = new WMTSGrid({
    origin, // 瓦片坐标系水平方向上的起始点。原点
    resolutions, // 瓦片坐标系各个层级上的分辨率。数组类型，索引跟缩放级别匹配。
    matrixIds, // 矩阵 ID。就是瓦片坐标系z维度（可以看作是缩放级别）各个层级的标识，此数组的长度需要与分辨率数组的长度相匹配
  });

  const wmtsSource = new WMTSSource({
    url: `http://t0.tianditu.gov.cn/${layers[options.type]}_${
      matrixSets[options.proj]
    }/wmts?tk=${options.key}`,
    layer: layers[options.type],
    version: "1.0.0",
    matrixSet: matrixSets[options.proj], // 图层矩阵集，一定要和WMTS capabilities文档中一致，否则会加载失败
    format: "tiles", // 图片格式
    projection, // 投影坐标系
    requestEncoding: "KVP", // 请求的编码方式，默认就是'KVP'
    style: "default",
    tileGrid: wmtsTileGrid, // 投影的坐标系配置
  });

  const wmtsLayer = new TileLayer({
    source: wmtsSource,
  });

  return wmtsLayer;
};

export default getLayer;
