/**
 * useSEO — sets <title>, <meta name="description"> and <link rel="canonical">
 * dynamically per route for a CRA (client-side) app.
 *
 * Usage:
 *   useSEO({
 *     title: "Apple iPhone repair in Delhi | MobileMistri",
 *     description: "Certified Apple technicians ...",
 *     canonical: "https://www.mobilemistri.com/city/delhi/apple",
 *   });
 */

import { useEffect } from "react";

const BASE_URL = "https://www.mobilemistri.com";

export function useSEO({ title, description, canonical }) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────
    if (title) document.title = title;

    // ── Meta description ───────────────────────────────────────
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }

    // ── Canonical ──────────────────────────────────────────────
    const href = canonical || BASE_URL + window.location.pathname;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);
  }, [title, description, canonical]);
}
