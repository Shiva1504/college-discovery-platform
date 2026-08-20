import Link from "next/link";

export type CollegeCardData = {
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  feesMin: number;
  feesMax: number;
  rating: number;
};

function formatFees(min: number, max: number) {
  const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
  return min === max ? fmt(min) : `${fmt(min)} - ${fmt(max)}`;
}

export function CollegeCard({ college }: { college: CollegeCardData }) {
  return (
    <Link
      href={`/colleges/${college.slug}`}
      className="block rounded-xl border border-neutral-200 bg-white p-4 hover:shadow-md hover:border-neutral-300 transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-neutral-900 leading-snug">
            {college.name}
          </h3>
          <p className="text-sm text-neutral-500 mt-0.5">
            {college.city}, {college.state}
          </p>
        </div>
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1">
          ★ {college.rating.toFixed(1)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="text-neutral-600">
          Fees:{" "}
          <span className="font-medium text-neutral-900">
            {formatFees(college.feesMin, college.feesMax)}
          </span>
        </span>
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          {college.type}
        </span>
      </div>
    </Link>
  );
}
