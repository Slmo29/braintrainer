# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (PWA disabled in dev)
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint check
```

No test suite is configured.

## Architecture Overview

**VivaMente** is a Next.js 14 App Router PWA for cognitive training targeted at elderly Italian users, with a caregiver/family monitoring layer. The app is fully in Italian.

### Routing Structure

Two route groups:
- `app/(app)/` — Protected main app: `home`, `esercizi`, `esercizi/[id]`, `progressi`, `profilo`, `messaggi`
- `app/onboarding/` — Auth flow: `registrati`, `accedi`, `istruzioni`, `demo`, `reward`
- `app/famiglia/` — Family/caregiver dashboard

Root redirects to `/onboarding`.

### Data Layer

> **Regola**: collegarsi **esclusivamente** al progetto Supabase con ID `vvxohvjyiqsesyockmcy`. Non usare, creare o referenziare altri progetti Supabase.

**Supabase** handles auth + PostgreSQL. Key tables:
- `users` — Senior user profiles with notification preferences; also stores `current_streak INT` and `last_activity_date DATE`
- `esercizi` — Exercise definitions with JSONB `config` field (structure TBD — waiting for spec doc)
- `sessioni` — Completed exercise sessions (score, accuratezza, durata, completato)
- `medaglie` — Streak-based medals with `giorni INT` field; 11 records (1,2,3,7,10,14,28,50,100,200,365 days)
- `user_medaglie` — Join table tracking which medals each user has earned
- `familiari` — Linked caregivers with a `permessi` JSONB object; `collegato_at` is a timestamp (convert to readable string via `giorniDa()` in `lib/utils.ts`)
- `inviti` — One-time tokens for family member onboarding
- `messaggi` — Encouragement messages from family to senior

Row Level Security is enabled on all tables — users only access their own data; familiari access is controlled by the `permessi` object.

Two Supabase clients:
- `lib/supabase/client.ts` — Browser (use in Client Components)
- `lib/supabase/server.ts` — Server (use in Server Components / API routes)

Sync layer at `lib/sync.ts`:
- `initUserData(userId)` — fetches profile, medals, today's session count from Supabase
- `salvaSessione(...)` — inserts a completed session into `sessioni`
- `aggiornaStreak(...)` — calculates new streak (reset if gap > 1 day), updates `users`
- `controllaNuoveMedaglie(...)` — checks for newly earned medals, inserts into `user_medaglie`

### State Management

Zustand store at `lib/store.ts` persists across pages via `localStorage`. Manages: user profile (`userId`, nome, cognome, ecc.), `streak`, `lastActivityDate`, `medaglie` (array di ID), family members, active pause state (timestamp-based, 24h cooldown), notification preferences.

`components/UserInit.tsx` (Client Component incluso nel layout) inizializza lo store da Supabase al mount, leggendo il profilo utente autenticato. Per i guest (`isGuest: true`) non fa fetch.

### Exercise System

Each exercise has a config stored as JSONB in Supabase (`esercizi.config`). The `esercizi/[id]` page loads the config and renders the appropriate component. Exercise components in `components/esercizi/` use a state machine pattern with phases: `pronto → mostra → rispondi → fine`.

Implemented exercise types: `MemoriaParole`, `StroopTest`, `Anagramma`, `SequenzaColori`, `CompletaParola`, `TorreHanoi`.

After 5 completed exercises, a 24-hour "active pause" is triggered via a timestamp stored in Zustand.

### UI System

- Design tokens (category colors, difficulty styles) centralized in `lib/design-tokens.ts`
- Reusable components in `components/ui/` — use `btn.tsx` variants (`primary`, `secondary`, `outline`, `ghost`, `success`, `danger`) for all buttons
- `lib/mock-data.ts` contains comprehensive mock data used during development before Supabase integration
- Bottom navigation: `components/BottomNav.tsx` (4 tabs: Home, Esercizi, Progressi, Profilo)

### Communications

- `lib/twilio.ts` — WhatsApp + SMS via Twilio (family notifications)
- `lib/resend.ts` — Email via Resend (magic links, invites)

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_APP_URL`
