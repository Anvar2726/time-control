import { create } from "zustand";

const ageCalculatorStore = create((set) => ({
  year: 0,
  month: 0,
  day: 0,
  nextBirthday: "",
  totals: {
    days: 0,
    weeks: 0,
    hours: 0,
    months: 0,
    minutes: 0,
    birthdayDays: 0,
  },
  setAge: (e) => {
    const currentDate = new Date();
    const userDate = new Date(e.target.value);
    const userBirthday = new Date(
      currentDate.getFullYear(),
      userDate.getMonth(),
      userDate.getDate(),
    );
    if (!e.target.value) return;
    if (userBirthday < currentDate) {
      userBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const diffBirthday = userBirthday - currentDate;
    const diffDays = Math.ceil(diffBirthday / (1000 * 60 * 60 * 24));
    const diffMs = currentDate - userDate;
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);

    let y = currentDate.getFullYear() - userDate.getFullYear();
    let m = currentDate.getMonth() - userDate.getMonth();
    let d = currentDate.getDate() - userDate.getDate();

    if (d < 0) {
      m--;
      d += new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    }
    if (m < 0) {
      y--;
      m += 12;
    }
    set({
      nextBirthday: userBirthday.toDateString(),
    });
    set({
      year: y,
      month: m,
      day: d,
    });
    set({
      totals: {
        days: totalDays,
        weeks: totalWeeks,
        hours: Math.floor(totalDays * 24),
        months: Math.floor(totalDays / 30.44),
        minutes: Math.floor(totalDays * 24 * 60),
        birthdayDays: diffDays,
      },
    });
  },
}));

export default ageCalculatorStore;
