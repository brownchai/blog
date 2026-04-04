'use client';

import Link from 'next/link';
import { useModeContext } from './ModeProvider';
import type { PostMeta } from '@/lib/posts';

interface HomeContentProps {
  professionalPosts: PostMeta[];
  personalPosts: PostMeta[];
}

function PostList({ posts, mode }: { posts: PostMeta[]; mode: 'professional' | 'personal' }) {
  if (posts.length === 0) {
    return (
      <p className="text-muted" style={{ fontSize: '0.85rem', paddingTop: '1rem' }}>
        No posts yet.
      </p>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${mode}/${post.slug}`}
          className="post-item"
        >
          <span className="post-title">
            {mode === 'personal' && <span className="accent" style={{ marginRight: '0.5rem' }}>✦</span>}
            {post.title}
          </span>
          <span className="post-meta text-muted">
            {post.readTime} &middot; {post.date}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function HomeContent({ professionalPosts, personalPosts }: HomeContentProps) {
  const { mode } = useModeContext();

  return (
    <div>
      {/* About section */}
      <section style={{ marginBottom: '3rem' }}>
        {mode === 'professional' ? (
          <div className="fade-in">
            <p style={{ fontSize: '0.95rem', lineHeight: '1.75', maxWidth: '560px' }}>
              Product manager in fintech. I&apos;ve spent years building the plumbing that
              moves money — enterprise-grade transaction processing infrastructure and
              consumer payment apps used by millions. Lately I&apos;ve been thinking hard
              about what happens when LLMs get dropped into that stack: where they help,
              where they break, and what it takes to ship AI features responsibly in
              regulated industries.
            </p>
          </div>
        ) : (
          <div className="fade-in">
            <p
              style={{
                fontSize: '1rem',
                lineHeight: '1.8',
                maxWidth: '560px',
                fontFamily: "'Lora', Georgia, serif",
              }}
            >
              There&apos;s a version of me that exists outside of product specs and roadmaps.
              This is where that version writes — about books, slow mornings, travel that
              doesn&apos;t go according to plan, and whatever else I can&apos;t stop thinking about.
            </p>
          </div>
        )}
      </section>

      {/* Posts section */}
      <section>
        <p
          className="section-label"
          style={{ fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}
        >
          {mode === 'professional' ? 'Writing' : 'Personal Essays'}
        </p>
        <PostList posts={mode === 'professional' ? professionalPosts : personalPosts} mode={mode} />
      </section>
    </div>
  );
}
