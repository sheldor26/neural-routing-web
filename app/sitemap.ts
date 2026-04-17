import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://neuralrouting.io";
  const now = new Date();

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at, published_at")
    .eq("published", true)
    .lte("published_at", new Date().toISOString());

  const postUrls: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: base,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/pricing`,             lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/docs`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/blog`,                lastModified: now, changeFrequency: "daily",   priority: 0.85 },
    { url: `${base}/how-it-works`,        lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/about`,                             lastModified: now, changeFrequency: "monthly", priority: 0.70 },
    { url: `${base}/sign-up`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/reduce-openai-costs`,               lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/llm-cost-optimization`,             lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/model-tax`,                         lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/analyzer`,                          lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/vs/portkey`,                        lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${base}/vs/litellm`,                        lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${base}/vs/openrouter`,                     lastModified: now, changeFrequency: "monthly", priority: 0.80 },
    { url: `${base}/blog/category/engineering`,         lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${base}/blog/category/architecture`,        lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    { url: `${base}/blog/category/neural-research`,     lastModified: now, changeFrequency: "weekly",  priority: 0.75 },
    ...postUrls,
  ];
}
