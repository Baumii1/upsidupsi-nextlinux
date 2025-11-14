// Dependencies: npm i minecraft-server-util
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { status as pingStatus } from "minecraft-server-util";
const execFileAsync = promisify(execFile);

const SUDO = "/usr/bin/sudo";
const SYSTEMCTL = "/usr/bin/systemctl";
const JOURNALCTL = "/usr/bin/journalctl";

// Wenn dein MC server-ip gesetzt ist, ggf. hier statt 127.0.0.1 diese IP nutzen
const HOST = "bettermc1.upsidupsi.de";
const PORT = 25565;

export async function GET() {
  let sysState = "unknown";
  let logs = "";

  // systemd state
  try {
    const { stdout } = await execFileAsync(SUDO, [SYSTEMCTL, "is-active", "mc-bettermc1.service"], { timeout: 10_000 });
    sysState = stdout.trim(); // active|inactive|failed|activating...
  } catch {}

  // letzte Logs (optional)
  try {
    const { stdout } = await execFileAsync(SUDO, [JOURNALCTL, "-u", "mc-bettermc1.service", "-n", "50", "--no-pager"], {
      timeout: 10_000,
    });
    logs = stdout ?? "";
  } catch {}

  // TCP Server List Ping (read-only)
  let ping = null;
  try {
    ping = await pingStatus(HOST, PORT, { timeout: 1500, enableSRV: false });
  } catch {
    // ping bleibt null, wenn (noch) nicht erreichbar
  }

  const players = ping?.players?.online ?? 0;
  const max = ping?.players?.max ?? 0;
  const motd = Array.isArray(ping?.motd?.clean) ? ping.motd.clean.join(" ") : ping?.motd?.clean ?? "";
  const version = ping?.version?.name ?? null;
  const latency = ping?.roundTripLatency ?? null;

  let state = "offline";
  if (sysState === "active" && !ping) state = "starting";
  else if (ping) state = "online";
  else if (sysState === "inactive") state = "offline";
  else state = sysState; // failed/activating/unknown

  return Response.json({ state, players, max, motd, version, latency, logs });
}
