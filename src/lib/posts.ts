import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export type Mode = 'professional' | 'personal';

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  description?: string;
  mode: Mode;
  tags?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function getPostSlugs(mode: Mode): string[] {
  const dir = path.join(postsDirectory, mode);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

export function getPostBySlug(mode: Mode, slug: string): Post | null {
  const filePath = path.join(postsDirectory, mode, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    mode,
    title: data.title ?? slug,
    date: formatDate(data.date ?? new Date().toISOString()),
    readTime: data.readTime ?? estimateReadTime(content),
    description: data.description ?? '',
    tags: data.tags ?? [],
    content,
  };
}

export function getAllPosts(mode: Mode): PostMeta[] {
  const slugs = getPostSlugs(mode);
  return slugs
    .map((slug) => {
      const post = getPostBySlug(mode, slug);
      if (!post) return null;
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter(Boolean)
    .sort((a, b) => {
      // Sort by raw date descending
      const filePath = (m: PostMeta) =>
        path.join(postsDirectory, mode, `${m!.slug}.md`);
      const rawA = matter(fs.readFileSync(filePath(a!), 'utf-8')).data.date ?? '';
      const rawB = matter(fs.readFileSync(filePath(b!), 'utf-8')).data.date ?? '';
      return new Date(rawB).getTime() - new Date(rawA).getTime();
    }) as PostMeta[];
}

export async function renderMarkdown(content: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);
  return result.toString();
}
