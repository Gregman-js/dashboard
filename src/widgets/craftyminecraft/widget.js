import credentialedProxyHandler from "../../utils/proxy/handlers/credentialed";

const widget = {
  api: "{url}/api/v2/servers/{server_id}/{endpoint}",
  proxyHandler: credentialedProxyHandler,

  mappings: {
    stats: {
      endpoint: "stats"
    },
  },
};

export default widget;
