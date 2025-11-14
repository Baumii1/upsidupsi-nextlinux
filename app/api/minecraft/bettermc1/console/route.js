export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { Rcon } from "rcon-client";
import net from "node:net";

const RCON_HOST = process.env.MC_BETTERMC1_HOST || "127.0.0.1";
const RCON_PORT = Number(process.env.MC_BETTERMC1_PORT || "25575");
const RCON_PASS = process.env.MC_BETTERMC1_RCON;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function portOpen(host, port, timeoutMs = 600) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host, port });
    let done = false;
    const finish = (ok) => { if (!done) { done = true; try { s.destroy(); } catch {} resolve(ok); } };
    s.setTimeout(timeoutMs);
    s.on("connect", () => finish(true));
    s.on("timeout", () => finish(false));
    s.on("error", () => finish(false));
  });
}

export async function POST(req) {
  try {
    const { cmd } = await req.json();
    if (!cmd || typeof cmd !== "string" || cmd.length > 200) {
      return new Response(JSON.stringify({ ok: false, message: "Ungültiger Befehl" }), { status: 400 });
    }
    if (!RCON_PASS) {
      return new Response(JSON.stringify({ ok: false, message: "RCON Passwort (MC_BETTERMC1_RCON) fehlt" }), { status: 500 });
    }

    // nach Restart kurz warten, bis RCON Port offen ist
    for (let i = 0; i < 10; i++) {
      if (await portOpen(RCON_HOST, RCON_PORT, 400)) break;
      await sleep(300);
    }

    const rcon = await Rcon.connect({
      host: RCON_HOST,
      port: RCON_PORT,
      password: RCON_PASS,
      timeout: 2000,
    });

    const resp = await rcon.send(cmd);
    await rcon.end();

    return Response.json({ ok: true, output: (resp ?? "").toString() });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, message: err?.message || "RCON Fehler" }), { status: 500 });
  }
}
