import credentialedProxyHandler from "../../utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/api/v2/servers/{serverId}/{endpoint}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    stats: {
      endpoint: "stats",
      validate: ["status", "data"],
    },
  },
};

export default widget;
