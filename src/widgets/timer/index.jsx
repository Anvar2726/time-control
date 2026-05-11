import timerStore, { durations, formatDuration, sounds, useTimerCard } from "../../features/timer";

import "./style.scss";

const TimerCard = () => {
  const {
    start,
    stop,
    reset,
    resume,
    setDuration,
    presets,
    deletePreset,
    startPreset,
    selectedPreset,
    selectedSound,
    isFinished,
    isrunning,
    isTimerModalOpen,
    isPresetModalOpen,
    timerForm,
    presetForm,
    openTimerModal,
    closeTimerModal,
    openPresetModal,
    closePresetModal,
    updateTimerForm,
    updatePresetForm,
    selectTimerSound,
    selectPresetSound,
    submitTimer,
    submitPreset,
  } = timerStore();

  const { hours, minutes, seconds } = useTimerCard();
  const activeSound = sounds.find((sound) => sound.id === selectedSound) || sounds[0];
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const progressText = isFinished ? "Time is up" : isrunning ? "Running" : "Ready";

  return (
    <div className="timer">
      <aside className="timer__presets">
        <div className="timer__section-head">
          <div>
            <span>Presets</span>
            <h2>Saved timers</h2>
          </div>
          <button className="timer__icon-btn" onClick={() => openPresetModal()} aria-label="Add preset">
            +
          </button>
        </div>

        <div className="timer__preset-list">
          {presets.length > 0 ? (
            presets.map((preset) => (
              <article className="timer__preset" key={preset.id}>
                <button className="timer__preset-main" onClick={() => startPreset(preset.id)}>
                  <strong>{preset.name}</strong>
                  <span>
                    {String(preset.hours).padStart(2, "0")}:
                    {String(preset.minutes).padStart(2, "0")}:
                    {String(preset.seconds).padStart(2, "0")}
                  </span>
                </button>
                <div className="timer__preset-actions">
                  <button onClick={() => openPresetModal(preset.id)}>Edit</button>
                  <button onClick={() => deletePreset(preset.id)}>Delete</button>
                </div>
              </article>
            ))
          ) : (
            <div className="timer__empty">No presets yet</div>
          )}
        </div>
      </aside>

      <div className="timer__panel">
        <div className="timer__status">
          <span>{progressText}</span>
          <strong>{activeSound.label}</strong>
        </div>

        <div className="timer__display" aria-label="Timer display">
          <span>{String(hours).padStart(2, "0")}</span>
          <small>:</small>
          <span>{String(minutes).padStart(2, "0")}</span>
          <small>:</small>
          <span>{String(seconds).padStart(2, "0")}</span>
        </div>

        <div className="timer__controls">
          <button className="timer__btn timer__btn--primary" onClick={start} disabled={isrunning || totalSeconds === 0}>
            Start
          </button>
          <button className="timer__btn" onClick={resume} disabled={isrunning || totalSeconds === 0}>
            Resume
          </button>
          <button className="timer__btn timer__btn--danger" onClick={stop} disabled={!isrunning && !isFinished}>
            Stop
          </button>
          <button className="timer__btn" onClick={reset}>
            Reset
          </button>
          <button className="timer__btn timer__btn--ghost" onClick={openTimerModal}>
            Set timer
          </button>
        </div>

        <section className="timer__durations" aria-label="Duration presets">
          {durations.map((duration) => (
            <button key={duration} onClick={() => setDuration(duration)}>
              {formatDuration(duration)}
            </button>
          ))}
        </section>
      </div>

      {isTimerModalOpen && (
        <div className="timer__modal-backdrop" role="presentation">
          <form className="timer__modal" onSubmit={submitTimer}>
            <div className="timer__modal-head">
              <h2>Set timer</h2>
              <button type="button" onClick={closeTimerModal} aria-label="Close timer modal">
                x
              </button>
            </div>

            <div className="timer__fields">
              {["hours", "minutes", "seconds"].map((field) => (
                <label key={field}>
                  <span>{field}</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="text"
                    value={timerForm[field]}
                    onChange={(event) => updateTimerForm(field, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="timer__sound-grid">
              {sounds.map((sound) => (
                <label className="timer__sound" key={sound.id}>
                  <input
                    type="radio"
                    name="timerSound"
                    checked={timerForm.soundId === sound.id}
                    onChange={() => selectTimerSound(sound.id)}
                  />
                  <span onClick={() => selectTimerSound(sound.id)}>{sound.label}</span>
                </label>
              ))}
            </div>

            <button className="timer__btn timer__btn--primary" type="submit">
              Save timer
            </button>
          </form>
        </div>
      )}

      {isPresetModalOpen && (
        <div className="timer__modal-backdrop" role="presentation">
          <form className="timer__modal" onSubmit={submitPreset}>
            <div className="timer__modal-head">
              <h2>{selectedPreset ? "Edit preset" : "New preset"}</h2>
              <button type="button" onClick={closePresetModal} aria-label="Close preset modal">
                x
              </button>
            </div>

            <label className="timer__name-field">
              <span>Name</span>
              <input
                required
                type="text"
                value={presetForm.name}
                onChange={(event) => updatePresetForm("name", event.target.value)}
              />
            </label>

            <div className="timer__fields">
              {["hours", "minutes", "seconds"].map((field) => (
                <label key={field}>
                  <span>{field}</span>
                  <input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="text"
                    value={presetForm[field]}
                    onChange={(event) => updatePresetForm(field, event.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="timer__sound-grid">
              {sounds.map((sound) => (
                <label className="timer__sound" key={sound.id}>
                  <input
                    type="radio"
                    name="presetSound"
                    checked={presetForm.soundId === sound.id}
                    onChange={() => selectPresetSound(sound.id)}
                  />
                  <span onClick={() => selectPresetSound(sound.id)}>{sound.label}</span>
                </label>
              ))}
            </div>

            <button className="timer__btn timer__btn--primary" type="submit">
              Save preset
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TimerCard;
