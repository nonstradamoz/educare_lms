"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo2 from "@/logos/logo2.png";

// Deterministic star field — server & client always match
const STARS = [
  { x: 5,  y: 12, s: 1.5, o: 0.6, d: 2.1 }, { x: 18, y: 45, s: 1,   o: 0.4, d: 3.2 },
  { x: 30, y: 8,  s: 2,   o: 0.7, d: 1.8 }, { x: 42, y: 72, s: 1.5, o: 0.5, d: 2.7 },
  { x: 55, y: 20, s: 1,   o: 0.3, d: 4.1 }, { x: 68, y: 88, s: 2,   o: 0.6, d: 2.4 },
  { x: 78, y: 35, s: 1.5, o: 0.4, d: 3.5 }, { x: 90, y: 60, s: 1,   o: 0.7, d: 1.9 },
  { x: 12, y: 80, s: 2,   o: 0.5, d: 2.8 }, { x: 25, y: 55, s: 1,   o: 0.4, d: 3.9 },
  { x: 48, y: 92, s: 1.5, o: 0.6, d: 2.2 }, { x: 62, y: 5,  s: 1,   o: 0.3, d: 4.4 },
  { x: 75, y: 78, s: 2,   o: 0.5, d: 1.7 }, { x: 88, y: 18, s: 1.5, o: 0.7, d: 3.1 },
  { x: 8,  y: 38, s: 1,   o: 0.4, d: 2.6 }, { x: 35, y: 65, s: 2,   o: 0.6, d: 1.5 },
  { x: 52, y: 42, s: 1.5, o: 0.3, d: 4.0 }, { x: 82, y: 50, s: 1,   o: 0.5, d: 2.9 },
  { x: 95, y: 28, s: 2,   o: 0.6, d: 1.6 }, { x: 20, y: 95, s: 1,   o: 0.4, d: 3.3 },
  { x: 65, y: 30, s: 1.5, o: 0.7, d: 2.0 }, { x: 40, y: 15, s: 1,   o: 0.3, d: 4.2 },
  { x: 72, y: 92, s: 2,   o: 0.5, d: 2.5 }, { x: 15, y: 62, s: 1.5, o: 0.6, d: 3.6 },
];

// SVG ring circumference for a r=90 circle
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SplashScreen() {
  const [mounted, setMounted]   = useState(false);
  const [visible, setVisible]   = useState(true);
  const [fading,  setFading]    = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Animate the SVG progress ring
    const start = performance.now();
    const duration = 2600;
    const raf = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min(elapsed / duration, 1));
      if (elapsed < duration) requestAnimationFrame(raf);
    };
    const id = requestAnimationFrame(raf);

    const fadeTimer = setTimeout(() => setFading(true), 2800);
    const hideTimer = setTimeout(() => setVisible(false), 3400);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #0f2460 0%, #07122e 55%, #000816 100%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 600ms cubic-bezier(0.4,0,0.2,1)",
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* ── Star field ── */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${s.s}px`,
              height: `${s.s}px`,
              left: `${s.x}%`,
              top: `${s.y}%`,
              opacity: s.o,
              animation: `twinkle ${s.d}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Ambient glows ── */}
      <div className="absolute pointer-events-none" style={{
        width: "600px", height: "600px",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)",
        animation: "breathe 3s ease-in-out infinite",
      }} />
      <div className="absolute pointer-events-none" style={{
        width: "300px", height: "300px",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)",
        animation: "breathe 3s ease-in-out 1.5s infinite",
      }} />

      {/* ── Tilted orbital rings ── */}
      <div className="absolute pointer-events-none" style={{
        width: "380px", height: "380px",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%) rotateX(75deg)",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.07)",
        animation: "orbitSpin 8s linear infinite",
      }}>
        {/* Dot on the orbit */}
        <div style={{
          position: "absolute", top: "-4px", left: "calc(50% - 4px)",
          width: "8px", height: "8px", borderRadius: "50%",
          background: "rgba(220,38,38,0.8)",
          boxShadow: "0 0 10px rgba(220,38,38,0.8)",
        }} />
      </div>
      <div className="absolute pointer-events-none" style={{
        width: "320px", height: "320px",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%) rotateX(75deg) rotateZ(60deg)",
        borderRadius: "50%",
        border: "1px solid rgba(255,255,255,0.05)",
        animation: "orbitSpin 12s linear infinite reverse",
      }}>
        <div style={{
          position: "absolute", top: "-3px", left: "calc(50% - 3px)",
          width: "6px", height: "6px", borderRadius: "50%",
          background: "rgba(255,255,255,0.6)",
          boxShadow: "0 0 8px rgba(255,255,255,0.6)",
        }} />
      </div>

      {/* ── SVG countdown ring + Logo ── */}
      <div className="relative z-10" style={{ width: "220px", height: "220px" }}>
        {/* SVG ring */}
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          className="absolute inset-0"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* track */}
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
          />
          {/* red fill segment */}
          <circle
            cx="110" cy="110" r={RADIUS}
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={mounted ? dashOffset : CIRCUMFERENCE}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
        </svg>

        {/* Inner logo circle */}
        <div
          className="absolute rounded-full bg-white flex items-center justify-center"
          style={{
            inset: "16px",
            boxShadow: "0 0 40px rgba(255,255,255,0.12), 0 0 80px rgba(29,78,216,0.2)",
            animation: "logoEntrance 0.9s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
        >
          <Image
            src={logo2}
            alt="Educare LMS"
            width={145}
            height={145}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* ── Brand name with letter-spacing reveal ── */}
      <div
        className="relative z-10 mt-8 text-center"
        style={{ animation: "fadeUp 0.9s ease 0.5s both" }}
      >
        <h1
          className="font-bold"
          style={{
            fontSize: "28px",
            letterSpacing: "0.35em",
            background: "linear-gradient(90deg, #93c5fd 0%, #ffffff 40%, #fca5a5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 3s linear infinite",
            backgroundSize: "200% auto",
          }}
        >
          EDUCARE
        </h1>
        <p className="text-white/35 text-[11px] tracking-[0.4em] uppercase mt-2">
          Group of Institutions
        </p>
      </div>

      {/* ── Thin horizontal line + percentage ── */}
      <div
        className="relative z-10 mt-8 flex flex-col items-center gap-2"
        style={{ animation: "fadeUp 0.9s ease 0.7s both" }}
      >
        <div className="relative rounded-full overflow-hidden" style={{ width: "180px", height: "2px", background: "rgba(255,255,255,0.08)" }}>
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#1d4ed8,#dc2626)",
              width: mounted ? `${Math.round(progress * 100)}%` : "0%",
              transition: "width 0.05s linear",
            }}
          />
        </div>
        <span className="text-white/25 text-[10px] tracking-widest font-mono">
          {mounted ? `${Math.round(progress * 100)}%` : "0%"}
        </span>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes twinkle   { from { opacity: 0.2; transform: scale(0.8); } to { opacity: 0.9; transform: scale(1.4); } }
        @keyframes breathe   { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.15); } }
        @keyframes orbitSpin { from { transform: translate(-50%,-50%) rotateX(75deg) rotateZ(0deg); } to { transform: translate(-50%,-50%) rotateX(75deg) rotateZ(360deg); } }
        @keyframes logoEntrance { from { transform: scale(0.2) rotate(-8deg); opacity: 0; } to { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes fadeUp    { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes shimmer   { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
      `}</style>
    </div>
  );
}
