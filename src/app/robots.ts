import type { MetadataRoute } from "next";

// ← Change the URL when you buy a domain
const SITE_URL = "https://loyalty-hub-landing-page-wheat.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
