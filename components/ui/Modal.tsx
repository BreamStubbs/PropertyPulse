"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="font-display text-xl text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-stone-100 hover:text-slate-700"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
        {footer ? (
          <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export { Button as ModalButton };
