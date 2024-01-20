import {getServiceItem} from "../../../utils/config/service-helpers";
import createLogger from "../../../utils/logger";

const logger = createLogger("ping");

export default async function handler(req, res) {
  const { group, service, action } = req.body;
  const serviceItem = await getServiceItem(group, service);
  if (!serviceItem) {
    logger.debug(`No service item found for group ${group} named ${service}`);
    return res.status(400).send({
      error: "Unable to find service, see log for details.",
    });
  }

  const {widget: { key, url, serverId }} = serviceItem;

  const craftyResponse = await fetch(
    `${url}/api/v2/servers/${serverId}/action/${action}`,
    {
      method: 'POST',
      headers: new Headers({
        'Authorization': `Bearer ${key}`,
      }),
    }
  ).then(r => r.json());

  if (!("status" in craftyResponse)) {
    return res.status(400).send({
      status: false,
      error: craftyResponse,
    });
  }

  return res.status(200).json({
    status: craftyResponse.status === 'ok',
  });
}
