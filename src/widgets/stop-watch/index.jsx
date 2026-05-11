import stopWatchStore, { useStopWatchCard } from "../../features/stop-watch";

import "./style.scss";

const StopWatchCard = () => {
  const { start, stop, reset, addLap, laps, isrunning, elapsedTime } = stopWatchStore();
  const { formatTime } = useStopWatchCard();
  const hasStarted = isrunning || elapsedTime > 0 || laps.length > 0;

  return (
    <div className="stop-watch__card">
      <div className="stop-watch__wrapper">
        <div className="stop-watch__timer">
          <div className="stop-watch__eyebrow">{isrunning ? "Running" : "Stopwatch"}</div>
          <p className={`stop-watch__time ${isrunning ? "stop-watch__time--running" : ""}`}>
            {formatTime()}
          </p>
          <div className="stop-watch__btns">
            {!hasStarted ? (
              <button className="stop-watch__btn stop-watch__btn--primary" onClick={start}>
                Start
              </button>
            ) : (
              <>
                <button
                  className="stop-watch__btn stop-watch__btn--danger"
                  onClick={stop}
                  disabled={!isrunning}
                >
                  Stop
                </button>
                <button
                  className="stop-watch__btn stop-watch__btn--primary"
                  onClick={start}
                  disabled={isrunning}
                >
                  Start
                </button>
                <button className="stop-watch__btn" onClick={reset}>
                  Reset
                </button>
                <button
                  className="stop-watch__btn stop-watch__btn--ghost"
                  onClick={addLap}
                  disabled={elapsedTime === 0}
                >
                  Laps
                </button>
              </>
            )}
          </div>
        </div>

        <div className="stop-watch__divider" />

        <div className="stop-watch__laps">
          <div className="stop-watch__laps-header">
            <h2>Laps</h2>
            <span>{laps.length}</span>
          </div>
          {laps.length > 0 ? (
            <ul>
              {laps.map((lap, index) => (
                <li key={`${lap}-${index}`}>
                  <span>Lap {String(index + 1).padStart(2, "0")}</span>
                  <strong>{lap}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="stop-watch__empty">No laps yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StopWatchCard;
