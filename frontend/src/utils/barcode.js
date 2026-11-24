/**
 * Generates a deterministic set of decorative barcode bar widths from a
 * seed string. Not a real, scannable barcode — purely visual, styled to
 * look like the barcode printed on a physical receipt.
 */
export function generateBarcodePattern(seed = "receiptsong", barCount = 46) {
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  const bars = [];
  let value = Math.abs(hash) || 1;
  for (let i = 0; i < barCount; i++) {
    value = (value * 9301 + 49297) % 233280;
    const width = 1 + (value % 3); // widths of 1, 2, or 3
    bars.push(width);
  }
  return bars;
}
