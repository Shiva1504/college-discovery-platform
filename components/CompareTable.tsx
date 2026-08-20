export type CompareCollegeData = {
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  feesMin: number;
  feesMax: number;
  rating: number;
  latestPlacement?: {
    year: number;
    avgPackage: number;
    highestPackage: number;
    placementRate: number;
  } | null;
};

function fmtLakh(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

const ROWS: {
  label: string;
  render: (c: CompareCollegeData) => React.ReactNode;
}[] = [
  { label: "Location", render: (c) => `${c.city}, ${c.state}` },
  { label: "Type", render: (c) => c.type },
  { label: "Rating", render: (c) => `★ ${c.rating.toFixed(1)}` },
  {
    label: "Fees",
    render: (c) =>
      c.feesMin === c.feesMax
        ? fmtLakh(c.feesMin)
        : `${fmtLakh(c.feesMin)} - ${fmtLakh(c.feesMax)}`,
  },
  {
    label: "Avg Package",
    render: (c) =>
      c.latestPlacement ? fmtLakh(c.latestPlacement.avgPackage) : "N/A",
  },
  {
    label: "Highest Package",
    render: (c) =>
      c.latestPlacement ? fmtLakh(c.latestPlacement.highestPackage) : "N/A",
  },
  {
    label: "Placement Rate",
    render: (c) =>
      c.latestPlacement ? `${c.latestPlacement.placementRate.toFixed(0)}%` : "N/A",
  },
];

export function CompareTable({ colleges }: { colleges: CompareCollegeData[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            <th className="text-left p-4 font-medium text-neutral-500 w-40">
              Criteria
            </th>
            {colleges.map((c) => (
              <th key={c.slug} className="text-left p-4 font-semibold text-neutral-900">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-b border-neutral-100 last:border-0">
              <td className="p-4 text-neutral-500 font-medium">{row.label}</td>
              {colleges.map((c) => (
                <td key={c.slug} className="p-4 text-neutral-800">
                  {row.render(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
