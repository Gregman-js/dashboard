import dynamic from "next/dynamic";

const customs = {
  minecraft: dynamic(() => import("./custom/minecraft"))
};

export default customs;
