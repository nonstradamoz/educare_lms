"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo2 from "@/logos/logo2.png";

// Deterministic particles — fixed values so server & client always match
const PARTICLES = [
  { w: 4, h: 4, l: 10, t: 15, color: 0, dur: 4.2, delay: 0.3 },
  { w: 3, h: 5, l: 25, t: 70, color: 1, dur: 5.1, delay: 1.1 },
  { w: 6, h: 4, l: 40, t: 30, color: 0, dur: 3.8, delay: 0.7 },
  { w: 3, h: 3, l: 55, t: 80, color: 1, dur: 6.0, delay: 0.2 },
  { w: 5, h: 5, l: 70, t: 10, color: 0, dur: 4.5, delay: 1.5 },
  { w: 4, h: 3, l: 85, t: 55, color: 1, dur: 3.5, delay: 0.9 },
  { w: 3, h: 6, l: 15, t: 90, color: 0, dur: 5.3, delay: 0.4 },
  { w: 5, h: 4, l: 60, t: 45, color: 1, dur: 4.8, delay: 1.8 },
  { w: 4, h: 4, l: 78, t: 25, color: 0, dur: 3.2, delay: 0.6 },
  { w: 3, h: 5, l: 32, t: 60, color: 1, dur: 5.7, delay: 1.3 },
  { w: 6, h: 3, l: 92, t: 72, color: 0, dur: 4.1, delay: 0.8 },
  { w: 4, h: 5, l: 48, t: 18, color: 1, dur: 6.2, delay: 0.1 },
  { w: 3, h: 4, l: 5,  t: 48, color: 0, dur: 3.9, delay: 1.6 },
  { w: 5, h: 3, l: 66, t: 88, color: 1, dur: 4.6, delay: 0.5 },
  { w: 4, h: 6, l: 20, t: 35, color: 0, dur: 5.4, delay: 1.0 },
  { w: 3, h: 4, l: 82, t: 5,  color: 1, dur: 3.7, delay: 1.9 },
  { w: 6, h: 4, l: 50, t: 95, color: 0, dur: 4.9, delay: 0.0 },
  { w: 4, h: 5, l: 95, t: 40, color: 1, dur: 5.6, delay: 1.2 },
];

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2400);
    const hideTimer = setTimeout(() => setVisible(false), 3000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #1a2d6b 40%, #0d1b3e 100%)",
        transition: "opacity 600ms ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Deterministic background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${p.w}px`,
              height: `${p.h}px`,
              left: `${p.l}%`,
              top: `${p.t}%`,
              background: p.color === 0 ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.2)",
              animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: "420px",
          height: "420px",
          background: "radial-gradient(circle, rgba(29,78,216,0.2) 0%, transparent 70%)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />

      {/* Spinning arcs */}
      <div
        className="absolute rounded-full border-[3px] border-transparent"
        style={{
          width: "300px",
          height: "300px",
          borderTopColor: "rgba(220,38,38,0.8)",
          borderRightColor: "rgba(220,38,38,0.2)",
          animation: "spin 2s linear infinite",
        }}
      />
      <div
        className="absolute rounded-full border-[2px] border-transparent"
        style={{
          width: "250px",
          height: "250px",
          borderBottomColor: "rgba(255,255,255,0.6)",
          borderLeftColor: "rgba(255,255,255,0.1)",
          animation: "spin 3s linear infinite reverse",
        }}
      />
      <div
        className="absolute rounded-full border-[1px] border-transparent"
        style={{
          width: "340px",
          height: "340px",
          borderTopColor: "rgba(255,255,255,0.15)",
          borderBottomColor: "rgba(220,38,38,0.2)",
          animation: "spin 6s linear infinite",
        }}
      />

      {/* Logo container — enlarged */}
      <div
        className="relative z-10 rounded-full bg-white flex items-center justify-center"
        style={{
          width: "200px",
          height: "200px",
          boxShadow: "0 0 60px rgba(255,255,255,0.2), 0 0 120px rgba(29,78,216,0.25)",
          animation: "logoEntrance 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        <Image
          src={logo2}
          alt="Educare LMS"
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </div>

      {/* Brand name */}
      <div
        className="relative z-10 mt-8 text-center"
        style={{ animation: "fadeUp 0.8s ease 0.4s both" }}
      >
        <h1
          className="text-3xl font-bold tracking-widest"
          style={{
            background: "linear-gradient(90deg, #ffffff 0%, #93c5fd 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.25em",
          }}
        >
          EDUCARE
        </h1>
        <p className="text-xs text-white/40 tracking-[0.3em] mt-1 uppercase">
          Learning Management System
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="relative z-10 mt-10 rounded-full overflow-hidden"
        style={{
          width: "200px",
          height: "3px",
          background: "rgba(255,255,255,0.1)",
          animation: "fadeUp 0.8s ease 0.6s both",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #1d4ed8, #dc2626)",
            animation: "progressFill 2.4s ease forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-18px) scale(1.3); opacity: 0.85; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.12); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes logoEntrance {
          from { transform: scale(0.3) rotate(-12deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </div>
  );
}
