import { createContext, useContext, useEffect, useState } from "react";
import { fetchContent } from "./api";

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContent().then(setContent).catch((e) => setError(e.message));
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
