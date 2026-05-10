import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/courses - Get all courses
export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        lessons: {
          orderBy: { order: "asc" },
          include: {
            tags: true,
          },
        },
        _count: {
          select: { enrollments: true, lessons: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, techStack, difficulty, duration, thumbnail } = body;

    const course = await db.course.create({
      data: {
        title,
        description,
        techStack,
        difficulty: difficulty || "beginner",
        duration: duration || 0,
        thumbnail,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
