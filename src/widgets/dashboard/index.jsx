import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigationType, useLocation } from "react-router-dom";
import "./style.scss";

const navItems = [
  {
    to: "/",
    end: true,
    icon: (
      <svg
        viewBox="0 0 20 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
    label: "Time Zone",
  },
  {
    to: "/time",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        id="Earth-Time--Streamline-Ultimate"
        height="48"
        width="48"
        className="h-[20px] w-[20px]"
      >
        <g>
          <path
            d="M22 44.22a1.08 1.08 0 0 0 -0.68 -0.42 19.56 19.56 0 0 1 -6.26 -2v-2.58a5 5 0 0 1 1.78 -3.82 8.92 8.92 0 0 0 2.54 -3.56 16.32 16.32 0 0 1 0.52 -2 8.12 8.12 0 0 0 0.16 -1.4 9.02 9.02 0 0 0 -9 -9H4.52a20 20 0 0 1 30.76 -12h-6.78a5.5 5.5 0 0 0 0 11 5.14 5.14 0 0 1 2.56 0.72 1.14 1.14 0 0 0 0.72 0.12 15.56 15.56 0 0 1 3.22 -0.28 16 16 0 0 1 12 5.4 0.6 0.6 0 0 0 1 -0.4 24 24 0 0 0 -48 0c0 9.84 8 24 24 24a0.6 0.6 0 0 0 0.4 -1.04 16 16 0 0 1 -2.4 -2.74Z"
            fill="currentColor"
            strokeWidth="1"
          ></path>
          <path
            d="M35 22a13 13 0 1 0 13 13 13.02 13.02 0 0 0 -13 -13Zm0 22a9 9 0 1 1 9 -9 9.02 9.02 0 0 1 -9 9Z"
            fill="currentColor"
            strokeWidth="1"
          ></path>
          <path
            d="M39 33h-1.5a0.5 0.5 0 0 1 -0.5 -0.5V30a2 2 0 0 0 -4 0v5a2 2 0 0 0 2 2h4a2 2 0 0 0 0 -4Z"
            fill="currentColor"
            strokeWidth="1"
          ></path>
        </g>
      </svg>
    ),
    label: "World Time",
  },
  {
    to: "/pomodoro",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        height="48"
        width="48"
        className="h-[20px] w-[20px]"
      >
        <g>
          <path
            d="M41.36 15.58a10.36 10.36 0 0 1 -2.38 0.96 10.14 10.14 0 0 1 0.26 6 3 3 0 0 1 -2.84 2 3.06 3.06 0 0 1 -0.6 0 20.54 20.54 0 0 1 -6.46 -2.76 15.58 15.58 0 0 1 -3.22 5.32 3 3 0 0 1 -4.24 0 15.58 15.58 0 0 1 -3.22 -5.3 20.54 20.54 0 0 1 -6.46 2.76 3.06 3.06 0 0 1 -0.6 0 3 3 0 0 1 -2.84 -2 10.24 10.24 0 0 1 0.26 -6 10.92 10.92 0 0 1 -2.4 -0.96A19.02 19.02 0 0 0 2 28c0 12.9 7.82 20 22 20s22 -7.1 22 -20a18.92 18.92 0 0 0 -4.64 -12.42Zm-13.54 24c4.74 -0.6 7.68 -3.48 7.68 -7.52a1.5 1.5 0 0 1 3 0c0 5.58 -4 9.7 -10.32 10.48H28a1.5 1.5 0 0 1 -1.48 -1.32 1.48 1.48 0 0 1 1.3 -1.7Z"
            fill="currentColor"
            strokeWidth="1"
          ></path>
          <path
            d="M22 7.52a14.72 14.72 0 0 0 -3.34 -0.36A23.74 23.74 0 0 0 6 11.48 9.32 9.32 0 0 0 12 14a7.6 7.6 0 0 0 1.86 -0.22c-3.38 4.5 -2.24 7.88 -2.24 7.88A16.42 16.42 0 0 0 20.62 16 13.5 13.5 0 0 0 24 25 13.5 13.5 0 0 0 27.38 16a16.42 16.42 0 0 0 9 5.64s1.14 -3.38 -2.24 -7.88A7.6 7.6 0 0 0 36 14a9.32 9.32 0 0 0 6 -2.48 23.74 23.74 0 0 0 -12.68 -4.32 14.72 14.72 0 0 0 -3.32 0.32V2a2 2 0 0 0 -4 0Z"
            fill="currentColor"
            strokeWidth="1"
          ></path>
        </g>
      </svg>
    ),
    label: "Pomodoro",
  },
  {
    to: "/planner",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
      </svg>
    ),
    label: "Planner",
  },
  {
    to: "/stop-watch",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="13" r="8" />
        <polyline points="12 9 12 13 14.5 15.5" />
        <path d="M9 3h6" />
        <path d="M12 3v2" />
        <path d="M19.4 5.6l-1.4 1.4" />
      </svg>
    ),
    label: "Stop Watch",
  },
  {
    to: "/timer",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
        <path d="M18 2l2 2" />
        <path d="M6 2L4 4" />
      </svg>
    ),
    label: "Timer",
  },
];

const DashboardPage = () => {
  const navigationType = useNavigationType();
  const { pathname } = useLocation();

  const [expanded, setExpanded] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("time-control-theme") || "dark";
  });
  const [now, setNow] = useState(new Date());

  
useEffect(() => {
  if (navigationType === "PUSH") {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    console.log(pathname, navigationType);
  }
}, [pathname, navigationType]);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("time-control-theme", theme);
  }, [theme]);

  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const closeMobileSidebar = () => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      setExpanded(false);
    }
  };

  return (
    <div className="dashboard">
      <button
        className="sidebar__mobile-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-label="Toggle sidebar"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {expanded ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${expanded ? "sidebar--expanded" : ""}`}>
        {/* Logo */}
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon">⏱</span>
          {expanded && <span className="sidebar__brand-text">TimeControl</span>}
        </div>

        {/* Toggle */}
        <button
          className="sidebar__toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-label="Toggle sidebar"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {expanded ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        {/* Nav */}
        <nav className="sidebar__nav">
          {navItems.map(({ to, end, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMobileSidebar}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
            >
              <span className="sidebar__link-icon">{icon}</span>
              {expanded && <span className="sidebar__link-label">{label}</span>}
              {!expanded && <span className="sidebar__tooltip">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="sidebar__footer">
          <div className="sidebar__avatar">
            <span>TC</span>
          </div>
          {expanded && <span className="sidebar__footer-text">v1.0.0</span>}
        </div>
      </aside>

      {/* Main area */}
      <div className="dashboard__body">
        <header className="topbar">
          <div className="topbar__title">
            <h1>Time Control</h1>
          </div>
          <div className="topbar__right">
            <span className="topbar__badge">
              {now.toLocaleDateString("uz-UZ", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="topbar__badge topbar__badge--time">
              {now.toLocaleTimeString("uz-UZ", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <button className="topbar__theme" type="button" onClick={toggleTheme}>
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <footer className="footer">
          <p>Copyright &copy; {new Date().getFullYear()} Time Control. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardPage;
