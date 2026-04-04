---
title: "Spensy: Why I'm Building Another Finance App"
date: "2026-04-04"
description: "Most people don't track their spending — not because they don't care, but because every existing tool makes it their problem. I'm trying to fix that."
tags: ["spensy", "projects","LLM", "fintech"]
---

I've started building a personal finance tracker. I know how that sounds. The space is crowded, the problem is "solved", and the graveyard of abandoned money apps is vast. Let me explain why I'm doing it anyway.

## The real reason people don't track their spending

The conventional wisdom is that people are bad at budgeting because they lack discipline or financial literacy. I don't think that's true. Most people I know are perfectly aware they're spending too much on food delivery or subscriptions — they just don't have a clear, up-to-date picture of *how much*, and maintaining that picture manually is a job in itself.

Every tool I've tried puts the burden on the user. Manual entry apps demand you log every transaction the moment it happens. Bank-linked apps only see one slice of your financial life and break whenever the bank changes its API. SMS-based trackers are a clever hack but SMS is dying — and leaves iPhone users behind.

The frustrating part is that the data already exists. Every transaction I make leaves a digital trail: an email confirmation from Swiggy, a payment receipt from my bank, a PDF statement at the end of the month, a UPI notification. The raw material for a complete financial picture is sitting in my inbox and my downloads folder. It just hasn't been connected.

## What I'm building

Spensy's core idea is simple: connect your email, drop a PDF statement, or upload a screenshot — and every transaction is automatically parsed, categorised, and logged. No manual entry. No dependency on bank APIs. No limitation to specific payment methods or institutions.

The ingestion layer is the entire bet. Gmail via OAuth for continuous email scanning — order confirmations, payment receipts, subscription renewals, investment confirmations. PDF and image upload for bank and credit card statements. Screenshot capture for anything else. An LLM pipeline handles the extraction: merchant, amount, date, category, payment method. A normalisation layer deduplicates across sources so the same transaction doesn't appear twice just because you got both an email receipt and a bank statement entry.

On top of that unified transaction log, the app becomes more useful over time. Category-wise breakdowns, month-over-month trends, a daily spend heatmap. Smart alerts — "you've used 80% of your dining budget and it's the 18th" — powered by patterns in your own data rather than generic thresholds. Anomaly detection for bills that spike unexpectedly. A consolidated view of every subscription and EMI you're paying, with renewal dates, because I've personally been surprised by a renewal I'd forgotten about more times than I'd like to admit.

Savings goals come next: define a target, and the app calculates what you need to set aside monthly, surfaces specific spending categories where cuts would accelerate your progress, and tracks you against the goal over time. Eventually — phase two territory — surplus cash gets routed toward investments: recurring deposits, liquid funds, index fund SIPs, calibrated to a simple risk profile.

## Why the existing options don't cut it

The Indian fintech landscape has some interesting players, but each one solves a narrow version of the problem.

Walnut was genuinely good at SMS-based tracking, but it was acquired and is effectively on life support. Neobanks like Fi and Jupiter have excellent in-app tracking — but only for transactions through their own accounts, which is a fundamental limitation if you bank elsewhere or split spending across multiple cards. CRED is polished but mostly sees credit card spend - and is limited to accounts view via AA APIs where adoption is limited today. Manual-entry apps like Money Manager are fine if you're the kind of person who logs every coffee purchase at the point of sale — I am not that person, and neither is most of my target audience.

The gap is source-agnostic ingestion. A tool that works regardless of which bank you use, which payment method you prefer, or whether your transactions arrive as emails, PDFs, or screenshots. That's the moat I'm trying to build.

## The privacy problem

Financial data is the most sensitive kind of personal data there is. Asking someone to grant email access to a side project is a significant ask, and I take that seriously.

The approach: email access is OAuth-based, read-only, and scoped only to transactional emails. All financial data and PII is encrypted at rest — anyone with database access shouldn't be able to read it in plaintext. Users can revoke email access at any time with immediate effect. No data sold to third parties, ever. DPDP Act compliance from day one, not retrofitted later.

This isn't just a legal checkbox. The product only works if people trust it with sensitive information. Trust has to be the foundation, not an afterthought.

## Where I am

This is early. I'm still in the design and validation phase — building the ingestion pipeline, figuring out how well LLM-based extraction actually works on the messy reality of Indian bank statement PDFs and email receipt formats. The accuracy bar for a financial product is high; you can't have a spending tracker that miscategorises 15% of transactions and expect people to rely on it for decisions.

I'll write more as it develops. For now, this is the problem I'm trying to solve: make financial awareness effortless, so that the people who want a clearer picture of their money don't have to earn it through forty minutes of manual data entry every week.
