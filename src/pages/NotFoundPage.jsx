import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container-editorial py-24 text-center lg:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-3xl text-brand-dark sm:text-4xl">
        Ova stranica ne postoji
      </h1>
      <p className="mx-auto mt-4 max-w-md text-gray-600">
        Možda je link zastareo. Pogledajte ponudu ili nas pozovite.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Nazad na početnu
      </Link>
    </div>
  );
}
