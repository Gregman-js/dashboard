import classNames from "classnames";

import { columnMap } from "../../utils/layout/columns";

import customs from "./customs";

import Item from "components/services/item";

export default function List({ groupName, services, layout, useEqualHeights, header }) {
  return (
    <ul
      className={classNames(
        layout?.style === "row" ? `grid ${columnMap[layout?.columns]} gap-x-2` : "flex flex-col",
        header ? "mt-3" : "",
        "services-list",
      )}
    >
      {services.map((service) => {
        if ("widget" in service && "type" in service.widget && service.widget.type in customs) {
          const ServiceType = customs[service.widget.type];

          return <ServiceType key={[service.container, service.app, service.name].filter((s) => s).join("-")} service={service} groupName={groupName} useEqualHeights={layout?.useEqualHeights ?? useEqualHeights} />;
        }

        return <Item
          key={[service.container, service.app, service.name].filter((s) => s).join("-")}
          service={service}
          groupName={groupName}
          useEqualHeights={layout?.useEqualHeights ?? useEqualHeights}
        />
      })}
    </ul>
  );
}
