import { useTimeZoneSearchCard } from "../../../features/time-zones/search-card";

import "./style.scss";

const TimeZoneSearchCard = ({ localTimeZone, selectedTimeZones, onSelectTimeZone }) => {
  const {
    isModalOpen,
    query,
    exampleSearches,
    results,
    openModal,
    closeModal,
    setQuery,
    handleExampleClick,
    handleSelectTimeZone,
  } = useTimeZoneSearchCard({
    localTimeZone,
    selectedTimeZones,
    onSelectTimeZone,
  });

  return (
    <>
      <div className="tz-search-card">
        <div className="tz-search-card__bar" />

        <div className="tz-search-card__header">
          <div>
            <span className="tz-search-card__eyebrow">Timezone Search</span>
            <h2 className="tz-search-card__title">Find and add timezone cards</h2>
          </div>
          <span className="tz-search-card__count">{selectedTimeZones.length}</span>
        </div>

        <button
          type="button"
          className="tz-search-card__trigger"
          onClick={openModal}
        >
          <span className="tz-search-card__trigger-copy">
            <span className="tz-search-card__trigger-label">Search Timezone</span>
            <span className="tz-search-card__trigger-hint">Tokyo, London, New York va boshqalar</span>
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </button>
      </div>

      {isModalOpen ? (
        <div
          className="tz-search-card__modal"
          role="dialog"
          aria-modal="true"
          aria-label="Timezone search modal"
          onClick={closeModal}
        >
          <div className="tz-search-card__modal-panel" onClick={(event) => event.stopPropagation()}>
            <div className="tz-search-card__modal-header">
              <div>
                <span className="tz-search-card__eyebrow">Search Timezones</span>
                <h3 className="tz-search-card__title">Add a new timezone card</h3>
              </div>
              <button
                type="button"
                className="tz-search-card__close"
                onClick={closeModal}
                aria-label="Modalni yopish"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <label className="tz-search-card__field">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search: new york, tokyo, london..."
                className="tz-search-card__input"
                autoFocus
              />
            </label>

            {!query.trim() ? (
              <div className="tz-search-card__placeholder">
                <span className="tz-search-card__placeholder-title">Example searches</span>
                <div className="tz-search-card__examples">
                  {exampleSearches.map((example) => (
                    <button
                      key={example}
                      type="button"
                      className="tz-search-card__example"
                      onClick={() => handleExampleClick(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
                <p className="tz-search-card__placeholder-text">
                  Modal ochilgach shu yerdan misollar chiqadi. Ulardan birini bosing yoki o'zingiz qidiring.
                </p>
              </div>
            ) : (
              <div className="tz-search-card__results">
                {results.length ? (
                  results.map((item) => (
                    <button
                      key={item.zone}
                      type="button"
                      className="tz-search-card__item"
                      onClick={() => handleSelectTimeZone(item.zone)}
                    >
                      <div className="tz-search-card__item-copy">
                        <span className="tz-search-card__city">{item.location}</span>
                        <span className="tz-search-card__zone">{item.zone}</span>
                      </div>

                      <div className="tz-search-card__item-meta">
                        <span className="tz-search-card__time">{item.time}</span>
                        <span className="tz-search-card__offset">{item.offset}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="tz-search-card__empty">
                    No results found for "<strong>{query}</strong>". Please try a different search term.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TimeZoneSearchCard;
