import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/teams - Get all teams
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const where: {
      members?: { some: { userId: string } };
    } = {};

    if (userId) {
      where.members = { some: { userId } };
    }

    const teams = await db.team.findMany({
      where,
      include: {
        members: {
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
          },
        },
        projects: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, ownerId } = body;

    // Create team with owner as first member
    const team = await db.team.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: ownerId,
            role: "owner",
          },
        },
      },
      include: {
        members: {
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
          },
        },
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Failed to create team" },
      { status: 500 }
    );
  }
}
