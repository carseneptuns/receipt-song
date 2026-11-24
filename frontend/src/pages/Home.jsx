import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ReceiptPreview from "../components/ReceiptPreview";

const SAMPLE_RECEIPT = {
  title: "RECEIPTSONG",
  name: "SYEE",
  store_name: "RECEIPTSONG",
  date: "02/09/2026",
  time: "08:30",
  footer: "THANK YOU ♡",
  theme: "classic",
};

const SAMPLE_SONGS = [
  { id: 1, title: "Ditto", artist: "NewJeans", duration: "3:05" },
  { id: 2, title: "Supernatural", artist: "Ariana Grande", duration: "2:43" },
  { id: 3, title: "Sweater Weather", artist: "The Neighbourhood", duration: "4:00" },
];

const STEPS = [
  {
    n: "01",
    title: "Add Your Songs",
    body: "Add the songs you want to put on your receipt.",
  },
  {
    n: "02",
    title: "Customize",
    body: "Edit your songs and personalize your receipt.",
  },
  {
    n: "03",
    title: "Download",
    body: "Generate your receipt and save it.",
  },
];

export default function Home() {
  return (
    <div>
      <Navbar />

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pb-24 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <h1 className="text-[2.75rem] font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
            turn your songs
            <br />
            into a receipt.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            spill your favorite songs, make your own receipt.
          </p>
          <Link
            to="/create"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition hover:bg-sage-dark"
          >
            Create Receipt
          </Link>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          <div className="rotate-[3deg] transition-transform duration-500 hover:rotate-0">
            <ReceiptPreview receipt={SAMPLE_RECEIPT} songs={SAMPLE_SONGS} />
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n}>
                <span className="font-mono text-sm text-sage-dark">{step.n}</span>
                <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
