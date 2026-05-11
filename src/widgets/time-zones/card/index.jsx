import { useTimeZoneCard } from "../../../features/time-zones/card";

import "./style.scss";

const TimeZoneCard = ({ timeZone, onRemove, isLocal = false }) => {
  const { timezone, time, date, dayProgress, isDaytime } = useTimeZoneCard(timeZone);

  return (
    <div className="tz-card">
      <div className="tz-card__bar" />

      <div className="tz-card__header">
        <div className="tz-card__header-main">
          <div className="tz-card__icon">
            {isDaytime ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </div>
          <div className="tz-card__meta">
            <span className="tz-card__region">{timezone.region}</span>
            <span className="tz-card__dot">-</span>
            <span className="tz-card__offset">{timezone.offset}</span>
          </div>
        </div>

        {!isLocal && onRemove ? (
          <button
            type="button"
            className="tz-card__remove"
            onClick={onRemove}
            aria-label={`${timezone.full} time zone kartasini o'chirish`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M8 6V4h8v2" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        ) : null}
      </div>

      <div className="tz-card__clock">
        <span className="tz-card__time">{time}</span>
      </div>

      <div className="tz-card__divider" />

      <div className="tz-card__info">
        <div className="tz-card__info-row">
          <span className="tz-card__label">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Time Zone
          </span>
          <span className="tz-card__value">{timezone.name}</span>
        </div>

        <div className="tz-card__info-row">
          <span className="tz-card__label">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Date
          </span>
          <span className="tz-card__value">{date}</span>
        </div>

        <div className="tz-card__info-row">
          <span className="tz-card__label">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            UTC Offset
          </span>
          <span className="tz-card__value tz-card__value--accent">{timezone.offset}</span>
        </div>
      </div>

      <div className="tz-card__day-progress">
        <span className="tz-card__progress-label">Day progress</span>
        <div className="tz-card__progress-track">
          <div className="tz-card__progress-fill" style={{ width: `${dayProgress}%` }} />
        </div>
        <span className="tz-card__progress-pct">{dayProgress}%</span>
      </div>
    </div>
  );
};

export default TimeZoneCard;
