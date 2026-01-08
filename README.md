# AI Boss Brainz

<p align="center">
  <img src="app/(chat)/opengraph-image.png" alt="AI Boss Brainz" width="600">
</p>

<p align="center">
  <strong>Your AI Executive Team, Available 24/7</strong>
</p>

<p align="center">
  AI Boss Brainz transforms how businesses approach strategic consulting. Instead of a generic chatbot, you get access to two distinct AI executives with specialized expertise, personalities, and strategic frameworks.
</p>

## Meet Your Executives

### Alexandria | Chief Marketing Officer

Alexandria brings deep expertise in brand strategy, market positioning, and creative campaigns. She excels at:

* Brand identity and positioning strategy
* Marketing campaign development
* Crisis communications and reputation management
* Customer experience optimization
* Content strategy and storytelling

Her approach is thoughtful, creative, and brand centric. She sees every business challenge through the lens of brand equity and customer perception.

### Kim | Chief Sales Officer

Kim is your revenue focused strategist with expertise in sales processes, deal structures, and market expansion. She specializes in:

* Sales pipeline optimization
* Deal negotiation and closing strategies
* Market entry and expansion planning
* Revenue forecasting and metrics
* Team scaling and sales operations

Her style is direct, results driven, and always focused on the bottom line. Every recommendation ties back to revenue impact.

### Collaborative Mode

When complex challenges require both perspectives, engage both executives simultaneously. They'll debate, complement each other's viewpoints, and deliver comprehensive strategic recommendations that balance brand building with revenue generation.

## Key Features

### Executive Focus Modes

Tailor your consultation with specialized modes:

| Mode | Description |
|------|-------------|
| Default | General strategic consultation |
| Brand Crisis | Reputation management and damage control |
| Launch Campaign | Go to market strategy and execution |
| Pipeline Audit | Sales funnel analysis and optimization |
| Deal Closing | Negotiation tactics and contract strategy |
| Market Entry | New market research and expansion planning |
| Team Scaling | Organizational growth and hiring strategy |

### Intelligent Conversation Analytics

* **Topic Detection** automatically categorizes conversations
* **Drift Alerts** notify when discussions stray from objectives
* **Executive Recommendations** suggest when to bring in another perspective
* **Conversation Depth Metrics** track strategic value delivered

### Executive Memory System

The platform remembers your preferences and patterns:

* Which executive you prefer for different topics
* Your business context and ongoing initiatives
* Historical recommendations and their outcomes
* Personal communication style preferences

### Reports Library

All AI generated documents, frameworks, and artifacts are automatically saved and organized:

* Filter by executive, date, or topic
* Export with executive branding
* Version history for all documents
* Quick access to past strategic work

### Rich Message Interactions

Go beyond simple chat with:

* **Reactions** to mark insights as Actionable, Brilliant, Helpful, or Save for Later
* **Voting** to train better responses over time
* **Voice Input** for hands free consulting sessions
* **File Attachments** for document analysis

## Technology

Built with modern, production grade technology:

* **Framework** Next.js 15+ with React 19 and TypeScript
* **AI Engine** Vercel AI SDK with advanced streaming
* **Database** Supabase (PostgreSQL) with row level security
* **Authentication** Supabase Auth with secure session management
* **Voice** ElevenLabs text to speech for natural responses
* **Styling** Tailwind CSS with shadcn/ui components
* **Monitoring** Sentry for error tracking and performance

## Getting Started

### Prerequisites

* Node.js 18+
* pnpm package manager
* Supabase account
* OpenRouter API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/Qualiasolutions/aibossybrainz.git
cd aibossybrainz
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```
AUTH_SECRET=your_auth_secret
OPENROUTER_API_KEY=your_openrouter_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

4. Set up the database

Apply migrations in the Supabase SQL Editor from `supabase/migrations/`

5. Start the development server

```bash
pnpm dev
```

Visit [localhost:3000](http://localhost:3000) to meet your AI executives.

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Qualiasolutions/aibossybrainz)

Or deploy manually:

```bash
pnpm build
vercel deploy --prod
```

## Usage Limits

| Tier | Daily Messages |
|------|----------------|
| Guest | 50 |
| Regular | 500 |
| Premium | 2,000 |

## Project Structure

```
app/
├── (auth)/           Authentication pages
├── (chat)/           Main application
│   ├── api/          API routes
│   ├── analytics/    Usage dashboard
│   ├── history/      Conversation history
│   ├── reports/      Reports library
│   └── executives/   Executive profiles

components/
├── chat.tsx              Chat interface
├── executive-switch.tsx  Executive selector
├── focus-mode-selector.tsx
├── message.tsx           Styled messages
└── conversation-analytics.tsx

lib/
├── ai/                   AI configuration
├── bot-personalities.ts  Executive personas
├── db/                   Database queries
└── security/             Rate limiting
```

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the terms included in the LICENSE file.

## Support

For questions, feature requests, or issues, please open a GitHub issue or contact the team at [qualiasolutions.net](https://qualiasolutions.net).

---

<p align="center">
  Built by <a href="https://qualiasolutions.net">Qualia Solutions</a>
</p>
