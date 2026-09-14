# Scooped — AI Assistant Briefing

You are working on **Scooped**, an ice cream discovery app. Read this whole file before touching anything.

## What the app is

"Real-time flavor availability near you." Users find which exact flavors are scoopable at shops nearby, right now — that availability data is the entire point of the product ("the money of this app"). Social features (check-ins, flavor duels, taste onboarding, alerts) exist to generate and refresh availability data.

- Live site: https://scooped-six.vercel.app (auto-deploys on every push to `main`)
- Repo: https://github.com/batmaxt/scooped, local at `~/dev/scooped`
- Launch target: April/May 2027 (opening day of ice cream season). Currently in build + private field-testing phase.

## The owner

Mat is a non-technical founder. Communicate accordingly:
- Give click-by-click instructions for anything he must do himself (dashboards, phone, etc.)
- He cannot run terminal commands from memory; give exact copy-paste commands, one per step
- He QAs the live app constantly and fires terse corrections ("that's lame", "kill it") — treat them as product rulings, execute immediately, don't argue
- Accuracy obsession: "err on the side of accuracy and efficiency — redundancy is murder"

## Stack

- Next.js 16 App Router, client components, Tailwind v4, TanStack Query, zustand
- Supabase (project `xuaeycylayiimocwnjix`): Postgres + PostGIS, RLS, RPCs
- Google Maps via @vis.gl/react-google-maps; marker clustering
- Vercel hosting; all 8 env vars are set correctly (see `.env.local` locally — NEVER paste its contents into a cloud chat or commit it)

## Critical constraints

1. **The anon key cannot write to the database.** All data changes (seeds, deletes, fixes) are delivered as SQL files the owner pastes into the Supabase dashboard SQL Editor. Write idempotent SQL (ON CONFLICT DO NOTHING, NOT EXISTS guards), inline every condition (no temp tables — the dashboard runs statements on separate connections), and include a result-check SELECT at the end.
2. **Typecheck before every commit:** `export PATH="/opt/homebrew/bin:$PATH" && npx tsc --noEmit 2>&1 | grep -v ".next/types"`
3. **Pushing to `main` deploys to production immediately.** There is no staging.
4. Supabase REST caps at 1000 rows/request — paginate with Range headers for counts.

## Product doctrine (owner rulings — do not violate)

- **Geography: Long Island + NYC (5 boros) ONLY.** No NJ, CT, or upstate NY.
- **Scoop shops only.** No supermarkets/retail (dormant until Phase 3), no brand-level features.
- **Real ice cream only.** NO frozen yogurt, NO italian ices, no cookie bars/candy/crepe shops. Gelato and sorbet are in.
- **"Nearby" = 5 miles** — but flavor SEARCH points beyond the zone: closest-first across the whole territory ("worth the trip").
- **Flavor alerts are name-agnostic** (match flavor NAME across all shops/brands; migration 00016). The novelty is "lemon custard popping up at a place you never heard of."
- **Flavors are shop-agnostic in pickers**: dedupe by `flavorNameKey()` (word-order-blind canonical key in `src/lib/flavor-utils.ts`), generic row preferred.
- **Catalog holds only scoopable flavors** — no sundaes, shakes, cones, cakes, toppings.
- **Always correct misspellings** in shop-sourced flavor names ("Choclate" → "Chocolate").
- **No redundant labels** in UI. No filler copy ("Find shops scooping it" was killed for lameness).
- **Availability provenance**: `source` = 'seed' (from shop's own menu, shows "On the menu", never decays) | 'user_report' | 'business'. User confirmations upgrade seeds to time-based freshness.

## Key files

- `src/lib/flavor-utils.ts` — flavor identity engine: SPECIALS/RULES emoji+color tables, `flavorNameKey`, `dedupeFlavorsByName`
- `src/app/(main)/discover/page.tsx` — omnibox + map (viewport-driven shop loading)
- `src/app/(main)/flavor-catalog/page.tsx` — Flavors tab: "scoopable near you," nearest-first
- `src/queries/` — all Supabase access; `search_locations_by_flavor` RPC returns id-order, client sorts by distance
- `supabase/migrations/` — schema history; `supabase/cleanup/` — one-off data operations already run
- `docs/ROADMAP.md` — plan of record

## Current data state (2026-09)

~470 shops (LI + NYC), ~1,140 flavors, ~3,500 availability records across ~240 shops, seeded from chain cores + 51 independents' own websites. Field testing in progress.
