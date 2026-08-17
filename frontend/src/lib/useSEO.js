/**
 * useSEO — sets <title>, <meta name="description">, <link rel="canonical">
 * and full Open Graph / Twitter Card tags dynamically per route (CRA client-side).
 *
 * Usage:
 *   useSEO({
 *     title: "Apple iPhone repair in Delhi | MobileMistri",
 *     description: "Certified Apple technicians ...",
 *     canonical: "https://www.mobilemistri.com/city/delhi/apple",
 *     image: "https://www.mobilemistri.com/og-default.jpg", // optional
 *   });
 */

import { useEffect } from "react";

const BASE_URL = "https://www.mobilemistri.com";
const DEFAULT_IMAGE = "https://www.mobilemistri.com/og-image.jpg";

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    // parse attr like 'name="description"' or 'property="og:title"'
    const [k, v] = attr.split("=");
    el.setAttribute(k, v.replace(/"/g, ""));
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

export function useSEO({ title, description, canonical, image, noindex }) {
  useEffect(() => {
    const resolvedCanonical = canonical || BASE_URL + window.location.pathname;
    const resolvedImage = image || DEFAULT_IMAGE;

    // ── Title ──────────────────────────────────────────────────
    if (title) document.title = title;

    // ── Meta description ───────────────────────────────────────
    if (description) {
      setMeta('meta[name="description"]', 'name="description"', description);
    }

    // ── Canonical ──────────────────────────────────────────────
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", resolvedCanonical);

    // ── Open Graph ─────────────────────────────────────────────
    if (title)       setMeta('meta[property="og:title"]',       'property="og:title"',       title);
    if (description) setMeta('meta[property="og:description"]', 'property="og:description"', description);
    setMeta('meta[property="og:url"]',   'property="og:url"',   resolvedCanonical);
    setMeta('meta[property="og:image"]', 'property="og:image"', resolvedImage);
    setMeta('meta[property="og:type"]',  'property="og:type"',  "website");
    setMeta('meta[property="og:site_name"]', 'property="og:site_name"', "MobileMistri");
    
    // Freshness Signal for Google
    const today = new Date().toISOString().split('T')[0];
    setMeta('meta[property="article:modified_time"]', 'property="article:modified_time"', today);

    // ── Twitter Card ───────────────────────────────────────────
    setMeta('meta[name="twitter:card"]',        'name="twitter:card"',        "summary_large_image");
    if (title)       setMeta('meta[name="twitter:title"]',       'name="twitter:title"',       title);
    if (description) setMeta('meta[name="twitter:description"]', 'name="twitter:description"', description);
    setMeta('meta[name="twitter:image"]', 'name="twitter:image"', resolvedImage);

    // ── Robots (Noindex) ───────────────────────────────────────
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robotsMeta) {
        robotsMeta = document.createElement("meta");
        robotsMeta.setAttribute("name", "robots");
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute("content", "noindex, nofollow");
    } else {
      // If not noindex, ensure the tag is either removed or set to index, follow
      if (robotsMeta) {
        robotsMeta.setAttribute("content", "index, follow");
      }
    }

  }, [title, description, canonical, image, noindex]);
}
