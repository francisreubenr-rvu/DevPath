import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/projects - Get all projects
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("ownerId");
    const teamId = searchParams.get("teamId");

    const where: {
      ownerId?: string;
      teamId?: string | null;
    } = {};

    if (ownerId) where.ownerId = ownerId;
    if (teamId) where.teamId = teamId;

    const projects = await db.project.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        team: true,
        kanbanTasks: {
          orderBy: { order: "asc" },
        },
        blueprint: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerId, teamId, name, description, status } = body;

    // Create project with blueprint
    const project = await db.project.create({
      data: {
        ownerId,
        teamId,
        name,
        description,
        status: status || "planning",
        blueprint: {
          create: {
            techRecommendations: JSON.stringify([]),
          },
        },
      },
      include: {
        blueprint: true,
        kanbanTasks: true,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
