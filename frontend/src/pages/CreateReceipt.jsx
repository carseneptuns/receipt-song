import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SongForm from "../components/SongForm";
import SongList from "../components/SongList";
import ReceiptCustomizer from "../components/ReceiptCustomizer";
import ReceiptPreview from "../components/ReceiptPreview";
import { ReceiptAPI, SongAPI } from "../services/api";
import { useToast } from "../context/ToastContext";

function defaultReceipt() {
  const now = new Date();
  return {
    title: "RECEIPTSONG",
    name: "Guest",
    store_name: "RECEIPTSONG",
    date: now.toLocaleDateString("en-GB"),
    time: now.toTimeString().slice(0, 5),
    footer: "THANK YOU ♡",
    theme: "classic",
  };
}

export default function CreateReceipt() {
  const [receiptId, setReceiptId] = useState(null);
  const [receipt, setReceipt] = useState(defaultReceipt());
  const [songs, setSongs] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [busy, setBusy] = useState(false);
  const saveTimer = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Create the underlying receipt record once, on first load.
  useEffect(() => {
    let cancelled = false;
    ReceiptAPI.create(defaultReceipt())
      .then((data) => {
        if (cancelled) return;
        setReceiptId(data.id);
        setReceipt(data);
        setSongs(data.songs || []);
      })
      .catch(() => {
        showToast("Could not start a new receipt. Check your connection and try again.");
      })
      .finally(() => !cancelled && setInitializing(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced sync of receipt metadata (title, name, theme, etc.) to the backend.
  useEffect(() => {
    if (!receiptId || initializing) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      ReceiptAPI.update(receiptId, receipt).catch(() =>
        showToast("Could not save your receipt settings.")
      );
    }, 500);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receipt, receiptId]);

  async function handleAddSong(song) {
    // Optimistic local update for instant preview feedback.
    const tempId = `temp-${Date.now()}`;
    const optimistic = { ...song, id: tempId };
    setSongs((prev) => [...prev, optimistic]);

    try {
      const saved = await SongAPI.add(receiptId, song);
      setSongs((prev) => prev.map((s) => (s.id === tempId ? saved : s)));
    } catch (err) {
      setSongs((prev) => prev.filter((s) => s.id !== tempId));
      showToast(err.message || "Could not add that song.");
    }
  }

  async function handleUpdateSong(songId, updates) {
    const previous = songs;
    setSongs((prev) => prev.map((s) => (s.id === songId ? { ...s, ...updates } : s)));
    try {
      await SongAPI.update(receiptId, songId, updates);
    } catch (err) {
      setSongs(previous);
      showToast(err.message || "Could not update that song.");
    }
  }

  async function handleDeleteSong(songId) {
    const previous = songs;
    setSongs((prev) => prev.filter((s) => s.id !== songId));
    try {
      await SongAPI.remove(receiptId, songId);
    } catch (err) {
      setSongs(previous);
      showToast(err.message || "Could not delete that song.");
    }
  }

  async function handleReorder(nextSongs) {
    const previous = songs;
    setSongs(nextSongs);
    try {
      await SongAPI.reorder(
        receiptId,
        nextSongs.map((s) => s.id)
      );
    } catch (err) {
      setSongs(previous);
      showToast(err.message || "Could not reorder songs.");
    }
  }

  async function handleGenerate() {
    if (songs.length === 0) {
      showToast("Add at least one song before generating your receipt.");
      return;
    }
    setBusy(true);
    try {
      await ReceiptAPI.update(receiptId, receipt);
      navigate(`/preview/${receiptId}`);
    } catch (err) {
      showToast(err.message || "Could not generate your receipt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Create your receipt</h1>
          <p className="mt-1 text-sm text-muted">Add songs, customize, and watch it update live.</p>
        </div>

        {initializing ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted">
            Setting things up…
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div className="space-y-8 order-2 lg:order-1">
              <section className="rounded-2xl border border-ink/10 bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold text-ink">Receipt Settings</h2>
                <ReceiptCustomizer receipt={receipt} onChange={setReceipt} />
              </section>

              <section className="rounded-2xl border border-ink/10 bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold text-ink">Add Song</h2>
                <SongForm onAddSong={handleAddSong} />
              </section>

              <section>
                <h2 className="mb-4 text-sm font-semibold text-ink">
                  Song List <span className="text-muted font-normal">({songs.length})</span>
                </h2>
                <SongList
                  songs={songs}
                  onReorder={handleReorder}
                  onUpdate={handleUpdateSong}
                  onDelete={handleDeleteSong}
                />
              </section>
            </div>

            <div className="order-1 lg:order-2">
              <div className="sticky top-8">
                <ReceiptPreview receipt={receipt} songs={songs} />
                <button
                  onClick={handleGenerate}
                  disabled={busy}
                  className="mx-auto mt-8 block w-full max-w-[380px] rounded-xl bg-ink py-3.5 text-sm font-medium text-paper transition hover:bg-sage-dark disabled:opacity-50"
                >
                  {busy ? "Generating…" : "Generate Receipt"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
