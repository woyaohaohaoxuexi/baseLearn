import {getWidth, getTopLeft, applyTransform} from "ol/extent";
import WMTSGrid from "ol/tilegrid/WMTS";
import WMTSSource, {optionsFromCapabilities} from "ol/source/WMTS";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import TileLayer from "ol/layer/Tile";
import {get as getProjection} from "ol/proj";

const parser = new WMTSCapabilities();
export const getLayer = (options) => {
  return fetch(options.url)
    .then((res) => res.text())
    .then((text) => {
      const result = parser.read(text);
      console.log("result", result);
      const source = optionsFromCapabilities(result, {
        layer: options.layer,
        matrixSet: options.matrixSet,
        url: "http://10.134.65.85:34668/laoshancimMapSvc/service/map/wmts",
        // tilePixelRatio: 2,
        tileLoadFunction: function (imageTile, src) {
          src = src
            .replace("TileMatrix", "z")
            .replace("TileCol", "x")
            .replace("TileRow", "y");
          src +=
            "&token=uQFqT2wITSjTa1TdYyGx0DhN8Z5wIA5Y-v0EOhqN2jndtbBw_NK6kfBdB1RQ8CKEgEW2_23uohKRtC60A48Cp1ms5PyD3tGCjf6nzZ8iSTwFjs3wch_i-ScqpWECGICbKDZv7-4cXPkSiSYdFwOems6WYExG1f3bWEiEg8LyXrolXFyQpEYzfpY_zykvNdA_Ntl-8nq9Cjx8CacExKIPkBup1rOW3HxC4FCvp4ziwrXpfH1IS_npYqTrtUdpC5NO";
          imageTile.getImage().src = src;
        },
      });
      console.log("source", source);

      source.crossOrigin = "Anonymous";
      source.url =
        "http://10.134.65.85:34668/laoshancimMapSvc/service/map/wmts";

      const wmtsLayer = new TileLayer({
        source: new WMTSSource(source),
      });

      return wmtsLayer;
    });
};
