"use client";
export const dynamic = "force-dynamic";

import nextDynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import CardNav from "../../components/CardNav";
import TiltedCard from "../../components/TiltedCard";

const DarkVeil = nextDynamic(() => import("../../components/DarkVeil"), { ssr: false });

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

const servers = [
  {
    slug: "BetterMC-Server",
    title: "BetterMC-Server",
    desc: "Better Minecraft + Custom Mods. Verwaltung & Status.",
    tags: ["1.20.x", "Modded", "Survival"],
    img: "https://picsum.photos/seed/bettermc/800/450",
  },
  // Weitere Server können hier ergänzt werden …
];

export default function MinecraftIndexPage() {
  const [theme, setTheme] = useState("dark");
  const hueShift = theme === "dark" ? 211 : 38;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

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
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-semibold">Minecraft</h1>
            <p className="mt-2 text-sm opacity-80">
              Wähle einen Server für Details, Status und Verwaltung.
            </p>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
            {servers.map((s) => (
              <a
                key={s.slug}
                href={`/minecraft/${s.slug}`}
                className="block w-full max-w-[640px]"
                aria-label={`${s.title} öffnen`}
               >
                <TiltedCard
                  imageSrc={s.img}
                  captionText={s.title}
                  containerHeight="360px"
                  imageHeight="360px"
                  rotateAmplitude={12}
                  scaleOnHover={1.15}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="tilted-overlay-label text-white drop-shadow">
                      {s.title}
                    </div>
                  }
                />
              </a>
            ))}
          </section>
        </main>
      </div>
    </>
  );
}
