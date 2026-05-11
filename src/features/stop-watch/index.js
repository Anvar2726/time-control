import { useEffect } from "react";
import { create } from "zustand";

const stopWatchStore = create((set, get) => ({
  isrunning: false,
  elapsedTime: 0,
  startTime: 0,
  laps: [],
  start: () =>
    set(() => {
      return {
        isrunning: true,
        startTime: Date.now() - get().elapsedTime,
      };
    }),
  stop: () =>
    set(() => {
      return {
        isrunning: false,
      };
    }),
  reset: () =>
    set(() => {
      return {
        isrunning: false,
        elapsedTime: 0,
        laps: [],
      };
    }),
  addLap: () => {
    const { laps, elapsedTime } = get();
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");
    let lapTime = `${minutes}:${seconds}:${milliseconds}`;
    set(() => {
      return {
        laps: [...laps, lapTime],
      };
    });
  },
}));

export const useStopWatchCard = () => {
  const { isrunning, elapsedTime, startTime } = stopWatchStore();
  useEffect(() => {
    let intervalId;
    if (isrunning) {
      intervalId = setInterval(() => {
        stopWatchStore.setState({ elapsedTime: Date.now() - startTime });
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isrunning, startTime]);
  const formatTime = () => {
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return { formatTime };
};
export default stopWatchStore;
