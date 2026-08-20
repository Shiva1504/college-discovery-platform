import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { CollegeListQuery } from "@/lib/validation";

export async function listColleges(query: CollegeListQuery) {
  const { q, city, state, type, minFees, maxFees, minRating, sort, page, limit } = query;

  const where: Prisma.CollegeWhereInput = {
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { city: { contains: q, mode: "insensitive" } },
        { state: { contains: q, mode: "insensitive" } },
      ],
    }),
    ...(city && { city: { equals: city, mode: "insensitive" } }),
    ...(state && { state: { equals: state, mode: "insensitive" } }),
    ...(type && { type }),
    ...(minRating !== undefined && { rating: { gte: minRating } }),
    ...((minFees !== undefined || maxFees !== undefined) && {
      AND: [
        ...(minFees !== undefined ? [{ feesMax: { gte: minFees } }] : []),
        ...(maxFees !== undefined ? [{ feesMin: { lte: maxFees } }] : []),
      ],
    }),
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "fees_asc"
      ? { feesMin: "asc" }
      : sort === "fees_desc"
        ? { feesMax: "desc" }
        : sort === "name_asc"
          ? { name: "asc" }
          : { rating: "desc" };

  const [data, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        city: true,
        state: true,
        type: true,
        feesMin: true,
        feesMax: true,
        rating: true,
        logoUrl: true,
      },
    }),
    prisma.college.count({ where }),
  ]);

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}
