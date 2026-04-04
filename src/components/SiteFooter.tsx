'use client';

import { useModeContext } from './ModeProvider';

export function SiteFooter({ backHref }: { backHref?: string }) {
  const { mode } = useModeContext();

  const socialLink =
    mode === 'professional'
      ? { href: 'https://www.linkedin.com/in/kushagra-agarwal/', label: 'LinkedIn' }
      : { href: 'https://x.com/agarwalboi', label: '𝕏' };

  return (
    <footer
      style={{
        marginTop: '5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
      className="divider"
    >
      {backHref ? (
        <a
          href={backHref}
          className="text-muted"
          style={{ fontSize: '0.78rem', textDecoration: 'none' }}
        >
          ← All posts
        </a>
      ) : (
        <span className="text-muted" style={{ fontSize: '0.72rem' }}>
          Built with Claude Code
        </span>
      )}

      <a
        href={socialLink.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted"
        style={{
          fontSize: '0.72rem',
          textDecoration: 'none',
          transition: 'opacity 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.6')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {socialLink.label} ↗
      </a>
    </footer>
  );
}
