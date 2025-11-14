export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);

const SUDO = "/usr/bin/sudo";
const SYSTEMCTL = "/usr/bin/systemctl";

const ALLOWED = new Set(["start", "stop", "restart"]);

export async function POST(req) {
  try {
    const { action } = await req.json();
    if (!ALLOWED.has(action)) {
      return new Response(JSON.stringify({ ok: false, message: "Ungültige Aktion" }), { status: 400 });
    }

    const args = {
      start: [SYSTEMCTL, "start", "mc-bettermc1.service"],
      stop: [SYSTEMCTL, "stop", "mc-bettermc1.service"],
      restart: [SYSTEMCTL, "restart", "mc-bettermc1.service"],
    }[action];

    await execFileAsync(SUDO, args, { timeout: 30_000 });
    return Response.json({ ok: true });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, message: err?.message || "Fehler" }), { status: 500 });
  }
}
