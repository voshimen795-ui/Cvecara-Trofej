import { Heart } from 'lucide-react';
import { SHOP } from '../data/shop.js';
import { Bloom, Sprig } from './ui/Botanical.jsx';
import logoHeart from '../assets/logo-heart.png';

/**
 * "Porodično" — the family story.
 *
 * PLACEHOLDER COPY. The owner is writing the final text; these three
 * paragraphs hold the shape (opening hook, how the shop works, the promise)
 * so the layout is settled before the words arrive. Replace PARAGRAPHS below
 * and nothing else needs to change.
 */
const PARAGRAPHS = [
  'Cvećara Trofej nije lanac. Iza tezge stoji porodica koja se cvećem bavi godinama — isti ljudi biraju cveće ujutru, vezuju buket popodne i odgovaraju na telefon kad pozovete.',
  'Zato svaki buket izgleda kao da je pravljen za nekog konkretnog, a ne po šablonu. Kad nam kažete povod, mi zapravo slušamo: da li je za izvinjenje, za rodilište ili za nekog ko voli samo bele cvetove.',
  'Radimo u komšiluku, sa ljudima koji nam se vraćaju godinama. To je jedini razlog zašto nam je stalo do svakog buketa koji izađe iz radnje.',
];

export default function FamilySection() {
  return (
    <section
      id="porodicno"
      className="relative isolate scroll-mt-24 overflow-hidden bg-brand-surface py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 top-8 hidden text-brand-primary opacity-[0.07] lg:block"
      >
        <Sprig className="h-72 w-72" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 bottom-4 hidden text-brand-primary opacity-[0.07] lg:block"
      >
        <Bloom className="h-64 w-64" />
      </div>

      <div className="container-editorial relative">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-mist">
            <Heart className="h-5 w-5 text-brand-primary-dark" strokeWidth={1.75} aria-hidden="true" />
          </span>

          <p className="eyebrow mt-5">O nama</p>
          <h2 className="mt-2 font-serif text-3xl text-brand-dark sm:text-4xl">Porodično</h2>

          <img
            src={logoHeart}
            alt=""
            aria-hidden="true"
            className="mx-auto my-7 h-6 w-auto opacity-70 [filter:brightness(0)_saturate(100%)_invert(45%)_sepia(12%)_saturate(1200%)_hue-rotate(130deg)]"
          />

          <div className="space-y-5 text-left sm:text-center">
            {PARAGRAPHS.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'font-serif text-lg leading-relaxed text-brand-dark sm:text-xl'
                    : 'leading-relaxed text-gray-600'
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <p className="mt-8 font-script text-3xl text-brand-primary-dark">{SHOP.name}</p>
        </div>
      </div>
    </section>
  );
}
