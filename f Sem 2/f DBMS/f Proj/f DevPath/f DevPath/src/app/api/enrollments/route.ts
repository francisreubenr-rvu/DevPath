import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/enrollments - Get enrollments
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const courseId = searchParams.get("courseId");

    const where: {
      userId?: string;
      courseId?: string;
    } = {};

    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;

    const enrollments = await db.enrollment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        course: {
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// POST /api/enrollments - Create a new enrollment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "Already enrolled in this course" },
        { status: 400 }
      );
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    // Create lesson submissions for all lessons in the course
    const lessons = await db.lesson.findMany({
      where: { courseId },
    });

    await db.lessonSubmission.createMany({
      data: lessons.map((lesson) => ({
        userId,
        lessonId: lesson.id,
        status: "not_started",
      })),
      skipDuplicates: true,
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}

// PATCH /api/enrollments - Update enrollment progress
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, courseId, progress, grade } = body;

    const enrollment = await db.enrollment.update({
      where: {
        userId_courseId: { userId, courseId },
      },
      data: {
        progress,
        grade,
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      { error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}
