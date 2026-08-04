import { Clock, Flower2, HeartHandshake } from 'lucide-react';
import { SHOP } from '../data/shop.js';

const PILLARS = [
  {
    icon: Flower2,
    title: 'Sveže sa pijace',
    body: 'Cveće biramo svakog jutra. Ono što ne prodamo istog dana ne ide u sutrašnji buket.',
  },
  {
    icon: HeartHandshake,
    title: 'Buket po želji',
    body: 'Recite nam priliku i budžet — komponujemo aranžman koji odgovara baš toj osobi.',
  },
  {
    icon: Clock,
    title: 'Isporuka istog dana',
    body: 'Porudžbine primljene do 14h isporučujemo isti dan na teritoriji Beograda.',
  },
];

export default function AboutSection() {
  return (
    <section id="o-nama" className="border-y border-gray-100 bg-brand-surface py-16 lg:py-24">
      <div className="container-editorial">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow">O nama</p>
            <h2 className="mt-2 font-serif text-3xl leading-tight text-brand-dark sm:text-4xl">
              Mala cvećara sa velikim standardom
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Cvećara Trofej radi u {SHOP.street} već godinama. Ne pravimo bukete unapred —
              svaki nastaje tek kada znamo kome ide i povodom čega.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {PILLARS.map(({ icon: Icon, title, body }) => (
                <li key={title} className="rounded-2xl border border-gray-100 bg-brand-bg p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10">
                    <Icon className="h-5 w-5 text-brand-primary" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-serif text-lg text-brand-dark">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
