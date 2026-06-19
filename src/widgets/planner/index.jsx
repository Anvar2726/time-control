import { memo, useMemo, useState } from "react";

import usePlannerStore, { toDateKey } from "../../features/planner";
import styles from "./style.module.scss";

const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "long",
});
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const pad = (value) => String(value).padStart(2, "0");

const toInputDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const fromInputDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getBoardDays = (startDate) =>
  Array.from({ length: 4 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);
    date.setHours(0, 0, 0, 0);
    return date;
  });

const isToday = (date) => toDateKey(date) === toDateKey(new Date());

const TaskForm = memo(({ date, initialValue = "", mode = "add", onCancel, onSubmit }) => {
  const [title, setTitle] = useState(initialValue);

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    onSubmit(cleanTitle, date);
    setTitle("");
  };

  return (
    <form className={styles.taskForm} onSubmit={handleSubmit}>
      <input
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task name"
        aria-label="Task name"
      />
      <div className={styles.formActions}>
        {onCancel && (
          <button type="button" className={styles.ghostButton} onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className={styles.primaryButton}>
          {mode === "edit" ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
});

const TaskCard = memo(({ task, onDelete, onEdit, onToggle }) => (
  <article className={`${styles.taskCard} ${task.completed ? styles.taskCardDone : ""}`}>
    <button
      type="button"
      className={styles.taskCheck}
      aria-label={task.completed ? "Mark task active" : "Mark task complete"}
      onClick={() => onToggle(task.id)}
    >
      {task.completed ? "X" : ""}
    </button>

    <div className={styles.taskBody}>
      <h3>{task.title || task.name}</h3>
      <p>{shortDateFormatter.format(task.date)}</p>
    </div>

    <div className={styles.taskActions}>
      <button type="button" onClick={() => onEdit(task)} aria-label="Edit task">
        Edit
      </button>
      <button type="button" onClick={() => onDelete(task.id)} aria-label="Delete task">
        Delete
      </button>
    </div>
  </article>
));

const EmptyState = memo(({ onAdd }) => (
  <div className={styles.emptyState}>
    <strong>No tasks for this day</strong>
    <button type="button" onClick={onAdd}>
      Add a new task
    </button>
  </div>
));

const PlannerColumn = memo(
  ({
    date,
    editingTask,
    isAdding,
    tasks,
    onAddClick,
    onCancelAdd,
    onCancelEdit,
    onCreate,
    onDelete,
    onEdit,
    onSaveEdit,
    onToggle,
  }) => {
    const dateIsToday = isToday(date);

    return (
      <section className={`${styles.dayColumn} ${dateIsToday ? styles.dayColumnToday : ""}`}>
        <header className={styles.dayHeader}>
          <div>
            <p>{dayFormatter.format(date).toUpperCase()}</p>
            <h2>{dateFormatter.format(date).toUpperCase()}</h2>
          </div>
          {dateIsToday && <span>TODAY</span>}
        </header>

        <div className={styles.columnTasks}>
          {isAdding && <TaskForm date={date} onCancel={onCancelAdd} onSubmit={onCreate} />}

          {tasks.map((task) =>
            editingTask?.id === task.id ? (
              <TaskForm
                key={task.id}
                date={task.date}
                initialValue={task.title || task.name}
                mode="edit"
                onCancel={onCancelEdit}
                onSubmit={(title) => onSaveEdit(task.id, { title })}
              />
            ) : (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
                onToggle={onToggle}
              />
            ),
          )}
          <EmptyState onAdd={() => onAddClick(date)} />
        </div>
      </section>
    );
  }
);

const PlannerCard = memo(() => {
  const [activeTab, setActiveTab] = useState("daily");
  const [addingDateKey, setAddingDateKey] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const {
    addTask,
    deleteTask,
    moveViewDate,
    setViewDate,
    tasks,
    toggleTask,
    updateTask,
    viewDate,
  } = usePlannerStore();

  const boardDays = useMemo(() => getBoardDays(viewDate), [viewDate]);
  const tasksByDate = useMemo(
    () =>
      tasks.reduce((groupedTasks, task) => {
        const dateKey = toDateKey(task.date);
        return {
          ...groupedTasks,
          [dateKey]: [...(groupedTasks[dateKey] || []), task],
        };
      }, {}),
    [tasks]
  );
  
  const sortedTasks = useMemo(
    () => [...tasks].sort((first, second) => second.date - first.date),
    [tasks]
  );

  const openAddForm = (date) => {
    setEditingTask(null);
    setAddingDateKey(toDateKey(date));
  };

  const handleCreateTask = (title, date) => {
    addTask({ title, date });
    setAddingDateKey(null);
  };

  const handleEditTask = (task) => {
    setAddingDateKey(null);
    setEditingTask(task);
    setActiveTab("daily");
    setViewDate(task.date);
  };

  const handleSaveEdit = (id, updates) => {
    updateTask(id, updates);
    setEditingTask(null);
  };

  return (
    <section className={styles.planner} aria-label="Daily planner">
      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label="Planner tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "daily"}
            className={activeTab === "daily" ? styles.activeTab : ""}
            onClick={() => setActiveTab("daily")}
          >
            Daily Planner
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "dump"}
            className={activeTab === "dump" ? styles.activeTab : ""}
            onClick={() => setActiveTab("dump")}
          >
            Task Dump
          </button>
        </div>

        <div className={styles.dateTools}>
          <button type="button" aria-label="Previous day" onClick={() => moveViewDate(-1)}>
            &lt;
          </button>
          <label>
            <span>Date</span>
            <input
              type="date"
              value={toInputDate(viewDate)}
              onChange={(event) => setViewDate(fromInputDate(event.target.value))}
            />
          </label>
          <button type="button" aria-label="Next day" onClick={() => moveViewDate(1)}>
            &gt;
          </button>
        </div>
      </div>

      {activeTab === "daily" ? (
        <div className={styles.board}>
          {boardDays.map((date) => {
            const dateKey = toDateKey(date);
            const dayTasks = tasksByDate[dateKey] || [];

            return (
              <div className={styles.columnWrap} key={dateKey}>
                <PlannerColumn
                  date={date}
                  editingTask={editingTask}
                  isAdding={addingDateKey === dateKey}
                  tasks={dayTasks}
                  onAddClick={openAddForm}
                  onCancelAdd={() => setAddingDateKey(null)}
                  onCancelEdit={() => setEditingTask(null)}
                  onCreate={handleCreateTask}
                  onDelete={deleteTask}
                  onEdit={handleEditTask}
                  onSaveEdit={handleSaveEdit}
                  onToggle={toggleTask}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.dumpPanel}>
          {sortedTasks.length === 0 ? (
            <div className={styles.emptyState}>
              <strong>No tasks yet</strong>
              <button type="button" onClick={() => setActiveTab("daily")}>
                Add a new task
              </button>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onEdit={handleEditTask}
                onToggle={toggleTask}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
});

export default PlannerCard;
