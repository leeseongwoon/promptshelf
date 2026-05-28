# PromptShelf Rules

## Purpose

PromptShelf is a platform for discovering, sharing, organizing, and reusing high-quality AI prompts.

The product should feel:

* Fast
* Minimal
* Useful
* Community-driven
* Productivity-focused

Avoid unnecessary complexity.

---

## Design Principles

* Clean and modern UI
* Prioritize readability
* Minimal distractions
* Support dark mode toggle
* Responsive on all devices
* Focus on content over decoration

Use generous spacing and clear typography.

---

## Core UX Rules

Prompt cards must support:

* One-tap copy
* Long-press copy on mobile
* Instant visual feedback after copying
* Smooth and fast interactions

Copying prompts should feel effortless.

---

## Development Rules

* Use TypeScript only
* Use functional components
* Prefer server-side rendering when possible
* Keep components modular and reusable
* Avoid duplicated logic
* Use meaningful naming conventions
* Keep files small and maintainable

---

## Code Style

* Use async/await instead of promise chains
* Prefer early returns
* Avoid deeply nested conditions
* Write self-documenting code
* Add comments only when necessary

---

## UI/UX Rules

* Every action should feel instant
* Keep user flows simple
* Reduce clicks whenever possible
* Optimize for prompt browsing and discovery
* Prioritize mobile usability

---

## Accessibility (A11y)

* All interactive elements must be keyboard accessible
* Ensure visible focus states
* Use semantic HTML (buttons for actions, links for navigation)
* Provide accessible names for icon-only buttons (e.g., copy, favorite)
* Maintain sufficient color contrast in both light and dark mode
* Respect user motion preferences (reduce animation for `prefers-reduced-motion`)

---

## Prompt System

Prompts should support:

* Title
* Description
* Tags
* Categories
* Copy button
* Favorites
* Upvotes
* Author attribution

---

## Community Features

Encourage:

* Sharing
* Remixing
* Saving
* Rating
* Discoverability

Avoid spam-heavy mechanics.

---

## Content & Safety

* Do not encourage harmful, illegal, or unsafe prompt content
* Provide clear reporting and moderation pathways if community features exist
* Avoid dark patterns (forced sign-in, misleading buttons, hidden actions)
* Copy should be direct and non-buzzwordy

---

## SEO Rules

* Optimize all pages for SEO
* Use semantic HTML
* Generate clean URLs
* Add metadata for prompts
* Improve page speed aggressively

---

## Performance Rules

* Lazy load heavy components
* Optimize images
* Minimize client-side JavaScript
* Prefer static generation when possible

---

## Reliability & Error Handling

* Never silently fail user actions (copy/favorite/upvote). Show a clear outcome.
* Prefer optimistic UI for low-risk actions, with rollback on failure.
* Use resilient empty/error/loading states; no blank screens.
* Handle offline/poor network gracefully where feasible.

---

## Security & Privacy

* Never log sensitive user data (emails, tokens, private prompts) to client console or server logs
* Store secrets only in environment variables (never commit `.env` or credentials)
* Validate and sanitize all user inputs on the server
* Protect write actions (create/edit/upvote) against CSRF where applicable
* Use least-privilege access patterns for any external services

---

## Data Model Guidelines

* Stable IDs (avoid index-based keys in UI)
* Prefer explicit, versionable schema for prompts (fields, defaults, migrations)
* Make tagging and categories consistent (normalize casing, avoid duplicates)
* Keep counters (upvotes/favorites) consistent and eventually correct

---

## Testing Expectations

* Critical flows must be covered: browse, view, copy, favorite, upvote, create/edit (if applicable)
* Add regression tests for bugs that reach main
* Prefer deterministic tests (avoid reliance on real time/network where possible)

---

## Observability

* Track key UX metrics: copy success rate, latency, and error rate
* Log server errors with enough context to debug, without leaking sensitive data
* Prefer structured logs and consistent error codes/messages

---

## Git, PRs, and Release Hygiene

* Small, reviewable PRs with clear descriptions and test plan
* Keep commits focused; avoid “misc” commits
* Don’t mix formatting-only changes with behavior changes unless necessary
* Update docs when behavior or user-facing UI changes

---

## Brand Identity

PromptShelf should feel like:

* The GitHub of prompts
* The Pinterest of AI workflows
* A clean toolbox for AI productivity

Tone:

* Smart
* Helpful
* Efficient
* Modern

Avoid:

* Corporate stiffness
* Overly playful UI
* Buzzword-heavy copy

---

## Long-Term Vision

Build the best searchable library of practical AI prompts on the internet.
