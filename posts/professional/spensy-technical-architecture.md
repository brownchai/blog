---
title: "Building Spensy: Technical Decisions So Far"
date: "2026-04-01"
description: "A walkthrough of the architecture behind Spensy v1 — the stack, the tradeoffs, and what I'd do differently."
tags: ["product", "engineering", "fintech", "AI", "side-project"]
---

Spensy is far enough along now that it makes sense to write down the technical decisions — not as a spec, but as a record of what I chose, why, and what I'd probably reconsider with more time.

## The stack

The backend is FastAPI with async PostgreSQL via SQLAlchemy 2.0 and asyncpg. Server-side rendering with Jinja2. No frontend framework — just custom CSS and HTML templates. Authentication is Google OAuth 2.0 via Authlib.

The honest answer for why I chose Python is familiarity. I move faster in it, and I trust my own debugging instincts more. FastAPI specifically earns its place — the async support is first-class, and the ergonomics are clean enough that the boilerplate stays manageable - that's what Claude told me.

## The core: Claude does the extraction

The product's main bet is that you can hand an LLM a bank statement — as a PDF, an image, or a screenshot — and get structured transaction data back. This turns out to work surprisingly well.

The flow: the user uploads a file, the app encodes it as base64, and sends it to Claude with a system prompt that instructs it to return a structured JSON list of transactions. Each transaction gets a merchant name, amount, date, payment direction, and a category code. If Claude returns malformed JSON, there's a single retry turn that asks it to correct the output.

One decision I'm still not entirely happy with: the in-memory pending state. Extraction results are held in a dict between the upload step and the confirmation step, keyed by session token. It works fine for a single-process deployment, but it won't survive a restart and won't scale to multiple workers without a shared store like Redis or a temporary DB table. It's the right tradeoff for now — simpler to reason about, easy to change later — but it's a known fragility.

## Privacy by design

This is a finance app. People are uploading their actual bank statements. The privacy architecture was not optional.

The approach: Google's OAuth `sub` identifier is never stored raw — it's HMAC-SHA256'd against a server secret before it touches the database. Emails, transaction party names, and descriptions are all encrypted with AES-256-GCM before storage. The nonce is prepended to the ciphertext, so the database holds opaque bytes. Anyone who gets read access to the database can't reconstruct user identities or transaction details without the encryption key.

User-supplied API keys for Claude are stored the same way. This also resolves the cost question neatly: Spensy doesn't pay Anthropic — users bring their own API keys. It keeps the unit economics clean and means I'm not on the hook for API costs as usage grows for now. That said, asking users to source their own API key on day one is real onboarding friction — the kind that loses people before they've seen the product work. The likely fix is a freemium tier where Spensy absorbs a limited number of extractions, with users supplying their own key once they're invested enough to bother.

## Deployment: Railway

I went with Railway from the start. The reasons were cost and simplicity — the free tier is generous for a hobby project, Postgres is a one-click add-on, and the dashboard stays out of your way.

It's not a considered architectural choice. Railway won on ease and price for a project at this stage. If Spensy ever needs to handle real traffic or stricter data residency requirements, this would need to be revisited — but that's a future problem.

## The category system

Transactions are tagged with an 8-digit category code — two reserved prefix digits, two base digits (the broad category), and four detail digits (the subcategory). There are eleven base categories: household, food, transport, health, entertainment, education, finance, travel, income, investment, and uncategorized.

Claude assigns these codes during extraction. The base and detail codes are stored as PostgreSQL generated columns derived from the full code, which keeps filtering and indexing clean without denormalizing the data model.

The current approach works for common transaction types but has obvious limits. Indian bank statements have idiosyncratic merchant naming — the same UPI payee can appear under a dozen different string representations across different statements. Claude handles the obvious cases well, but edge cases leak into "uncategorized" more than I'd like.

## What's next

Three things are on the roadmap.

**Better categorization logic.** Right now, categorization is entirely Claude's inference at extraction time with no feedback loop. Users can see their categories but can't easily correct them at scale, and the system doesn't learn from corrections. The right fix is a merchant resolution layer — a normalized merchant database that maps raw payee strings to known entities — with Claude as the fallback for unknowns. Corrections should feed back into that layer.

**Surfacing insights.** The transaction data exists; the product doesn't yet do much with it. Month-over-month comparisons, subscription detection, spending anomalies, budget tracking against categories — none of this is built yet. The data model is designed to support it (the indexed category and date columns exist for this reason), but the query and display layer is missing. This is the next meaningful user-facing addition.

**Minimising LLM API calls.** Every upload currently sends a full Claude API call. For statements with hundreds of transactions, this is expensive in tokens. The goal is to get smarter about what actually needs to go to Claude: known merchants can be resolved locally, structured PDFs can have transactions extracted deterministically before LLM touch, and batch processing could reduce the number of round-trips for multi-statement uploads. Claude should be the exception handler, not the default path.

The foundation is solid. The next phase is making it genuinely useful rather than just technically functional.