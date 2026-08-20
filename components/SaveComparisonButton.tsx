"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SaveComparisonButton({
  collegeIds,
  isAuthenticated,
}: {
  collegeIds: string[];
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);

  async function save() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!name.trim()) return;
    setPending(true);
    const res = await fetch("/api/saved/comparisons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), collegeIds }),
    });
    if (res.ok) {
      setSaved(true);
      setShowInput(false);
    }
    setPending(false);
  }

  if (saved) {
    return <span className="text-sm text-emerald-700 font-medium">Comparison saved ✓</span>;
  }

  if (!showInput) {
    return (
      <button
        onClick={() => (isAuthenticated ? setShowInput(true) : router.push("/login"))}
        className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
      >
        Save Comparison
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name this comparison"
        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm"
        autoFocus
      />
      <button
        onClick={save}
        disabled={pending || !name.trim()}
        className="rounded-lg bg-neutral-900 text-white px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      >
        Save
      </button>
    </div>
  );
}
