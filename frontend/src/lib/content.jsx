import { createContext, useContext, useEffect, useState } from "react";
import * as staticContent from "./contentData";

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setContent({
      brands: staticContent.BRANDS,
      cities: staticContent.CITIES,
      services: staticContent.SERVICES,
      issues: staticContent.ISSUES,
      faq: staticContent.FAQ,
      testimonials: staticContent.TESTIMONIALS
    });
  }, []);

  return (
    <ContentContext.Provider value={{ content, error }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be inside ContentProvider");
  return ctx;
};
