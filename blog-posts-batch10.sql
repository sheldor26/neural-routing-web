-- Blog Post: I Cut Our AI Costs by 73% in One Week
-- Run in Supabase SQL Editor

INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'cut-ai-costs-73-percent-one-week',
  'I Cut Our AI Costs by 73% in One Week — Here''s How',
  'Our LLM bill was $12,400/month. Seven days later, it was $3,350 — without changing a single user-facing feature. Here''s the exact playbook.',
  'Neural Research',
  '10 min read',
  NULL,
  $$Our LLM bill was $12,400 in March. By the end of the first week of April, the run rate was $3,350/month. Same features, same output quality, same users. Nobody noticed the change — except finance.

This isn''t a theoretical exercise. It''s a step-by-step account of what I did, what I found, and how the numbers moved each day.

## Day 0: The audit

Before touching anything, I needed to understand where the money was going.

I pulled a week of API logs — every request, every model, every token count. The breakdown was sobering:

- **Total requests/week:** ~84,000
- **Model used:** GPT-4o for 100% of requests
- **Average input tokens/request:** ~800
- **Average output tokens/request:** ~350
- **Weekly cost:** ~$3,100 (extrapolating to $12,400/month)

Then I categorized the requests by what they were actually doing:

| Task Type | % of Requests | Example |
|-----------|---------------|---------|
| Classification/routing | 28% | Categorize support tickets into 6 types |
| Entity extraction | 22% | Pull names, dates, amounts from text |
| Simple Q&A | 18% | Answer FAQs from a knowledge base |
| Summarization | 15% | Condense customer conversations |
| Complex generation | 12% | Draft detailed responses, reports |
| Multi-step reasoning | 5% | Analyze data, draw conclusions |

50% of our requests were classification and extraction. Tasks where the output is a single label or a structured data object. Tasks that Llama 3.1 8B handles identically to GPT-4o.

Another 18% were FAQ-style Q&A — essentially lookup against known content. GPT-4o-mini handles this without breaking a sweat.

Only 17% of our traffic genuinely benefited from GPT-4o''s reasoning capabilities. We were paying premium rates on 83% of requests for no quality gain.

That gap is the [Model Tax](https://neuralrouting.io/model-tax).

## Day 1-2: Setting up the routing layer

I implemented a three-tier model cascade:

**Tier 1 — Economy (Llama 3.1 8B on Groq):** Classification, extraction, reformatting, simple Q&A. Cost: $0.05/1M input, $0.08/1M output.

**Tier 2 — Mid-range (GPT-4o-mini):** Summarization, moderate Q&A, template-based generation. Cost: $0.15/1M input, $0.60/1M output.

**Tier 3 — Premium (GPT-4o):** Complex generation, multi-step reasoning, anything the lower tiers can''t handle confidently. Cost: $2.50/1M input, $10.00/1M output.

The routing logic started simple: I wrote a fast classifier that looked at the task type (extracted from the system prompt or API endpoint) and routed accordingly. Classification endpoints → Tier 1. Summarization → Tier 2. Generation → Tier 3.

Total setup time: about 6 hours. Most of that was mapping our internal API endpoints to task types and testing that the economy models produced acceptable output.

## Day 3: First results

After 24 hours of routed traffic:

| Tier | % of Traffic | Daily Cost |
|------|-------------|------------|
| Economy (Llama 3.1 8B) | 50% | $1.20 |
| Mid-range (GPT-4o-mini) | 33% | $14.80 |
| Premium (GPT-4o) | 17% | $67.50 |
| **Total** | | **$83.50/day** |

Previous daily cost: ~$443/day. New daily cost: $83.50/day. That''s an **81% reduction** on day one.

But I wasn''t celebrating yet. The numbers meant nothing if quality had degraded.

## Day 3-4: Quality validation

I ran a shadow comparison. For every economy-tier response, I also sent the same prompt to GPT-4o in the background and compared outputs.

The results for classification tasks: **97.3% agreement** between Llama 3.1 8B and GPT-4o. The 2.7% divergence was almost entirely on edge cases where even GPT-4o''s classification was arguable.

For extraction tasks: **99.1% agreement**. Dates, names, amounts — the economy model was functionally identical.

For simple Q&A: **94.8% agreement** on GPT-4o-mini. The 5.2% gap was on questions that required more nuance. I adjusted the routing to escalate ambiguous Q&A to GPT-4o, which moved about 3% of traffic from Tier 2 to Tier 3.

After the adjustment, the effective accuracy was above 98% across all tiers.

## Day 5: Adding semantic caching

While reviewing the logs, I noticed heavy repetition. Our support bot was getting variations of the same 50-60 questions, worded differently each time. Each variation was a fresh API call.

I added a semantic cache layer:

- **Exact match cache:** Hash the prompt, store the response. If the identical prompt comes in, return the cached response. Hit rate: ~12%.
- **Similarity cache:** Embed prompts with a lightweight model, store in a vector database. If a new prompt is semantically similar (cosine similarity > 0.95) to a cached one, return the cached response. Hit rate: ~22%.

Combined cache hit rate: **34%**. Meaning 34% of requests never reached an LLM at all. Cost for those requests: $0.

## Day 6-7: Final numbers

After a full week of routing + caching:

| Component | Impact |
|-----------|--------|
| Model routing (3-tier cascade) | -81% |
| Semantic caching (exact + vector) | -34% of remaining calls |
| Prompt optimization (trimmed system prompts) | -15% input tokens |
| **Combined new run rate** | **~$3,350/month** |

From $12,400 to $3,350. A **73% reduction** in total LLM costs.

And the quality metrics I tracked throughout the week:

| Metric | Before | After |
|--------|--------|-------|
| Classification accuracy | 94.2% | 94.0% |
| Extraction accuracy | 97.8% | 97.6% |
| User satisfaction (CSAT on support) | 4.3/5 | 4.3/5 |
| Average response latency | 1.8s | 1.2s |

Quality was flat. Latency actually *improved* because economy models on Groq respond faster than GPT-4o. Users didn''t notice anything — except the support bot was slightly snappier.

## What I''d do differently

If I did this again, I''d skip the manual routing logic and use an automated router from day one. Mapping endpoints to task types worked for our codebase, but it doesn''t generalize — and it broke every time we added a new feature. A system that analyzes prompt complexity in real time, like NeuralRouting''s Model Cascading, would have saved me the 6 hours of manual mapping and handled edge cases I hadn''t anticipated.

I''d also start with shadow validation from the beginning, not day 3. The anxiety between "I flipped the switch" and "I''ve confirmed quality is fine" was unnecessary. Shadow Engine-style background validation eliminates that gap entirely.

## Your turn

The specific numbers will differ for your workload. Maybe your split is 60% simple / 20% moderate / 20% complex instead of our 50/33/17. Maybe you''re spending $3K/month, not $12K. The principle is the same: if you''re not routing by complexity, you''re overpaying.

Start by measuring your Model Tax — the gap between what you''re spending and what you''d spend with intelligent routing.

**[Calculate your Model Tax →](https://neuralrouting.io/model-tax)**$$,
  true,
  '2026-05-05 10:00:00+00',
  '2026-05-05 10:00:00+00'
);
