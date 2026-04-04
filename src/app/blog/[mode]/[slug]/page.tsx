import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getPostSlugs, renderMarkdown } from '@/lib/posts';
import { ModeProvider } from '@/components/ModeProvider';
import { ModeToggle } from '@/components/ModeToggle';
import { SiteFooter } from '@/components/SiteFooter';
import type { Mode } from '@/lib/posts';
import type { Metadata } from 'next';

interface Params {
  mode: string;
  slug: string;
}

export async function generateStaticParams() {
  const professional = getPostSlugs('professional').map((slug) => ({
    mode: 'professional',
    slug,
  }));
  const personal = getPostSlugs('personal').map((slug) => ({
    mode: 'personal',
    slug,
  }));
  return [...professional, ...personal];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { mode, slug } = params;
  if (mode !== 'professional' && mode !== 'personal') return {};
  const post = getPostBySlug(mode as Mode, slug);
  if (!post) return {};
  return {
    title: `${post.title} — Kushagra`,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Params;
}) {
  const { mode, slug } = params;

  if (mode !== 'professional' && mode !== 'personal') notFound();

  const post = getPostBySlug(mode as Mode, slug);
  if (!post) notFound();

  const html = await renderMarkdown(post.content);

  return (
    <ModeProvider initialMode={mode as Mode}>
      <div
        style={{
          minHeight: '100vh',
          maxWidth: '680px',
          margin: '0 auto',
          padding: '3rem 1.5rem 6rem',
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '3.5rem',
          }}
        >
          <Link
            href={`/?mode=${mode}`}
            style={{
              fontSize: '0.88rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              textDecoration: 'none',
            }}
          >
            Kushagra
          </Link>
          <ModeToggle />
        </header>

        {/* Back link */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href={`/?mode=${mode}`}
            className="text-muted"
            style={{
              fontSize: '0.8rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'opacity 0.15s ease',
            }}
          >
            ← Back
          </Link>
        </div>

        {/* Post header */}
        <div style={{ marginBottom: '3rem' }}>
          {mode === 'personal' && (
            <p className="accent" style={{ fontSize: '0.8rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              ✦ Personal
            </p>
          )}
          {mode === 'professional' && (
            <p className="text-muted" style={{ fontSize: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              ⚙ Professional
            </p>
          )}
          <h1
            style={{
              fontSize: '1.8rem',
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              fontFamily: mode === 'personal' ? "'Lora', Georgia, serif" : "'Inter', sans-serif",
            }}
          >
            {post.title}
          </h1>
          <div
            className="text-muted"
            style={{ fontSize: '0.78rem', display: 'flex', gap: '12px', alignItems: 'center' }}
          >
            <span>{post.date}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{post.readTime}</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span style={{ opacity: 0.4 }}>·</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="accent"
                    style={{ fontSize: '0.7rem', opacity: 0.8 }}
                  >
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="divider" style={{ border: 'none', borderTop: '1px solid', marginBottom: '2.5rem' }} />

        {/* Post body */}
        <article
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <SiteFooter backHref={`/?mode=${mode}`} />
      </div>
    </ModeProvider>
  );
}
