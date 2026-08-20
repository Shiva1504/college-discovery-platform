import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { compareQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const parsed = compareQuerySchema.safeParse({
    ids: request.nextUrl.searchParams.get("ids") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid comparison request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const slugs = parsed.data.ids;

  const colleges = await prisma.college.findMany({
    where: { slug: { in: slugs } },
    include: {
      courses: { take: 5 },
      placements: { orderBy: { year: "desc" }, take: 1 },
    },
  });

  const orderedColleges = slugs
    .map((slug) => colleges.find((c) => c.slug === slug))
    .filter((c): c is (typeof colleges)[number] => Boolean(c));

  return NextResponse.json({ data: orderedColleges });
}
