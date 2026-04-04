'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type Mode = 'professional' | 'personal';

interface ModeContextValue {
  mode: Mode;
  setMode: (m: Mode) => void;
}

const ModeContext = createContext<ModeContextValue>({
  mode: 'professional',
  setMode: () => {},
});

export function useModeContext() {
  return useContext(ModeContext);
}

export function ModeProvider({
  children,
  initialMode,
}: {
  children: React.ReactNode;
  initialMode: Mode;
}) {
  const [mode, setModeState] = useState<Mode>(initialMode);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    // persist to localStorage
    try { localStorage.setItem('blog-mode', m); } catch {}
    // update URL param without full navigation
    const url = new URL(window.location.href);
    url.searchParams.set('mode', m);
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Apply body class for CSS theming
  useEffect(() => {
    document.body.classList.remove('mode-professional', 'mode-personal');
    document.body.classList.add(`mode-${mode}`);
  }, [mode]);

  // On mount, check localStorage override
  useEffect(() => {
    try {
      const stored = localStorage.getItem('blog-mode') as Mode | null;
      // URL param takes priority (already captured in initialMode via server)
      // Only use stored if no URL param was present
      const params = new URLSearchParams(window.location.search);
      if (!params.has('mode') && stored && (stored === 'professional' || stored === 'personal')) {
        setModeState(stored);
      }
    } catch {}
  }, []);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}
