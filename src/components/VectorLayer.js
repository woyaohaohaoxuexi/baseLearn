import MultiPoint from "ol/geom/MultiPoint";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {Cluster} from "ol/source";
import {transform} from "ol/proj";
import {Icon, Style, Text} from "ol/style";
import Overlay from "ol/Overlay";

export default function (points) {
  // const pointsArr = points.map((item) =>
  //   transform(item, "EPSG:4490", "EPSG:3857")
  // );
  // const iconFeature = new Feature(new MultiPoint(pointsArr));

  const iconFeatures = points.map((item, index) => {
    const coordinate = transform(item, "EPSG:4490", "EPSG:3857");
    const point = new Point(coordinate);
    // point.on("pointermove", (evt) => {
    //   console.log("point move", evt);
    // });
    return new Feature({geometry: point, name: `测试icon${index}`});
  });

  const clusterSource = new Cluster({
    distance: 40,
    source: new VectorSource({features: iconFeatures}),
  });

  const clusetrStyle = new Style({
    image: new Icon({
      src: "lan.png",
      scale: [0.8, 0.8],
    }),
    // text: new Text({
    //   text: "测试文本",
    // }),
    // renderer: function (notation, state) {
    //   console.log("notation", notation);
    //   console.log("state", state);

    //   return "<div>aa</div>";
    // },
  });

  const iconStyle = new Style({
    image: new Icon({
      src: "lan.png",
      scale: [0.5, 0.5],
    }),
    // text: new Text({
    //   text: "测试文本",
    // }),
    // renderer: function (notation, state) {
    //   console.log("notation", notation);
    //   console.log("state", state);

    //   return "<div>aa</div>";
    // },
  });

  // iconFeature.on("pointermove", (evt) => {
  //   console.log("mouseover", evt);
  // });

  // iconFeature.set("style", iconStyle);

  return new VectorLayer({
    // style: function (feature) {
    //   return feature.get("style");
    // },
    // source: new VectorSource({ features: [iconFeature] }),
    style: function (feature) {
      const size = feature.get("features");
      if (size && size.length > 1) {
        return clusetrStyle;
      }
      return iconStyle;
    },
    source: clusterSource,
  });
}
