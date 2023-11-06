import dynamic from "next/dynamic";

const customs = {
  minecraft: dynamic(() => import("./custom/minecraft")),
  "craftyminecraft": dynamic(() => import("./custom/craftyminecraft"))
};

export default customs;
