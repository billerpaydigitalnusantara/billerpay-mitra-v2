/**
 * Format a number or string into currency format.
 * @param {string | number} value - The number or string to format.
 * @param {string} locale - The locale for formatting (e.g., 'en-US', 'id-ID').
 * @param {string} currency - The currency code (e.g., 'USD', 'IDR').
 * @returns {string} - The formatted currency string.
 */
const formatToCurrency = (value: string | number, locale: string = "id-ID", currency: string = "IDR"): string => {
  if (isNaN(Number(value))) return "Invalid number";

  const numericValue = parseFloat(value.toString());

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    
    minimumFractionDigits: 0, // Ensures 2 decimal places
    maximumFractionDigits: 0,
  }).format(numericValue);
}

const formatThousands = (number: string | number): string => {
  const num = typeof number === 'string' ? parseInt(number, 10) : number
  if (isNaN(num)) return "Invalid number";
  return num.toLocaleString("id-ID"); 
}

export { formatToCurrency, formatThousands }