import { v4 } from "uuid";
import { create } from "zustand";

const PLANNER_STORAGE_KEY = "time-control-planner-tasks";

const getStoredTasks = () => {
  if (typeof window === "undefined") return [];

  try {
    const tasks = JSON.parse(window.localStorage.getItem(PLANNER_STORAGE_KEY) || "[]");
    if (!Array.isArray(tasks)) return [];

    return tasks.map((task) => ({
      ...task,
      date: new Date(task.date),
    }));
  } catch {
    return [];
  }
};

const setStoredTasks = (tasks) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(tasks));
};

const plannerStore = create((set, get) => ({
  tasks: getStoredTasks(),
  calendarValue: new Date(),
  tasksForm: null,
  selectedTask: null,
  setCalendarValue: (value) => set(() => ({ calendarValue: value })),
  addTask: (task) =>
    set((state) => {
      const tasks = [...state.tasks, task];
      setStoredTasks(tasks);
      return { tasks };
    }),
  sumbitTask: (e) => {
    const { calendarValue, addTask, selectedTask, tasks, setCalendarValue } = get();
    e.preventDefault();
    const formData = new FormData(e.target);
    set(() => ({ tasksForm: e.target }));
    const tasksObj = {
      id: v4(),
      name: formData.get("taskName"),
      date: calendarValue,
      completed: false,
    };
    if (selectedTask) {
        const updatedTasks = tasks.map((task) => {
            if (task.id === selectedTask) {
                return { ...task, name: tasksObj.name, date: tasksObj.date };
            }
            return task;
        });
        setStoredTasks(updatedTasks);
        set(() => ({ tasks: updatedTasks, selectedTask: null }));
    }else{
        addTask(tasksObj);
        set(() => ({ selectedTask: null }));
    }
    setCalendarValue(new Date());
    e.target.reset();
  },
  doneTask: (id) => {
    const { tasks } = get();
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setStoredTasks(updatedTasks);
    set(() => ({ tasks: updatedTasks }));
  },
  deleteTask: (id) => {
    const { tasks } = get();
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setStoredTasks(filteredTasks);
    set(() => ({ tasks: filteredTasks }));
  },
  editTask: (id) => {
    const { tasks, tasksForm, setCalendarValue } = get();
    const foundedTask = tasks.find((task) => task.id === id);
    if (foundedTask) {
        tasksForm.taskName.value = foundedTask.name;
        set(() => ({ selectedTask: id }));
      setCalendarValue(foundedTask.date);
    }
  },
}));

export default plannerStore;
