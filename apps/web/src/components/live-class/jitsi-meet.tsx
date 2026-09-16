"use client";

import { useEffect, useRef } from "react";

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  onClose?: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (
      domain: string,
      options: Record<string, unknown>
    ) => { dispose: () => void };
  }
}

export function JitsiMeet({ roomName, displayName, onClose }: JitsiMeetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => {
    const domain = "meet.jit.si";

    const loadJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

      apiRef.current = new window.JitsiMeetExternalAPI(domain, {
        roomName: `educare-${roomName.toLowerCase().replace(/\s+/g, "-")}`,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          disableDeepLinking: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone", "camera", "desktop", "chat",
            "raisehand", "participants-pane", "tileview",
            "videoquality", "filmstrip", "shortcuts", "hangup",
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          BRAND_WATERMARK_LINK: "",
          DEFAULT_BACKGROUND: "#0162b1",
        },
      });

      apiRef.current;
    };

    // Load Jitsi script if not already loaded
    if (window.JitsiMeetExternalAPI) {
      loadJitsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = loadJitsi;
      document.head.appendChild(script);
    }

    return () => {
      apiRef.current?.dispose();
    };
  }, [roomName, displayName]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#111] shadow-xl">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
