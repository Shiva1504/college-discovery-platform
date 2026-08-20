"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SaveButton({
  collegeId,
  initialSaved,
  isAuthenticated,
}: {
  collegeId: string;
  initialSaved: boolean;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setPending(true);
    const method = saved ? "DELETE" : "POST";
    const res = await fetch("/api/saved", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId }),
    });
    if (res.ok) setSaved(!saved);
    setPending(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium border transition-colors disabled:opacity-50 ${
        saved
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-900 border-neutral-300 hover:bg-neutral-50"
      }`}
    >
      {saved ? "Saved ✓" : "Save College"}
    </button>
  );
}
