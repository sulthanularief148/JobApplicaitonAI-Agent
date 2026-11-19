# ApplyWise AI

AI-powered job application assistant that analyzes your CV against job postings and provides tailored application materials.

## Features

- **CV Upload & Parsing** — Upload a PDF resume; text is extracted automatically with `unpdf`
- **AI Job Analysis** — Paste a job description to get a match score (0-100), skill gap analysis, and tailored application content
- **Tailored Output** — AI generates a customized CV summary, bullet points, cover note, and LinkedIn message based on your actual experience
- **Honesty Guard** — The AI flags skills you don't have instead of fabricating experience
- **Application Tracker** — Kanban board and table view to track applications across stages (Saved -> Applied -> Interview -> Offer -> Rejected)
- **Dashboard** — Live stats for total applications, interviews, offers, and average match score
- **Demo Login** — One-click demo account for recruiters to try without signing up

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Cache Components) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase (Postgres + Auth + RLS) |
| AI | Google Gemini API (REST, no SDK) |
| Drag & Drop | dnd-kit |
| Validation | Zod v4 |
| PDF Parsing | unpdf |
| Testing | Vitest |
| Deploy | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier)
- A [Google AI Studio](https://aistudio.google.com) API key (free tier)

### Setup

```bash
# Clone the repo
git clone https://github.com/sulthanularief148/JobApplicaitonAI-Agent.git
cd applywise-ai

# Install dependencies
npm install

# Copy env file and fill in your keys
cp .env.example .env

# Run the database migration in your Supabase SQL editor
# Copy the contents of supabase/migrations/001_initial_schema.sql

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model name (default: `gemini-3.8-flash`) |
| `NEXT_PUBLIC_DEMO_EMAIL` | Demo account email |
| `NEXT_PUBLIC_DEMO_PASSWORD` | Demo account password |

### Scripts

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run test       # Run Vitest tests
npm run lint       # ESLint check
```

## Architecture

```
src/
  app/
    (app)/              # Authenticated routes (shared layout + navbar)
      dashboard/        # Stats dashboard (server component)
      cv/               # CV upload page
      analyze/          # Job analysis form + results
      applications/     # Kanban board + table tracker
    api/
      analyze/          # POST - AI analysis endpoint
      applications/     # GET/POST/PATCH/DELETE - CRUD
      auth/signup/      # POST - server-side signup (bypasses email confirm)
    auth/               # Login page + callback
  components/
    analysis/           # ScoreGauge, SkillsChips, ResultCard
    applications/       # KanbanBoard, ApplicationTable, Modal
    auth/               # AuthForm (login/signup/magic link)
    cv/                 # CvUpload, CvEditor
    layout/             # Navbar
  lib/
    ai/                 # Provider interface + Gemini implementation
    supabase/           # Client/server/middleware helpers
    types/              # Application status types
    validators/         # Zod schemas (job input, AI response)
```

## Database

Six tables with Row Level Security (every user sees only their own data):

- **profiles** - auto-created on signup
- **cvs** - uploaded CV text
- **jobs** - saved job postings
- **analyses** - AI analysis results (linked to jobs)
- **applications** - application tracker entries
- **analysis_counts** - rate limiting (20/day)

## AI Provider Pattern

The app uses a Strategy Pattern for AI providers. Currently implements Gemini, but adding a new provider (OpenAI, Claude, etc.) requires only implementing the `AIProvider` interface:

```typescript
interface AIProvider {
  analyze(cvText: string, jobDescription: string): Promise<AnalysisResponse>;
}
```

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy - Vercel auto-detects Next.js

## License

MIT
