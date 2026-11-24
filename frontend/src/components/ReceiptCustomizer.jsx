import React from "react";
import { THEME_LIST } from "./ReceiptPreview";

export default function ReceiptCustomizer({ receipt, onChange }) {
  function set(field, value) {
    onChange({ ...receipt, [field]: value });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Receipt Title" value={receipt.title} onChange={(v) => set("title", v)} />
        <Field label="Name" value={receipt.name} onChange={(v) => set("name", v)} />
        <Field label="Store Name" value={receipt.store_name} onChange={(v) => set("store_name", v)} />
        <div className="grid grid-cols-2 gap-2">
          <Field label="Date" value={receipt.date} onChange={(v) => set("date", v)} />
          <Field label="Time" value={receipt.time} onChange={(v) => set("time", v)} />
        </div>
      </div>
      <Field label="Footer Message" value={receipt.footer} onChange={(v) => set("footer", v)} />

      <div>
        <span className="mb-2 block text-xs font-medium text-muted">Theme</span>
        <div className="grid grid-cols-4 gap-2">
          {THEME_LIST.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => set("theme", t.id)}
              className={`rounded-lg border py-2.5 text-xs font-medium transition ${
                receipt.theme === t.id
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/10 bg-white text-ink hover:border-ink/30"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-ink/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink/40"
      />
    </label>
  );
}
