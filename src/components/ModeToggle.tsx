'use client';

import { useModeContext } from './ModeProvider';

export function ModeToggle() {
  const { mode, setMode } = useModeContext();

  return (
    <button
      className="toggle-btn"
      aria-label="Toggle between professional and personal mode"
      onClick={() => setMode(mode === 'professional' ? 'personal' : 'professional')}
    >
      <span className={`toggle-segment ${mode === 'professional' ? 'active-segment' : ''}`}>
        <span>⚙</span>
        <span>Professional</span>
      </span>
      <span className="toggle-divider" aria-hidden="true" />
      <span className={`toggle-segment ${mode === 'personal' ? 'active-segment' : ''}`}>
        <span>✦</span>
        <span>Personal</span>
      </span>
    </button>
  );
}
