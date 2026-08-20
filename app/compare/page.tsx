import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CompareTable } from "@/components/CompareTable";
import { SaveComparisonButton } from "@/components/SaveComparisonButton";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const slugs = (ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (slugs.length < 2) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Compare Colleges</h1>
        <p className="text-neutral-500">
          Select 2-3 colleges from the{" "}
          <Link href="/colleges" className="underline">
            explore page
          </Link>{" "}
          to compare them side by side.
        </p>
      </div>
    );
  }

  const [colleges, session] = await Promise.all([
    prisma.college.findMany({
      where: { slug: { in: slugs } },
      include: { placements: { orderBy: { year: "desc" }, take: 1 } },
    }),
    auth(),
  ]);

  const ordered = slugs
    .map((slug) => colleges.find((c) => c.slug === slug))
    .filter((c): c is (typeof colleges)[number] => Boolean(c))
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      city: c.city,
      state: c.state,
      type: c.type,
      feesMin: c.feesMin,
      feesMax: c.feesMax,
      rating: c.rating,
      latestPlacement: c.placements[0] ?? null,
    }));

  if (ordered.length < 2) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Compare Colleges</h1>
        <p className="text-neutral-500">
          Couldn&apos;t find enough matching colleges. Try selecting again from the{" "}
          <Link href="/colleges" className="underline">
            explore page
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-neutral-900">Compare Colleges</h1>
        <SaveComparisonButton
          collegeIds={ordered.map((c) => c.slug)}
          isAuthenticated={Boolean(session?.user)}
        />
      </div>
      <CompareTable colleges={ordered} />
    </div>
  );
}
