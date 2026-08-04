import { useMemo, useState } from 'react';
import Hero from '../components/Hero.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import AboutSection from '../components/AboutSection.jsx';
import { PRODUCTS, filterProducts } from '../data/products.js';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const visibleProducts = useMemo(
    () => filterProducts(PRODUCTS, activeCategory),
    [activeCategory]
  );

  return (
    <>
      <Hero />

      <section id="kolekcija" className="container-editorial scroll-mt-24 py-8 lg:py-12">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        <ProductGrid products={visibleProducts} />
      </section>

      <AboutSection />
    </>
  );
}
