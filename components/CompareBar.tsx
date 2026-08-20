"use client";

import { useRouter } from "next/navigation";

export function CompareBar({
  selected,
  onClear,
}: {
  selected: string[];
  onClear: () => void;
}) {
  const router = useRouter();

  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-neutral-900 text-white px-5 py-3 shadow-lg">
      <span className="text-sm">
        {selected.length} college{selected.length > 1 ? "s" : ""} selected
      </span>
      <button
        onClick={onClear}
        className="text-sm text-neutral-300 hover:text-white"
      >
        Clear
      </button>
      <button
        disabled={selected.length < 2}
        onClick={() => router.push(`/compare?ids=${selected.join(",")}`)}
        className="rounded-full bg-white text-neutral-900 text-sm font-medium px-4 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Compare
      </button>
    </div>
  );
}
