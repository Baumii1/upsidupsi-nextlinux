"use client";
import { useEffect, useState } from "react";

export default function Header({ onToggleTheme }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("site-theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    document.documentElement.classList.toggle("light", mode === "light");
    localStorage.setItem("site-theme", mode);
  }, [mode]);

  const toggle = () => {
    setMode((m) => (m === "dark" ? "light" : "dark"));
    onToggleTheme && onToggleTheme();
  };

  return (
    <header className="app-content relative z-20 py-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-accentBlue to-accentOrange flex items-center justify-center text-white font-bold">U</div>
          <div>
            <div className="header-title text-white">Upsidupsi Netzwerk</div>
            <div className="text-xs text-white/80">Deine Services — zentral erreichbar</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggle} className="theme-toggle text-sm text-white/90">
            Toggle Theme
          </button>
        </div>
      </div>
    </header>
  );
}
