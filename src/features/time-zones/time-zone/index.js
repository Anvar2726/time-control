import { create } from "zustand";

import { STORAGE_KEY } from "../../../consts/time-zones";

const getLocalTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

const getStoredTimeZones = (localTimeZone) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (timeZone, index, list) =>
        typeof timeZone === "string" &&
        timeZone !== localTimeZone &&
        list.indexOf(timeZone) === index,
    );
  } catch (error) {
    console.error("Error parsing stored time zones:", error);
    return [];
  }
};

const useTimeZoneStore = create((set, get) => {
  const localTimeZone = getLocalTimeZone();

  return {
    localTimeZone,
    selectedTimeZones: getStoredTimeZones(localTimeZone),
    handleAddTimeZone: (timeZone) => {
      const { selectedTimeZones, localTimeZone } = get();
      if (!timeZone || timeZone === localTimeZone) {
        return;
      }
      if (selectedTimeZones.includes(timeZone)) {
        return;
      }
      const updatedTimeZones = [...selectedTimeZones, timeZone];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTimeZones));
      set({ selectedTimeZones: updatedTimeZones });
    },
    handleRemoveTimeZone: (timeZone) => {
      const { selectedTimeZones } = get();
      const updatedTimeZones = selectedTimeZones.filter((item) => item !== timeZone);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTimeZones));
      set({ selectedTimeZones: updatedTimeZones });
    },
  };
});

export default useTimeZoneStore;
