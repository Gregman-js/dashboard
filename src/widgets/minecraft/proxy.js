import { pingWithPromise } from "minecraft-ping-js";

import getServiceWidget from "utils/config/service-helpers";

export default async function minecraftProxyHandler(req, res) {
    const { group, service } = req.query;
    const serviceWidget = await getServiceWidget(group, service);
    const url = new URL(serviceWidget.url);
    try {
        const pingResponse = await pingWithPromise(url.hostname, url.port || 25565);
        res.status(200).send({
            version: pingResponse.version.name,
            online: true,
            players: pingResponse.players,
            ping: pingResponse.ping
        });
    } catch (e) {
        res.status(200).send({
            version: undefined,
            online: false,
            players: undefined,
            ping: undefined,
        });
    }
}
