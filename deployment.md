# Deploying to Vercel — Step by Step

## Prerequisites

- A GitHub account (vercel.com uses GitHub for authentication and auto-deploys)
- Node 20+ installed locally (already set up)
- Git installed

---

## Step 1 — Push the project to GitHub

### 1a. Initialize a git repo (if not already done)

```bash
cd /Users/kushagra/Desktop/kush_projects/personal_blog
git init
git add .
git commit -m "initial commit"
```

### 1b. Create a new GitHub repository

Go to https://github.com/new and:
- Name it something like `personal-blog`
- Set it to **Private** (recommended for a personal blog)
- Do **not** check "Add a README file" — you already have one
- Click **Create repository**

### 1c. Push your code

GitHub will show you the commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/personal-blog.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Create a Vercel account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub** — this links your GitHub account directly, which is what enables auto-deploy on every push
4. Authorize Vercel to access your GitHub when prompted
5. You will land on your Vercel dashboard

> The free "Hobby" plan is sufficient for a personal blog. No credit card required.

---

## Step 3 — Import the project into Vercel

1. From your Vercel dashboard, click **Add New → Project**
2. Under "Import Git Repository", find `personal-blog` and click **Import**
   - If you don't see it, click **Adjust GitHub App Permissions** and grant access to the repo
3. Vercel will auto-detect that it's a **Next.js** project — no framework config needed
4. Leave all settings as default:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (leave blank)
   - **Build Command:** `next build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)
5. Click **Deploy**

Vercel will now build and deploy your site. This takes about 30–60 seconds.

---

## Step 4 — Verify the deployment

1. Once the build finishes, Vercel shows a **Congratulations** screen with a preview URL like:
   `https://personal-blog-yourname.vercel.app`
2. Click **Visit** to open your live site
3. Check both modes work:
   - `https://your-url.vercel.app/?mode=professional`
   - `https://your-url.vercel.app/?mode=personal`
4. Click into a blog post to confirm markdown renders correctly

---

## Step 5 — Add a custom domain (optional but recommended)

If you have a domain (e.g. from Namecheap, Cloudflare, Google Domains):

1. In your Vercel project, go to **Settings → Domains**
2. Type your domain (e.g. `kushagra.xyz`) and click **Add**
3. Vercel will show you DNS records to add — either:
   - **A record** pointing to `76.76.21.21` (for apex domains like `kushagra.xyz`)
   - **CNAME record** pointing to `cname.vercel-dns.com` (for subdomains like `blog.kushagra.xyz`)
4. Add these records in your domain registrar's DNS settings
5. DNS propagation takes 5 minutes to 48 hours (usually under 15 minutes with Cloudflare)
6. Vercel automatically provisions an SSL certificate (HTTPS) once the domain is verified

> If you don't have a domain yet, the free `yourname.vercel.app` subdomain works perfectly.

---

## Step 6 — Set up the Node version on Vercel

Since this project requires Node 20, tell Vercel explicitly:

1. In your Vercel project, go to **Settings → General**
2. Scroll to **Node.js Version**
3. Select **20.x** from the dropdown
4. Click **Save**
5. Trigger a redeploy: go to **Deployments → the latest deployment → Redeploy**

Alternatively, add a `.nvmrc` file to your repo so Vercel picks it up automatically:

```bash
echo "20" > .nvmrc
git add .nvmrc
git commit -m "set node version to 20"
git push
```

---

## How to publish a new blog post

This is the everyday workflow once everything is set up:

1. Create a new `.md` file in `posts/professional/` or `posts/personal/`

```
posts/
  professional/
    your-new-post.md   ← add here
  personal/
    your-new-post.md   ← or here
```

2. Use this frontmatter at the top of the file:

```markdown
---
title: "Your Post Title"
date: "2025-04-10"
description: "One sentence summary shown in metadata."
tags: ["tag1", "tag2"]
---

Your content here in standard Markdown...
```

3. Commit and push:

```bash
git add posts/
git commit -m "add: your post title"
git push
```

4. Vercel automatically detects the push and deploys within ~30 seconds. No manual action needed.

---

## Troubleshooting

### Build fails on Vercel

Check the build logs in **Vercel → Deployments → [failed deployment] → View Build Logs**.

Common causes:
- **TypeScript errors** — run `npx tsc --noEmit` locally to catch them before pushing
- **Missing dependency** — make sure all imports exist in `package.json`
- **Wrong Node version** — confirm Node 20.x is selected in Vercel settings (Step 6)

### Site loads but looks unstyled

Tailwind v4 uses a PostCSS plugin. If styles are missing, confirm `postcss.config.mjs` exists:

```bash
ls postcss.config*
```

If it's missing, create it:

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

### Blog post returns 404

The post slug in the URL must exactly match the filename (without `.md`).
- File: `posts/professional/my-post.md` → URL: `/blog/professional/my-post`
- Filenames should use lowercase kebab-case with no spaces

### Fonts not loading

The Google Fonts `@import` in `globals.css` requires an internet connection at build time. Vercel build servers have internet access, so this works automatically. If testing locally without internet, fonts fall back to system fonts gracefully.
