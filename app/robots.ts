import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/analytics", "/logs", "/attribution", "/quality", "/finops", "/rules", "/team", "/report", "/onboarding", "/chat", "/workflows", "/api/"],
      },
    ],
    sitemap: "https://neuralrouting.io/sitemap.xml",
  };
}
