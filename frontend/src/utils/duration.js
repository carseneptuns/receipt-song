/**
 * Duration helpers shared across the editor and the receipt preview.
 * Songs are stored as "mm:ss" or "h:mm:ss" strings so they're easy to
 * type by hand; these functions convert to/from total seconds.
 */

export function isValidDuration(value) {
  if (!value || typeof value !== "string") return false;
  const parts = value.trim().split(":");
  if (parts.length < 2 || parts.length > 3) return false;
  return parts.every((p) => /^\d+$/.test(p));
}

export function durationToSeconds(value) {
  if (!isValidDuration(value)) return 0;
  const parts = value.trim().split(":").map(Number);
  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }
  const [h, m, s] = parts;
  return h * 3600 + m * 60 + s;
}

export function secondsToDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");

  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

export function totalDuration(songs) {
  const totalSeconds = songs.reduce(
    (sum, song) => sum + durationToSeconds(song.duration),
    0
  );
  return secondsToDuration(totalSeconds);
}
