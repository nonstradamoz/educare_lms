"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type TrackType = 'TUITION' | 'ENTRANCE';

interface TrackContextType {
  track: TrackType;
  setTrack: (track: TrackType) => void;
}

const TrackContext = createContext<TrackContextType>({
  track: 'TUITION',
  setTrack: () => {},
});

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [track, setTrack] = useState<TrackType>('TUITION');

  useEffect(() => {
    const saved = localStorage.getItem('educare_track') as TrackType;
    if (saved === 'ENTRANCE') {
      setTrack('ENTRANCE');
    }
  }, []);

  const handleSetTrack = (newTrack: TrackType) => {
    setTrack(newTrack);
    localStorage.setItem('educare_track', newTrack);
    // Optionally trigger a page reload so server components refetch with the new header/cookie
    // window.location.reload(); 
  };

  return (
    <TrackContext.Provider value={{ track, setTrack: handleSetTrack }}>
      {children}
    </TrackContext.Provider>
  );
}

export const useTrack = () => useContext(TrackContext);
