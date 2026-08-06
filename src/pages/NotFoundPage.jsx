import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/index.jsx';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="container-editorial py-24 text-center lg:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-3xl text-brand-dark sm:text-4xl">
        {t('notfound.title')}
      </h1>
      <p className="mx-auto mt-4 max-w-md text-gray-600">{t('notfound.lead')}</p>
      <Link to="/" className="btn-primary mt-8">
        {t('common.back')}
      </Link>
    </div>
  );
}
