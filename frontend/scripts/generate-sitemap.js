
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
  { slug: "lucknow",   priority: "0.8", metro: true  },
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

// Master Pages: Model × Repair (Excluding City variants)
const SERVICES = [
  "screen-replacement", "battery-replacement", "charging-port",
  "back-glass", "water-damage", "speaker-mic-camera",
  "software-update", "diagnostics", "logic-board"
];

// Extracting model slugs from BRANDS
const modelSlugs = [];
BRANDS.forEach(brand => {
  // Using some predefined sample models for the sitemap to avoid hardcoding the huge list directly in this script.
  // We can read contentData.js, but since this is a simple script, let's load it dynamically.
});

// Read contentData.js as text to avoid ES Module import errors in this CommonJS script
const code = fs.readFileSync(path.resolve(__dirname, "../src/lib/contentData.js"), "utf8");

// Parse Brands and Models
const brandMatches = code.match(/\"slug\":\s*\"([^\"]+)\"[\s\S]*?\"models\":\s*\[([\s\S]*?)\]/g);
const SERVICES_SLUGS = [
  "screen-replacement", "battery-replacement", "charging-port",
  "back-glass", "water-damage", "speaker-mic-camera",
  "software-update", "diagnostics", "logic-board"
];

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

entries.push("\n  <!-- ══════════ MASTER PAGES: MODEL × REPAIR ═══════════ -->");
let masterPageCount = 0;

if (brandMatches) {
  brandMatches.forEach(match => {
    const brandSlugMatch = match.match(/\"slug\":\s*\"([^\"]+)\"/);
    const brandSlug = brandSlugMatch ? brandSlugMatch[1] : "";
    const brandObj = BRANDS.find(b => b.slug === brandSlug);
    
    // extract models array text
    const modelsText = match.match(/\"models\":\s*\[([\s\S]*?)\]/)[1];
    let models = [...modelsText.matchAll(/\"([A-Za-z0-9 \(\)\+]+)\"/g)].map(m => m[1]);
    
    // Apply Master Page Strategy: Limit models to avoid thin content & keep URLs under ~5000
    let modelLimit = 10; // Default for low tier
    if (brandObj) {
      if (brandObj.tier === "top") modelLimit = 35;
      else if (brandObj.tier === "mid") modelLimit = 20;
    }
    
    models = models.filter(m => !m.startsWith("Other")).slice(0, modelLimit);
    
    models.forEach((modelName) => {
      const modelSlug = slugify(modelName);
      SERVICES_SLUGS.forEach((serviceSlug) => {
        // Base Model x Service Page (Master Page) - Generated for ALL models and ALL services
        entries.push(
          urlInline(
            `${BASE}/${modelSlug}/${serviceSlug}`,
            "0.8", 
            "weekly"
          )
        );
        masterPageCount++;

        // Local Model x Service x City Pages
        // To save crawl budget, only generate these for:
        // 1. Top Tier Brands (Apple, Samsung)
        // 2. High Demand Services (Screen Replacement, Battery Replacement)
        // 3. Metro Cities
        const isHighDemandService = serviceSlug === "screen-replacement" || serviceSlug === "battery-replacement";
        
        if (brandObj && brandObj.tier === "top" && isHighDemandService) {
          CITIES.filter(c => c.metro).forEach((city) => {
            entries.push(
              urlInline(
                `${BASE}/${modelSlug}/${serviceSlug}/${city.slug}`,
                "0.7",
                "monthly"
              )
            );
            masterPageCount++;
          });
        }
      });
    });
  });
}

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

const total = CORE.length + CITIES.length + BRANDS.length + (CITIES.length * BRANDS.length) + masterPageCount;
console.log(`✅ sitemap.xml generated: ${total} URLs, lastmod=${TODAY}`);
