import { getSettings } from "../../../utils/config/config";

export default async function handler(req, res) {
  const { service } = req.query;
  const [serviceName, serviceAction] = service;

  const settings = getSettings();

  const token = settings.systemd.base64;

  if (!serviceName || !serviceAction || !token) {
    return res.status(400).send({
      status: false,
      error: "Not all params provided",
    });
  }

  const mcResponse = await fetch(
    `http://zlomek.local:10070/api/v1/${serviceName}/${serviceAction}`,
    {
      method: 'GET',
      headers: new Headers({
          'Authorization': `Basic ${token}`,
      }),
    }
  ).then(r => r.json());

  // console.log(`Server response ${JSON.stringify(mcResponse)}`);

  if (!(serviceAction in mcResponse)) {
    return res.status(400).send({
      status: false,
      error: "error",
    });
  }

  const status = mcResponse[serviceAction] === 'OK';

  return res.status(200).json({
    status,
  });
}
