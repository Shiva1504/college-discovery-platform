import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { savedCollegeBodySchema } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: { college: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: saved });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = savedCollegeBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const college = await prisma.college.findUnique({ where: { id: parsed.data.collegeId } });
  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  const saved = await prisma.savedCollege.upsert({
    where: {
      userId_collegeId: { userId: session.user.id, collegeId: parsed.data.collegeId },
    },
    create: { userId: session.user.id, collegeId: parsed.data.collegeId },
    update: {},
  });

  return NextResponse.json({ data: saved }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = savedCollegeBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.savedCollege.deleteMany({
    where: { userId: session.user.id, collegeId: parsed.data.collegeId },
  });

  return NextResponse.json({ data: { removed: true } });
}
