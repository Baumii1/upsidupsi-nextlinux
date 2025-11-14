"use client";
export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";
import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import CardNav from "../../../components/CardNav";

const DarkVeil = nextDynamic(() => import("../../../components/DarkVeil"), { ssr: false });

const navItems = [
  {
    label: "Services",
    textColor: "#fff",
    links: [
      { label: "Mailserver", ariaLabel: "Mailserver öffnen", href: "https://mail.upsidupsi.de", target: "_blank" },
      { label: "Bruch Challenge", ariaLabel: "Bruch Challenge Infos", href: "#" },
    ],
  },
  {
    label: "Games",
    textColor: "#fff",
    links: [
      { label: "Eco Server", ariaLabel: "Eco Infos", href: "#" },
      { label: "Minecraft Server", ariaLabel: "Minecraft Infos", href: "/minecraft" },
    ],
  },
  {
    label: "Kontakt",
    textColor: "#fff",
    links: [
      { label: "E-Mail", ariaLabel: "E-Mail schreiben", href: "#" },
      { label: "Twitter", ariaLabel: "Twitter", href: "#" },
      { label: "LinkedIn", ariaLabel: "LinkedIn", href: "#" },
    ],
  },
];

export default function BetterMCPage() {
  const [theme, setTheme] = useState("dark");
  const hueShift = theme === "dark" ? 211 : 38;

  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [cmd, setCmd] = useState("");
  const [consoleOut, setConsoleOut] = useState("");

  // Live-Logs
  const [logs, setLogs] = useState([]);
  const [autoscroll, setAutoscroll] = useState(true);
  const logBoxRef = useRef(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError("");
      const res = await fetch("/api/minecraft/bettermc1/status", { cache: "no-store" });
      const data = await res.json();
      setStatus(data);
    } catch {
      setError("Status konnte nicht geladen werden.");
    }
  }, []);

  const fetchLogs = useCallback(async (count = 200) => {
    try {
      const res = await fetch(`/api/minecraft/bettermc1/logs?lines=${count}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.lines)) setLogs(data.lines);
    } catch {
      /* logs optional – kein globaler Fehler */
    }
  }, []);

  const sendAction = async (action) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/minecraft/bettermc1/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.message || "Fehler");
      setTimeout(() => {
        fetchStatus();
        fetchLogs();
      }, 1200);
    } catch (e) {
      setError(e.message || "Aktion fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const sendConsole = async () => {
    if (!cmd.trim()) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/minecraft/bettermc1/console", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data?.message || "RCON Fehler");
      setConsoleOut((prev) => `${prev}${prev ? "\n" : ""}> ${cmd}\n${(data.output || "").trim()}`);
      setCmd("");
      setTimeout(() => {
        fetchStatus();
        fetchLogs();
      }, 800);
    } catch (e) {
      setError(e.message || "RCON fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const chip = (st) =>
    st === "online"
      ? "inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/15 text-emerald-300 px-3 py-1 text-xs"
      : st === "starting"
      ? "inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/15 text-amber-300 px-3 py-1 text-xs"
      : "inline-flex items-center gap-2 rounded-full border border-zinc-400/20 bg-zinc-500/15 text-zinc-300 px-3 py-1 text-xs";

  // Theme-Klasse
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Polling
  useEffect(() => {
    fetchStatus();
    fetchLogs();
    const i1 = setInterval(fetchStatus, 15000);
    const i2 = setInterval(fetchLogs, 2000);
    return () => {
      clearInterval(i1);
      clearInterval(i2);
    };
  }, [fetchStatus, fetchLogs]);

  // Autoscroll ans Ende, wenn aktiv
  useEffect(() => {
    if (!autoscroll || !logBoxRef.current) return;
    const el = logBoxRef.current;
    el.scrollTop = el.scrollHeight;
  }, [logs, autoscroll]);

  const handleLogScroll = () => {
    if (!logBoxRef.current) return;
    const el = logBoxRef.current;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
    setAutoscroll(atBottom);
  };

  return (
    <>
      <DarkVeil
        hueShift={hueShift}
        noiseIntensity={0}
        scanlineIntensity={0.05}
        scanlineFrequency={0.02}
        warpAmount={2.4}
        speed={0.5}
        resolutionScale={1}
      />

      <div className="app-content relative z-10 min-h-screen pt-28 sm:pt-36">
        <CardNav items={navItems} onToggleTheme={setTheme} activeTheme={theme} />

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-zinc-100">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold">BetterMC-Server</h1>
              <p className="mt-1 text-sm opacity-80">Better Minecraft + Custom Mods</p>
            </div>
            <Link href="/minecraft" className="text-sm opacity-90 underline underline-offset-4">
              Zurück zur Übersicht
            </Link>
          </div>

          <section className="grid gap-6 md:grid-cols-3">
            {/* Status */}
            <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/[0.03] p-5 md:col-span-2">
              <h3 className="text-lg font-medium">Status</h3>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className={chip(status?.state || "unknown")}>
                  <span className="h-2 w-2 rounded-full bg-current inline-block" />
                  {status?.state || "unknown"}
                </span>
                <span className="text-sm opacity-80">
                  {status?.players ?? 0}/{status?.max ?? 0} Spieler
                </span>
                <span className="ml-auto text-xs opacity-70">
                  {status ? `Version: ${status.version ?? "–"} • ${Math.round(status.latency ?? 0)} ms` : "—"}
                </span>
              </div>

              <p className="mt-4 text-sm opacity-80">
                Adresse: <span className="opacity-100">bettermc1.upsidupsi.de:25565</span>
              </p>

              {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
            </div>

            {/* Aktionen */}
            <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/[0.03] p-5">
              <h3 className="text-lg font-medium">Aktionen</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => sendAction("start")}
                  disabled={loading}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-white/25 transition disabled:opacity-50"
                >
                  Start
                </button>
                <button
                  onClick={() => sendAction("stop")}
                  disabled={loading}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-white/25 transition disabled:opacity-50"
                >
                  Stop
                </button>
                <button
                  onClick={() => sendAction("restart")}
                  disabled={loading}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-white/25 transition disabled:opacity-50 col-span-2"
                >
                  Restart
                </button>
              </div>
            </div>
          </section>

          {/* Live-Logs */}
          <section className="mt-6">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 dark:bg-white/[0.03] p-5">
              <div className="mb-3 flex items-center gap-3">
                <h3 className="text-lg font-medium">Live-Logs</h3>
                <span className="text-xs opacity-70">
                  {autoscroll ? "Autoscroll aktiv" : "Autoscroll pausiert"}
                </span>
                {!autoscroll && (
                  <button
                    onClick={() => {
                      setAutoscroll(true);
                      if (logBoxRef.current) logBoxRef.current.scrollTop = logBoxRef.current.scrollHeight;
                    }}
                    className="ml-auto rounded-lg border border-white/15 px-3 py-1 text-xs hover:border-white/25 transition"
                  >
                    Zum Ende
                  </button>
                )}
              </div>

              <div
                ref={logBoxRef}
                onScroll={handleLogScroll}
                className="max-h-[420px] overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs leading-relaxed font-mono whitespace-pre-wrap"
              >
                {logs.length === 0 ? (
                  <div className="opacity-70">Keine Logs geladen…</div>
                ) : (
                  logs.map((line, i) => <div key={i}>{line}</div>)
                )}
              </div>
            </div>
          </section>

          {/* Konsole */}
          <section className="mt-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 dark:bg-white/[0.03] p-5">
              <h3 className="text-lg font-medium">Konsole (RCON)</h3>
              <div className="mt-3 flex gap-2">
                <input
                  value={cmd}
                  onChange={(e) => setCmd(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendConsole()}
                  placeholder="z. B. list, say Hallo, whitelist add <Name>"
                  className="flex-1 rounded-xl border border-white/15 bg-transparent px-3 py-2 text-sm outline-none"
                />
                <button
                  onClick={sendConsole}
                  disabled={loading || !cmd.trim()}
                  className="rounded-xl border border-white/15 px-4 py-2 text-sm hover:border-white/25 transition disabled:opacity-50"
                >
                  Senden
                </button>
              </div>
              {consoleOut && (
                <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-black/30 p-3 text-xs leading-relaxed">
{consoleOut}
                </pre>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
