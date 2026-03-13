# T1D Parent Copilot

A calm, supportive mobile-first web app for parents managing a child's Type 1 Diabetes.

## Features

- **Ask Why** — Chat with an AI assistant to understand possible reasons for blood sugar patterns (high or low). Powered by Claude Opus 4.6 with streaming responses.
- **Event Log** — Log diabetes-related events: meals, exercise, illness, stress, site changes, medication, and more. Data stored locally on device.
- **Weekly Insights** — Get AI-generated pattern summaries from the past 7 days of logged events, with suggested questions for your care team.
- **Care Guide** — Build a printable emergency guide with blood sugar thresholds, step-by-step instructions for high/low BG, emergency contacts, and caregiver notes.

## Important Disclaimers

> **This app is informational only.** It does not provide insulin dosing advice, make medical treatment decisions, or replace guidance from your diabetes care team. Always consult your endocrinologist or certified diabetes educator for treatment decisions.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **Claude Opus 4.6** via `@anthropic-ai/sdk` for AI features
- **localStorage** for client-side data persistence (no backend database)
- **lucide-react** for icons

## Architecture

```
src/
├── app/
│   ├── page.tsx          # Home / dashboard
│   ├── ask/page.tsx      # Ask Why — streaming AI chat
│   ├── log/page.tsx      # Event Log
│   ├── insights/page.tsx # Weekly Insights
│   ├── guide/page.tsx    # Caregiver Guide
│   └── api/
│       ├── ask/route.ts      # Claude streaming endpoint
│       └── insights/route.ts # Claude insights endpoint
├── components/
│   ├── BottomNav.tsx     # Mobile navigation
│   ├── Disclaimer.tsx    # Medical disclaimer component
│   └── PageShell.tsx     # Shared page layout
└── lib/
    ├── types.ts          # TypeScript types
    └── storage.ts        # localStorage helpers
```
