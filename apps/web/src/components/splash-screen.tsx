"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import logo2 from "@/logos/logo2.png";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out after 2.2s, fully unmount after 2.8s
    const fadeTimer = setTimeout(() => setFading(true), 2200);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
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
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? "rgba(220,38,38,0.5)" : "rgba(255,255,255,0.2)",
              animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Outer glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: "340px",
          height: "340px",
          background: "radial-gradient(circle, rgba(29,78,216,0.18) 0%, transparent 70%)",
          animation: "pulse 2s ease-in-out infinite",
        }}
      />

      {/* Spinning decorative arcs */}
      <div
        className="absolute rounded-full border-[3px] border-transparent"
        style={{
          width: "240px",
          height: "240px",
          borderTopColor: "rgba(220,38,38,0.7)",
          borderRightColor: "rgba(220,38,38,0.2)",
          animation: "spin 2s linear infinite",
        }}
      />
      <div
        className="absolute rounded-full border-[2px] border-transparent"
        style={{
          width: "200px",
          height: "200px",
          borderBottomColor: "rgba(255,255,255,0.5)",
          borderLeftColor: "rgba(255,255,255,0.1)",
          animation: "spin 3s linear infinite reverse",
        }}
      />
      <div
        className="absolute rounded-full border-[1px] border-transparent"
        style={{
          width: "270px",
          height: "270px",
          borderTopColor: "rgba(255,255,255,0.15)",
          borderBottomColor: "rgba(220,38,38,0.15)",
          animation: "spin 5s linear infinite",
        }}
      />

      {/* Logo container */}
      <div
        className="relative z-10 rounded-full bg-white flex items-center justify-center"
        style={{
          width: "150px",
          height: "150px",
          boxShadow: "0 0 40px rgba(255,255,255,0.15), 0 0 80px rgba(29,78,216,0.2)",
          animation: "logoEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
      >
        <Image
          src={logo2}
          alt="Educare LMS"
          width={110}
          height={110}
          className="object-contain"
          priority
        />
      </div>

      {/* Brand name */}
      <div
        className="relative z-10 mt-8 text-center"
        style={{
          animation: "fadeUp 0.8s ease 0.4s both",
        }}
      >
        <h1
          className="text-2xl font-bold tracking-wider"
          style={{
            background: "linear-gradient(90deg, #ffffff 0%, #93c5fd 50%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.2em",
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
          width: "160px",
          height: "3px",
          background: "rgba(255,255,255,0.1)",
          animation: "fadeUp 0.8s ease 0.6s both",
        }}
      >
        <div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #1d4ed8, #dc2626)",
            animation: "progressFill 2s ease forwards",
          }}
        />
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to   { transform: translateY(-20px) scale(1.3); opacity: 0.9; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes logoEntrance {
          from { transform: scale(0.4) rotate(-10deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(16px); opacity: 0; }
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
