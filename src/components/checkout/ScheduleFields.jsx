import { Calendar } from 'lucide-react';
import { OPENING_HOURS, isOpenOn, slotsFor } from '../../data/shop.js';

const iso = (date) => date.toISOString().slice(0, 10);

/** Local-midnight Date from a yyyy-mm-dd string, avoiding UTC drift. */
const parseISO = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const DAY_LABEL = OPENING_HOURS.map((h) => h.label);

/**
 * Date and time picker for delivery or pickup. Times come from the shop's
 * opening hours, so a customer can never book a slot when the door is locked.
 */
export default function ScheduleFields({ value, onChange }) {
  const today = new Date();
  const min = iso(today);
  const max = iso(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));

  const chosen = value.date ? parseISO(value.date) : null;
  const closed = chosen && !isOpenOn(chosen);
  const slots = chosen ? slotsFor(chosen) : [];

  // Today's slots that have already passed are no use to anyone.
  const usable =
    chosen && iso(chosen) === min
      ? slots.filter((s) => Number(s.slice(0, 2)) > today.getHours())
      : slots;

  const setDate = (date) => onChange({ ...value, date, time: '' });

  return (
    <fieldset className="space-y-4">
      <legend className="mb-1 flex items-center gap-2 font-serif text-xl text-brand-dark">
        <Calendar className="h-5 w-5 text-brand-primary-dark" aria-hidden="true" />
        Zakazivanje
      </legend>

      <div className="flex gap-3">
        {['dostava', 'preuzimanje'].map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange({ ...value, mode })}
            aria-pressed={value.mode === mode}
            className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition ${
              value.mode === mode
                ? 'border-brand-primary-dark bg-brand-mist text-brand-dark'
                : 'border-brand-border text-brand-muted hover:border-brand-primary'
            }`}
          >
            {mode === 'dostava' ? 'Dostava na adresu' : 'Preuzimanje u radnji'}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-brand-dark">Datum</span>
        <input
          type="date"
          value={value.date}
          min={min}
          max={max}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full rounded-xl border border-brand-border bg-white px-4 py-3 text-brand-dark focus:border-brand-primary-dark"
        />
      </label>

      {closed && (
        <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {DAY_LABEL[chosen.getDay()]}om ne radimo. Izaberite drugi dan.
        </p>
      )}

      {chosen && !closed && usable.length === 0 && (
        <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Za danas više nema slobodnih termina. Izaberite sutrašnji datum.
        </p>
      )}

      {usable.length > 0 && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-dark">Vreme</span>
          <div className="flex flex-wrap gap-2">
            {usable.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onChange({ ...value, time: slot })}
                aria-pressed={value.time === slot}
                className={`rounded-lg border px-3.5 py-2 text-sm tabular-nums transition ${
                  value.time === slot
                    ? 'border-brand-primary-dark bg-brand-mist font-semibold text-brand-dark'
                    : 'border-brand-border text-brand-muted hover:border-brand-primary'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
}
