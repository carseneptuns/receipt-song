import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toPng, toJpeg } from "html-to-image";
import {
  HiArrowLeft,
  HiDownload,
  HiPrinter,
  HiPlus,
} from "react-icons/hi";

import Navbar from "../components/Navbar";
import ReceiptPreview from "../components/ReceiptPreview";
import { ReceiptAPI } from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Preview() {
  const { id } = useParams();

  const [receipt, setReceipt] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const receiptRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    ReceiptAPI.get(id)
      .then((data) => {
        if (cancelled) return;

        setReceipt(data);
        setSongs(data.songs || []);
      })
      .catch(() => {
        showToast("Receipt not found.");
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleDownload(format) {
    if (!receiptRef.current) return;

    setDownloading(true);

    try {
      const fn = format === "png" ? toPng : toJpeg;
      const node = receiptRef.current;

      // html-to-image bakes the node's computed `margin` (from mx-auto)
      // into the clone as a fixed pixel value, but the canvas is only
      // sized to the node's own width/height — so the auto-centered
      // margin shoves the content sideways and the far edge gets clipped.
      // Forcing margin to 0 and pinning explicit width/height on the
      // clone neutralizes that.
      const rect = node.getBoundingClientRect();

      const dataUrl = await fn(node, {
        pixelRatio: 3,
        width: rect.width,
        height: rect.height,
        style: {
          margin: "0",
          transform: "none",
        },
        backgroundColor:
          format === "jpg" ? "#FFFDF7" : undefined,
      });

      const link = document.createElement("a");

      link.download = `receiptsong-${id}.${format}`;
      link.href = dataUrl;

      link.click();
    } catch {
      showToast(
        "Could not export the receipt image. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div>
        <Navbar />

        <div className="flex h-64 items-center justify-center text-sm text-muted">
          Loading…
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div>
        <Navbar />

        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p className="text-sm text-muted">
            This receipt could not be found.
          </p>

          <Link
            to="/create"
            className="mt-4 inline-block text-sm font-medium text-ink underline"
          >
            Create a new one
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      <div className="print:hidden">
        <Navbar />
      </div>

      <div className="mx-auto max-w-2xl px-6 pb-24">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-1.5 text-sm text-muted hover:text-ink print:hidden"
        >
          <HiArrowLeft size={15} />
          Back to editor
        </button>


        {/* RECEIPT */}
        <div className="flex justify-center">
          <ReceiptPreview
            ref={receiptRef}
            receipt={receipt}
            songs={songs}
            className="max-w-[340px]"
          />
        </div>


        {/* ACTION BUTTONS */}
        <div className="mt-12 grid grid-cols-2 gap-3 print:hidden sm:grid-cols-4">

          <ActionButton
            onClick={() => handleDownload("png")}
            disabled={downloading}
            icon={<HiDownload size={16} />}
          >
            PNG
          </ActionButton>

          <ActionButton
            onClick={() => handleDownload("jpg")}
            disabled={downloading}
            icon={<HiDownload size={16} />}
          >
            JPG
          </ActionButton>

          <ActionButton
            onClick={handlePrint}
            icon={<HiPrinter size={16} />}
          >
            Print
          </ActionButton>

          <ActionButton
            onClick={() => navigate("/create")}
            icon={<HiPlus size={16} />}
          >
            New
          </ActionButton>

        </div>

      </div>

    </div>
  );
}


function ActionButton({
  onClick,
  disabled,
  icon,
  children,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white py-3 text-sm font-medium text-ink transition hover:border-ink/30 disabled:opacity-50"
    >
      {icon}
      {children}
    </button>
  );
}