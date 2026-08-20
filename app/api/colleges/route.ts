import { NextRequest, NextResponse } from "next/server";
import { listColleges } from "@/lib/colleges";
import { collegeListQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const parsed = collegeListQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await listColleges(parsed.data);
  return NextResponse.json(result);
}
