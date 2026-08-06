import { Sparkles } from 'lucide-react';

const OCCASIONS = [
  'Rođendan',
  'Godišnjica',
  'Izvinjenje',
  'Rodilište',
  'Sahrana',
  'Bez povoda',
];

const CARD_LIMIT = 200;

/**
 * "Personalizovan buket" — what the florist needs to know beyond the items:
 * the occasion, what goes on the card, and anything to swap or avoid.
 */
export default function PersonalisationFields({ value, onChange }) {
  const set = (field) => (event) => onChange({ ...value, [field]: event.target.value });
  const left = CARD_LIMIT - value.cardMessage.length;

  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 flex items-center gap-2 font-serif text-xl text-brand-dark">
        <Sparkles className="h-5 w-5 text-brand-primary-dark" aria-hidden="true" />
        Personalizovan buket
      </legend>
      <p className="text-sm text-gray-600">
        Sve je opciono — ali što više znamo, to je buket bliži onome što ste zamislili.
      </p>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-brand-dark">Povod</span>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occasion) => {
            const active = value.occasion === occasion;
            return (
              <button
                key={occasion}
                type="button"
                // Tapping the active chip clears it, so the field stays optional.
                onClick={() => onChange({ ...value, occasion: active ? '' : occasion })}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? 'border-brand-primary-dark bg-brand-mist font-medium text-brand-dark'
                    : 'border-brand-border text-brand-muted hover:border-brand-primary'
                }`}
              >
                {occasion}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-brand-dark">
          Poruka na čestitki
          <span className={`text-xs font-normal ${left < 20 ? 'text-brand-rose' : 'text-brand-muted'}`}>
            {left} preostalo
          </span>
        </span>
        <textarea
          rows={3}
          maxLength={CARD_LIMIT}
          value={value.cardMessage}
          onChange={set('cardMessage')}
          placeholder="Sve najbolje! Voli te…"
          className="w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-dark placeholder:text-gray-400 focus:border-brand-primary-dark"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brand-dark">Posebne želje</span>
        <textarea
          rows={3}
          value={value.wishes}
          onChange={set('wishes')}
          placeholder="Bez ljiljana, više zelenila, papir u roze tonovima…"
          className="w-full resize-y rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-dark placeholder:text-gray-400 focus:border-brand-primary-dark"
        />
      </label>
    </fieldset>
  );
}
