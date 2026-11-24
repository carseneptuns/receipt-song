import React, { forwardRef } from "react";
import { totalDuration } from "../utils/duration";
import { formatDateLine, formatOrderNumber } from "../utils/format";
import Barcode from "./Barcode";

const THEMES = {
  classic: {
    label: "Classic",
    paper: "#FFFDF7",
    ink: "#171512",
    muted: "rgba(23,21,18,0.55)",
    accent: "#171512",
    divider: "rgba(23,21,18,0.3)",
    creaseLight: "rgba(255,255,255,0.55)",
    creaseDark: "rgba(23,21,18,0.045)",
    texture: true,
  },
  minimal: {
    label: "Minimal",
    paper: "#FFFFFF",
    ink: "#111111",
    muted: "rgba(17,17,17,0.5)",
    accent: "#111111",
    divider: "rgba(17,17,17,0.18)",
    creaseLight: "transparent",
    creaseDark: "transparent",
    texture: false,
  },
  dark: {
    label: "Dark",
    paper: "#181614",
    ink: "#F3F0E9",
    muted: "rgba(243,240,233,0.55)",
    accent: "#F3F0E9",
    divider: "rgba(243,240,233,0.28)",
    creaseLight: "rgba(255,255,255,0.05)",
    creaseDark: "rgba(0,0,0,0.35)",
    texture: true,
  },
  cute: {
    label: "Cute",
    paper: "#FFF2F6",
    ink: "#3B2430",
    muted: "rgba(59,36,48,0.55)",
    accent: "#C5577D",
    divider: "rgba(59,36,48,0.25)",
    creaseLight: "rgba(255,255,255,0.6)",
    creaseDark: "rgba(59,36,48,0.05)",
    texture: true,
  },
};

export const THEME_LIST = [
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
  { id: "dark", label: "Dark" },
  { id: "cute", label: "Cute" },
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function textureStyle(theme) {
  if (!theme.texture) {
    return { backgroundColor: theme.paper };
  }

  return {
    backgroundColor: theme.paper,
    backgroundImage: `
      repeating-linear-gradient(
        101deg,
        ${theme.creaseDark} 0px,
        transparent 1.5px,
        transparent 38px,
        ${theme.creaseLight} 39px,
        transparent 41px,
        transparent 95px
      ),
      repeating-linear-gradient(
        9deg,
        ${theme.creaseDark} 0px,
        transparent 1px,
        transparent 70px,
        ${theme.creaseLight} 71px,
        transparent 73px,
        transparent 140px
      )
    `,
  };
}

const ReceiptPreview = forwardRef(function ReceiptPreview(
  { receipt, songs, className = "" },
  ref
) {
  const theme = THEMES[receipt.theme] || THEMES.classic;

  const total = totalDuration(songs);
  const orderNumber = formatOrderNumber(
    receipt.id ?? receipt.title
  );

  const dateLine = formatDateLine(
    receipt.date,
    receipt.time
  );

  const storeName = (
    receipt.store_name || "RECEIPTSONG"
  ).toUpperCase();

  return (
    <div
      ref={ref}
      className={`relative mx-auto w-full max-w-[380px] font-mono ${className}`}
      style={{ color: theme.ink }}
    >
      <div
        className="relative overflow-hidden rounded-[2px] px-6 py-6 shadow-paper"
        style={textureStyle(theme)}
      >

        {/* HEADER */}
        <div className="text-center">
          <p
            className="text-[9px] font-semibold tracking-[0.2em]"
            style={{ color: theme.muted }}
          >
            A RECEIPTSONG ORIGINAL
          </p>

          <p
            className="mt-1 break-words font-display text-3xl leading-none tracking-wide"
            style={{ color: theme.ink }}
          >
            {receipt.title || "RECEIPTSONG"}
          </p>
        </div>

        {/* ORDER */}
        <div className="mt-4 text-[11px] leading-relaxed">
          <p>
            ORDER #{orderNumber} FOR {storeName}
          </p>

          <p style={{ color: theme.muted }}>
            {dateLine}
          </p>
        </div>

        <Divider theme={theme} />

        {/* TABLE HEADER */}
        <div
          className="flex text-[10px] font-semibold tracking-[0.1em]"
          style={{ color: theme.muted }}
        >
          <span className="w-8 shrink-0">
            QTY
          </span>

          <span className="flex-1">
            ITEM
          </span>
        </div>

        <div className="my-2 border-t border-dashed"
          style={{ borderColor: theme.divider }}
        />

        {/* SONG LIST */}
        {songs.length === 0 ? (
          <p
            className="py-4 text-center text-[11px]"
            style={{ color: theme.muted }}
          >
            no songs yet — start spilling.
          </p>
        ) : (
          <ul className="space-y-2 text-[12px]">
            {songs.map((song, index) => (
              <li
                key={song.id || index}
                className="flex gap-2"
              >
                <span
                  className="w-7 shrink-0 tabular-nums"
                  style={{ color: theme.muted }}
                >
                  {pad2(index + 1)}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold leading-snug">
                    {song.title || "Untitled"}
                  </p>

                  <p
                    className="truncate text-[10px]"
                    style={{ color: theme.muted }}
                  >
                    {song.artist || "Unknown artist"}
                  </p>
                </div>

                <span
                  className="shrink-0 tabular-nums text-[10px]"
                  style={{ color: theme.muted }}
                >
                  {song.duration || "0:00"}
                </span>
              </li>
            ))}
          </ul>
        )}

        <Divider theme={theme} />

        {/* TOTAL */}
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span style={{ color: theme.muted }}>
              ITEM COUNT:
            </span>

            <span className="font-semibold">
              {songs.length}
            </span>
          </div>

          <div className="flex justify-between">
            <span style={{ color: theme.muted }}>
              TOTAL:
            </span>

            <span className="font-semibold">
              {total}
            </span>
          </div>
        </div>

        <Divider theme={theme} />

        {/* CREDIT */}
        <p
          className="text-[10px]"
          style={{ color: theme.muted }}
        >
          CREDITS TO{" "}
          {(receipt.name || "GUEST").toUpperCase()}
        </p>

        {/* FOOTER */}
        <p
          className="mt-4 text-center text-[11px] font-semibold"
          style={{ color: theme.accent }}
        >
          {receipt.footer || "THANK YOU ♡"}
        </p>

        {/* BARCODE */}
        <div className="mt-4 flex flex-col items-center">
          <Barcode
            seed={`${receipt.id || ""}-${storeName}`}
            color={theme.ink}
            className="h-7 w-36"
          />

          <p
            className="mt-1 text-[9px] tracking-[0.15em]"
            style={{ color: theme.muted }}
          >
            {storeName}
          </p>
        </div>

      </div>
    </div>
  );
});


function Divider({ theme }) {
  return (
    <div
      className="my-3 border-t border-dashed"
      style={{
        borderColor: theme.divider,
      }}
    />
  );
}

export default ReceiptPreview;