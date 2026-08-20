import { Suspense } from "react";
import { listColleges } from "@/lib/colleges";
import { collegeListQuerySchema } from "@/lib/validation";
import { FilterBar } from "@/components/FilterBar";
import { CollegeListInfinite } from "@/components/CollegeListInfinite";

export default async function CollegesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const flatParams = Object.fromEntries(
    Object.entries(rawParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );

  const parsed = collegeListQuerySchema.safeParse(flatParams);
  const query = parsed.success ? parsed.data : collegeListQuerySchema.parse({});
  const result = await listColleges(query);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Explore Colleges</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {result.total} colleges found. Search, filter, and compare.
        </p>
      </div>
      <Suspense>
        <FilterBar />
      </Suspense>
      <Suspense>
        <CollegeListInfinite key={JSON.stringify(query)} initial={result} />
      </Suspense>
    </div>
  );
}
