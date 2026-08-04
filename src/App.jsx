import { useEffect } from 'react';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import HomePage from './pages/HomePage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/** Navigating between pages should land at the top, not mid-catalogue. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

/**
 * HashRouter rather than BrowserRouter: the site is a static bundle, so
 * deep links have to resolve without any server-side rewrite rules.
 */
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex min-h-screen flex-col bg-brand-bg">
        <AnnouncementBar />
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/buketi" element={<CategoryPage category="buketi" />} />
            <Route path="/aranzmani" element={<CategoryPage category="aranzmani" />} />
            <Route path="/pokloni" element={<CategoryPage category="pokloni" />} />
            <Route
              path="/plisane-igracke"
              element={<CategoryPage category="plisane-igracke" />}
            />
            <Route path="/baloni" element={<CategoryPage category="baloni" />} />
            <Route path="/proizvod/:id" element={<ProductPage />} />
            <Route path="/o-nama" element={<AboutPage />} />
            <Route path="/kolekcija" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
        <CartDrawer />
      </div>
    </HashRouter>
  );
}
