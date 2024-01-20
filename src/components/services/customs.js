import dynamic from "next/dynamic";

const customs = {
  craftyserver: dynamic(() => import("./custom/craftyserver"))
};

export default customs;
