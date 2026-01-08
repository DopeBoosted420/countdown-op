"use client";

import { useState, useEffect } from "react";

export default function Countdown() {
  const [targetDate, setTargetDate] = useState<string>("2026-04-27T06:00");
  const [timeLeft, setTimeLeft] = useState({
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [hasEnded, setHasEnded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // --- Dark Mode initialisieren ---
  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored) setDarkMode(stored === "true");
    else {
      const hour = new Date().getHours();
      setDarkMode(hour < 6 || hour >= 18);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", String(!darkMode));
  };

  // --- Berechnung Monate/Tage/Stunden/Minuten/Sekunden ---
  const calcTimeParts = (target: Date, now: Date) => {
    let months =
      (target.getFullYear() - now.getFullYear()) * 12 +
      (target.getMonth() - now.getMonth());
    if (target.getDate() < now.getDate()) months -= 1;

    // Monat Startdatum nach vollen Monaten
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth() + months,
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    let diffMs = target.getTime() - monthStart.getTime();

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diffMs -= days * 1000 * 60 * 60 * 24;

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    diffMs -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(diffMs / (1000 * 60));
    diffMs -= minutes * 1000 * 60;

    const seconds = Math.floor(diffMs / 1000);

    return { months, days, hours, minutes, seconds };
  };

  // --- Timer Interval ---
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = new Date(targetDate);
      if (now >= target) {
        setHasEnded(true);
        const audio = new Audio("/alarm.mp3");
        audio.play();
      } else {
        setTimeLeft(calcTimeParts(target, now));
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // --- Hintergrund ---
  const hue = Math.floor((timeLeft.seconds % 3600) / 3600 * 360);
  const bgGradient = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
    : "bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100"; // Heller Light Mode

  const textColor = darkMode ? "text-white" : "text-gray-900";
  const cardColor = darkMode ? "bg-gray-800" : "bg-white";

  if (hasEnded) {
    return (
      <div className={`${bgGradient} w-screen h-screen flex items-center justify-center`}>
        <div className="flex flex-col items-center p-4">
          <h1 className={`text-5xl font-bold mb-6 ${textColor} text-center`}>
            🎉 OP 🎉
          </h1>
          <div className="bg-green-600 text-white p-12 rounded-3xl text-5xl font-bold shadow-2xl animate-bounce text-center">
            ✅ Drück mir die Daumen!
          </div>
          <button
            onClick={toggleDarkMode}
            className="mt-6 px-6 py-2 rounded-lg shadow-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgGradient} w-screen min-h-screen flex relative transition-colors duration-1000`}>

      {/* Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Burger Menu */}
      <div className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-xl p-6 z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <h2 className="text-xl font-bold mb-6 ml-10.5 mt-1.5 dark:text-white">⚙️ Optionen</h2>
        <div className="mb-4">
          <label className="text-sm dark:text-gray-200">Datum & Uhrzeit:</label>
          <input
            type="datetime-local"
            className="w-full mt-1 px-2 py-1 rounded-lg shadow-md text-black dark:text-white bg-gray-700 dark:bg-gray-700"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white shadow-md w-full"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
        <button
          onClick={() => setMenuOpen(false)}
          className="px-4 py-2 rounded-lg bg-red-500 text-white shadow-md w-full"
        >
          ❌ Schließen
        </button>
      </div>

      {/* Hauptbereich */}
      <div className="flex-1 flex flex-col items-center justify-center relative">

        {/* Burger Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-6 left-6 z-50 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-md"
        >
          ☰
        </button>

        <h1 className={`text-5xl sm:text-6xl md:text-7xl font-bold mb-8 ${textColor} text-center`}>
          🩺 Zeit bis zur OP 🏳️‍⚧️
        </h1>

        {/* Digitale Anzeige */}
        <div className={`${cardColor} p-6 sm:p-8 rounded-3xl flex flex-wrap justify-center gap-6 text-3xl sm:text-4xl font-bold shadow-2xl`}>
          <div className="flex flex-col items-center">
            <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>{String(timeLeft.months).padStart(2, "0")}</span>
            <span className="text-xs sm:text-sm text-gray-400">Monate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>{String(timeLeft.days).padStart(2, "0")}</span>
            <span className="text-xs sm:text-sm text-gray-400">Tage</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>{String(timeLeft.hours).padStart(2, "0")}</span>
            <span className="text-xs sm:text-sm text-gray-400">Std.</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>{String(timeLeft.minutes).padStart(2, "0")}</span>
            <span className="text-xs sm:text-sm text-gray-400">Min.</span>
          </div>
          <div className="flex flex-col items-center">
            <span className={`${darkMode ? "text-white" : "text-gray-900"}`}>{String(timeLeft.seconds).padStart(2, "0")}</span>
            <span className="text-xs sm:text-sm text-gray-400">Sek.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
