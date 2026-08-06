/**
 * Google reviews, transcribed from the shop's public listing.
 *
 * Rendered as native cards rather than pasted screenshots: the screenshots are
 * Google's dark chrome, which fights the brand, and they don't reflow, scale
 * or read out to a screen reader.
 *
 * The review text itself lives in `src/i18n/locales/*.json` under
 * `reviews.items.<id>` — Serbian is the verbatim original, and the other
 * languages are our translation, which the slider labels as such. Author
 * names are proper nouns and stay as Google shows them.
 */
export const GOOGLE = {
  rating: 5.0,
  count: 10,
  url: 'https://www.google.com/maps/search/?api=1&query=Cve%C4%87ara%20Trofej%2C%20Dimitrija%20Tucovi%C4%87a%20128%2C%20Beograd',
};

export const REVIEWS = [
  { id: 'nikolina', author: 'Nikolina Lalić', rating: 5, when: 'month1' },
  { id: 'ljubica', author: 'Ljubica Novaković', rating: 5, when: 'months3' },
  { id: 'boba', author: 'Boba Stamenković', rating: 5, when: 'months3' },
  { id: 'natasa', author: 'Nataša Ružić', rating: 5, when: 'months3' },
  { id: 'ivana', author: 'Ivana Vukojević', rating: 5, when: 'months3' },
  { id: 'jelena-2', author: 'Jelena', rating: 5, when: 'months3' },
  { id: 'mia', author: 'Mia Radenković', rating: 5, when: 'months3' },
  { id: 'maja', author: 'Maja Momčilović', rating: 5, when: 'months3' },
  { id: 'dragana', author: 'Dragana Vasić', rating: 5, when: 'months2' },
  { id: 'luka', author: 'Luka Šljivar', rating: 5, when: 'months2' },
];
