"use client";

import { useEffect, useState, useCallback } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useRoomContext,
  useTracks,
  TrackLoop,
  ParticipantTile,
  ControlBar,
  GridLayout,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { fetchApi } from "@/lib/api";
import { Loader2, WifiOff } from "lucide-react";

interface LiveKitRoomProps {
  roomId: string;
  identity: string;
  name: string;
  role: string;
  onLeave: () => void;
}

interface TokenResponse {
  token: string;
  wsUrl: string;
}

export function LiveKitClassRoom({ roomId, identity, name, role, onLeave }: LiveKitRoomProps) {
  const [tokenData, setTokenData] = useState<TokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    try {
      const data = await fetchApi<TokenResponse>(
        `/live-class/token?roomId=${encodeURIComponent(roomId)}&identity=${encodeURIComponent(identity)}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}`
      );
      setTokenData(data);
    } catch (e: any) {
      setError(e.message || "Failed to connect to the classroom.");
    }
  }, [roomId, identity, name, role]);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
        <WifiOff className="h-10 w-10 text-red-400" />
        <p className="text-sm text-white/70">{error}</p>
        <button
          onClick={fetchToken}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-white">
        <Loader2 className="h-7 w-7 animate-spin text-brand-blue" />
        <p className="text-xs text-white/50">Joining classroom...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={tokenData.token}
      serverUrl={tokenData.wsUrl}
      connect={true}
      video={role !== "STUDENT"}
      audio={role !== "STUDENT"}
      onDisconnected={onLeave}
      className="h-full w-full"
      style={{ "--lk-bg": "#0f0f1a" } as React.CSSProperties}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
