import pomodoroStore, {
  formatPomodoroTime,
  pomodoroModes,
  usePomodoroTimer,
} from "../../features/pomodoro";

import "./style.scss";

const PomodoroCard = () => {
  const {
    activeMode,
    remainingSeconds,
    isRunning,
    pomodoroCount,
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    settingsForm,
    setMode,
    start,
    pause,
    reset,
    updateSettingsForm,
    saveSettings,
  } = pomodoroStore();

  usePomodoroTimer();

  const modeDurations = {
    focus: focusMinutes,
    short: shortBreakMinutes,
    long: longBreakMinutes,
  };
  const activeLabel =
    pomodoroModes.find((mode) => mode.id === activeMode)?.label || "Focus";

  return (
    <section className="pomodoro">
      <aside className="pomodoro__settings">
        <div className="pomodoro__section-head">
          <div>
            <span>Settings</span>
            <h2>Pomodoro time</h2>
          </div>
        </div>

        <form className="pomodoro__form" onSubmit={saveSettings}>
          <label>
            <span>Focus</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              type="text"
              value={settingsForm.focusMinutes}
              onChange={(event) =>
                updateSettingsForm("focusMinutes", event.target.value)
              }
            />
          </label>

          <label>
            <span>Short break</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              type="text"
              value={settingsForm.shortBreakMinutes}
              onChange={(event) =>
                updateSettingsForm("shortBreakMinutes", event.target.value)
              }
            />
          </label>

          <label>
            <span>Long break</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              type="text"
              value={settingsForm.longBreakMinutes}
              onChange={(event) =>
                updateSettingsForm("longBreakMinutes", event.target.value)
              }
            />
          </label>

          <button type="submit">Save settings</button>
        </form>
      </aside>

      <div className="pomodoro__panel">
        <div className="pomodoro__tabs" role="tablist" aria-label="Pomodoro modes">
          {pomodoroModes.map((mode) => (
            <button
              className={activeMode === mode.id ? "pomodoro__tab active" : "pomodoro__tab"}
              key={mode.id}
              type="button"
              onClick={() => setMode(mode.id)}
            >
              <span>{mode.label}</span>
              <strong>{modeDurations[mode.id]} min</strong>
            </button>
          ))}
        </div>

        <div className="pomodoro__status">
          <span>{isRunning ? "Running" : "Ready"}</span>
          <strong>{activeLabel}</strong>
        </div>

        <div className="pomodoro__display">{formatPomodoroTime(remainingSeconds)}</div>

        <div className="pomodoro__controls">
          <button
            className="pomodoro__btn pomodoro__btn--primary"
            type="button"
            onClick={start}
            disabled={isRunning}
          >
            Start
          </button>
          <button
            className="pomodoro__btn"
            type="button"
            onClick={pause}
            disabled={!isRunning}
          >
            Pause
          </button>
          <button className="pomodoro__btn pomodoro__btn--ghost" type="button" onClick={reset}>
            Reset
          </button>
        </div>

        <div className="pomodoro__count">
          <span>Completed focus sessions</span>
          <strong>{pomodoroCount}</strong>
        </div>
      </div>
    </section>
  );
};

export default PomodoroCard;
