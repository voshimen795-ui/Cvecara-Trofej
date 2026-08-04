const rsd = new Intl.NumberFormat('sr-RS', {
  style: 'currency',
  currency: 'RSD',
  maximumFractionDigits: 0,
});

/** 4800 -> "4.800 RSD" */
export function formatPrice(amount) {
  return rsd.format(amount);
}
