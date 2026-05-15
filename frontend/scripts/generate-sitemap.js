
const fs   = require("fs");
const path = require("path");

const CITIES = [
  { slug: "delhi",     priority: "0.9", metro: true  },
  { slug: "noida",     priority: "0.9", metro: true  },
  { slug: "gurgaon",   priority: "0.9", metro: true  },
  { slug: "hyderabad", priority: "0.9", metro: true  },
  { slug: "bangalore", priority: "0.9", metro: true  },
  { slug: "mumbai",    priority: "0.9", metro: true  },
  { slug: "ghaziabad", priority: "0.8", metro: false },
  { slug: "faridabad", priority: "0.8", metro: false },
  { slug: "pune",      priority: "0.8", metro: false },
  { slug: "chennai",   priority: "0.8", metro: false },
];

const BRANDS = [
  { slug: "apple",        priority: "0.9", tier: "top" },
  { slug: "samsung",      priority: "0.9", tier: "top" },
  { slug: "oneplus",      priority: "0.8", tier: "mid" },
  { slug: "xiaomi",       priority: "0.8", tier: "mid" },
  { slug: "google-pixel", priority: "0.8", tier: "mid" },
  { slug: "nothing",      priority: "0.7", tier: "low" },
  { slug: "realme",       priority: "0.7", tier: "low" },
  { slug: "motorola",     priority: "0.7", tier: "low" },
];

const BASE    = "https://www.mobilemistri.com";
const TODAY   = new Date().toISOString().split("T")[0]; // e.g. "2026-05-15"
const OUT     = path.resolve(__dirname, "../public/sitemap.xml");

function urlBlock(loc, priority, freq) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${freq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function urlInline(loc, priority, freq) {
  return (
    `  <url>` +
    `<loc>${loc}</loc>` +
    `<lastmod>${TODAY}</lastmod>` +
    `<changefreq>${freq}</changefreq>` +
    `<priority>${priority}</priority>` +
    `</url>`
  );
}

function comboPriority(city, brand) {
  if (city.metro && brand.tier === "top") return "0.8";
  if (city.metro && brand.tier === "mid") return "0.7";
  return "0.6";
}

// ─── Build entries ────────────────────────────────────────────────────────────
const entries = [];

// Core pages
entries.push("  <!-- ═══════════════ CORE PAGES ═══════════════ -->");
const CORE = [
  { path: "/",         priority: "1.0", freq: "weekly"  },
  { path: "/book",     priority: "0.9", freq: "weekly"  },
  { path: "/services", priority: "0.9", freq: "monthly" },
  { path: "/cities",   priority: "0.8", freq: "monthly" },
  { path: "/about",    priority: "0.7", freq: "monthly" },
  { path: "/faq",      priority: "0.7", freq: "monthly" },
];
CORE.forEach(({ path: p, priority, freq }) =>
  entries.push(urlBlock(`${BASE}${p}`, priority, freq))
);

// City pages
entries.push("\n  <!-- ═══════════════ CITY PAGES ═══════════════ -->");
CITIES.forEach((city) =>
  entries.push(urlBlock(`${BASE}/city/${city.slug}`, city.priority, "weekly"))
);

// Brand pages
entries.push("\n  <!-- ══════════════ BRAND PAGES ═══════════════ -->");
BRANDS.forEach((brand) =>
  entries.push(urlBlock(`${BASE}/brand/${brand.slug}`, brand.priority, "monthly"))
);

// City × Brand combinations
entries.push("\n  <!-- ══════════ CITY × BRAND COMBINATIONS ═══════════ -->");
CITIES.forEach((city) => {
  entries.push(`  <!-- ${city.slug} -->`);
  BRANDS.forEach((brand) => {
    entries.push(
      urlInline(
        `${BASE}/city/${city.slug}/${brand.slug}`,
        comboPriority(city, brand),
        "monthly"
      )
    );
  });
});

// ─── Assemble XML ─────────────────────────────────────────────────────────────
const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
  `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"`,
  `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9`,
  `                            https://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`,
  ``,
  entries.join("\n"),
  ``,
  `</urlset>`,
].join("\n");

// ─── Write file ───────────────────────────────────────────────────────────────
fs.writeFileSync(OUT, xml, "utf8");

const total = CORE.length + CITIES.length + BRANDS.length + (CITIES.length * BRANDS.length);
console.log(`✅ sitemap.xml generated: ${total} URLs, lastmod=${TODAY}`);
