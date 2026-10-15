/**
 * Format a number as Indian Rupees using the en-IN locale.
 *  formatINR(4500)   → "₹4,500.00"
 *  formatINR(12800)  → "₹12,800.00"
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Convert paise (integer) to rupees.
 */
export function paiseToRupees(paise: number): number {
  return paise / 100;
}

/**
 * Convert rupees to paise (integer).
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

/**
 * Generate a sequential receipt number.
 *  generateReceiptNumber(42, 2026, 10) → "RCP-2026-10-0042"
 */
export function generateReceiptNumber(
  seq: number,
  year: number,
  month: number,
): string {
  const m = String(month).padStart(2, "0");
  const s = String(seq).padStart(4, "0");
  return `RCP-${year}-${m}-${s}`;
}

/**
 * Generate a sequential invoice number.
 *  generateInvoiceNumber(142, 2026, 10) → "INV-2026-10-0142"
 */
export function generateInvoiceNumber(
  seq: number,
  year: number,
  month: number,
): string {
  const m = String(month).padStart(2, "0");
  const s = String(seq).padStart(4, "0");
  return `INV-${year}-${m}-${s}`;
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLen: number = 120): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
}

/**
 * Format a flat/unit number with wing prefix.
 *  formatUnitNumber("A", 4, 2) → "A-402"
 */
export function formatUnitNumber(
  wingName: string,
  floor: number,
  unitOnFloor: number,
): string {
  return `${wingName}-${floor}${String(unitOnFloor).padStart(2, "0")}`;
}
