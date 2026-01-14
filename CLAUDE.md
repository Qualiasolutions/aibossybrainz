# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Alecci Media AI Chatbot** - Executive personality-driven AI consultancy platform. Fork of Vercel's Chat SDK with three executive personas (Alexandria, Kim, Collaborative) providing specialized business consulting.

**Supabase Project:** `esymbjpzjjkffpfqukxw`

## Commands

```bash
pnpm dev              # Dev server with Turbopack (localhost:3000)
pnpm build            # Production build
pnpm lint             # Ultracite linter (Biome-based)
pnpm format           # Ultracite formatter

# Testing (Playwright)
pnpm test                                                  # Run all tests
export PLAYWRIGHT=True && pnpm exec playwright test tests/e2e/chat.test.ts  # Single test
pnpm exec playwright test --project=e2e                    # E2E tests only
pnpm exec playwright test --project=routes                 # API route tests only
```

## Architecture

### Tech Stack
- **Framework:** Next.js 15.6+ (App Router, React 19, TypeScript)
- **AI:** Vercel AI SDK 5.x with OpenRouter (Gemini 3 Flash)
- **Database:** Supabase (Postgres with RLS)
- **Auth:** Supabase Auth
- **Storage:** Vercel Blob
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **Voice:** ElevenLabs TTS
- **Monitoring:** Sentry

### AI Models (`lib/ai/providers.ts`)

All models use OpenRouter with `google/gemini-3-flash-preview`:
- `chat-model` - Main chat responses
- `chat-model-reasoning` - Complex reasoning tasks
- `artifact-model` - Document generation
- `title-model` - Title generation

### Executive Personality System (`lib/bot-personalities.ts`)

Three personas with distinct system prompts and styling:
- **Alexandria** - CMO, brand strategist (rose gradient)
- **Kim** - CSO, sales/revenue (red gradient)
- **Collaborative** - Both executives together (mixed gradient)

Focus modes: `default`, `brand_crisis`, `launch_campaign`, `pipeline_audit`, `deal_closing`, `market_entry`, `team_scaling`

### Key Directories

```
app/
├── (auth)/           # Supabase Auth routes
├── (chat)/           # Main app (authenticated)
│   ├── api/          # Route handlers: chat, voice, analytics, reactions
│   ├── analytics/    # Usage dashboard
│   └── reports/      # Reports library
lib/
├── ai/
│   ├── providers.ts      # OpenRouter config
│   ├── prompts.ts        # System prompt builder
│   ├── topic-classifier.ts
│   ├── knowledge-base.ts # Per-executive knowledge loading
│   └── tools/            # createDocument, webSearch, etc.
├── bot-personalities.ts  # Executive personas + focus modes
├── db/queries.ts         # All Supabase query functions
├── supabase/             # Supabase client creation
└── security/             # Rate limiting (Redis + DB fallback)
components/
├── chat.tsx              # Main chat interface
├── executive-switch.tsx  # Persona selector
├── focus-mode-selector.tsx
├── message.tsx           # Executive-styled messages
└── voice-player-button.tsx
```

### Database Tables (Supabase)

Key tables in `lib/supabase/types.ts`:
- `User` - Synced from Supabase Auth
- `Chat` - Conversations with `topic`, `topicColor`, `isPinned`, `lastContext`
- `Message_v2` - Messages with `botType`, `parts`, `attachments`
- `Document` - AI artifacts (text, code, image, sheet)
- `Vote_v2`, `MessageReaction` - Feedback
- `ExecutiveMemory` - Per-user executive tracking
- `UserAnalytics` - Usage metrics

All tables have RLS enabled. See `supabase/migrations/` for schema.

### Chat Flow (`app/(chat)/api/chat/route.ts`)

1. Validate with Zod schema
2. Check rate limits (Redis → DB fallback)
3. Truncate to 60 messages (first + recent)
4. Load knowledge base for selected executive
5. Build system prompt (persona + focus mode + knowledge)
6. Stream via AI SDK with tools
7. Auto-classify topic on new chats
8. Save messages to Supabase

### Rate Limits (`lib/ai/entitlements.ts`)

- Guest: 50/day
- Regular: 500/day
- Premium: 2000/day

## Environment Variables

Required:
- `AUTH_SECRET` - NextAuth secret
- `OPENROUTER_API_KEY` - AI model access
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob

Optional:
- `REDIS_URL` - Rate limiting (falls back to DB)
- `TAVILY_API_KEY` - Enhanced web search
- `ELEVENLABS_API_KEY` - Text-to-speech

## Supabase Migrations

Apply via Supabase Dashboard SQL Editor in order:
1. `supabase/migrations/01_create_tables.sql`
2. `supabase/migrations/02_enable_rls.sql`

See `supabase/README.md` for details.

## Testing

Playwright config: `playwright.config.ts`
- **e2e/** - End-to-end chat flows
- **routes/** - API route tests
- **fixtures.ts, helpers.ts** - Test utilities

Dev server auto-starts on `pnpm test`.

## Roadmap

See `ROADMAP.md` for features and `PROGRESS.md` for status.
