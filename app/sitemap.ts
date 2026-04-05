import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://neuralrouting.io";
  const now = new Date();

  // Fetch published blog posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true);

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
    { url: `${base}/sign-up`,                    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/reduce-openai-costs`,         lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/llm-cost-optimization`,       lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    ...postUrls,
  ];
}
