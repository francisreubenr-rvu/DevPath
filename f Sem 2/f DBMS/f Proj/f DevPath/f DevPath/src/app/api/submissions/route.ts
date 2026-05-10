import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/submissions - Get submissions
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const lessonId = searchParams.get("lessonId");

    const where: {
      userId?: string;
      lessonId?: string;
    } = {};

    if (userId) where.userId = userId;
    if (lessonId) where.lessonId = lessonId;

    const submissions = await db.submission.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        lesson: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

// POST /api/submissions - Create a new submission
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, lessonId, code } = body;

    // Simulate AI evaluation
    const aiScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const status = aiScore >= 80 ? "passed" : "failed";
    const feedback = JSON.stringify({
      strengths: ["Good code structure", "Clear variable naming"],
      improvements: ["Add error handling", "Consider edge cases"],
      suggestions: ["Use try-catch blocks", "Add input validation"],
    });

    const submission = await db.submission.create({
      data: {
        userId,
        lessonId,
        code,
        aiScore,
        aiFeedback: feedback,
        status: "evaluated",
        evaluatedAt: new Date(),
      },
    });

    // If passed, mark lesson as completed
    if (status === "passed") {
      await db.lessonSubmission.upsert({
        where: {
          userId_lessonId: { userId, lessonId },
        },
        create: {
          userId,
          lessonId,
          status: "completed",
          completedAt: new Date(),
        },
        update: {
          status: "completed",
          completedAt: new Date(),
        },
      });

      // Unlock related Kanban tasks
      await db.kanbanTask.updateMany({
        where: { lessonId },
        data: { status: "in_progress" },
      });
    }

    return NextResponse.json({
      ...submission,
      passed: status === "passed",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Failed to create submission" },
      { status: 500 }
    );
  }
}
