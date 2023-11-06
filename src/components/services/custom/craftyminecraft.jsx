import { MdToggleOff, MdToggleOn } from "react-icons/md";
import classNames from "classnames";
import {useContext, useState} from "react";

import ErrorBoundary from "../../errorboundry";
import useWidgetAPI from "../../../utils/proxy/use-widget-api";
import {SettingsContext} from "../../../utils/contexts/settings";

import ResolvedIcon from "components/resolvedicon";
import CraftyMinecraftWidget from 'widgets/craftyminecraft/component';

export default function Craftyminecraft({ service }) {
  const { data: mcData, error: mcError } = useWidgetAPI(service.widget, "stats");
  const { settings } = useContext(SettingsContext);
  const [live, setLive] = useState(false);

  if ((!mcError && mcData && mcData.data.running) !== live) {
    setLive(!mcError && mcData && mcData.data.running);
  }

  const toggleServer = () => {
    if (mcError || !mcData) {
      return;
    }

    const action = mcData.data.running ? 'stop_server' : 'start_server';
    setLive(action === 'start_server');

    fetch(
      `${service.crafty.url}/api/v2/servers/${service.crafty.server_id}/action/${action}`,
      {
        method: 'POST',
        headers: new Headers({
          'Authorization': `Bearer ${service.crafty.key}`,
        }),
      }
    )
      .then(r => r.json())
      .then(response => {
        if (response.status) {
          setLive(action === 'start_server');
        }
      });
  };

  return (
    <li key={service.name} id={service.id} className="service" data-name={service.name || ""}>
      <div
        className={classNames(
          settings.cardBlur !== undefined && `backdrop-blur${settings.cardBlur.length ? "-" : ""}${settings.cardBlur}`,
          "transition-all h-15 mb-2 p-1 rounded-md font-medium text-theme-700 dark:text-theme-200 dark:hover:text-theme-300 shadow-md shadow-theme-900/10 dark:shadow-theme-900/20 bg-theme-100/20 hover:bg-theme-300/20 dark:bg-white/5 dark:hover:bg-white/10 relative overflow-clip service-card",
        )}
      >
        <div className="flex select-none z-0 service-title">
          {/* icon */}
          {service.icon &&
            <div className="flex-shrink-0 flex items-center justify-center w-12 service-icon">
              <ResolvedIcon icon={service.icon} />
            </div>
          }

          {/* name & description */}
          <div className="flex-1 flex items-center justify-between rounded-r-md service-title-text">
            <div className="flex-1 px-2 py-2 text-sm text-left z-10 service-name">
              {service.name}
              <p className="text-theme-500 dark:text-theme-300 text-xs font-light service-description">
                {service.description}
              </p>
            </div>
          </div>

          {/* toggle */}
          <button
            type="button"
            className="flex-shrink-0 flex items-center justify-center w-12 cursor-pointer"
          >
            {live ? (
              <MdToggleOn
                onClick={() => toggleServer()}
                className="text-theme-800 dark:text-theme-200 w-8 h-8 cursor-pointer"
              />
            ) : (
              <MdToggleOff
                onClick={() => toggleServer()}
                className="text-theme-800 dark:text-theme-200 w-8 h-8 cursor-pointer"
              />
            )}
          </button>
        </div>

        {/* stats */}
        <ErrorBoundary>
          <CraftyMinecraftWidget service={service} />
        </ErrorBoundary>
      </div>
    </li>
  );
}
