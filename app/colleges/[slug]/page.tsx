import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { SaveButton } from "@/components/SaveButton";

function fmtLakh(n: number) {
  return `₹${(n / 100000).toFixed(1)}L`;
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [college, session] = await Promise.all([
    prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placements: { orderBy: { year: "desc" } },
        reviews: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    }),
    auth(),
  ]);

  if (!college) notFound();

  let isSaved = false;
  if (session?.user?.id) {
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId: college.id } },
    });
    isSaved = Boolean(saved);
  }

  const avgReviewRating =
    college.reviews.length > 0
      ? college.reviews.reduce((sum, r) => sum + r.rating, 0) / college.reviews.length
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{college.name}</h1>
          <p className="text-neutral-500 mt-1">
            {college.city}, {college.state} · Est. {college.establishedYear} ·{" "}
            {college.type.charAt(0) + college.type.slice(1).toLowerCase()}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1">
            ★ {college.rating.toFixed(1)} rating
          </p>
        </div>
        <SaveButton
          collegeId={college.id}
          initialSaved={isSaved}
          isAuthenticated={Boolean(session?.user)}
        />
      </div>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">Overview</h2>
        <p className="text-neutral-700 leading-relaxed">{college.description}</p>
        <p className="text-sm text-neutral-500 mt-2">
          Fees range: {fmtLakh(college.feesMin)} - {fmtLakh(college.feesMax)}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {college.courses.map((course) => (
            <div key={course.id} className="rounded-lg border border-neutral-200 p-3">
              <p className="font-medium text-neutral-900">{course.name}</p>
              <p className="text-sm text-neutral-500">
                {course.degree} · {course.durationYears} yrs · {fmtLakh(course.fees)}/total
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">Placements</h2>
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="text-left p-3 font-medium text-neutral-500">Year</th>
                <th className="text-left p-3 font-medium text-neutral-500">Avg Package</th>
                <th className="text-left p-3 font-medium text-neutral-500">Highest Package</th>
                <th className="text-left p-3 font-medium text-neutral-500">Placement Rate</th>
              </tr>
            </thead>
            <tbody>
              {college.placements.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="p-3 text-neutral-800">{p.year}</td>
                  <td className="p-3 text-neutral-800">{fmtLakh(p.avgPackage)}</td>
                  <td className="p-3 text-neutral-800">{fmtLakh(p.highestPackage)}</td>
                  <td className="p-3 text-neutral-800">{p.placementRate.toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-900">Reviews</h2>
          {avgReviewRating !== null && (
            <span className="text-sm text-neutral-500">
              Avg. {avgReviewRating.toFixed(1)} / 5 from {college.reviews.length} reviews
            </span>
          )}
        </div>
        {college.reviews.length === 0 ? (
          <p className="text-neutral-500 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {college.reviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-neutral-900">{review.title}</p>
                  <span className="text-sm text-emerald-700">★ {review.rating}</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
