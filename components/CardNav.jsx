"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./CardNav.css";

const COLLAPSED_H = 60;
const OPEN_DUR = 560;
const CLOSE_DUR = 360;
const OVERSHOOT_FACTOR = 1.06;
const UNDERSHOOT_FACTOR = 0.975;
const CARD_STAGGER = 120;
const CARD_IN_DUR = 420;
const CARD_OUT_DUR = 260;
const EASE_OUT_SMOOTH = "cubic-bezier(.22,.8,.22,1)";
const EASE_STD = "cubic-bezier(.2,.8,.2,1)";

export default function CardNav({
  logo,
  logoAlt = "Logo",
  items = [],
  className = "",
  baseColor = "rgba(12,16,26,0.65)",
  menuColor = "#e5e7eb",
  buttonBgColor = "rgba(0,0,0,0.5)",
  buttonTextColor = "#fff",
  onToggleTheme,
  activeTheme = "dark",
  accentA = "#f97316",
  accentB = "#60a5fa",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef([]);

  const collapsedH = 60;

  function measureOpenHeight() {
    const nav = navRef.current;
    const content = contentRef.current;
    if (!nav || !content) return collapsedH;

    const prev = {
      vis: content.style.visibility,
      ptr: content.style.pointerEvents,
      pos: content.style.position,
      h: content.style.height,
    };
    content.style.visibility = "visible";
    content.style.pointerEvents = "auto";
    content.style.position = "static";
    content.style.height = "auto";
    // force reflow
    content.offsetHeight; // eslint-disable-line no-unused-expressions
    const full = COLLAPSED_H + content.scrollHeight + 8;

    content.style.visibility = prev.vis;
    content.style.pointerEvents = prev.ptr;
    content.style.position = prev.pos;
    content.style.height = prev.h;

    return full;
  }

  function openMenu() {
    const nav = navRef.current;
    const content = contentRef.current;
    if (!nav || !content) return;

    const full = measureOpenHeight();
    const overshoot = Math.round(full * OVERSHOOT_FACTOR);

    content.style.visibility = "visible";
    content.style.pointerEvents = "auto";

    nav.getAnimations().forEach(a => a.cancel());
    const heightAnim = nav.animate(
      [
        { height: `${COLLAPSED_H}px` },
        { height: `${overshoot}px`, offset: 0.68, easing: EASE_OUT_SMOOTH },
        { height: `${full}px`, easing: EASE_STD },
      ],
      { duration: OPEN_DUR, fill: "forwards" }
    );
    heightAnim.onfinish = () => { nav.style.height = `${full}px`; };

    cardsRef.current.forEach((el, i) => {
      if (!el) return;
      el.getAnimations().forEach(a => a.cancel());
      el.style.clipPath = "inset(100% 0 0 0 round 12px)";
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      el.animate(
        [
          { clipPath: "inset(100% 0 0 0 round 12px)", transform: "translateY(12px)", opacity: 0 },
          { clipPath: "inset(0 0 0 0 round 12px)",   transform: "translateY(0)",    opacity: 1, easing: EASE_OUT_SMOOTH },
        ],
        { duration: CARD_IN_DUR, delay: i * CARD_STAGGER, fill: "forwards" }
      );
    });
  }

  function closeMenu() {
    const nav = navRef.current;
    const content = contentRef.current;
    if (!nav || !content) return;

    const full = measureOpenHeight();
    const undershoot = Math.max(COLLAPSED_H, Math.round(full * UNDERSHOOT_FACTOR));

    cardsRef.current.slice().reverse().forEach((el, idx) => {
      if (!el) return;
      el.getAnimations().forEach(a => a.cancel());
      el.animate(
        [
          { clipPath: "inset(0 0 0 0 round 12px)",   transform: "translateY(0)",  opacity: 1 },
          { clipPath: "inset(100% 0 0 0 round 12px)", transform: "translateY(8px)", opacity: 0, easing: EASE_STD },
        ],
        { duration: CARD_OUT_DUR, delay: idx * (CARD_STAGGER * 0.5), fill: "forwards" }
      );
    });

    nav.getAnimations().forEach(a => a.cancel());
    const anim = nav.animate(
      [
        { height: `${full}px` },
        { height: `${undershoot}px`, offset: 0.35, easing: EASE_STD },
        { height: `${COLLAPSED_H}px`, easing: EASE_STD },
      ],
      { duration: CLOSE_DUR, fill: "forwards" }
    );
    anim.onfinish = () => {
      nav.style.height = `${COLLAPSED_H}px`;
      content.style.visibility = "hidden";
      content.style.pointerEvents = "none";
    };
  }

  const toggle = () => {
    setIsOpen(prev => {
      const next = !prev;
      next ? openMenu() : closeMenu();
      return next;
    });
  };

  useLayoutEffect(() => {
    const nav = navRef.current;
    const content = contentRef.current;
    if (nav) nav.style.height = `${collapsedH}px`;
    if (content) {
      content.style.visibility = "hidden";
      content.style.pointerEvents = "none";
    }
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (!isOpen) return;
      const nav = navRef.current;
      if (!nav) return;
      nav.style.height = `${measureOpenHeight()}px`;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isOpen]);

  const LogoNode = logo ? (
    <img src={logo} alt={logoAlt} className="logo" />
  ) : (
    <div className="logo-fallback">U</div>
  );

  return (
    <div className={`card-nav-container ${className}`}>
      <nav
        ref={navRef}
        className={`card-nav ${isOpen ? "open" : ""}`}
        style={{
          backgroundColor: baseColor,
          ["--accent-a"]: accentA,
          ["--accent-b"]: accentB,
          borderColor: "rgba(255,255,255,0.08)",
        }}
      >
        <div className="card-nav-top">
          <div
            className={`hamburger-menu ${isOpen ? "open" : ""}`}
            onClick={toggle}
            role="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            tabIndex={0}
            style={{ color: menuColor }}
          >
            <div className="hamburger-line" />
            <div className="hamburger-line" />
          </div>

          <div className="logo-container">{LogoNode}</div>

          <button
            type="button"
            className="card-nav-cta-button"
            style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            onClick={() => {
              if (onToggleTheme) {
                const next = activeTheme === "dark" ? "light" : "dark";
                onToggleTheme(next); // <— Parent bekommt den nächsten Mode
              }
            }}
          >
            {onToggleTheme ? (activeTheme === "dark" ? "Light" : "Dark") : "Get Started"}
          </button>
        </div>

        <div ref={contentRef} className="card-nav-content" aria-hidden={!isOpen}>
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card"
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{
                background: "linear-gradient(to bottom right, rgba(255,255,255,0.045), rgba(255,255,255,0.025))",
                color: item.textColor || "#fff",
              }}
            >
              <div className="nav-card-label">{item.label}</div>
              <div className="nav-card-links">
                {(item.links || []).map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link"
                    href={lnk.href || "#"}
                    aria-label={lnk.ariaLabel || lnk.label}
                    target={lnk.target || "_self"}
                    rel={lnk.target === "_blank" ? "noopener noreferrer" : undefined}
                  >
                    <span className="link-text">{lnk.label}</span>
                    <svg aria-hidden="true" className="nav-card-link-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 3h7v7h-2V7.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
