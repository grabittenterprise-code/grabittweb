import type { MetadataRoute } from "next";

const siteUrl = "https://www.grabitt.company";

const publicRoutes = [
  "",
  "/product",
  "/ingredients",
  "/reviews",
  "/story",
  "/shop",
  "/contact",
  "/help",
  "/settings/privacy",
  "/settings/terms"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
