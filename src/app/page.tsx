import { cookies } from 'next/headers';
import { ModeProvider } from '@/components/ModeProvider';
import { ModeToggle } from '@/components/ModeToggle';
import { HomeContent } from '@/components/HomeContent';
import { SiteFooter } from '@/components/SiteFooter';
import { getAllPosts } from '@/lib/posts';
import type { Mode } from '@/lib/posts';

interface SearchParams {
  mode?: string;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const urlMode = searchParams.mode === 'personal' ? 'personal' : searchParams.mode === 'professional' ? 'professional' : null;

  // Resolve initial mode: URL param → cookie → default professional
  let initialMode: Mode = 'professional';
  if (urlMode) {
    initialMode = urlMode;
  } else {
    try {
      const cookieStore = await cookies();
      const cookieMode = cookieStore.get('blog-mode')?.value;
      if (cookieMode === 'personal' || cookieMode === 'professional') {
        initialMode = cookieMode;
      }
    } catch {}
  }

  const professionalPosts = getAllPosts('professional');
  const personalPosts = getAllPosts('personal');

  return (
    <ModeProvider initialMode={initialMode}>
      <div
        style={{
          minHeight: '100vh',
          maxWidth: '680px',
          margin: '0 auto',
          padding: '3rem 1.5rem 6rem',
        }}
      >
        {/* Header / Nav */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '3.5rem',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '0.88rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              textDecoration: 'none',
            }}
          >
            Kushagra Agarwal
          </a>
          <ModeToggle />
        </header>

        {/* Main content switches by mode */}
        <main>
          <HomeContent
            professionalPosts={professionalPosts}
            personalPosts={personalPosts}
          />
        </main>

        <SiteFooter />
      </div>
    </ModeProvider>
  );
}
