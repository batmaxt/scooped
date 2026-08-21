# Scooped — Product Roadmap

*Last updated: August 2026. This is the source of truth for what we're building
and in what order. If you're new here (hi Brandon), read top to bottom.*

## The thesis

Scooped is **real-time flavor availability near you**, wrapped in a social app
people enjoy using. The social layer (check-ins, streaks, badges, feed) exists
to *generate availability data* — every scan, sighting, and check-in is a data
point wearing a fun costume. Any feature that produces neither delight in the
first 30 seconds nor richer availability data gets cut.

**Doctrine:** scoop shops → density → habit → then point the same machine at
supermarket freezer aisles.

---

## Phase 1 — Stick the landing on scoop shops (NOW)

Coverage exists (~1,371 tri-state locations). The gap is **flavor density** and
**polish**. Nobody trusts an app full of "No flavors scooped yet."

1. ✅ Bulletproofing: waking-up screen, error boundaries, branded 404
2. ✅ Design system enforcement: unified auth, contrast fixes, neutral shadows
3. ✅ Design glow-up: semantic flavor emoji/color engine, monogram/real photos,
   location page CTA hierarchy, catalog filters (Non-Dairy toggle + formats)
4. 🔨 Freshness visuals — "Still there ✓" one-tap confirms SHIPPED; still to
   do: age-tinted chips + "Gone ✗" (needs a mark-unavailable RPC)
5. 🔨 Scan gratification — first-to-map 🏆 celebration SHIPPED; still to
   do: scoops-mapped counter on profile
6. ✅ **Unified Discover** — one omnibox (flavor/shop/address), flavor mode
   with freshness results + catalog fallback, full-screen searchable map,
   ?q= deep links. Search tab replaced by Flavors (catalog) in nav.
7. 🔨 Seed availability from shops' own published menus — Morgenstern's done
   (34 flavors via their website). Repeat for Van Leeuwen/Jeni's/Salt & Straw
   storefronts etc. 77 availability records and counting.
8. ✅ Deploy to Vercel (scooped-six.vercel.app) + production redirect URL in Supabase
8b. ⬜ **Zombie sweep**: re-check all locations against Google Places
   `business_status` to auto-flag permanently closed shops (Big Gay,
   Morgenstern's flagship, and BANANAS all died between imports)
9. ⬜ Upgrade Supabase to Pro ($25/mo) before real users — free tier pauses kill
10. ✅ Catalog audit: 787 → 669 clean flavors, dupes merged, products killed,
    Morgenstern's added. Alerts are flavor-only and NAME-agnostic (migration
    00016): an alert on "Lemon Custard" fires for any brand at any shop.
11. ✅ Post-check-in prompt: one-tap "yes, it's on the menu" after posting
12. ✅ Home "Freshly confirmed" shelf — live availability with timestamps
13. ✅ Map fixed — root cause was MISSING Maps env vars on Vercel, not
    billing. Still owed on Vercel env: GOOGLE_PLACES_API_KEY and
    ANTHROPIC_API_KEY (menu scan is dead on the live site until added),
    delete stale NEXT_PUBLIC_MAPBOX_TOKEN, check misnamed VAPID private key.

### Kill list (deliberately NOT building)
Stories/reels, DMs, more badge types, AI recommendations (needs data first),
events/meetups.

---

## Phase 2 — The shop partner loop

The business portal **already exists** (`/claim`, `/dashboard`, `/flavors`,
admin approval). What's missing is a reason for shops to touch it daily.

1. ⬜ **10-second daily update**: two buttons on the business dashboard —
   📸 "Scan today's board" (reuse scan flow, owner-trusted, auto-approve) and
   ✓ "Same as yesterday" (wraps existing `confirmAllFlavors`)
2. ⬜ **Update = marketing blast**: when a shop posts today's flavors, push
   notifications fire to every user with a matching flavor/shop alert.
   The pitch to shops: *"Free customer notifications. You just tell us
   what's in the case."*
3. ⬜ **Verified fresh today** badge on the location page
4. ⬜ Demand stats on the dashboard: views this week, alerts waiting on
   flavors they carry
5. ⬜ Printable QR table-tent ("Follow our flavors on Scooped")

No separate app — it all lives in the existing PWA business routes.

---

## Phase 3 — Retail pints & expansion

- **Brand alerts for freezer aisles**: "Van Leeuwen Honeycomb spotted at Key
  Food on Deer Park Ave" — alerts system already supports this shape.
  Supermarkets stay passive until then (sightings accrue, zero investment).
- **New metros, demand-driven**: "Add this shop" flow (Places autocomplete,
  `insert_location` RPC exists) + per-metro chain-locator backfill + rerun the
  Places discovery scripts per metro (~$50–200 API cost each). Add locations
  only where we can also get flavors.

---

## Operating notes

- **Repo**: https://github.com/batmaxt/scooped — pull before starting, push
  when done. GitHub is the disaster-recovery lifeline (ask Mat's laptop).
- **Local path**: keep the repo OUT of Desktop/Documents (iCloud eats files).
  Mat: `~/dev/scooped`.
- **Supabase pauses** on the free tier after ~1 week idle. The app now shows a
  branded "waking up" screen and self-recovers, but unpause promptly at
  https://supabase.com/dashboard.
- Database is shared: both dev machines and (eventually) production point at
  the same Supabase project until we outgrow it.
