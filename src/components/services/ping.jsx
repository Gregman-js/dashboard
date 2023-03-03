import { useTranslation } from "react-i18next";
import useSWR from "swr";

export default function Ping({ service, ping = undefined }) {
  const { t } = useTranslation();

  const swrUrl = ping === undefined ? `/api/ping?${new URLSearchParams({ping: service.ping}).toString()}` : null;

  const { data, error } = useSWR(swrUrl, {
    refreshInterval: 30000
  });

  if (ping !== undefined) {
    if (!ping) {
      return (
        <div className="w-auto px-1.5 py-0.5 text-center bg-theme-500/10 dark:bg-theme-900/50 rounded-b-[3px] overflow-hidden">
          <div className="text-[8px] font-bold text-emerald-500/80">-</div>
        </div>
      );
    }

    return (
      <div className="w-auto px-1.5 py-0.5 text-center bg-theme-500/10 dark:bg-theme-900/50 rounded-b-[3px] overflow-hidden">
        <div className="text-[8px] font-bold text-emerald-500/80">{t("common.ms", { value: ping, style: "unit", unit: "millisecond", unitDisplay: "narrow", maximumFractionDigits: 0 })}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-auto px-1.5 py-0.5 text-center bg-theme-500/10 dark:bg-theme-900/50 rounded-b-[3px] overflow-hidden">
        <div className="text-[8px] font-bold text-rose-500 uppercase">{t("ping.error")}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-auto px-1.5 py-0.5 text-center bg-theme-500/10 dark:bg-theme-900/50 rounded-b-[3px] overflow-hidden">
        <div className="text-[8px] font-bold text-black/20 dark:text-white/40 uppercase">{t("ping.ping")}</div>
      </div>
    );
  }

  const statusText = `${service.ping}: HTTP status ${data.status}`;

  if (data && data.status !== 200) {
    return (
      <div className="w-auto px-1.5 py-0.5 text-center bg-theme-500/10 dark:bg-theme-900/50 rounded-b-[3px] overflow-hidden" title={statusText}>
        <div className="text-[8px] font-bold text-rose-500/80">{data.status}</div>
      </div>
    );
  }

  if (data && data.status === 200) {
    return (
      <div className="w-auto px-1.5 py-0.5 text-center bg-theme-500/10 dark:bg-theme-900/50 rounded-b-[3px] overflow-hidden" title={statusText}>
        <div className="text-[8px] font-bold text-emerald-500/80">{t("common.ms", { value: data.latency, style: "unit", unit: "millisecond", unitDisplay: "narrow", maximumFractionDigits: 0 })}</div>
      </div>
    );
  }

}
