-- Blog Post: What is the Model Tax?
-- Run in Supabase SQL Editor

INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'what-is-the-model-tax',
  'What is the Model Tax? The Hidden Cost Every AI Team Pays',
  'The Model Tax is the invisible cost of sending every LLM request to GPT-4o. 80% of your prompts don''t need a premium model. Here''s what it''s costing you — and how to eliminate it.',
  'Engineering',
  '8 min read',
  NULL,
  $$You're paying GPT-4o prices on prompts that a model 50x cheaper could handle. That gap between what you spend and what you *should* spend is your Model Tax — and most teams don't even know they're paying it.

## The math your API dashboard won't show you

Here's a typical breakdown of LLM requests in production:

About 40% are simple tasks: classification, extraction, reformatting, yes/no decisions. Another 30% are moderate: summarization, basic Q&A, template-based generation. The remaining 30% are genuinely complex: multi-step reasoning, nuanced generation, tasks where GPT-4o actually earns its price tag.

If you're routing 100% of those requests to GPT-4o at $2.50 per million input tokens and $10.00 per million output tokens, you're paying premium rates on 70% of requests that don't need it.

That's the Model Tax.

## Why it exists

The Model Tax isn't a bug in your code. It's a default in your architecture.

Most teams start with a single LLM provider — usually OpenAI — and wire every API call to their best model. It works. The outputs are good. And for the first few hundred dollars a month, nobody questions it.

Then usage grows. Your chatbot handles 50K requests a day. Your extraction pipeline processes thousands of documents. Your summarizer runs on every support ticket. Each call hits GPT-4o because that's what's in the config, and the bill climbs from $500/month to $5,000 to $15,000.

The problem isn't that GPT-4o is expensive. It's that you're using it for everything, including tasks where a $0.05/million-token model produces identical output.

## What the research says

UC Berkeley's RouteLLM research (ICLR 2025) demonstrated that up to 80% of typical LLM requests can be handled by smaller, cheaper models with equivalent quality for those tasks. The key insight: prompt complexity varies enormously, but most routing architectures treat every request the same.

Think about it this way. When you ask an LLM to extract a date from an email, you don't need the same model that can write a legal brief. But your infrastructure doesn't know the difference — so it sends both to the most expensive option.

## How to calculate yours

The Model Tax formula is straightforward:

**Model Tax = Current Spend − Routed Spend**

Where "Routed Spend" is what you'd pay if each request went to the cheapest model capable of handling it at equivalent quality.

For a team spending $10,000/month on GPT-4o across all requests:

- 40% simple tasks → route to Llama 3.1 8B on Groq ($0.05/1M input tokens) = ~$20/month
- 30% moderate tasks → route to GPT-4o-mini ($0.15/1M input tokens) = ~$450/month
- 30% complex tasks → keep on GPT-4o ($2.50/1M input tokens) = ~$3,000/month

**Routed total: ~$3,470/month. Model Tax: $6,530/month. That's a 65% waste.**

These numbers shift based on your traffic mix, but the pattern holds. If you're not routing by complexity, you're overpaying by 60-85%.

## Why teams don't fix it

Three reasons:

**It's invisible.** Your API dashboard shows total spend and request count. It doesn't show "here are the 12,000 requests this week that a cheaper model could have handled." You need to actually analyze your prompt distribution to see the waste.

**It feels risky.** Switching models feels like gambling with quality. What if the cheaper model gets it wrong? What if users notice? The fear of degradation keeps teams on the expensive default.

**It's an infrastructure problem, not an application problem.** The product team doesn't own the LLM bill. The infrastructure team doesn't own the prompt quality. The Model Tax lives in the gap between those two concerns.

## How to eliminate it

There are two approaches:

**Manual routing.** Classify your prompts yourself, set up multiple model endpoints, write routing logic, build quality monitoring. It works, but it's a significant engineering investment — and you'll spend weeks building infrastructure instead of shipping features.

**Intelligent routing.** Use a routing layer that sits between your app and your LLM providers, automatically analyzes each prompt's complexity, and routes to the cheapest capable model. This is what NeuralRouting does: Model Cascading sends simple tasks to economy models first, and the Shadow Engine validates responses against premium models in background to ensure quality never drops.

The difference: manual routing is a project. Intelligent routing is a drop-in.

## Your next step

You can't fix what you can't measure. The first step is seeing how much of your LLM spend is waste.

**[Calculate your Model Tax →](https://neuralrouting.io/model-tax)**

Plug in your monthly spend and request volume. The calculator shows exactly how much you're overpaying — and what your bill would look like with intelligent routing.$$,
  true,
  '2026-04-07 10:00:00+00',
  '2026-04-07 10:00:00+00'
);

INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'gpt4o-vs-gpt4o-mini-vs-open-source-pricing-2026',
  'GPT-4o vs GPT-4o-mini vs Open Source: When to Use Each (2026 Pricing Guide)',
  'Complete 2026 pricing comparison of GPT-4o, GPT-4o-mini, Claude, Gemini, and Llama 3. Per-token costs, when to use each model, and how to cut your LLM bill by routing intelligently.',
  'Architecture',
  '10 min read',
  NULL,
  $$GPT-4o costs $2.50 per million input tokens. GPT-4o-mini costs $0.15. That''s a 16x price difference — and for most of your API calls, the output quality is identical.

This guide breaks down every major LLM''s pricing in 2026, shows you which model fits which task, and explains why routing by complexity is the single highest-leverage cost optimization you can make.

## The 2026 LLM Pricing Table

All prices are per million tokens as of April 2026.

### OpenAI Models

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|----------------|----------|
| GPT-4o | $2.50 | $10.00 | 128K | Complex reasoning, nuanced generation, multi-step tasks |
| GPT-4o-mini | $0.15 | $0.60 | 128K | Summarization, classification, moderate Q&A, template generation |

### Anthropic Models

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|----------------|----------|
| Claude Opus 4.6 | $5.00 | $25.00 | 1M | Complex analysis, research, long-document processing |
| Claude Sonnet 4.6 | $3.00 | $15.00 | 1M | Balanced quality/cost, coding, detailed responses |
| Claude Haiku 4.5 | $1.00 | $5.00 | 200K | Fast classification, extraction, simple Q&A |

### Google Models

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|----------------|----------|
| Gemini 2.5 Pro | $1.25 | $10.00 | 1M | Complex reasoning at lower cost than GPT-4o |
| Gemini 2.5 Flash | ~$0.15 | ~$0.60 | 1M | High-speed, cost-effective general tasks |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | — | Ultra-cheap simple tasks |

### Open Source (via Groq)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Best For |
|-------|----------------------|------------------------|----------------|----------|
| Llama 3.1 70B | $0.59 | $0.79 | 128K | Strong open-source alternative for moderate-complex tasks |
| Llama 3.1 8B | $0.05 | $0.08 | 128K | Simple tasks, classification, extraction, reformatting |

## The cost gap is enormous

Let''s make this concrete. Say you process 10 million input tokens and 5 million output tokens per day.

**All requests on GPT-4o:**
(10M × $2.50 + 5M × $10.00) / 1M = $25 + $50 = **$75/day → $2,250/month**

**All requests on Llama 3.1 8B via Groq:**
(10M × $0.05 + 5M × $0.08) / 1M = $0.50 + $0.40 = **$0.90/day → $27/month**

That''s an 83x cost difference. Obviously you can''t send everything to Llama 3.1 8B — some tasks need GPT-4o''s reasoning. But that''s exactly the point: most tasks don''t, and the savings from routing those to cheaper models are massive.

## When to use each model

### Use GPT-4o ($2.50/$10.00) when:

The task requires multi-step reasoning, nuanced understanding of context, complex code generation, or creative writing where subtle quality differences matter. Examples: legal document analysis, multi-turn debugging sessions, research synthesis, generating marketing copy that needs to match a specific tone precisely.

Roughly 20-30% of production LLM requests fall into this category.

### Use GPT-4o-mini ($0.15/$0.60) when:

The task is moderate complexity: summarization, structured Q&A, template-based generation, sentiment analysis, basic code completion. The output quality for these tasks is functionally identical to GPT-4o at 1/16th the cost.

About 30% of requests fit here.

### Use Llama 3.1 8B on Groq ($0.05/$0.08) when:

The task is simple and well-defined: text classification, entity extraction, date parsing, reformatting JSON, yes/no decisions, language detection. These are tasks where any competent model produces the same output.

This covers roughly 40% of production requests — and it costs 50x less than GPT-4o.

### The routing sweet spot

A well-routed traffic mix looks like this:

| Tier | Model | % of Requests | Monthly Cost (at 10M tokens/day) |
|------|-------|---------------|----------------------------------|
| Economy | Llama 3.1 8B | 40% | ~$11/month |
| Mid-tier | GPT-4o-mini | 30% | ~$135/month |
| Premium | GPT-4o | 30% | ~$675/month |
| **Total** | | | **~$821/month** |

Compared to $2,250/month if everything hits GPT-4o, that''s a **64% reduction**.

## The question nobody asks

Here''s what most pricing guides miss: knowing the prices isn''t the hard part. The hard part is knowing which of your requests can safely use a cheaper model.

You need to analyze prompt complexity in real time — task type, reasoning depth, acceptable error tolerance — and route each request to the cheapest model that can handle it at equivalent quality. Then you need to validate that the cheaper model actually delivered.

This is what Model Cascading does. Simple requests cascade to economy models first. If the economy model''s confidence is low, the request escalates to the next tier. And the Shadow Engine runs background validation against premium models to make sure quality never silently degrades.

The result: your traffic automatically distributes across the optimal price-quality curve without you manually classifying every prompt type.

## Batch API and caching: additional savings

Beyond model routing, two more optimizations stack on top:

**Batch APIs.** Both OpenAI and Anthropic offer 50% discounts for non-real-time workloads. If your pipeline can tolerate async processing (document analysis, nightly report generation, bulk classification), batch pricing cuts costs in half on top of any routing savings.

**Semantic Caching.** If you''re seeing repeated or near-identical prompts (common in customer support, FAQ, and templated workflows), caching responses at the semantic level eliminates the API call entirely. NeuralRouting''s 2-level Semantic Cache (exact match + vector similarity) saves 30-40% of calls.

Stack all three — routing + batching + caching — and the compounding effect is significant.

## Calculate your savings

Stop guessing. Plug your numbers into the calculator and see exactly what your LLM bill would look like with intelligent routing.

**[See how much you''d save with routing →](https://neuralrouting.io/model-tax)**$$,
  true,
  '2026-04-14 10:00:00+00',
  '2026-04-14 10:00:00+00'
);

INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  '5-ways-cut-openai-api-bill-without-losing-quality',
  '5 Ways to Cut Your OpenAI API Bill Without Sacrificing Quality',
  'Your OpenAI API bill is 60-85% higher than it needs to be. Here are 5 proven methods to cut LLM costs in production without degrading output quality.',
  'Engineering',
  '9 min read',
  NULL,
  $$Your OpenAI bill hit $8,000 last month and it''s climbing. You know you''re overpaying, but you''re afraid that touching the model configuration will break something. Here are five methods to cut that bill dramatically — ranked by impact — without degrading a single user-facing response.

## 1. Route requests by complexity (saves 60-85%)

This is the highest-leverage optimization and the one most teams skip entirely.

The premise is simple: not every API call needs GPT-4o. When your app asks an LLM to extract a date from an email, classify a support ticket, or reformat a JSON blob, GPT-4o produces the same output as a model that costs 50x less. But your code sends it to GPT-4o anyway, because that''s what''s in the config.

UC Berkeley''s RouteLLM research (ICLR 2025) showed that up to 80% of typical requests can be handled by smaller models at equivalent quality. The practical impact: if you''re spending $10K/month and routing 70% of traffic to economy models, your bill drops to $3,000-$4,000.

**How to implement it:**

The manual approach: audit your prompt types, classify them by complexity, and set up separate endpoints for each tier. This works, but it''s a multi-week engineering project and you''ll need to maintain the classification logic as your product evolves.

The automated approach: use an intelligent routing layer like [NeuralRouting](https://neuralrouting.io) that analyzes each prompt''s complexity in real time and routes to the cheapest capable model. Model Cascading sends simple tasks to economy models first, and the Shadow Engine validates quality in background. Drop-in setup, no prompt classification required.

**Impact:** 60-85% cost reduction on your total LLM spend.

## 2. Cache repeated and similar prompts (saves 30-40%)

Look at your API logs. You''ll find the same prompts — or near-identical ones — hitting the API over and over. Customer support bots answering the same ten questions. Extraction pipelines running the same template against different documents. Summarizers processing similar content.

Every repeated call is money wasted on a response you already have.

**How to implement it:**

At the basic level, hash your prompts and store responses in Redis. If the exact same prompt comes in, return the cached response. Cost: $0.

At the advanced level, implement semantic caching with vector similarity. Two prompts that mean the same thing but are worded differently ("What''s your return policy?" vs "How do I return an item?") should return the same cached response. This requires embedding your prompts and doing similarity search, but it catches 3-5x more cache hits than exact matching alone.

NeuralRouting''s Semantic Cache uses a 2-level approach: exact match first (instant, zero-cost), then vector similarity with a configurable threshold. Teams with repetitive workloads see 30-40% of calls eliminated entirely.

**Impact:** 30-40% reduction in total API calls — stacks on top of routing savings.

## 3. Use the Batch API for non-real-time workloads (saves 50%)

OpenAI''s Batch API gives you a flat 50% discount on both input and output tokens. The tradeoff: responses come back within 24 hours instead of in real time.

If your pipeline includes any of these, batch them:

- Nightly report generation
- Bulk document classification or extraction
- Data enrichment jobs
- Content moderation backlogs
- Training data labeling
- Analytics summarization

**How to implement it:**

Separate your workloads into "real-time" (user-facing, needs sub-second response) and "async" (backend, can wait minutes or hours). Send async workloads through the Batch API endpoint. OpenAI and Anthropic both offer this — Anthropic gives the same 50% discount.

**Impact:** 50% cost reduction on all batch-eligible workloads. For teams where 40% of volume is async, that''s an additional 20% off the total bill.

## 4. Optimize your prompts (saves 20-40%)

Long prompts cost more. Every token in your system prompt, every few-shot example, every verbose instruction — you''re paying for it on every single request.

Most production prompts are bloated. They were written during development when clarity mattered more than efficiency, and nobody went back to trim them.

**How to implement it:**

Audit your top 10 prompts by volume. For each one:

- Remove redundant instructions. If you say "respond in JSON format" and also "your response should be formatted as JSON," that''s wasted tokens.
- Compress few-shot examples. Three examples usually work as well as five. One well-chosen example often works as well as three.
- Shorten system prompts. The model doesn''t need a paragraph of context if a sentence will do.
- Use structured output mode instead of prompt-based formatting instructions. OpenAI''s JSON mode and function calling eliminate the need for format instructions entirely.

A 30% reduction in average prompt length translates directly to a 30% reduction in input token costs.

**Impact:** 20-40% reduction in input token costs, depending on how bloated your current prompts are.

## 5. Set max token limits and use streaming wisely (saves 10-20%)

Two quick wins that most teams overlook:

**Max tokens.** If your classification endpoint only needs a one-word response ("positive" / "negative"), set `max_tokens` to 10 instead of leaving it at the default. You''re paying for output tokens — don''t let the model ramble when you need a short answer.

**Stop sequences.** For structured outputs, define stop sequences that cut generation as soon as the useful content is complete. This prevents the model from generating explanatory text after the JSON blob you actually need.

**Streaming.** This doesn''t save money directly, but it reduces perceived latency. For user-facing applications, streaming the response token-by-token lets users start reading immediately. Combined with routing (where economy models are often faster), the UX actually improves while costs drop.

**Impact:** 10-20% reduction in output token costs.

## Stack them for compounding savings

These optimizations aren''t mutually exclusive. They compound:

| Optimization | Savings | Cumulative Bill (starting $10K/month) |
|-------------|---------|---------------------------------------|
| Baseline | — | $10,000 |
| 1. Route by complexity | -65% | $3,500 |
| 2. Semantic caching | -35% | $2,275 |
| 3. Batch async workloads | -20% (of async portion) | $1,900 |
| 4. Optimize prompts | -25% input tokens | $1,550 |
| 5. Token limits | -15% output tokens | $1,350 |

From $10,000 to $1,350. That''s an **86.5% reduction** — and output quality is identical because you''re still using GPT-4o for the requests that actually need it.

## See your numbers

Every team''s traffic mix is different. The split between simple, moderate, and complex requests determines your specific savings. Instead of estimating, calculate it.

**[Calculate your savings →](https://neuralrouting.io/model-tax)**

Plug in your monthly spend and request volume. See exactly how much of your bill is Model Tax — the invisible cost of not routing by complexity.$$,
  true,
  '2026-04-21 10:00:00+00',
  '2026-04-21 10:00:00+00'
);

INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'model-cascading-explained-netflix-style-llm-routing',
  'Model Cascading Explained: How Netflix-Style Routing Works for LLMs',
  'Model Cascading routes each LLM request to the cheapest model that can handle it, starting from the bottom. Here''s exactly how it works — from prompt analysis to quality validation.',
  'Engineering',
  '10 min read',
  NULL,
  $$Netflix doesn''t stream every show at 4K. It adapts the quality to your connection — high resolution when you have bandwidth, lower when you don''t. The experience stays good either way, and it saves enormous amounts of bandwidth.

Model Cascading applies the same principle to LLM requests. Instead of sending every prompt to your most expensive model, you start at the cheapest tier and only escalate when the task requires it. The result: 60-85% lower costs, same output quality.

Here''s exactly how it works.

## The core idea

A cascading system has three components:

**A model tier list.** An ordered set of models from cheapest to most expensive. For example: Llama 3.1 8B ($0.05/1M input tokens) → GPT-4o-mini ($0.15/1M) → GPT-4o ($2.50/1M).

**A complexity analyzer.** A fast classifier that looks at each incoming prompt and estimates how much reasoning power it needs. This runs before the LLM call — think of it as a triage nurse before the doctor.

**An escalation policy.** Rules that determine when a request should jump to the next tier. If the economy model''s output confidence is below threshold, the request automatically escalates.

Put them together: every request enters at the bottom tier, gets routed to the cheapest model that can handle it, and only escalates if needed. Most requests never need to escalate.

## How prompt complexity analysis works

The complexity analyzer is the intelligence behind the cascade. It needs to answer one question fast: "How hard is this prompt?"

There are several signals it can evaluate:

**Task type detection.** Classification, extraction, and reformatting are structurally simple — they have well-defined inputs and outputs. Open-ended generation, multi-step reasoning, and nuanced summarization are structurally complex. A fast classifier can detect task type from the prompt structure in milliseconds.

**Reasoning depth estimation.** Prompts that require chaining multiple logical steps ("Given X and Y, determine Z, then use Z to...") need more capable models. Single-step instructions ("Extract the date from this text") don''t. The number of conditional clauses, nested requirements, and implicit constraints in a prompt correlates strongly with required model capability.

**Input complexity.** Long, multi-document inputs with cross-references are harder than short, focused inputs. Technical or domain-specific language may require a model trained on more data.

**Output format requirements.** Generating a simple JSON object is easier than generating a coherent 500-word essay. Structured output tasks can be served by smaller models more reliably.

**Risk level.** Some tasks are low-risk (internal classification, data reformatting) and some are high-risk (customer-facing generation, legal text). Risk tolerance should factor into routing — you might always send high-risk prompts to a premium model regardless of complexity.

The analyzer assigns a complexity score — say, 0 to 100 — and the cascading engine maps that score to a model tier.

## The escalation flow

Here''s how a request moves through a typical cascade:

**Step 1: Analyze.** The incoming prompt hits the complexity analyzer. Score: 22 out of 100. That''s a low-complexity task — probably classification or extraction.

**Step 2: Route to economy tier.** The prompt goes to Llama 3.1 8B on Groq. Response time: ~100ms. Cost: negligible.

**Step 3: Confidence check.** The system evaluates the response. Is the output well-formed? Does it match the expected format? Is the model''s confidence above threshold? If yes — done. Return the response. Total cost: a fraction of a cent.

**Step 4: Escalate (if needed).** If the economy model''s response is uncertain or malformed, the request escalates to GPT-4o-mini. Same confidence check. If that''s not enough, escalate to GPT-4o. Each tier costs more but has a higher probability of handling the request well.

In practice, 60-80% of requests resolve at the economy tier. Another 15-25% resolve at mid-tier. Only 5-15% need the premium model.

## Shadow validation: the quality guarantee

The biggest concern with cascading is quality degradation. If you''re routing 70% of requests to cheaper models, how do you know the outputs are good enough?

This is where the Shadow Engine comes in.

For a configurable percentage of economy-tier responses, the Shadow Engine sends the same prompt to a premium model in the background. It then compares the two responses. If they match (same classification, same extraction, same semantic content), the economy model is validated. If they diverge, the system flags the discrepancy — and the Confidence Matrix updates its understanding of which prompt types the economy model handles well.

The Shadow Engine runs asynchronously. It doesn''t add latency to the user-facing response. And it provides continuous, data-driven validation that the cascade is working correctly.

Over time, the Confidence Matrix builds a map: "For prompts that look like X, the economy model matches the premium model 98% of the time." That map gets more accurate with every request, and the routing gets more aggressive — safely.

## Building it yourself vs. using a router

You can build a basic cascade in a weekend. Two model endpoints, an if/else on prompt length, done. But production cascading requires:

- A complexity analyzer that works across task types, not just prompt length
- Confidence scoring on model outputs
- Background quality validation (Shadow Engine)
- Self-improving routing that gets better over time (Confidence Matrix)
- Failover handling when a provider goes down mid-cascade
- Latency management — the analysis step can''t add 500ms to every request
- Observability — dashboards showing routing distribution, quality scores, cost savings

That''s not a weekend project. It''s a platform.

[NeuralRouting](https://neuralrouting.io) is that platform. It sits between your app and your LLM providers as a drop-in SDK. Model Cascading, Shadow Engine validation, Confidence Matrix learning, multi-provider failover, and Semantic Caching — all in one routing layer. One endpoint, five lines of integration code.

## When cascading works best

Model Cascading delivers the highest ROI when:

- You process more than 10K LLM requests per day
- Your prompts vary in complexity (not all creative writing, not all classification)
- You''re using a premium model (GPT-4o, Claude Opus) for everything
- Your monthly LLM spend exceeds $1,000
- You have both user-facing and backend workloads

If 90% of your prompts are the same type and same complexity, cascading helps less. But most production workloads have a wide distribution — and that''s where the 60-85% savings live.

## See it in action

Want to see how cascading would classify your actual prompts? The Prompt Analyzer takes any prompt and shows you its complexity score, recommended model tier, and estimated cost at each tier.

**[Try it on your own prompts →](https://neuralrouting.io/analyzer)**$$,
  true,
  '2026-04-28 10:00:00+00',
  '2026-04-28 10:00:00+00'
);

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
