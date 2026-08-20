"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

const COLLEGE_TYPES = ["GOVERNMENT", "PRIVATE", "DEEMED"] as const;
const SORT_OPTIONS = [
  { value: "rating_desc", label: "Top Rated" },
  { value: "fees_asc", label: "Fees: Low to High" },
  { value: "fees_desc", label: "Fees: High to Low" },
  { value: "name_asc", label: "Name (A-Z)" },
] as const;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("q", q);
        }}
        className="flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search colleges by name..."
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
        <button
          type="submit"
          className="rounded-lg bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-700"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-3 text-sm">
        <select
          defaultValue={searchParams.get("type") ?? ""}
          onChange={(e) => updateParam("type", e.target.value)}
          className="rounded-lg border border-neutral-300 px-2 py-1.5"
        >
          <option value="">All Types</option>
          {COLLEGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <input
          defaultValue={searchParams.get("city") ?? ""}
          onBlur={(e) => updateParam("city", e.target.value)}
          placeholder="City"
          className="w-32 rounded-lg border border-neutral-300 px-2 py-1.5"
        />

        <input
          type="number"
          defaultValue={searchParams.get("minRating") ?? ""}
          onBlur={(e) => updateParam("minRating", e.target.value)}
          placeholder="Min rating"
          min={0}
          max={5}
          step={0.1}
          className="w-28 rounded-lg border border-neutral-300 px-2 py-1.5"
        />

        <select
          defaultValue={searchParams.get("sort") ?? "rating_desc"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="ml-auto rounded-lg border border-neutral-300 px-2 py-1.5"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
