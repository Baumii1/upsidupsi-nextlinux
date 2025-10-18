"use client";

import DarkVeil from "../components/DarkVeil";
import Header from "../components/Header";
import Image from "next/image";

export default function Page() {
  return (
    <>
      {/* Fullscreen background */}
      <div className="fullscreen-bg">
        <DarkVeil />
      </div>

      {/* Content above background */}
      <div className="app-content relative z-10 min-h-screen">
        <Header />

        <main className="container py-8">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="https://mail.upsidupsi.de" className="card-glass">
              <div className="mb-3 rounded-md overflow-hidden">
                <img src="https://via.placeholder.com/600x300?text=Mailserver" alt="Mailserver" className="w-full h-36 object-cover rounded" />
              </div>
              <h3 className="text-lg font-semibold text-white">Mailserver</h3>
              <p className="text-sm text-white/80">Zugriff auf dein persönliches Postfach und E-Mail Verwaltung.</p>
            </a>

            <a href="#" className="card-glass">
              <div className="mb-3 rounded-md overflow-hidden">
                <img src="https://via.placeholder.com/600x300?text=Minecraft" alt="Minecraft" className="w-full h-36 object-cover rounded" />
              </div>
              <h3 className="text-lg font-semibold text-white">Minecraft Server</h3>
              <p className="text-sm text-white/80">Deine eigene Welt voller Abenteuer – Multiplayer bereit.</p>
            </a>

            <a href="#" className="card-glass">
              <div className="mb-3 rounded-md overflow-hidden">
                <img src="https://via.placeholder.com/600x300?text=Eco" alt="Eco" className="w-full h-36 object-cover rounded" />
              </div>
              <h3 className="text-lg font-semibold text-white">Eco Server</h3>
              <p className="text-sm text-white/80">Gemeinsam eine nachhaltige Zivilisation erschaffen.</p>
            </a>

            <a href="#" className="card-glass">
              <div className="mb-3 rounded-md overflow-hidden">
                <img src="https://via.placeholder.com/600x300?text=Bruch+Challenge" alt="Bruch" className="w-full h-36 object-cover rounded" />
              </div>
              <h3 className="text-lg font-semibold text-white">Bruch Challenge Hub</h3>
              <p className="text-sm text-white/80">Live Fortschritt & Status aller Challenge-Spiele.</p>
            </a>
          </section>
        </main>
      </div>
    </>
  );
}
