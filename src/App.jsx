import { useMemo, useState } from 'react';
import AnnouncementBar from './components/AnnouncementBar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import AboutSection from './components/AboutSection.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import { PRODUCTS, filterProducts } from './data/products.js';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');

  const visibleProducts = useMemo(
    () => filterProducts(PRODUCTS, activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen bg-brand-bg">
      <AnnouncementBar />
      <Navbar onSelectCategory={setActiveCategory} />

      <main>
        <Hero onSelectCategory={setActiveCategory} />

        <section id="kolekcija" className="container-editorial scroll-mt-24 py-8 lg:py-12">
          <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          <ProductGrid products={visibleProducts} />
        </section>

        <AboutSection />
      </main>

      <Footer onSelectCategory={setActiveCategory} />
      <CartDrawer />
    </div>
  );
}
