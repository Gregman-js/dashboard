import classNames from "classnames";
import {useContext, useState} from "react";
import {MdToggleOff, MdToggleOn} from "react-icons/md";

import Widget from "../widget";
import useWidgetAPI from "../../../utils/proxy/use-widget-api";

import { SettingsContext } from "utils/contexts/settings";
import ResolvedIcon from "components/resolvedicon";

export default function CraftyServer({ service, group }) {
  const hasLink = service.href && service.href !== "#";
  const { settings } = useContext(SettingsContext);

  // craftyserver
  const [live, setLive] = useState(false);
  const [block, setBlock] = useState(false);

  let running = null;

  const { data: statsData, error: statsError } = useWidgetAPI(service.widget, "stats");

  if (!statsError && statsData) {
    running = statsData.data.running;

    if (live !== running && block === false) {
      setLive(running);
    } else if (live === running && block === true) {
      setBlock(false);
    }
  }

  const toggleServer = () => {
    const actionState = !live;
    setBlock(true);
    setLive(actionState);

    const action = actionState ? "start_server" : "stop_server";

    fetch(
      `/api/craftyserver/action`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action,
          group,
          service: service.name,
        })
      }
    )
      .then(r => r.json())
      .then(response => {
        if (response.status) {
          setLive(actionState)
        }
      });
  };

  return (
    <li key={service.name} id={service.id} className="service" data-name={service.name || ""}>
      <div
        className={classNames(
          settings.cardBlur !== undefined && `backdrop-blur${settings.cardBlur.length ? "-" : ""}${settings.cardBlur}`,
          hasLink && "cursor-pointer",
          "transition-all h-15 mb-2 p-1 rounded-md font-medium text-theme-700 dark:text-theme-200 dark:hover:text-theme-300 shadow-md shadow-theme-900/10 dark:shadow-theme-900/20 bg-theme-100/20 hover:bg-theme-300/20 dark:bg-white/5 dark:hover:bg-white/10 relative overflow-clip service-card",
        )}
      >
        <div className="flex select-none z-0 service-title">
          {service.icon &&
            (hasLink ? (
              <a
                href={service.href}
                target={service.target ?? settings.target ?? "_blank"}
                rel="noreferrer"
                className="flex-shrink-0 flex items-center justify-center w-12 service-icon"
                aria-label="Crafty"
              >
                <ResolvedIcon icon={service.icon}/>
              </a>
            ) : (
              <div className="flex-shrink-0 flex items-center justify-center w-12 service-icon">
                <ResolvedIcon icon={service.icon}/>
              </div>
            ))}

          {hasLink ? (
            <a
              href={service.href}
              target={service.target ?? settings.target ?? "_blank"}
              rel="noreferrer"
              className="flex-1 flex items-center justify-between rounded-r-md service-title-text"
            >
              <div className="flex-1 px-2 py-2 text-sm text-left z-10 service-name">
                {service.name}
                <p className="text-theme-500 dark:text-theme-300 text-xs font-light service-description">
                  {service.description}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex-1 flex items-center justify-between rounded-r-md service-title-text">
              <div className="flex-1 px-2 py-2 text-sm text-left z-10 service-name">
                {service.name}
                <p className="text-theme-500 dark:text-theme-300 text-xs font-light service-description">
                  {service.description}
                </p>
              </div>
            </div>
          )}


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

        {service.widget && <Widget service={service} />}
      </div>
    </li>
  );
}
