import { useEffect } from "react";
import { create } from "zustand";

import alarm2 from "../../assets/sounds/alarm-2.mp3";

export const pomodoroModes = [
  { id: "focus", label: "Focus", durationKey: "focusMinutes" },
  { id: "short", label: "Short break", durationKey: "shortBreakMinutes" },
  { id: "long", label: "Long break", durationKey: "longBreakMinutes" },
];

const defaultDurations = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
};

const getDurationByMode = (state, mode = state.activeMode) => {
  const modeItem = pomodoroModes.find((item) => item.id === mode) || pomodoroModes[0];
  return state[modeItem.durationKey];
};

const minutesToSeconds = (minutes) => Math.max(1, parseInt(minutes) || 1) * 60;

let alarmAudio = null;

const stopAlarm = () => {
  if (!alarmAudio) return;
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
};

const playAlarm = () => {
  if (typeof Audio === "undefined") return;
  stopAlarm();
  alarmAudio = new Audio(alarm2);
  alarmAudio.play().catch(() => {});
};

const pomodoroStore = create((set, get) => ({
  ...defaultDurations,
  activeMode: "focus",
  remainingSeconds: defaultDurations.focusMinutes * 60,
  isRunning: false,
  pomodoroCount: 0,
  settingsForm: defaultDurations,
  setMode: (mode) => {
    stopAlarm();
    const state = get();
    const duration = getDurationByMode(state, mode);
    set(() => ({
      activeMode: mode,
      remainingSeconds: minutesToSeconds(duration),
      isRunning: false,
    }));
  },
  start: () => {
    stopAlarm();
    const { remainingSeconds } = get();
    if (remainingSeconds > 0) {
      set(() => ({ isRunning: true }));
    }
  },
  pause: () => {
    stopAlarm();
    set(() => ({ isRunning: false }));
  },
  reset: () => {
    stopAlarm();
    const state = get();
    set(() => ({
      remainingSeconds: minutesToSeconds(getDurationByMode(state)),
      isRunning: false,
    }));
  },
  updateSettingsForm: (field, value) => {
    const nextValue = value.replace(/\D/g, "");
    set((state) => ({
      settingsForm: {
        ...state.settingsForm,
        [field]: nextValue,
      },
    }));
  },
  saveSettings: (event) => {
    event.preventDefault();
    stopAlarm();
    const { settingsForm, activeMode } = get();
    const nextDurations = {
      focusMinutes: Math.max(1, parseInt(settingsForm.focusMinutes) || 1),
      shortBreakMinutes: Math.max(1, parseInt(settingsForm.shortBreakMinutes) || 1),
      longBreakMinutes: Math.max(1, parseInt(settingsForm.longBreakMinutes) || 1),
    };
    const nextState = { ...get(), ...nextDurations };
    set(() => ({
      ...nextDurations,
      settingsForm: nextDurations,
      remainingSeconds: minutesToSeconds(getDurationByMode(nextState, activeMode)),
      isRunning: false,
    }));
  },
  completeCurrentMode: () => {
    const state = get();
    const isFocus = state.activeMode === "focus";
    const nextCount = isFocus ? state.pomodoroCount + 1 : state.pomodoroCount;
    playAlarm();
    set(() => ({
      pomodoroCount: nextCount,
      remainingSeconds: minutesToSeconds(getDurationByMode(state)),
      isRunning: false,
    }));
  },
}));

export const formatPomodoroTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const usePomodoroTimer = () => {
  const { isRunning } = pomodoroStore();

  useEffect(() => {
    if (!isRunning) return undefined;

    const timer = setInterval(() => {
      const state = pomodoroStore.getState();
      if (state.remainingSeconds <= 1) {
        state.completeCurrentMode();
        return;
      }

      pomodoroStore.setState((state) => {
        if (state.remainingSeconds <= 1) {
          return state;
        }

        return { remainingSeconds: state.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);
};

export default pomodoroStore;
