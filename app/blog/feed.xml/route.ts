import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

const SITE = "https://neuralrouting.io";
const FEED_URL = `${SITE}/blog/feed.xml`;
const TITLE = "NeuralRouting — AI Cost Engineering Blog";
const SUBTITLE =
  "LLM cost benchmarks, routing architecture, and AI infrastructure research from the NeuralRouting team.";
const AUTHOR_NAME = "Juan Miranda";
const AUTHOR_URL = `${SITE}/about`;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, tag, published_at, updated_at, created_at")
    .eq("published", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(50);

  const list = posts ?? [];
  const latest = list[0];
  const updated = (latest?.updated_at || latest?.published_at || new Date().toISOString());

  const entries = list
    .map((p) => {
      const postUrl = `${SITE}/blog/${p.slug}`;
      const published = p.published_at || p.created_at;
      const postUpdated = p.updated_at || published;
      return `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${postUrl}" />
    <id>${postUrl}</id>
    <updated>${new Date(postUpdated).toISOString()}</updated>
    <published>${new Date(published).toISOString()}</published>
    ${p.tag ? `<category term="${escapeXml(p.tag)}" />` : ""}
    ${p.excerpt ? `<summary>${escapeXml(p.excerpt)}</summary>` : ""}
    <author>
      <name>${AUTHOR_NAME}</name>
      <uri>${AUTHOR_URL}</uri>
    </author>
  </entry>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(TITLE)}</title>
  <subtitle>${escapeXml(SUBTITLE)}</subtitle>
  <link rel="self" href="${FEED_URL}" />
  <link href="${SITE}/blog" />
  <id>${FEED_URL}</id>
  <updated>${new Date(updated).toISOString()}</updated>
  <author>
    <name>${AUTHOR_NAME}</name>
    <uri>${AUTHOR_URL}</uri>
  </author>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
