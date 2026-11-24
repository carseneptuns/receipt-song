import React, { useState } from "react";
import { HiPlus } from "react-icons/hi";
import { isValidDuration } from "../utils/duration";

const EMPTY = { title: "", artist: "", album: "", duration: "", album_cover: "" };

export default function SongForm({ onAddSong }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Please enter a song title.";
    if (!form.artist.trim()) next.artist = "Please enter an artist.";
    if (!form.duration.trim()) {
      next.duration = "Please enter a duration.";
    } else if (!isValidDuration(form.duration)) {
      next.duration = "Use the format mm:ss, like 3:05.";
    }
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onAddSong({ ...form, title: form.title.trim(), artist: form.artist.trim() });
    setForm(EMPTY);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Song Title"
          value={form.title}
          onChange={(v) => handleChange("title", v)}
          error={errors.title}
          placeholder="Ditto"
        />
        <Field
          label="Artist"
          value={form.artist}
          onChange={(v) => handleChange("artist", v)}
          error={errors.artist}
          placeholder="NewJeans"
        />
        <Field
          label="Album"
          value={form.album}
          onChange={(v) => handleChange("album", v)}
          placeholder="OMG"
        />
        <Field
          label="Duration"
          value={form.duration}
          onChange={(v) => handleChange("duration", v)}
          error={errors.duration}
          placeholder="3:05"
        />
      </div>
      <Field
        label="Album Cover URL (optional)"
        value={form.album_cover}
        onChange={(v) => handleChange("album_cover", v)}
        placeholder="https://..."
      />
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-medium text-paper transition hover:bg-sage-dark"
      >
        <HiPlus size={16} /> Add Song
      </button>
    </form>
  );
}

function Field({ label, value, onChange, error, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink/25 ${
          error ? "border-red-300" : "border-ink/10 focus:border-ink/40"
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  );
}
