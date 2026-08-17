import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Reusable Breadcrumbs component with auto-injected JSON-LD Schema.
 * 
 * @param {Array} items - Array of breadcrumb items.
 * Example: [{ label: "Home", path: "/" }, { label: "Services", path: "/services" }, { label: "Screen Replacement", path: "/services/screen-replacement", current: true }]
 */
export default function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.current ? undefined : `https://www.mobilemistri.com${item.path}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="bg-slate-50 border-b border-slate-200 py-3" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1 || item.current;
            return (
              <span key={item.label} className="flex items-center">
                {isLast ? (
                  <span className="text-slate-800 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link to={item.path} className="hover:text-[#002FA7] transition-colors">
                      {item.label}
                    </Link>
                    <ChevronRight className="w-3 h-3 mx-2 text-slate-400" />
                  </>
                )}
              </span>
            );
          })}
        </div>
      </nav>
    </>
  );
}
