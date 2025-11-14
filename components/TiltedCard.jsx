"use client";
import { useRef, useEffect } from "react";
import "./TiltedCard.css";

/**
 * TiltedCard – vanilla React version (no external motion libraries)
 * Props bleiben kompatibel zum Template.
 */
export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "360px",
  containerWidth = "100%",
  imageHeight = "360px",
  imageWidth = "100%",
  scaleOnHover = 1.12,
  rotateAmplitude = 12,
  showMobileWarning = false,
  showTooltip = false,
  overlayContent = null,
  displayOverlayContent = false,
}) {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const captionRef = useRef(null);
  const rafRef = useRef(null);

  // simple spring-ish smoothing
  const target = useRef({ rx: 0, ry: 0, s: 1, x: 0, y: 0, capRot: 0, capOpacity: 0 });
  const current = useRef({ rx: 0, ry: 0, s: 1, x: 0, y: 0, capRot: 0, capOpacity: 0 });
  const lastY = useRef(0);

  function applyStyles() {
    const el = innerRef.current;
    if (!el) return;
    el.style.transform = `rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg) scale(${current.current.s})`;
    if (showTooltip && captionRef.current) {
      const cap = captionRef.current;
      cap.style.transform = `translate(${current.current.x}px, ${current.current.y}px) rotate(${current.current.capRot}deg)`;
      cap.style.opacity = String(current.current.capOpacity);
    }
  }

  function tick() {
    // lerp
    const lerp = (a, b, t) => a + (b - a) * t;
    current.current.rx = lerp(current.current.rx, target.current.rx, 0.12);
    current.current.ry = lerp(current.current.ry, target.current.ry, 0.12);
    current.current.s = lerp(current.current.s, target.current.s, 0.12);
    current.current.x = lerp(current.current.x, target.current.x, 0.18);
    current.current.y = lerp(current.current.y, target.current.y, 0.18);
    current.current.capRot = lerp(current.current.capRot, target.current.capRot, 0.18);
    current.current.capOpacity = lerp(current.current.capOpacity, target.current.capOpacity, 0.18);

    applyStyles();
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleMouse(e) {
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rx = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const ry = (offsetX / (rect.width / 2)) * rotateAmplitude;

    target.current.rx = rx;
    target.current.ry = ry;
    target.current.x = e.clientX - rect.left;
    target.current.y = e.clientY - rect.top;

    const velY = offsetY - lastY.current;
    target.current.capRot = -velY * 0.6;
    lastY.current = offsetY;
  }

  function handleMouseEnter() {
    target.current.s = scaleOnHover;
    target.current.capOpacity = 1;
  }

  function handleMouseLeave() {
    target.current.s = 1;
    target.current.rx = 0;
    target.current.ry = 0;
    target.current.capOpacity = 0;
    target.current.capRot = 0;
  }

  return (
    <figure
      ref={rootRef}
      className="tilted-card-figure"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="tilted-card-mobile-alert">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <div
        ref={innerRef}
        className="tilted-card-inner"
        style={{ width: imageWidth, height: imageHeight }}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="tilted-card-img"
          style={{ width: imageWidth, height: imageHeight }}
        />

        {displayOverlayContent && overlayContent && (
          <div className="tilted-card-overlay">{overlayContent}</div>
        )}
      </div>

      {showTooltip && (
        <figcaption ref={captionRef} className="tilted-card-caption">
          {captionText}
        </figcaption>
      )}
    </figure>
  );
}
