-- Blog Posts Week 3: Claude costs, Agent optimization, OpenAI alternatives
-- Run in Supabase SQL Editor

-- ARTICLE 1: Reduce Claude API Costs
INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'reduce-claude-api-costs-guide',
  'How to Reduce Claude API Costs by 60-80% Without Sacrificing Quality',
  'Claude Opus 4.6 costs $5/$25 per MTok. Most teams overpay by 3-5x. Learn how model routing, prompt caching, batch API, and semantic caching cut your Anthropic bill by 60-80%.',
  'Engineering',
  '10 min read',
  NULL,
  $$Everyone writes about reducing OpenAI costs. Almost nobody talks about Anthropic.

That''s weird, because Claude Opus 4.6 costs $5/$25 per million tokens (input/output), and Sonnet 4.6 sits at $3/$15. These aren''t cheap. If you''re running a production app on Claude and you''re not thinking about cost optimization, you''re probably spending 3-5x more than you need to.

I went through this myself while building NeuralRouting. Here''s what actually moves the needle, ranked by impact.

## The biggest mistake: using Opus for everything

Opus 4.6 is a beast. It scores highest on reasoning benchmarks, handles complex multi-step problems, and gives you a 1M token context window at standard pricing. It also costs 5x more than Haiku 4.5.

The problem is that most requests don''t need Opus. A customer support response, a text summary, a simple classification — Haiku handles these fine. Sonnet covers the middle ground. Opus should only touch the hard stuff.

A rough breakdown:

- **Haiku 4.5 ($1/$5 per MTok)**: Classification, extraction, simple Q&A, content moderation, translation
- **Sonnet 4.6 ($3/$15 per MTok)**: Code generation, analysis, longer-form writing, multi-step reasoning
- **Opus 4.6 ($5/$25 per MTok)**: Complex research, agentic workflows, tasks where accuracy is critical

Most production workloads are 60-70% simple tasks. That means 60-70% of your requests could run on a model that costs 80% less. The math here isn''t complicated — it''s just that nobody bothers to do it.

## Prompt caching: the single biggest cost lever

Anthropic''s prompt caching is genuinely impressive, and I don''t think enough teams use it. The idea is simple: if you''re sending the same system prompt or document context with every request, you''re paying full input token price every time.

With caching, the first request pays a small premium (1.25x for 5-minute TTL, 2x for 1-hour TTL). Every subsequent request that hits cache pays 10% of the standard input price.

Quick example with Sonnet 4.6:

Your system prompt is 50,000 tokens. Without caching, 20 requests cost you $3.00 in system prompt tokens alone. With 5-minute caching, the first request costs $0.19 (write), and the next 19 cost $0.015 each. Total: $0.47.

That''s an 84% reduction on input costs, just from caching.

The catch: your cache only lives for 5 minutes (or 1 hour at the higher write cost). If your requests are spaced further apart, you won''t get hits. For chatbots and agents that process multiple requests in quick succession, this is free money.

## Batch API: 50% off if you can wait

Anthropic''s Batch API gives you a flat 50% discount on everything — input and output tokens — in exchange for async processing within 24 hours.

This works for:

- Content generation pipelines
- Document analysis batches
- Data classification at scale
- Anything that doesn''t need a real-time response

Stack batch processing with prompt caching and you''re looking at up to 95% total savings on eligible workloads. That number sounds aggressive but it''s straight from Anthropic''s documentation.

The limitation is obvious: if your user is waiting for a response, batch doesn''t help. But a surprising amount of production AI work isn''t user-facing. Log analysis, content pipelines, scheduled reports — all of this can run async.

## Model routing: automate the model selection

Here''s where I''m biased, because this is what NeuralRouting does. But the concept matters regardless of what tool you use.

The idea: instead of hardcoding `model: "claude-opus-4.6"` in every API call, route each request to the cheapest model that can handle it. Score the prompt complexity, check if it''s a simple task or a hard one, and pick accordingly.

You can do this manually with if/else logic. It works until you have 50 different prompt types and the rules get messy. Or you can use a router that does it automatically.

Either way, the principle is the same: match the model to the task. A $5 model answering a $1 question is waste. Not dramatic waste — just steady, compounding, unnecessary spending that adds up to thousands per month at scale.

## Semantic caching: stop paying for repeat questions

This is different from Anthropic''s prompt caching. Semantic caching stores the actual LLM responses and returns them when a similar enough question comes in.

"What''s your return policy?" and "How do I return a product?" are different strings but the same question. Exact-match caching misses this. Semantic caching catches it.

In production, we see 30-40% cache hit rates on typical customer-facing applications. That''s 30-40% of your requests answered instantly at zero token cost.

The tradeoff: you need a vector database (pgvector works fine) and you need to decide on a similarity threshold. Too loose and you''ll serve wrong answers. Too tight and you won''t get many hits. 0.92-0.95 cosine similarity is a decent starting point.

## Trim your context window

This one''s boring but it matters. Every token you send costs money. Long conversation histories, bloated system prompts, documents included "just in case" — all of it adds up.

Some practical cuts:

- Summarize conversation history instead of sending the full transcript after 10+ turns
- Only include document sections relevant to the current query, not the entire document
- Keep system prompts tight — every word costs tokens and most system prompts are 3x longer than they need to be
- Use Haiku to pre-process and extract relevant chunks before sending to a more expensive model

A 200K token input on Opus 4.6 costs $1.00. The same information compressed to 20K tokens costs $0.10. Same answer, 90% cheaper input.

## What this looks like combined

Let''s say you''re running a production app doing 100K Claude requests per month on Opus 4.6.

**Before optimization:**
- Average 2K tokens in, 500 tokens out per request
- Cost: (100K × 2K × $5/1M) + (100K × 500 × $25/1M) = $1,000 + $1,250 = $2,250/month

**After routing + caching + context trimming:**
- 70% of requests routed to Haiku ($1/$5)
- 20% to Sonnet ($3/$15)
- 10% stays on Opus ($5/$25)
- 35% cache hit rate eliminates those requests entirely
- Average context trimmed 40%

Effective cost: roughly $350-500/month. That''s a 75-85% reduction.

These aren''t theoretical numbers. They''re based on the routing patterns we see in the NeuralRouting pipeline. Your mileage varies depending on your workload mix, but the direction is consistent.

## But won''t prices just keep dropping?

Anthropic keeps making their models cheaper. Opus 4.6 is 67% cheaper than Opus 4.1 was. Haiku 4.5 is dirt cheap. The pricing trend is clearly downward.

So you could just wait and let the prices drop. But "wait for it to get cheaper" isn''t a cost strategy. You''re overpaying right now, today, on every request. And the techniques here — routing, caching, context management — work regardless of what the per-token price is. When Anthropic drops prices again, your optimized setup gets even cheaper.

Start with the easy wins: prompt caching and model tiering. Those two alone will cut your bill in half. Then add semantic caching and routing when you''re ready for the next jump.$$,
  true,
  '2026-04-10 10:00:00+00',
  '2026-04-10 10:00:00+00'
);

-- ARTICLE 2: AI Agent Cost Optimization
INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'ai-agent-cost-optimization',
  'Why Your AI Agents Are Burning Money (And How to Stop It)',
  'AI agents consume 10-50x more tokens than chatbots. Learn how agent loop detection, per-step model routing, and context compression cut agent costs by 65-75%.',
  'Engineering',
  '9 min read',
  NULL,
  $$AI agents are incredible at racking up your API bill.

A chatbot sends a message, gets a response, done. An agent reads 15 files, calls 4 tools, retries twice when something fails, and accumulates context across dozens of turns. By the time it finishes a task, it might have consumed 500K+ tokens. On Opus 4.6 at $5/$25 per MTok, that single agent session costs $2-5 before you even count the output.

Multiply that by hundreds of users, and you''ve got a problem that no amount of fundraising solves.

I''ve been thinking about this a lot while building NeuralRouting, because agent workloads are where cost optimization matters most — and where most teams are doing it worst.

## The agent cost problem is different from chatbot costs

With a chatbot, costs are roughly predictable. User sends message, model responds, you can estimate the average cost per conversation. Easy.

Agents are different in three ways that mess up your budget:

**Token accumulation.** Every turn appends to the conversation history. An agent that takes 20 steps to complete a task resends the entire context on each step. By step 20, you''re paying input token costs on a massive context window — not because the task is complex, but because the conversation grew.

**Tool call overhead.** Each tool call generates tokens for the function definition, the arguments, the result, and the model''s interpretation of the result. A coding agent that reads a file, edits it, runs tests, and reads the error output can burn through 50K tokens just on the tool call overhead.

**Retry loops.** When an agent hits an error, it retries. Sometimes it retries the same thing 3-4 times with slightly different approaches. Each retry resends the full context. These loops are where money goes to die.

Cognition (the team behind Devin) measured that 60% of agent compute goes to search and context retrieval — reading files, looking things up — not to actual code generation. You''re paying input prices for the agent to think about what to do, not for the output you actually want.

## Agent loop detection: the first thing to fix

The most expensive agent failure mode is the infinite loop. Agent tries something, fails, tries a variation, fails, tries another variation, and keeps going. I''ve seen sessions where an agent burned through $10-15 in tokens looping on a problem it was never going to solve.

You need a kill switch. Here''s what to look for:

- **Step limits.** Set a hard cap on how many turns an agent can take per task. 25-30 is reasonable for most workflows. If it hasn''t solved it in 30 steps, it''s not going to.
- **Repetition detection.** If the agent is sending substantially similar tool calls on consecutive turns, something is stuck. Flag it and escalate to a human or a different model.
- **Cost caps per session.** Set a dollar limit. When a session crosses $2 (or whatever your threshold is), kill it. No task is worth infinite money.

NeuralRouting has agent loop detection built into the routing layer, which catches these before they spiral. But even a simple counter on your side works. The point is that you need *something*.

## Route agent steps individually

Most teams get this wrong. They pick a model for the agent — say Opus 4.6 — and every step runs on Opus. But agent tasks aren''t uniformly complex.

A typical coding agent session might look like:

1. Read the file structure → **Simple, Haiku can do this**
2. Analyze the error message → **Medium, Sonnet handles it**
3. Generate a fix → **Complex reasoning, Opus makes sense here**
4. Write the code → **Medium, Sonnet**
5. Run tests and interpret results → **Simple, Haiku**
6. Summarize what was done → **Simple, Haiku**

Out of 6 steps, only 1 actually needs Opus. But most teams run all 6 on Opus because it''s easier to configure.

If you route each step to the right model:
- Steps 1, 5, 6 on Haiku 4.5: $1/$5 per MTok
- Steps 2, 4 on Sonnet 4.6: $3/$15 per MTok
- Step 3 on Opus 4.6: $5/$25 per MTok

That''s roughly 50-60% cheaper than running everything on Opus. Same output quality, because the easy steps don''t need a frontier model.

The challenge is that most agent frameworks don''t support per-step model selection natively. You either have to hack it yourself or use a routing layer (like NeuralRouting) that scores each step''s complexity and picks the model automatically.

## Cache aggressively between agent steps

Agents are repetitive by nature. The system prompt, the project context, the conversation history up to the current point — all of this gets resent on every turn.

Anthropic''s prompt caching helps here. If your agent''s system prompt is 50K tokens and you cache it, every subsequent step costs 90% less on those 50K tokens. Over a 20-step session, that saves you a lot.

But there''s a more interesting opportunity: semantic caching across users. If 10 different users ask their agents to do roughly the same thing ("fix the type error in the login component"), the first agent does the work and the next 9 get a cached response. This only works for common enough requests, but in production apps with many users doing similar tasks, it adds up.

## Compress context between turns

This is an aggressive optimization but it works: instead of keeping the full conversation history, summarize older turns into a compact representation.

The agent doesn''t need the exact text of step 3 when it''s on step 18. It needs to know what happened. A 200-token summary of "read the user model, found a missing validation on the email field" carries the same information as the 5,000 tokens of the original tool call and response.

Use a cheap model (Haiku) to summarize older context, then feed the compressed version to the expensive model for the current step. You''re trading a few cents on summarization for dollars saved on context that would otherwise keep growing.

The risk: you lose detail. If the agent needs to reference something specific from step 3, the summary might not have it. A good middle ground is keeping the last 3-5 steps in full detail and summarizing everything before that.

## Extended thinking: powerful but expensive

Claude''s extended thinking feature lets the model reason step-by-step before producing a response. The thinking tokens are billed as output tokens at the same rate.

For agents, this gets expensive fast. A complex reasoning step might generate 3,000-5,000 thinking tokens at $25/MTok (on Opus). That''s $0.075-$0.125 just for the model to think, before it produces any visible output.

Extended thinking is worth it on hard problems where accuracy matters. It''s waste on simple steps. If your agent is using extended thinking on "read this file and tell me what''s in it," you''re paying for thinking the model doesn''t need to do.

Route the thinking budget like you route the model: simple steps get no extended thinking, complex steps get it when needed.

## What real savings look like

A team running a coding agent on Claude Opus 4.6, no optimization:

- Average session: 25 steps, 400K total input tokens, 80K output tokens
- Cost per session: $2.00 input + $2.00 output = $4.00
- 500 sessions/day = $2,000/day = $60,000/month

After per-step routing + caching + context compression + loop detection:

- 60% of steps routed to cheaper models
- Prompt caching cuts input costs 40% on cached portions
- Context compression reduces average input tokens by 30%
- Loop detection kills 5% of sessions early that would''ve been 3x more expensive

Effective cost: roughly $15,000-20,000/month. Still not cheap, but 65-75% cheaper than the starting point.

## This only gets worse from here

The agent cost problem is only going to get worse. As agents take on more complex, longer-running tasks, token consumption per session will grow. Models will get cheaper per token, but sessions will get longer. The net effect on your bill depends on which trend wins.

The teams that''ll be fine are the ones treating token cost as an engineering problem right now — routing, caching, compressing, and monitoring — instead of hoping that the next model price drop saves them.

If you''re building with agents and your cost monitoring consists of checking your Anthropic dashboard once a week, you''re going to be surprised at some point. Probably soon.$$,
  true,
  '2026-04-11 10:00:00+00',
  '2026-04-11 10:00:00+00'
);

-- ARTICLE 3: OpenAI Alternative APIs
INSERT INTO posts (slug, title, excerpt, tag, read_time, cover_image, content, published, created_at, updated_at)
VALUES
(
  'openai-alternative-api-2026',
  'OpenAI Alternative APIs in 2026: Drop-In Replacements That Actually Work',
  'Need an OpenAI alternative API? We compare LiteLLM, OpenRouter, Cloudflare AI Gateway, Vercel, and NeuralRouting — compatibility, latency, routing, and real costs.',
  'Architecture',
  '8 min read',
  NULL,
  $$You built your app on OpenAI. It works. Your code imports the OpenAI SDK, every request hits `api.openai.com`, and your billing goes to one place.

Then one of three things happens: your bill gets too high, OpenAI has an outage and your app goes down with it, or you realize GPT-4o is overkill for half your requests.

Now you need an alternative. But rewriting your integration from scratch isn''t an option — you''ve got production traffic and you can''t afford to break things. What you want is a drop-in replacement. Change the base URL, keep everything else the same.

Here''s what actually exists in 2026 and what the tradeoffs are. I''m going to be direct about what works and what doesn''t because I''ve tested most of these while building NeuralRouting.

## What "OpenAI-compatible" actually means

When a service says it''s "OpenAI-compatible," they mean it accepts the same API format: same endpoint structure, same request body, same response shape. You change `base_url` in your OpenAI SDK client and it just works.

In theory.

In practice, compatibility varies. Some services handle chat completions fine but break on function calling. Others work for basic requests but don''t support streaming. A few claim compatibility but return slightly different JSON structures that crash your parsing code.

Before you switch anything in production, test your actual request patterns — not just a hello-world call.

## The options, honestly

### Direct provider APIs (Anthropic, Google, Mistral, etc.)

Going straight to another provider gives you the best pricing and the most control. Anthropic''s Claude, Google''s Gemini, Mistral''s models — they all have APIs, and they''re all competitive on price.

The catch: none of them use the OpenAI format natively. Anthropic has its own message format. Google has a different structure. Mistral is closer to OpenAI''s format but not identical.

So you''re either rewriting your integration code or using a translation layer. For a single alternative provider, rewriting might be fine. For multiple providers, it gets messy.

**Best for:** Teams committed to switching to one specific provider.

### LiteLLM (open-source proxy)

LiteLLM is the most popular open-source option for unifying multiple LLM providers behind a single OpenAI-compatible API. It supports 100+ providers, handles format translation, and you self-host it.

I used it early on and it works for prototyping. The problems show up at scale:

- Python-based, so it adds real latency under heavy load (hundreds of milliseconds at high QPS)
- No intelligent routing — it''s a proxy, not a router. You still pick which model to call.
- Limited observability out of the box
- You own the infrastructure: hosting, scaling, monitoring, all on you

**Best for:** Dev teams comfortable with self-hosting who want multi-provider access without lock-in.

### OpenRouter (managed service)

OpenRouter gives you one API endpoint and access to 200+ models. Pay-as-you-go with a credit system. The format is OpenAI-compatible.

It''s the fastest way to try different models. The downside is a markup on top of provider prices — typically 5% — which gets expensive at volume. At $100K/month in inference spending, you''re paying $5K just for the routing layer.

Also no intelligent routing. You pick the model. OpenRouter just proxies the request.

**Best for:** Prototyping, hackathons, and low-volume production where convenience beats cost.

### Cloudflare AI Gateway

Sits on Cloudflare''s edge network. Good latency, basic caching, request logging. Easy to set up if you''re already on Cloudflare.

The routing is basic — availability-based, not intelligence-based. It won''t look at your prompt and decide whether to use a cheap or expensive model. You still make that decision.

**Best for:** Teams already on Cloudflare who want basic observability and caching with minimal setup.

### Vercel AI Gateway

Tightly integrated with Vercel''s platform and the Vercel AI SDK. Sub-20ms routing latency. Nice for frontend teams building AI features.

Limited outside the Vercel ecosystem. If you''re not deploying on Vercel, there''s not much reason to use this over other options.

**Best for:** Frontend teams building AI apps on Vercel.

### NeuralRouting

This is what I''ve been building, so take this section with the appropriate grain of salt.

NeuralRouting is OpenAI SDK compatible — you change your base URL to `neuralrouting.io/v1` and your API key, and your existing code works. But instead of proxying your request to a single provider, it scores the prompt complexity and routes to the cheapest model that can handle it.

Simple question? Goes to an economy model at $0.50/MTok. Complex reasoning? Routes to GPT-4o or Opus. The routing decision happens in under 1ms with a local classifier — no API call needed for the routing itself.

It also includes semantic caching (exact + vector similarity), a Shadow Engine that benchmarks economy model quality against premium, and agent loop detection. If a provider goes down, requests failover automatically.

The honest limitations: I only support OpenAI and Groq right now. Two providers. I know that''s thin. More are coming, but I''m not going to list a dozen providers on the landing page when I''ve only tested two in production.

**Best for:** Teams that want automatic cost optimization, not just multi-provider access.

## The real question: proxy or router?

Most "OpenAI alternative APIs" are proxies. They translate formats and forward requests. You still decide which model to use.

A router makes that decision for you. It looks at the request, evaluates complexity, and picks the model. The difference matters because the biggest cost savings come from model selection, not from which provider you''re calling.

If you''re sending every request to GPT-4o through a proxy, you''re paying GPT-4o prices regardless of which proxy you use. A router sends the simple stuff to cheaper models and keeps the expensive model for hard problems.

For most teams, that model-selection layer saves more money than provider arbitrage ever will. The price difference between GPT-4o on OpenAI vs. GPT-4o on Azure is marginal. The price difference between GPT-4o and Haiku 4.5 is 10-50x.

## How to evaluate any alternative

Before switching, test these things:

**Compatibility.** Send your actual production request patterns — including function calls, streaming, system prompts — and verify the responses parse correctly.

**Latency.** Measure added latency from the proxy/router layer. Anything over 50ms overhead starts affecting user experience.

**Failover.** Kill a provider connection and see what happens. Does the service reroute? How fast? Or does your app just break?

**Cost transparency.** Can you see per-request costs? Per-model breakdowns? If you can''t measure it, you can''t optimize it.

**Lock-in.** How hard is it to leave? If the service wraps your requests in a proprietary format, you''re trading one lock-in for another. OpenAI SDK compatibility should work both directions — easy to join, easy to leave.

## The boring conclusion

The best OpenAI alternative depends on what problem you''re solving:

If you just want a backup provider for outages, any proxy works. LiteLLM is free and does the job.

If you want to try different models without rewriting code, OpenRouter gets you there fastest.

If you want to reduce costs automatically without changing how your app works, you need a router that selects models by task complexity — that''s what NeuralRouting does.

Whatever you pick, stop hardcoding a single provider and a single model. That''s the one decision that costs you the most, and it''s the easiest one to fix.$$,
  true,
  '2026-04-12 10:00:00+00',
  '2026-04-12 10:00:00+00'
);
