import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import plannerStore from "../../features/planner";

import "./style.scss";

const PlannerCard = () => {
  const [calendarModalType, setCalendarModalType] = useState(null);
  const [activeFilterDate, setActiveFilterDate] = useState(null);
  const [doneFilterDate, setDoneFilterDate] = useState(null);
  const {
    calendarValue,
    setCalendarValue,
    sumbitTask,
    tasks,
    deleteTask,
    doneTask,
    editTask,
    selectedTask,
  } = plannerStore();

  const isSameDate = (firstDate, secondDate) =>
    firstDate.toDateString() === secondDate.toDateString();
  const dailyTasks = tasks.filter((task) => isSameDate(task.date, calendarValue));
  const activeTasks = tasks.filter(
    (task) =>
      !task.completed &&
      (!activeFilterDate || isSameDate(task.date, activeFilterDate))
  );
  const doneTasks = tasks.filter(
    (task) =>
      task.completed && (!doneFilterDate || isSameDate(task.date, doneFilterDate))
  );
  const formatLongDate = (date) => date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const selectedDate = formatLongDate(calendarValue);
  const activeSelectedDate = activeFilterDate
    ? formatLongDate(activeFilterDate)
    : "All dates";
  const doneSelectedDate = doneFilterDate ? formatLongDate(doneFilterDate) : "All dates";
  const modalDate =
    calendarModalType === "done"
      ? doneFilterDate || new Date()
      : activeFilterDate || new Date();
  const modalSelectedDate =
    calendarModalType === "done" ? doneSelectedDate : activeSelectedDate;
  const formatTaskDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="planner">
      <aside className="planner__calendar-panel">
        <div className="planner__header">
          <div>
            <span>Planner</span>
            <h2>Daily tasks</h2>
          </div>
        </div>

        <Calendar
          className="planner__calendar"
          onChange={setCalendarValue}
          value={calendarValue}
        />

        <div className="planner__summary">
          <span>Selected date</span>
          <strong>{selectedDate}</strong>
          <p>{dailyTasks.length} task on this date</p>
        </div>

        <div className="planner__daily-list">
          {dailyTasks.length === 0 && (
            <div className="planner__empty">No tasks planned for this date.</div>
          )}

          {dailyTasks.map((task) => (
            <article
              key={task.id}
              className={`planner__daily-item${
                task.completed ? " planner__daily-item--done" : ""
              }`}
            >
              <span>{task.completed ? "Done" : "Active"}</span>
              <h3>{task.name}</h3>
            </article>
          ))}
        </div>
      </aside>

      <div className="planner__task-panel">
        <form className="planner__form" onSubmit={sumbitTask}>
          <label htmlFor="taskName">
            <span>{selectedTask ? "Update task" : "New task"}</span>
            <input
              required
              type="text"
              name="taskName"
              id="taskName"
              placeholder="Task name"
            />
          </label>
          <button type="submit">{selectedTask ? "Save task" : "Add task"}</button>
        </form>

        <div className="planner__section-head">
          <div>
            <span>Queue</span>
            <h2>Active tasks</h2>
            <p>{activeSelectedDate}</p>
          </div>
          <div className="planner__section-actions">
            {activeFilterDate && (
              <button
                className="planner__date-button"
                type="button"
                onClick={() => setActiveFilterDate(null)}
              >
                All dates
              </button>
            )}
            <button
              className="planner__date-button"
              type="button"
              onClick={() => setCalendarModalType("active")}
            >
              Choose date
            </button>
            <strong>{activeTasks.length}</strong>
          </div>
        </div>

        <div className="planner__task-list">
          {activeTasks.length === 0 && (
            <div className="planner__empty">No active tasks for this date.</div>
          )}

          {activeTasks.map((task) => (
            <article key={task.id} className="planner__task-item">
              <div className="planner__task-content">
                <h3>{task.name}</h3>
                <p>{formatTaskDate(task.date)}</p>
              </div>
              <div className="planner__task-actions">
                <button type="button" onClick={() => doneTask(task.id)}>
                  Done
                </button>
                <button type="button" onClick={() => editTask(task.id)}>
                  Edit
                </button>
                <button
                  className="planner__task-delete"
                  type="button"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="planner__section-head planner__section-head--done">
          <div>
            <span>Archive</span>
            <h2>Done tasks</h2>
            <p>{doneSelectedDate}</p>
          </div>
          <div className="planner__section-actions">
            {doneFilterDate && (
              <button
                className="planner__date-button"
                type="button"
                onClick={() => setDoneFilterDate(null)}
              >
                All dates
              </button>
            )}
            <button
              className="planner__date-button"
              type="button"
              onClick={() => setCalendarModalType("done")}
            >
              Choose date
            </button>
            <strong>{doneTasks.length}</strong>
          </div>
        </div>

        <div className="planner__done-list">
          {doneTasks.length === 0 && (
            <div className="planner__empty">No completed tasks for this date.</div>
          )}

          {doneTasks.map((task) => (
            <article
              key={task.id}
              className="planner__task-item planner__task-item--done"
              onClick={() => doneTask(task.id)}
            >
              <div className="planner__task-content">
                <h3>{task.name}</h3>
                <p>{formatTaskDate(task.date)}</p>
              </div>
              <button
                className="planner__task-delete"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </div>

      {calendarModalType && (
        <div
          className="planner__modal-backdrop"
          onClick={() => setCalendarModalType(null)}
        >
          <div className="planner__modal" onClick={(e) => e.stopPropagation()}>
            <div className="planner__modal-head">
              <div>
                <span>Select date</span>
                <h2>{modalSelectedDate}</h2>
              </div>
              <button type="button" onClick={() => setCalendarModalType(null)}>
                x
              </button>
            </div>

            <Calendar
              className="planner__calendar"
              onChange={(value) => {
                if (calendarModalType === "done") {
                  setDoneFilterDate(value);
                } else {
                  setActiveFilterDate(value);
                }
                setCalendarModalType(null);
              }}
              value={modalDate}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default PlannerCard
