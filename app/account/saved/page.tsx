import Link from "next/link";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { CollegeCard } from "@/components/CollegeCard";

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-neutral-500">
          Please{" "}
          <Link href="/login" className="underline">
            sign in
          </Link>{" "}
          to view your saved items.
        </p>
      </div>
    );
  }

  const [savedColleges, savedComparisons] = await Promise.all([
    prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: { college: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Saved Colleges</h1>
        {savedColleges.length === 0 ? (
          <p className="text-neutral-500 mt-3">
            No saved colleges yet.{" "}
            <Link href="/colleges" className="underline">
              Explore colleges
            </Link>{" "}
            to save some.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedColleges.map((s) => (
              <CollegeCard key={s.id} college={s.college} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-neutral-900">Saved Comparisons</h2>
        {savedComparisons.length === 0 ? (
          <p className="text-neutral-500 mt-3">No saved comparisons yet.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {savedComparisons.map((cmp) => (
              <Link
                key={cmp.id}
                href={`/compare?ids=${cmp.collegeIds.join(",")}`}
                className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-neutral-300"
              >
                <p className="font-medium text-neutral-900">{cmp.name}</p>
                <p className="text-sm text-neutral-500">
                  {cmp.collegeIds.length} colleges · saved{" "}
                  {new Date(cmp.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
