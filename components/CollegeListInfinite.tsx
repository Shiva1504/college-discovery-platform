"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CollegeCard, type CollegeCardData } from "./CollegeCard";
import { CompareBar } from "./CompareBar";

type ListResponse = {
  data: CollegeCardData[];
  page: number;
  totalPages: number;
  total: number;
};

export function CollegeListInfinite({
  initial,
}: {
  initial: ListResponse;
}) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState(initial.data);
  const [page, setPage] = useState(initial.page);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const loadMore = useCallback(async () => {
    if (loading || page >= totalPages) return;
    setLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page + 1));
    const res = await fetch(`/api/colleges?${params.toString()}`);
    const json: ListResponse = await res.json();
    setItems((prev) => [...prev, ...json.data]);
    setPage(json.page);
    setTotalPages(json.totalPages);
    setLoading(false);
  }, [loading, page, totalPages, searchParams]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  function toggleSelect(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < 3
          ? [...prev, slug]
          : prev
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-10 text-center text-neutral-500">
        No colleges match your filters. Try adjusting search criteria.
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((college) => (
          <div key={college.slug} className="relative">
            <label className="absolute top-3 left-3 z-10 inline-flex items-center rounded-md bg-white/90 shadow-sm border border-neutral-200 px-2 py-1 text-xs gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(college.slug)}
                onChange={() => toggleSelect(college.slug)}
                className="accent-neutral-900"
              />
              Compare
            </label>
            <CollegeCard college={college} />
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {loading && (
        <p className="text-center text-sm text-neutral-500 mt-4">
          Loading more colleges...
        </p>
      )}
      {page >= totalPages && items.length > 0 && (
        <p className="text-center text-xs text-neutral-400 mt-6">
          You&apos;ve reached the end — {items.length} of {initial.total} colleges
        </p>
      )}
      <CompareBar selected={selected} onClear={() => setSelected([])} />
    </div>
  );
}
