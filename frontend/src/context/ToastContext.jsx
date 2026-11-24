import React, { createContext, useCallback, useContext, useState } from "react";
import { HiCheckCircle, HiExclamationCircle, HiX } from "react-icons/hi";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "error") => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-paper bg-white text-sm animate-[fadein_0.15s_ease-out] ${
              t.type === "error" ? "border-red-200" : "border-sage-dark/30"
            }`}
          >
            {t.type === "error" ? (
              <HiExclamationCircle className="mt-0.5 shrink-0 text-red-500" size={18} />
            ) : (
              <HiCheckCircle className="mt-0.5 shrink-0 text-sage-dark" size={18} />
            )}
            <p className="flex-1 text-ink leading-snug">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss"
              className="text-muted hover:text-ink shrink-0"
            >
              <HiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
