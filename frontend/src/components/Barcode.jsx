import React from "react";
import { generateBarcodePattern } from "../utils/barcode";

/**
 * Purely decorative barcode, styled after the striped code printed at
 * the bottom of physical receipts. `seed` keeps the pattern stable for
 * a given receipt instead of re-randomizing on every render.
 */
export default function Barcode({ seed, color = "#111111", className = "" }) {
  const bars = generateBarcodePattern(seed);
  const gap = 1.4;
  let x = 0;
  const rects = bars.map((w, i) => {
    const rect = <rect key={i} x={x} y={0} width={w} height={38} fill={color} />;
    x += w + gap;
    return rect;
  });

  return (
    <svg
      viewBox={`0 0 ${x} 38`}
      className={className}
      preserveAspectRatio="none"
      role="img"
      aria-label="Decorative barcode"
    >
      {rects}
    </svg>
  );
}
