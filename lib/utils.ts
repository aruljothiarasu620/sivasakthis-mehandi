export const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');
export const priceLabel = (price: number, starting: number) =>
  !price ? 'Custom quote' : (starting ? 'From ' : '') + inr(price);
export const digits = (s: string) => s.replace(/\D/g, '');
/** Normalise an Indian number to wa.me format (91XXXXXXXXXX). */
export const waNumber = (s: string) => { const d = digits(s); return d.length === 10 ? '91' + d : d; };
export const waLink = (num: string, text: string) => `https://wa.me/${waNumber(num)}?text=${encodeURIComponent(text)}`;
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const PRICE_NOTICE = 'Prices may vary depending on design complexity, event requirements, and location. Contact us for a personalized quotation.';
