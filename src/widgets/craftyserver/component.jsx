import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { widget } = service;
  const { data: serverData, error: serverError } = useWidgetAPI(widget, "stats");
  const { t } = useTranslation();

  if (serverError) {
    return <Container service={service} error={serverError} />;
  }
  if (!serverData) {
    return (
      <Container service={service}>
        <Block label="minecraft.status" />
        <Block label="minecraft.players" />
        <Block label="minecraft.version" />
      </Container>
    );
  }

  const statsData = serverData.data;

  const players = statsData.running ? `${statsData.online} / ${statsData.max}` : "-";

  return (
    <Container service={service}>
      <Block label="minecraft.status" value={statsData.running ? (
        <span className="text-green-500">{t("minecraft.up")}</span>
      ) : (
        <span className="text-red-500">{t("minecraft.down")}</span>
      )} />
      <Block label="minecraft.players" value={players} />
      <Block label="minecraft.ram" value={statsData.mem || "-"} />
      <Block label="minecraft.port" value={statsData.server_port} />
    </Container>
  );
}
