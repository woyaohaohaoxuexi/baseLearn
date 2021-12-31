import {getWidth, getTopLeft, applyTransform} from "ol/extent";
import WMTSGrid from "ol/tilegrid/WMTS";
import WMTSSource, {optionsFromCapabilities} from "ol/source/WMTS";
import WMTSCapabilities from "ol/format/WMSCapabilities";
import TileLayer from "ol/layer/Tile";
import {get as getProjection} from "ol/proj";

const parser = new WMTSCapabilities();
export const getLayer = async (options) => {
  return fetch(
    "http://10.134.65.85:34668/laoshancimMetaSvc/interact/meta/wmts/1.0.0/WMTSCapabilities.xml?id=fa0e33f1-48f1-4d58-9af2-26d45a17b904&model=0"
  )
    .then((res) => res.text())
    .then((text) => {
      console.log("res", text);
      const result = parser.read(text);
      console.log("result", result);
      const source = optionsFromCapabilities(result, {
        layer: options.layer,
        matrixSet: options.matrixSet,
      });

      const wmtsLayer = new TileLayer({
        source: new WMTSSource(source),
      });

      return wmtsLayer;
    });
};
