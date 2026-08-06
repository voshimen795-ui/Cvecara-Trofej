import Hero from '../components/Hero.jsx';
import FanDeck from '../components/FanDeck.jsx';
import CategoryLinks from '../components/CategoryLinks.jsx';
import AboutSection from '../components/AboutSection.jsx';
import FamilySection from '../components/FamilySection.jsx';
import MapSection from '../components/MapSection.jsx';
import ReviewsSlider from '../components/ReviewsSlider.jsx';
import InstagramSection from '../components/InstagramSection.jsx';

/**
 * The home page sells the shop, not the catalogue — the full grid lives on
 * the category pages. Here the fan deck teases a rotating handful, and the
 * category tiles are the next step for anyone ready to browse.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FanDeck />
      <CategoryLinks />
      <ReviewsSlider />
      <FamilySection />
      <AboutSection />
      <InstagramSection />
      <MapSection />
    </>
  );
}
