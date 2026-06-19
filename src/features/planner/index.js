import { v4 } from "uuid";
import { create } from "zustand";

const PLANNER_STORAGE_KEY = "time-control-planner-tasks";

const normalizeDate = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const pad = (value) => String(value).padStart(2, "0");

export const toDateKey = (date) => {
  const normalized = normalizeDate(date);
  return `${normalized.getFullYear()}-${pad(normalized.getMonth() + 1)}-${pad(
    normalized.getDate()
  )}`;
};

const parseTask = (task) => ({
  ...task,
  date: normalizeDate(task.date || new Date()),
  completed: Boolean(task.completed),
});

const getStoredTasks = () => {
  if (typeof window === "undefined") return [];

  try {
    const tasks = JSON.parse(window.localStorage.getItem(PLANNER_STORAGE_KEY) || "[]");
    if (!Array.isArray(tasks)) return [];

    return tasks.map(parseTask);
  } catch {
    return [];
  }
};

const setStoredTasks = (tasks) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(tasks));
};

const updateStoredTasks = (set, updater) => {
  set((state) => {
    const tasks = updater(state.tasks);
    setStoredTasks(tasks);
    return { tasks };
  });
};

const usePlannerStore = create((set) => ({
  tasks: getStoredTasks(),
  viewDate: normalizeDate(new Date()),

  setViewDate: (date) => set({ viewDate: normalizeDate(date) }),

  moveViewDate: (days) =>
    set((state) => {
      const nextDate = normalizeDate(state.viewDate);
      nextDate.setDate(nextDate.getDate() + days);
      return { viewDate: nextDate };
    }),

  addTask: ({ title, date }) =>
    updateStoredTasks(set, (tasks) => [
      ...tasks,
      {
        id: v4(),
        title: title.trim(),
        date: normalizeDate(date),
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]),

  updateTask: (id, updates) =>
    updateStoredTasks(set, (tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updates,
              title: updates.title ? updates.title.trim() : task.title,
              date: updates.date ? normalizeDate(updates.date) : task.date,
            }
          : task
      )
    ),

  toggleTask: (id) =>
    updateStoredTasks(set, (tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    ),

  deleteTask: (id) =>
    updateStoredTasks(set, (tasks) => tasks.filter((task) => task.id !== id)),
}));

export default usePlannerStore;
