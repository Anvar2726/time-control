import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

const  Pomodoropage =  lazy (() => import("./pages/pomodoro"));
const  StopWatchPage =  lazy (() => import("./pages/stop-watch"));
const  TimeZonePage =  lazy (() => import("./pages/time-zones"));
const  TimerPage =  lazy (() => import("./pages/timer"));
const  PlannerPage =  lazy (() => import("./pages/planner"));
const  NotFoundPage =  lazy (() => import("./pages/not-found"));
const  DashboardPage =  lazy (() => import("./widgets/dashboard"));
const  AgeCalculatorPage =  lazy (() => import("./pages/age-calculator"));

function App() {  
  return (
    <Suspense>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardPage />}>
            <Route index element={<TimeZonePage />} />
            <Route path="time" element={<AgeCalculatorPage />} />
            <Route path="pomodoro" element={<Pomodoropage />} />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="stop-watch" element={<StopWatchPage />} />
            <Route path="timer" element={<TimerPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default App
