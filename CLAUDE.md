# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Alecci Media AI Chatbot** - An executive personality-driven AI consultancy platform. Fork of Vercel's Chat SDK, customized with three executive personas (Alexandria, Kim, Collaborative) that provide specialized business consulting advice.

**Core differentiator:** AI executives feel like real consultants, not chatbots.

## Commands

```bash
pnpm dev              # Start dev server with Turbopack (localhost:3000)
pnpm build            # Run migrations + production build
pnpm lint             # Ultracite linter (npx ultracite@latest check)
pnpm format           # Ultracite formatter (npx ultracite@latest fix)

# Database (Drizzle ORM + Postgres)
pnpm db:generate      # Generate migration from schema changes
pnpm db:migrate       # Apply migrations (npx tsx lib/db/migrate.ts)
pnpm db:studio        # Open Drizzle Studio
pnpm db:push          # Push schema directly (dev only)
pnpm db:pull          # Pull schema from database

# Testing (Playwright)
pnpm test             # Run all Playwright tests
export PLAYWRIGHT=True && pnpm exec playwright test tests/e2e/chat.test.ts  # Single test file
```

## Architecture

### Tech Stack
- **Framework:** Next.js 15+ (App Router, React 19, TypeScript)
- **AI:** Vercel AI SDK 5.x with OpenRouter provider (Gemini 3 Flash + Gemini 2.5 Pro)
- **Database:** Vercel Postgres via Drizzle ORM
- **Auth:** NextAuth v5 (credentials + guest)
- **Storage:** Vercel Blob
- **Styling:** Tailwind CSS 4 + shadcn/ui (Radix primitives)
- **Voice:** ElevenLabs TTS
- **Linting:** Ultracite (Biome-based)

### Executive Personality System (`lib/bot-personalities.ts`)

Three AI personalities with distinct prompt augmentations:
- **Alexandria** - CMO/brand strategist (rose gradient styling)
- **Kim** - Sales VP/revenue optimizer (blue gradient styling)
- **Collaborative** - Both executives together (purple gradient styling)

Focus modes provide specialized contexts: `brand_crisis`, `launch_campaign`, `pipeline_audit`, `deal_closing`, `market_entry`, `team_scaling`.

### AI Provider Configuration (`lib/ai/providers.ts`)

```typescript
// Uses OpenRouter for model access
"chat-model": "google/gemini-3-flash-preview"      // Fast responses
"chat-model-reasoning": "google/gemini-2.5-pro"    // Complex tasks
"artifact-model": "google/gemini-2.5-pro"          // Document generation
"title-model": "google/gemini-2.0-flash-exp:free"  // Title generation
```

### Key Directory Structure

```
app/
├── (auth)/           # Auth routes + auth.ts config
├── (chat)/           # Main chat app (authenticated)
│   ├── api/          # Route handlers (chat, voice, analytics, reactions)
│   ├── analytics/    # Usage analytics dashboard
│   ├── reports/      # Reports library page
│   └── chat/[id]/    # Dynamic chat route
├── (legal)/          # Legal pages (privacy, terms, about)
└── api/              # Public API routes

lib/
├── ai/
│   ├── providers.ts      # OpenRouter model configuration
│   ├── prompts.ts        # System prompt construction
│   ├── topic-classifier.ts # Chat topic detection
│   └── tools/            # AI tools (createDocument, webSearch, etc.)
├── bot-personalities.ts  # Executive personas + focus modes
├── db/
│   ├── schema.ts         # Drizzle schema (User, Chat, Message_v2, etc.)
│   ├── queries.ts        # Database query functions
│   └── migrations/       # SQL migration files
└── security/             # Rate limiting

components/
├── chat.tsx              # Main chat interface
├── executive-switch.tsx  # Executive persona selector
├── focus-mode-selector.tsx # Focus mode dropdown
├── message.tsx           # Message rendering with executive styling
├── multimodal-input.tsx  # Input with file uploads
├── voice-player-button.tsx # ElevenLabs TTS playback
└── ui/                   # shadcn/ui primitives

hooks/
├── use-voice-player.ts   # TTS playback management
├── use-realtime-call.ts  # Real-time voice conversations
└── use-auto-speak.ts     # Auto-TTS toggle
```

### Database Schema (`lib/db/schema.ts`)

Key tables:
- `User` - Users with `userType` (guest/regular/premium)
- `Chat` - Conversations with `topic`, `topicColor`, `isPinned`
- `Message_v2` - Messages with `botType`, `parts`, `attachments`
- `Document` - AI-generated artifacts (text, code, image, sheet)
- `Vote_v2`, `MessageReaction` - Message feedback
- `ExecutiveMemory` - Per-user executive usage tracking
- `UserAnalytics` - Usage metrics

### Message Rate Limits (`lib/ai/entitlements.ts`)

- Guest: 50 messages/day
- Regular: 500 messages/day
- Premium: 2000 messages/day

### Chat Route Flow (`app/(chat)/api/chat/route.ts`)

1. Validate request with Zod schema
2. Check rate limits per user tier
3. Truncate history to 60 messages (first + recent)
4. Build system prompt with executive personality + focus mode
5. Stream response via AI SDK
6. Auto-classify topic on new chats
7. Save messages to database

## Testing

Playwright tests in `tests/` with two projects:
- `e2e/` - End-to-end chat flows
- `routes/` - API route tests

Helpers in `tests/fixtures.ts` and `tests/helpers.ts`.

## Environment Variables

Required (see `.env.example`):
- `AUTH_SECRET` - NextAuth secret
- `OPENROUTER_API_KEY` - AI model access
- `POSTGRES_URL` - Database connection
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage

Optional:
- `REDIS_URL` - Rate limiting
- `TAVILY_API_KEY` - Enhanced web search
- `ELEVENLABS_API_KEY` - Text-to-speech

## Roadmap Reference

See `ROADMAP.md` for feature specifications and `PROGRESS.md` for implementation status. Key completed features:
- Executive personalities with message styling
- Focus modes for specialized contexts
- Topic-based chat classification
- Usage analytics dashboard
- Reports library
- Message reactions system
- PDF/Excel export
- Voice playback with speed controls
