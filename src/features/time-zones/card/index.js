import { useEffect } from "react";
import { create } from "zustand";

const getTimeZoneMeta = (timeZone) => {
  const zone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(new Date());
  const offset =
    parts.find((part) => part.type === "timeZoneName")?.value?.replace("UTC", "GMT") || "GMT";
  const [region, ...cityParts] = zone.split("/");
  const city = cityParts.join(" / ").replace(/_/g, " ") || region;

  return {
    name: city || zone,
    offset,
    region,
    full: zone,
  };
};

const formatTime = (date, timeZone) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

const formatDate = (date, timeZone) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

const getHourInZone = (date, timeZone) => {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    hour12: false,
  }).format(date);

  return Number(hour);
};

const getDayProgress = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);

  return Math.round(((hour * 60 + minute) / 1440) * 100);
};

const buildCardState = (date, timeZone) => {
  const timezone = getTimeZoneMeta(timeZone);
  const hours = getHourInZone(date, timezone.full);

  return {
    timezone,
    time: formatTime(date, timezone.full),
    date: formatDate(date, timezone.full),
    dayProgress: getDayProgress(date, timezone.full),
    isDaytime: hours >= 6 && hours < 20,
  };
};

const useTimeZoneCardStore = create((set, get) => ({
  currentTime: new Date(),
  intervalId: null,
  subscribersCount: 0,
  startClock: () => {
    if (get().intervalId) {
      return;
    }

    const intervalId = window.setInterval(() => {
      set({ currentTime: new Date() });
    }, 1000);

    set({ intervalId });
  },
  stopClock: () => {
    const { intervalId } = get();

    if (!intervalId) {
      return;
    }

    window.clearInterval(intervalId);
    set({ intervalId: null });
  },
  registerCard: () => {
    const nextSubscribersCount = get().subscribersCount + 1;
    set({ subscribersCount: nextSubscribersCount });

    if (nextSubscribersCount === 1) {
      get().startClock();
    }
  },
  unregisterCard: () => {
    const nextSubscribersCount = Math.max(get().subscribersCount - 1, 0);
    set({ subscribersCount: nextSubscribersCount });

    if (nextSubscribersCount === 0) {
      get().stopClock();
    }
  },
}));

export const useTimeZoneCard = (timeZone) => {
  const currentTime = useTimeZoneCardStore((state) => state.currentTime);

  useEffect(() => {
    const { registerCard, unregisterCard } = useTimeZoneCardStore.getState();

    registerCard();

    return () => unregisterCard();
  }, []);

  return buildCardState(currentTime, timeZone);
};

export default useTimeZoneCardStore;
