"use client";

import { useRef, useState } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { useStore } from "@/lib/store";
import { fileToAvatarDataUrl } from "@/lib/image";

export function ProfilePhotoEditor() {
  const { currentUser, updateProfile } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!currentUser) return null;

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      updateProfile({ avatar_url: dataUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update your photo.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="group relative rounded-full focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        aria-label="Change profile photo"
      >
        <Avatar name={currentUser.full_name} src={currentUser.avatar_url} size={72} />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/0 text-white opacity-0 transition group-hover:bg-slate-900/45 group-hover:opacity-100">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L8 6H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-4l-1.5-2Z" />
            <circle cx="12" cy="13" r="3.5" />
          </svg>
        </span>
      </button>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? "Uploading…" : currentUser.avatar_url ? "Change photo" : "Add photo"}
          </Button>
          {currentUser.avatar_url ? (
            <Button variant="ghost" size="sm" onClick={() => updateProfile({ avatar_url: undefined })} disabled={busy}>
              Remove
            </Button>
          ) : null}
        </div>
        <p className="mt-1.5 text-[13px] text-slate-500 dark:text-slate-400">JPG or PNG, up to 10 MB. We’ll crop it to a square.</p>
        {error ? <p className="mt-1 text-[13px] text-rose-600 dark:text-rose-400">{error}</p> : null}
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
    </div>
  );
}
