---
title: "Abstractions That Last"
date: "2025-01-28"
description: "On choosing the right level of abstraction and why premature abstraction costs more than duplication."
tags: ["software design"]
---

There's a moment in every codebase where the cost of abstraction tips from negative to positive. Getting that timing wrong in either direction has real consequences — but the failure modes are different, and we're biased toward one of them.

## The duplication trap is overstated

DRY — Don't Repeat Yourself — is the most misapplied principle in software engineering. The rule is often taught as: *if you see the same code twice, extract it*. The real lesson is: *if you see the same **concept** twice, name it*.

Two functions that look identical may represent entirely different ideas. `calculateTax(amount)` and `calculateDiscount(amount)` might share the same implementation today. Merging them into `applyPercentage(amount, rate)` conflates two concepts that will diverge the moment tax law changes.

```typescript
// Premature abstraction
function applyPercentage(amount: number, rate: number): number {
  return amount * rate;
}

// These should stay separate
function calculateTax(amount: number): number {
  return amount * TAX_RATE;
}

function calculateDiscount(amount: number): number {
  return amount * DISCOUNT_RATE;
}
```

The second version has duplication. It also has clarity, and it lets the two concepts evolve independently.

## What makes an abstraction durable

An abstraction survives if:

1. **It names a real concept** — not a coincidental structural similarity
2. **Its boundary is stable** — the interface changes less than the implementation
3. **It encapsulates the right scope** — neither too small to be useful nor too large to be understood

The standard library is full of examples of durable abstractions. `Array.map` has been stable for decades because it names an essential concept (transform each element) and the interface never needed to change because the concept was right.

## The cost of premature abstraction

When you abstract too early, you pay:

- **Coupling costs**: callers now depend on a generalisation that might not fit their actual need
- **Indirection costs**: future readers have to understand the abstraction to understand any of its uses
- **Rigidity costs**: changing the abstraction requires updating all call sites

These costs compound. The worst codebases I've worked in weren't the ones with duplication — they were the ones with wrong abstractions that couldn't be changed without touching half the system.

## A practical heuristic

Wait for the third time. The first use is just code. The second use might be coincidence. By the third time you're writing structurally similar code for a genuinely similar concept, you have enough information to name it correctly.

The rule is: *copy once, abstract twice*.

This feels wasteful. It isn't. The temporary duplication is the price of understanding the shape of your problem before committing to a structure.
