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

  const statusIndicator = serverData.data.running ? (
    <span className="text-green-500">{t("minecraft.up")}</span>
  ) : (
    <span className="text-red-500">{t("minecraft.down")}</span>
  );

  const players = serverData.data.running ? `${serverData.data.online} / ${serverData.data.max}` : "-";
  const version = (!serverData.data.version || serverData.data.version === "False") ? "-" : serverData.data.version;

  return (
    <Container service={service}>
      <Block label="minecraft.status" value={statusIndicator} />
      <Block label="minecraft.players" value={players} />
      <Block label="minecraft.version" value={version} />
    </Container>
  );
}
