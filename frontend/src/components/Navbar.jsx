import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="w-full">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-mono text-lg font-semibold tracking-tight text-ink">
            Receipt<span className="text-sage-dark">Song</span>
          </span>
        </Link>
        <Link
          to="/create"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-sage-dark"
        >
          Create Receipt
        </Link>
      </nav>
    </header>
  );
}
