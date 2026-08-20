import { z } from "zod";

export const collegeTypeEnum = z.enum(["GOVERNMENT", "PRIVATE", "DEEMED"]);

export const collegeListQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  type: collegeTypeEnum.optional(),
  minFees: z.coerce.number().int().min(0).optional(),
  maxFees: z.coerce.number().int().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc", "name_asc"]).optional().default("rating_desc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(12),
});

export type CollegeListQuery = z.infer<typeof collegeListQuerySchema>;

export const compareQuerySchema = z.object({
  ids: z
    .string()
    .min(1)
    .transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean))
    .refine((arr) => arr.length >= 2 && arr.length <= 3, {
      message: "Provide between 2 and 3 college slugs to compare",
    }),
});

export const savedCollegeBodySchema = z.object({
  collegeId: z.string().min(1),
});

export const savedComparisonBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  collegeIds: z.array(z.string().min(1)).min(2).max(3),
});

export const signupBodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8).max(100),
});
