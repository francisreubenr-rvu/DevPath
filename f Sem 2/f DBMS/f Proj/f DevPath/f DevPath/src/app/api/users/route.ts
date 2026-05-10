import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/users - Get all users
export async function GET() {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            ownedProjects: true,
            enrollments: true,
            teamMemberships: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, passwordHash, role, subscriptionTier, avatar, bio } = body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: passwordHash || "hashed_password_placeholder",
        role: role || "learner",
        subscriptionTier: subscriptionTier || "starter",
        avatar,
        bio,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        subscriptionTier: true,
        avatar: true,
        bio: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
