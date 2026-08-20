import Link from "next/link";
import { prisma } from "@/lib/db";
import { CollegeCard } from "@/components/CollegeCard";

export default async function Home() {
  const topColleges = await prisma.college.findMany({
    orderBy: { rating: "desc" },
    take: 6,
    select: {
      slug: true,
      name: true,
      city: true,
      state: true,
      type: true,
      feesMin: true,
      feesMax: true,
      rating: true,
    },
  });

  return (
    <div>
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            Find the right college, backed by data.
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-xl mx-auto">
            Search, compare, and shortlist colleges by fees, placements, and ratings —
            all in one place.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/colleges"
              className="rounded-lg bg-neutral-900 text-white px-6 py-3 text-sm font-medium hover:bg-neutral-700"
            >
              Explore Colleges
            </Link>
            <Link
              href="/compare"
              className="rounded-lg border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
            >
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">Top Rated Colleges</h2>
          <Link href="/colleges" className="text-sm text-neutral-600 hover:text-neutral-900 underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topColleges.map((college) => (
            <CollegeCard key={college.slug} college={college} />
          ))}
        </div>
      </section>
    </div>
  );
}
