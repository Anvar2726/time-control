import { useEffect } from "react";
import { v4 } from "uuid";
import { create } from "zustand";

import alarm1 from "../../assets/sounds/alarm-1.mp3";
import alarm2 from "../../assets/sounds/alarm-2.mp3";
import alarm3 from "../../assets/sounds/alarm-3.mp3";
import alarm4 from "../../assets/sounds/alarm-4.mp3";
import alarm5 from "../../assets/sounds/alarm-5.mp3";
import alarm6 from "../../assets/sounds/alarm-6.mp3";
import { TIMER_STORAGE_KEY } from "../../consts/timer";

export const sounds = [
  { id: "alarm-1", label: "Alarm 1", src: alarm1 },
  { id: "alarm-2", label: "Alarm 2", src: alarm2 },
  { id: "alarm-3", label: "Alarm 3", src: alarm3 },
  { id: "alarm-4", label: "Alarm 4", src: alarm4 },
  { id: "alarm-5", label: "Alarm 5", src: alarm5 },
  { id: "alarm-6", label: "Alarm 6", src: alarm6 },
];

export const durations = [5, 10, 15, 20, 30, 60, 120, 180];

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return `${hours} hour${hours > 1 ? "s" : ""}`;
};

const emptyPreset = {
  name: "",
  hours: 0,
  minutes: 5,
  seconds: 0,
  soundId: "alarm-1",
};

let previewAudio = null;
let alarmAudio = null;

const getSound = (soundId) => sounds.find((sound) => sound.id === soundId) || sounds[0];

const getStoredPresets = () => {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(TIMER_STORAGE_KEY);
    const presets = JSON.parse(value || "[]");
    return Array.isArray(presets) ? presets : [];
  } catch {
    return [];
  }
};

const setStoredPresets = (presets) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(presets));
};

const stopPreview = () => {
  if (!previewAudio) return;
  previewAudio.pause();
  previewAudio.currentTime = 0;
};

const playPreview = (soundId) => {
  if (typeof Audio === "undefined") return;
  stopPreview();
  previewAudio = new Audio(getSound(soundId).src);
  previewAudio.volume = 0.75;
  previewAudio.play().catch(() => {});
};

const stopAlarm = () => {
  if (!alarmAudio) return;
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
};

const playAlarm = (soundId) => {
  if (typeof Audio === "undefined") return;
  stopAlarm();
  alarmAudio = new Audio(getSound(soundId).src);
  alarmAudio.loop = true;
  alarmAudio.play().catch(() => {});
};

const timerStore = create((set, get) => ({
  hours: 0,
  minutes: 0,
  seconds: 0,
  isrunning: false,
  isFinished: false,
  selectedSound: "alarm-1",
  isTimerModalOpen: false,
  isPresetModalOpen: false,
  timerForm: {
    hours: 0,
    minutes: 0,
    seconds: 0,
    soundId: "alarm-1",
  },
  presetForm: emptyPreset,
  presets: getStoredPresets(),
  selectedPreset: null,
  setTime: ({ hours = 0, minutes = 0, seconds = 0, soundId }) => {
    set(() => ({
      hours: Math.max(0, parseInt(hours) || 0),
      minutes: Math.max(0, parseInt(minutes) || 0),
      seconds: Math.max(0, parseInt(seconds) || 0),
      selectedSound: soundId || get().selectedSound,
      isFinished: false,
    }));
  },
  addHour: (h) => {
    set(() => ({ hours: Math.max(0, h || 0), isFinished: false }));
  },
  addMinute: (m) => {
    set(() => ({ minutes: Math.max(0, m || 0), isFinished: false }));
  },
  addSecond: (s) => {
    set(() => ({ seconds: Math.max(0, s || 0), isFinished: false }));
  },
  setSound: (soundId) => {
    set(() => ({ selectedSound: soundId }));
  },
  setDuration: (time) => {
    const totalMinutes = Math.max(0, parseInt(time) || 0);
    set(() => ({
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
      seconds: 0,
      isFinished: false,
    }));
  },
  start: () => {
    const { hours, minutes, seconds } = get();
    if (hours + minutes + seconds > 0) {
      set(() => ({ isrunning: true, isFinished: false }));
    }
  },
  stop: () => {
    stopAlarm();
    set(() => ({ isrunning: false, isFinished: false }));
  },
  reset: () => {
    stopAlarm();
    set(() => ({ hours: 0, minutes: 0, seconds: 0, isrunning: false, isFinished: false }));
  },
  resume: () => {
    const { hours, minutes, seconds } = get();
    if (hours + minutes + seconds > 0) {
      set(() => ({ isrunning: true, isFinished: false }));
    }
  },
  addPreset: (preset) => {
    set((state) => {
      const presets = [...state.presets, preset];
      setStoredPresets(presets);
      return { presets };
    });
  },
  submit: (e) => {
    const { addPreset, selectedPreset, presets } = get();
    e.preventDefault();
    const formData = new FormData(e.target);
    set(() => ({ form: e.target }));
    const preset = {
      id: v4(),
      name: formData.get("presetName"),
      hours: parseInt(formData.get("hours")) || 0,
      minutes: parseInt(formData.get("minutes")) || 0,
      seconds: parseInt(formData.get("seconds")) || 0,
      soundId: formData.get("soundId") || get().selectedSound,
    };
    if (selectedPreset) {
      const updatedPresets = presets.map((p) =>
        p.id === selectedPreset ? { ...p, ...preset, id: selectedPreset } : p,
      );
      setStoredPresets(updatedPresets);
      set(() => ({ presets: updatedPresets, selectedPreset: null }));
    } else {
      addPreset(preset);
      set(() => ({ selectedPreset: null }));
    }
    e.target.reset();
  },
  deletePreset: (id) => {
    const { presets } = get();
    const filteredPresets = presets.filter((preset) => preset.id !== id);
    setStoredPresets(filteredPresets);
    set(() => ({ presets: filteredPresets }));
  },
  clearSelectedPreset: () => {
    set(() => ({ selectedPreset: null }));
  },
  openTimerModal: () => {
    const { hours, minutes, seconds, selectedSound } = get();
    set(() => ({
      timerForm: { hours, minutes, seconds, soundId: selectedSound },
      isTimerModalOpen: true,
    }));
  },
  closeTimerModal: () => {
    stopPreview();
    set(() => ({ isTimerModalOpen: false }));
  },
  openPresetModal: (presetId) => {
    const { presets, selectedSound } = get();
    const preset = presets.find((item) => item.id === presetId);

    if (preset) {
      set(() => ({
        selectedPreset: preset.id,
        presetForm: {
          name: preset.name,
          hours: preset.hours,
          minutes: preset.minutes,
          seconds: preset.seconds,
          soundId: preset.soundId || selectedSound,
        },
        isPresetModalOpen: true,
      }));
      return;
    }

    set(() => ({
      selectedPreset: null,
      presetForm: { ...emptyPreset, soundId: selectedSound },
      isPresetModalOpen: true,
    }));
  },
  closePresetModal: () => {
    stopPreview();
    set(() => ({ isPresetModalOpen: false, selectedPreset: null }));
  },
  updateTimerForm: (field, value) => {
    const nextValue = field === "soundId" ? value : value.replace(/\D/g, "");
    set((state) => ({ timerForm: { ...state.timerForm, [field]: nextValue } }));
  },
  updatePresetForm: (field, value) => {
    const nextValue = ["hours", "minutes", "seconds"].includes(field)
      ? value.replace(/\D/g, "")
      : value;
    set((state) => ({ presetForm: { ...state.presetForm, [field]: nextValue } }));
  },
  selectTimerSound: (soundId) => {
    playPreview(soundId);
    set((state) => ({ timerForm: { ...state.timerForm, soundId } }));
  },
  selectPresetSound: (soundId) => {
    playPreview(soundId);
    set((state) => ({ presetForm: { ...state.presetForm, soundId } }));
  },
  submitTimer: (event) => {
    event.preventDefault();
    const { timerForm, setTime, setSound } = get();
    setTime(timerForm);
    setSound(timerForm.soundId);
    stopPreview();
    set(() => ({ isTimerModalOpen: false }));
  },
  submitPreset: (event) => {
    event.preventDefault();
    const { savePreset, presetForm } = get();
    savePreset(presetForm);
    stopPreview();
    set(() => ({ isPresetModalOpen: false, presetForm: emptyPreset }));
  },
  savePreset: (presetData) => {
    const { presets, selectedPreset } = get();
    const preset = {
      id: selectedPreset || v4(),
      name: presetData.name,
      hours: Math.max(0, parseInt(presetData.hours) || 0),
      minutes: Math.max(0, parseInt(presetData.minutes) || 0),
      seconds: Math.max(0, parseInt(presetData.seconds) || 0),
      soundId: presetData.soundId || get().selectedSound,
    };

    if (selectedPreset) {
      const updatedPresets = presets.map((item) => (item.id === selectedPreset ? preset : item));
      setStoredPresets(updatedPresets);
      set(() => ({
        presets: updatedPresets,
        selectedPreset: null,
      }));
      return;
    }

    set((state) => {
      const presets = [...state.presets, preset];
      setStoredPresets(presets);
      return { presets };
    });
  },
  editPreset: (id) => {
    const { presets } = get();
    const foundedPreset = presets.find((preset) => preset.id === id);
    if (foundedPreset) {
      set(() => ({ selectedPreset: foundedPreset.id }));
    }
    return foundedPreset;
  },
  startPreset: (presetId) => {
    const { presets } = get();
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;
    set(() => ({
      hours: preset.hours,
      minutes: preset.minutes,
      seconds: preset.seconds,
      selectedSound: preset.soundId || get().selectedSound,
      isFinished: false,
      isrunning: preset.hours + preset.minutes + preset.seconds > 0,
    }));
  },
  finish: () => {
    set(() => ({ isrunning: false, isFinished: true }));
  },
}));

export const useTimerCard = () => {
  const { hours, minutes, seconds, isrunning, isFinished, selectedSound } = timerStore();
  useEffect(() => {
    let timer;
    if (isrunning) {
      timer = setInterval(() => {
        timerStore.setState((state) => {
          if (state.hours === 0 && state.minutes === 0 && state.seconds === 0) {
            return { isrunning: false, isFinished: true };
          }
          if (state.hours === 0 && state.minutes === 0 && state.seconds === 1) {
            return { seconds: 0, isrunning: false, isFinished: true };
          }
          if (state.seconds > 0) {
            return { seconds: state.seconds - 1 };
          } else if (state.minutes > 0) {
            return { seconds: 59, minutes: state.minutes - 1 };
          } else if (state.hours > 0) {
            return { seconds: 59, minutes: 59, hours: state.hours - 1 };
          }
          return state;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isrunning]);

  useEffect(() => {
    if (isFinished) {
      playAlarm(selectedSound);
      return;
    }

    stopAlarm();
  }, [isFinished, selectedSound]);

  return { hours, minutes, seconds, isrunning };
};

export default timerStore;
