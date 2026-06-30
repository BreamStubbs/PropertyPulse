"use client";

import { Icon } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { fileSize, formatDate } from "@/lib/format";
import type { FileRecord, Profile } from "@/lib/types";

export function FileRow({ file, uploader }: { file: FileRecord; uploader?: Profile }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-slate-500">
        <Icon.Files className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-slate-900">{file.name}</div>
        <div className="truncate text-[13px] text-slate-500">
          {uploader ? `${uploader.full_name} · ` : ""}
          {formatDate(file.uploaded_at)} · {fileSize(file.size_bytes)}
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        // download is a placeholder action in the demo
        onClick={() => alert(`Downloading “${file.name}” (demo placeholder).`)}
      >
        <Icon.Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download</span>
      </Button>
    </div>
  );
}

export function FileGroup({
  category,
  files,
  uploaders,
}: {
  category: string;
  files: FileRecord[];
  uploaders: Record<string, Profile>;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-50 px-4 py-2.5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{category}</h3>
        <span className="text-[13px] text-slate-400">{files.length}</span>
      </div>
      <div className="divide-y divide-stone-100">
        {files.map((f) => (
          <FileRow key={f.id} file={f} uploader={f.uploaded_by ? uploaders[f.uploaded_by] : undefined} />
        ))}
      </div>
    </div>
  );
}
