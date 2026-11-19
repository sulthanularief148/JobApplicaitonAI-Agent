# What I Learned Building ApplyWise AI

This document captures my key learnings from building this project. I reference it in interviews to explain architectural decisions and technical depth.

## 1. Supabase Auth & Row Level Security

**What I learned:** Supabase provides auth out of the box, but email confirmation is enabled by default. For a portfolio project, I created a server-side signup route using the admin API (`auth.admin.createUser` with `email_confirm: true`) to bypass this. I also learned the new API key format (`sb_publishable_*` / `sb_secret_*`).

**RLS insight:** Every table has `auth.uid() = user_id` policies. This means even if someone crafts a malicious API request, Postgres itself blocks access to other users' data. The security is at the database level, not the application level.

## 2. AI Provider Pattern (Strategy Pattern)

**What I learned:** Instead of coupling the app to one AI service, I defined an `AIProvider` interface. The `GeminiProvider` implements it, but swapping to OpenAI or Claude would only require a new class — no changes to the API route.

**Why it matters:** Gemini's free tier has rate limits and the model naming changes frequently (I had to update from `gemini-2.0-flash` to `gemini-3.8-flash` during development). Having a clean interface made this a one-line change.

## 3. Structured AI Output with Zod Validation

**What I learned:** LLMs don't always return valid JSON. My approach:
1. Set `responseMimeType: 'application/json'` in the Gemini config
2. Parse the response with Zod (`analysisResponseSchema`)
3. If validation fails, retry once with the error message included in the prompt
4. Strip markdown code fences before parsing (LLMs sometimes wrap JSON in ` ```json `)

**Key insight:** Never trust AI output. Always validate at the boundary.

## 4. Next.js 16 Breaking Changes

**What I learned:** Next.js 16 introduced several breaking changes:
- `PageProps<'/path/[id]'>` replaces manual param type definitions
- `await props.params` — params are now async
- `export const instant = false` replaces `export const dynamic = 'force-dynamic'`
- Cache Components are the new default (opt out per-route)

## 5. PDF Text Extraction Without External Services

**What I learned:** `unpdf` extracts text from PDFs entirely on the server — no external API calls. The return type is `{ text: string[] }` where each array element is one page's text. I join them with newlines.

**Trade-off:** `unpdf` works well for text-based PDFs but can't handle scanned images. For a production app, I'd add OCR as a fallback.

## 6. Drag-and-Drop with dnd-kit

**What I learned:** `@dnd-kit/core` provides the DnD context and sensors, while `@dnd-kit/sortable` handles list reordering. Key architectural decisions:
- Used `useDroppable` for columns (status categories)
- Used `useSortable` for cards (individual applications)
- Optimistic UI: update state immediately on drag end, then fire the PATCH request
- `DragOverlay` renders a floating copy of the dragged card for smooth visuals

## 7. Supabase Client Architecture in Next.js

**What I learned:** You need separate Supabase clients for different contexts:
- **Browser client** (`createBrowserClient`) — for client components, reads cookies from the browser
- **Server client** (`createServerClient`) — for server components and API routes, reads cookies from the request
- **Middleware client** — refreshes the session token on every request

**Lazy initialization:** In client components, create the Supabase client inside event handlers (not at module level) to avoid prerender errors.

## 8. Rate Limiting with Database Counts

**What I learned:** Instead of Redis or in-memory stores (which reset on deploy), I used a Supabase table (`analysis_counts`) with a unique constraint on `(user_id, date)`. The `upsert` pattern either inserts a new row or increments the existing count. Simple, persistent, and free.

## 9. Server-Side Validation at Every Boundary

**What I learned:** I validate at three boundaries:
1. **Client form** — Zod schema prevents bad submissions
2. **API route** — Re-validates with the same schema (never trust the client)
3. **AI response** — Zod schema ensures the AI returns the expected shape

The same Zod schemas are shared between client and server (defined in `lib/validators/`).

## 10. Vercel Deployment Considerations

**What I learned:**
- Environment variables must be set in the Vercel dashboard (not just `.env`)
- The `SUPABASE_SERVICE_ROLE_KEY` is server-only — never prefix it with `NEXT_PUBLIC_`
- Supabase RLS policies work the same in production as in development
- The Gemini API key should be treated as a server secret
