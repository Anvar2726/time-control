import { useEffect } from "react";
import { create } from "zustand";

const getSupportedTimeZones = () => {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone");
  }

  return [
    "UTC",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Tashkent",
    "America/New_York",
    "America/Chicago",
    "America/Los_Angeles",
    "Australia/Sydney",
  ];
};

const TIME_ZONES = getSupportedTimeZones().map((zone) => {
  const parts = zone.split("/");
  const region = parts[0] || zone;
  const location = parts.slice(1).join(" / ") || zone;
  const normalizedLocation = location.replace(/_/g, " ");
  const normalizedZone = zone.replace(/_/g, " ");

  return {
    zone,
    region,
    location: normalizedLocation,
    searchTerms: [normalizedLocation, normalizedZone, region].join(" ").toLowerCase(),
  };
});

const EXAMPLE_SEARCHES = ["Tokyo", "London", "New York", "Moscow", "Dubai"];

const getOffsetLabel = (zone, date) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "shortOffset",
  });
  const parts = formatter.formatToParts(date);
  const offset = parts.find((part) => part.type === "timeZoneName")?.value || "GMT";

  return offset.replace("UTC", "GMT");
};

const getTimeLabel = (zone, date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

const getSearchResults = ({ query, localTimeZone, selectedTimeZones, currentTime }) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return TIME_ZONES.filter(({ zone, searchTerms }) => {
    if (zone === localTimeZone || selectedTimeZones.includes(zone)) {
      return false;
    }

    return searchTerms.includes(normalizedQuery);
  })
    .slice(0, 10)
    .map((item) => ({
      ...item,
      time: getTimeLabel(item.zone, currentTime),
      offset: getOffsetLabel(item.zone, currentTime),
    }));
};

const useTimeZoneSearchCardStore = create((set, get) => ({
  isModalOpen: false,
  query: "",
  currentTime: new Date(),
  intervalId: null,
  openModal: () => {
    set({ isModalOpen: true });
    get().startClock();
  },
  closeModal: () => {
    set({ isModalOpen: false, query: "" });
    get().stopClock();
  },
  setQuery: (query) => set({ query }),
  startClock: () => {
    if (get().intervalId || typeof window === "undefined") {
      return;
    }

    const intervalId = window.setInterval(() => {
      set({ currentTime: new Date() });
    }, 1000);

    set({ intervalId, currentTime: new Date() });
  },
  stopClock: () => {
    const { intervalId } = get();

    if (!intervalId || typeof window === "undefined") {
      return;
    }

    window.clearInterval(intervalId);
    set({ intervalId: null });
  },
}));

export const useTimeZoneSearchCard = ({
  localTimeZone,
  selectedTimeZones,
  onSelectTimeZone,
}) => {
  const isModalOpen = useTimeZoneSearchCardStore((state) => state.isModalOpen);
  const query = useTimeZoneSearchCardStore((state) => state.query);
  const currentTime = useTimeZoneSearchCardStore((state) => state.currentTime);
  const openModal = useTimeZoneSearchCardStore((state) => state.openModal);
  const closeModal = useTimeZoneSearchCardStore((state) => state.closeModal);
  const setQuery = useTimeZoneSearchCardStore((state) => state.setQuery);

  useEffect(() => {
    if (!isModalOpen || typeof document === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, isModalOpen]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isModalOpen]);

  const handleSelectTimeZone = (timeZone) => {
    onSelectTimeZone(timeZone);
    closeModal();
  };

  return {
    isModalOpen,
    query,
    exampleSearches: EXAMPLE_SEARCHES,
    results: getSearchResults({
      query,
      localTimeZone,
      selectedTimeZones,
      currentTime,
    }),
    openModal,
    closeModal,
    setQuery,
    handleExampleClick: setQuery,
    handleSelectTimeZone,
  };
};

export default useTimeZoneSearchCardStore;
