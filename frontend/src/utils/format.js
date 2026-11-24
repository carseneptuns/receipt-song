/**
 * Small formatting helpers for the receipt's header lines.
 */

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
];

/**
 * Tries to parse a date string in dd/mm/yyyy (or yyyy-mm-dd) form and
 * return a "WEEKDAY · MONTH · YEAR" line. Falls back to the raw string
 * (plus time) if it can't be parsed, since the date field is free text.
 */
export function formatDateLine(dateStr, timeStr) {
  if (!dateStr) return timeStr || "";

  let date = null;
  const slashParts = dateStr.split("/");
  const dashParts = dateStr.split("-");

  if (slashParts.length === 3) {
    const [d, m, y] = slashParts.map(Number);
    if (d && m && y) date = new Date(y, m - 1, d);
  } else if (dashParts.length === 3) {
    const [y, m, d] = dashParts.map(Number);
    if (d && m && y) date = new Date(y, m - 1, d);
  }

  if (date && !Number.isNaN(date.getTime())) {
    return `${WEEKDAYS[date.getDay()]} \u00B7 ${MONTHS[date.getMonth()]} \u00B7 ${date.getFullYear()}`;
  }

  return timeStr ? `${dateStr} \u00B7 ${timeStr}` : dateStr;
}

/** Turns a receipt id (or any string) into a stable 4-digit order number. */
export function formatOrderNumber(seed) {
  if (typeof seed === "number") {
    return String(seed).padStart(4, "0").slice(-4);
  }
  let hash = 0;
  const str = String(seed || "receiptsong");
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return String(Math.abs(hash) % 10000).padStart(4, "0");
}
