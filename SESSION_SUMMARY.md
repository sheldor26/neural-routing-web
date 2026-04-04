# NeuralRouting.io — Build Session Summary

## What Was Built

---

### 1. Database Migration — `001_workflow_runs.sql`
Applied to Supabase. Creates two tables:

- **`workflow_definitions`** — Reusable workflow templates with steps (JSONB), owned per user, soft-deleteable.
- **`workflow_runs`** — Each execution instance: status, input, output, per-step results, cost/credits/savings aggregates.
- Row-Level Security enabled on both. Backend bypasses via service role key.

---

### 2. Backend — `workflow_router.py` (neural-routing-core)

New FastAPI router mounted at `/v1/workflows`.

| Method | Endpoint | What it does |
|--------|----------|-------------|
| POST | `/v1/workflows` | Create a workflow definition |
| GET | `/v1/workflows` | List user's active workflows |
| GET | `/v1/workflows/{id}` | Get single workflow |
| DELETE | `/v1/workflows/{id}` | Soft-delete (is_active = false) |
| POST | `/v1/workflows/{id}/runs` | **Execute** a workflow |
| GET | `/v1/workflows/{id}/runs` | List run history |
| GET | `/v1/workflows/runs/{run_id}` | Full run detail |

**Execution logic:**
- Steps run sequentially. Each step prompt is rendered via a `{{input.key}}` / `{{steps.output_key}}` template system.
- Each step is independently routed through NeuralRouter with its own `routing_mode`.
- Credits charged per step so balance is accurate even if a later step fails.
- Run record persisted at every state transition (pending → running → completed/failed).

---

### 3. Backend — Analytics endpoint added to `api_v1.py`

`GET /v1/account/analytics/{user_id}?days=30`

Returns:
- **`daily`** — Array of {date, savings_usd, cost_usd, requests, credits_used} for the last N days (zero-filled for continuity).
- **`model_distribution`** — Request counts by credit tier (budget / medium / premium) with percentages.
- **`top_models`** — Top 5 models by request count.
- **`total_requests`** — Total for the period.

---

### 4. Frontend — `/workflows` page (neural-routing-web)

**List view:**
- Grid of workflow cards showing name, step count, steps preview (expandable), routing modes per step, output_key flow.
- One-click delete.

**Create form UX helpers:**
- **4 built-in templates** (Research & Summarize, Support Ticket Triage, SEO Blog Post, Code Review Pipeline) — pre-fill the entire form with one click, available both from the empty state and as quick-apply buttons inside the form.
- **Live variable detection badges** — as you type in the prompt template, detected `{{input.*}}` and `{{steps.*}}` variables appear as colored chips below the textarea. Step refs are green if the key is defined by a prior step, red if not, with an error hint.
- **Available context chips** — for steps after the first, shows all `{{steps.X}}` keys from prior steps as clickable insert buttons.
- **Routing mode tooltips** — hover the ℹ icon to see what Auto / Cost / Quality / Speed does.
- **Duplicate step** button per step.
- **Auto-sanitize output_key** — spaces become underscores, forced lowercase.
- **Duplicate key validation** — warns before save if two steps share an output key.

---

### 5. Frontend — `/workflows/[id]` page

**Pipeline view:** Step list with routing modes.

**Run form:**
- Auto-detects all `{{input.*}}` variable names from step templates and renders the corresponding input fields — no hardcoding.
- Validation before run.

**Results panel:**
- Summary bar: total cost, total saved, total credits.
- Expandable per-step accordion: model used, latency, credits, savings, full output.
- **Copy button** per step output (turns green on success, references the `{{steps.output_key}}` name).

**Run history table:** last 10 runs with status badge, date, cost, savings, credits.

---

### 6. Frontend — `/analytics` page

Charts powered by Recharts (already installed).

- **Range selector:** 7d / 14d / 30d / 90d.
- **4 summary cards:** Total Saved, Total Spent, Requests, Credits Used.
- **Savings vs. Spent area chart** (overlapping, gradient fill).
- **Requests per day bar chart**.
- **Model tier distribution donut + legend** (budget / medium / premium with progress bars).
- **Top 5 models** horizontal bar chart.
- Empty state with link to setup guide.
- Analytics link added to dashboard nav.

---

## Monetization Context

- **Payment provider: Lemon Squeezy** (Stripe unavailable in Argentina).
- `@lemonsqueezy/lemonsqueezy.js` is already installed in the web project.
- Integration is blocked pending Lemon Squeezy project validation.
- Once validated: build checkout session + webhook to update `plan` and `credits` in Supabase.

---

---

## Critical Bug Fixes (Session 2)

### 1. Onboarding proxy — `app/api/proxy/dispatch/route.ts`
**Bug:** imported `getAuth` but called `auth()` (undefined). Also used status code `0` instead of `401`.
**Fix:** Replaced with correct `import { auth } from '@clerk/nextjs/server'` + `await auth()`. Fixed status codes. Removed hardcoded fallback key — now errors explicitly if `NR_PRIVATE_KEY` env var is missing.

### 2. Dashboard — API key generation fallback
**Bug:** If the Clerk webhook failed on signup, user arrived at dashboard with no API key and no way to get one.
**Fix:** Added a `generateApiKey()` function that calls `POST /v1/account/keys/generate`. When `apiData.key` is null, the key section shows an amber warning + "Generate Key" button instead of the masked key display.

### 3. Landing page — real aggregate stats
**Bug:** `globalStats` was hardcoded (`savings: 145280.40`, `requests: 1240500`) — fake numbers that hurt credibility.
**Fix:**
- Added `GET /v1/public/stats` endpoint to backend (no auth) — aggregates `total_savings` and `requests_count` from `user_stats` table.
- Landing page `useEffect` now fetches real data on mount. Falls back gracefully on error.

---

## What's Next (Priority Order)

1. **Lemon Squeezy integration** — checkout + webhook → update plan/credits in Supabase. Blocked on validation.
2. **Email on low credits** — notify users before they run out so they upgrade proactively (needs email provider: Resend or similar).
3. **Onboarding step 2 polish** — after the "Get My API Key" CTA, verify the user actually has a key before redirecting to dashboard.
4. **Public stats minimum floor** — once real numbers are low, consider a "Since launch" framing instead of "this month" to avoid showing $0.
