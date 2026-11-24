import React from "react";

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 text-sm text-muted sm:flex-row">
        <p className="font-mono">ReceiptSong</p>
        <p>Made for people who spill their playlists.</p>
      </div>
    </footer>
  );
}
