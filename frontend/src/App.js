import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import { Toaster } from "sonner";
import { ContentProvider } from "./lib/content";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RequireAdmin from "./components/RequireAdmin";
import FloatingActions from "./components/FloatingActions";
import EmiBanner from "./components/EmiBanner";

import Services from "./pages/Services";
import Cities from "./pages/Cities";
import CityPage from "./pages/CityPage";
import BrandPage from "./pages/BrandPage";
import Book from "./pages/Book";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

function Shell({ children, plain = false }) {
  return (
    <>
      {!plain && <EmiBanner />}
      {!plain && <Header />}
      <main className="min-h-[60vh] pb-16">
        {children}
      </main>
      {!plain && <Footer />}
      {!plain && <FloatingActions />}
    </>
  );
}

function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-center" richColors closeButton />
        <Routes>
          <Route path="/" element={<Shell><Home /></Shell>} />
          <Route path="/services" element={<Shell><Services /></Shell>} />
          <Route path="/cities" element={<Shell><Cities /></Shell>} />
          <Route path="/city/:city" element={<Shell><CityPage /></Shell>} />
          <Route path="/city/:city/:brand" element={<Shell><CityPage /></Shell>} />
          <Route path="/brand/:brand" element={<Shell><BrandPage /></Shell>} />
          <Route path="/book" element={<Shell><Book /></Shell>} />
          <Route path="/about" element={<Shell><About /></Shell>} />
          <Route path="/faq" element={<Shell><FAQ /></Shell>} />
          <Route path="/admin/login" element={<Shell><AdminLogin /></Shell>} />
          <Route path="/admin" element={<Shell><RequireAdmin><AdminDashboard /></RequireAdmin></Shell>} />
          <Route path="*" element={<Shell><NotFound /></Shell>} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}

export default App;
