import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateReceipt from "./pages/CreateReceipt";
import Preview from "./pages/Preview";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateReceipt />} />
        <Route path="/preview/:id" element={<Preview />} />
      </Routes>
    </ToastProvider>
  );
}
