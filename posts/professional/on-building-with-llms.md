---
title: "On Building with LLMs: What Nobody Tells You"
date: "2025-03-15"
description: "Real lessons from shipping production AI features — the parts that don't make it into the blog posts."
tags: ["AI", "engineering"]
---

Over the past year I've shipped three different LLM-powered features into production. Each one taught me something that none of the tutorials I read had mentioned. Here's what actually matters.

## Evals are your only ground truth

Everyone tells you to write evals. What they don't tell you is *what to evaluate*, or more precisely, that your eval suite is a bet on what the user actually cares about.

The first feature I shipped was a document summarisation tool. I optimised for ROUGE scores against a human-written reference set. The users hated it. They wanted bullet points; the references were prose. The metric was technically correct and practically useless.

> The eval you write reflects the problem you understand. If your understanding is wrong, a passing eval score is actively misleading.

## Latency is a product decision disguised as an engineering problem

A 3-second p50 response time sounds acceptable until you watch a user type a follow-up question halfway through reading the first response. Streaming buys you a lot, but streaming a bad answer fast is still a bad answer.

The real question is: what's the unit of user value? If it's a complete thought, don't stream sentence fragments. If it's an incrementally-useful list, stream items.

## Context is money

Token costs feel abstract until you have a feature that passes the entire conversation history on every request. At scale, a 4x context window usage doesn't just cost 4x — it also compounds into slower responses and tighter rate limits.

The discipline of context management — deciding what to keep, summarise, or discard — is the most underrated skill in LLM engineering right now.

## The model is not the product

Six months into building, I realised I'd been optimising the wrong thing. The model quality accounts for maybe 30% of the user experience. The other 70% is:

- How you frame the task in the prompt
- How you handle errors gracefully
- How fast the UI responds
- Whether users trust the output enough to act on it

Trust is the hardest part. Users will use a slightly worse answer they trust over a better one they don't.

## What I'd do differently

Start with the eval suite before writing a single line of feature code. Define "good" in concrete, measurable terms. Build the simplest possible version first and let the evals tell you what to improve.

The models are improving fast enough that yesterday's hard problem is today's solved one. The durable skill is knowing how to ask the right question.
