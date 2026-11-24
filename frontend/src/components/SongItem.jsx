import React, { useState } from "react";
import { HiPencil, HiTrash, HiCheck, HiX, HiOutlineDotsVertical } from "react-icons/hi";
import { isValidDuration } from "../utils/duration";

export default function SongItem({ song, index, onUpdate, onDelete, dragHandleProps }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(song);
  const [errors, setErrors] = useState({});

  function startEdit() {
    setDraft(song);
    setErrors({});
    setEditing(true);
  }

  function saveEdit() {
    const next = {};
    if (!draft.title.trim()) next.title = "Please enter a song title.";
    if (!draft.artist.trim()) next.artist = "Please enter an artist.";
    if (!isValidDuration(draft.duration)) next.duration = "Use mm:ss, like 3:05.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onUpdate(song.id, { ...draft, title: draft.title.trim(), artist: draft.artist.trim() });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="rounded-xl border border-ink/10 bg-white p-4">
        <div className="grid grid-cols-2 gap-2.5">
          <EditField label="Title" value={draft.title} error={errors.title} onChange={(v) => setDraft((d) => ({ ...d, title: v }))} />
          <EditField label="Artist" value={draft.artist} error={errors.artist} onChange={(v) => setDraft((d) => ({ ...d, artist: v }))} />
          <EditField label="Album" value={draft.album} onChange={(v) => setDraft((d) => ({ ...d, album: v }))} />
          <EditField label="Duration" value={draft.duration} error={errors.duration} onChange={(v) => setDraft((d) => ({ ...d, duration: v }))} />
        </div>
        <EditField
          label="Album Cover URL"
          value={draft.album_cover || ""}
          onChange={(v) => setDraft((d) => ({ ...d, album_cover: v }))}
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={saveEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ink py-2 text-xs font-medium text-paper hover:bg-sage-dark"
          >
            <HiCheck size={14} /> Save
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink/15 py-2 text-xs font-medium text-ink hover:bg-paper"
          >
            <HiX size={14} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3.5">
      <span
        {...dragHandleProps}
        className="cursor-grab text-ink/25 hover:text-ink/50 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <HiOutlineDotsVertical size={18} />
      </span>
      <span className="w-6 shrink-0 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{song.title}</p>
        <p className="truncate text-xs text-muted">{song.artist}</p>
      </div>
      <span className="shrink-0 font-mono text-xs text-muted">{song.duration}</span>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={startEdit}
          aria-label="Edit song"
          className="rounded-lg p-2 text-muted hover:bg-paper hover:text-ink"
        >
          <HiPencil size={15} />
        </button>
        <button
          onClick={() => onDelete(song.id)}
          aria-label="Delete song"
          className="rounded-lg p-2 text-muted hover:bg-red-50 hover:text-red-500"
        >
          <HiTrash size={15} />
        </button>
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, error }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-paper px-2.5 py-2 text-sm outline-none ${
          error ? "border-red-300" : "border-ink/10 focus:border-ink/40"
        }`}
      />
      {error && <span className="mt-0.5 block text-[11px] text-red-500">{error}</span>}
    </label>
  );
}
