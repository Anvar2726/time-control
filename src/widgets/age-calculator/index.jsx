import { memo } from "react";
import ageCalculatorStore from "../../features/age-calculator";

import "./style.scss";

const AgeCalculatorCard = memo(() => {
  const { year, month, day, nextBirthday, totals, setAge } = ageCalculatorStore();
  const hasResult = Boolean(nextBirthday);
  const today = new Date();
  const maxDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const totalItems = [
    { label: "Total days", value: totals.days },
    { label: "Total weeks", value: totals.weeks },
    { label: "Total months", value: totals.months },
    { label: "Total hours", value: totals.hours },
    { label: "Total minutes", value: totals.minutes },
  ];

  const formatNumber = (value) => value.toLocaleString("en-US");

  return (
    <section className="age-calculator">
      <div className="age-calculator__hero">
        <span className="age-calculator__eyebrow">Age calculator</span>
        <h2>Find your exact age</h2>
        <p>Choose your birth date and see your age, lifetime totals, and the countdown to your next birthday.</p>
      </div>

      <div className="age-calculator__layout">
        <aside className="age-calculator__panel age-calculator__input-panel">
          <div className="age-calculator__section-head">
            <span>Birth date</span>
            <strong>Pick a date</strong>
          </div>

          <label className="age-calculator__date-field">
            <span>Date of birth</span>
            <input type="date" max={maxDate} onChange={setAge} />
          </label>

          <div className="age-calculator__hint">
            {hasResult ? "Result updated from your selected date." : "Your calculation will appear after selecting a date."}
          </div>
        </aside>

        <div className="age-calculator__content">
          <div className="age-calculator__panel age-calculator__age-panel">
            <div className="age-calculator__section-head">
              <span>Exact age</span>
              <strong>{hasResult ? "Calculated" : "Waiting"}</strong>
            </div>

            <div className="age-calculator__age-grid" aria-label="Exact age result">
              <article>
                <strong>{year}</strong>
                <span>Years</span>
              </article>
              <article>
                <strong>{month}</strong>
                <span>Months</span>
              </article>
              <article>
                <strong>{day}</strong>
                <span>Days</span>
              </article>
            </div>
          </div>

          <div className="age-calculator__stats">
            {totalItems.map((item) => (
              <article className="age-calculator__stat" key={item.label}>
                <span>{item.label}</span>
                <strong>{formatNumber(item.value)}</strong>
              </article>
            ))}
          </div>

          <div className="age-calculator__panel age-calculator__birthday">
            <div>
              <span>Next birthday</span>
              <strong>{nextBirthday || "Select a date"}</strong>
            </div>
            <p>
              <b>{formatNumber(totals.birthdayDays)}</b>
              days left
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AgeCalculatorCard;

