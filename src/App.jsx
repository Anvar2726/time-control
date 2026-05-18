import { BrowserRouter, Route, Routes } from "react-router-dom"
import WorldTimePage from "./pages/world-time"
import Pomodoropage from "./pages/pomodoro"
import StopWatchPage from "./pages/stop-watch"
import TimeZonePage from "./pages/time-zones"
import TimerPage from "./pages/timer"
import PlannerPage from "./pages/planner"
import NotFoundPage from "./pages/not-found"
import DashboardPage from "./widgets/dashboard"

function App() {

  
  return (
    <BrowserRouter>
      <Routes >
        <Route element={<DashboardPage />} >
          <Route index element={<TimeZonePage />} />
          <Route path="time" element={<WorldTimePage />} />
          <Route path="pomodoro" element={<Pomodoropage />} />
          <Route path="planner" element={<PlannerPage />} />
          <Route path="stop-watch" element={<StopWatchPage />} />
          <Route path="timer" element={<TimerPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
