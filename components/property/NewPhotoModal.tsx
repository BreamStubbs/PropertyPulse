"use client";

import { useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { useStore } from "@/lib/store";
import { fileToGalleryDataUrl } from "@/lib/image";

export function NewPhotoModal({
  open,
  onClose,
  propertyId,
}: {
  open: boolean;
  onClose: () => void;
  propertyId: string;
}) {
  const { addPropertyPhoto } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setPreview("");
    setCaption("");
    setError("");
    setBusy(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      setPreview(await fileToGalleryDataUrl(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't read that image.");
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    if (!preview) return;
    addPropertyPhoto({ property_id: propertyId, url: preview, caption: caption.trim() || undefined });
    close();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Add photo"
      footer={
        <>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!preview || busy}>
            Add to gallery
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {preview ? (
          <div className="relative overflow-hidden rounded-xl border border-stone-200 dark:border-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Selected" className="aspect-[4/3] w-full object-cover" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 rounded-lg bg-slate-900/70 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900/85"
            >
              Choose different
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-8 text-center text-slate-500 hover:border-amber-400 hover:bg-amber-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:border-amber-500/50 dark:hover:bg-amber-500/10"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 20h16" />
            </svg>
            <span className="text-[15px] font-medium">{busy ? "Processing…" : "Tap to choose a photo"}</span>
            <span className="text-[13px]">JPG or PNG, up to 10 MB</span>
          </button>
        )}

        <Field label="Caption (optional)">
          <Input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Kitchen after remodel" />
        </Field>

        {error ? <p className="text-[13px] text-rose-600 dark:text-rose-400">{error}</p> : null}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </Modal>
  );
}
