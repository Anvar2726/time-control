import { memo } from "react";
import TimeZoneCard from "../../widgets/time-zones/card";
import TimeZoneSearchCard from "../../widgets/time-zones/search-card";

import useTimeZoneStore from "../../features/time-zones/time-zone";

import "./style.scss";

const TimeZonePage = memo(() => {
  const { localTimeZone, selectedTimeZones, handleAddTimeZone, handleRemoveTimeZone } =
    useTimeZoneStore();

  return (
    <section className="time-zone-page">
      <div className="time-zone-page__hero">
        <div>
          <span className="time-zone-page__eyebrow">Global Time Explorer</span>

          <h1 className="time-zone-page__title">Time zones in one place</h1>
        </div>

        <div className="time-zone-page__search">
          <TimeZoneSearchCard
            localTimeZone={localTimeZone}
            selectedTimeZones={selectedTimeZones}
            onSelectTimeZone={handleAddTimeZone}
          />
        </div>
      </div>

      <div className="time-zone-page__layout">
        <div className="time-zone-page__cards">
          <TimeZoneCard timeZone={localTimeZone} isLocal />

          {selectedTimeZones.map((timeZone) => (
            <TimeZoneCard
              key={timeZone}
              timeZone={timeZone}
              onRemove={() => handleRemoveTimeZone(timeZone)}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

export default TimeZonePage;
