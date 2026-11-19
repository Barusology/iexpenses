import { useEffect } from "react";
import { SITE_ORIGIN } from "@/lib/sitePolicy";

export default function SeoHead({
  title,
  description,
  canonicalPath = "/",
  noIndex = false,
}) {
  const fullUrl = `${SITE_ORIGIN}${canonicalPath}`;

  useEffect(() => {
    document.title = title;

    const setMeta = (name, content, attr = "name") => {
      if (!content) return;
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("og:type", "website", "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", fullUrl, "property");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", fullUrl);
  }, [title, description, fullUrl, noIndex]);

  return null;
}
