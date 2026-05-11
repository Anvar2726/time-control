import { v4 } from "uuid";
import { create } from "zustand";

const plannerStore = create((set, get) => ({
  tasks: [],
  calendarValue: new Date(),
  tasksForm: null,
  selectedTask: null,
  setCalendarValue: (value) => set(() => ({ calendarValue: value })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
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
    set(() => ({ tasks: updatedTasks }));
  },
  deleteTask: (id) => {
    const { tasks } = get();
    const filteredTasks = tasks.filter((task) => task.id !== id);
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
