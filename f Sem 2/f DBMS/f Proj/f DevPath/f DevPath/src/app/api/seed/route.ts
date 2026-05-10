import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST /api/seed - Seed the database with sample data
export async function POST() {
  try {
    // Create sample users
    const users = await Promise.all([
      db.user.create({
        data: {
          email: "john@example.com",
          firstName: "John",
          lastName: "Doe",
          passwordHash: "hashed_password",
          role: "learner",
          subscriptionTier: "pro",
          bio: "Full-stack developer in training",
        },
      }),
      db.user.create({
        data: {
          email: "sarah@example.com",
          firstName: "Sarah",
          lastName: "Kim",
          passwordHash: "hashed_password",
          role: "learner",
          subscriptionTier: "team",
          bio: "Frontend enthusiast",
        },
      }),
      db.user.create({
        data: {
          email: "alex@example.com",
          firstName: "Alex",
          lastName: "Chen",
          passwordHash: "hashed_password",
          role: "mentor",
          subscriptionTier: "pro",
          bio: "Senior developer and mentor",
        },
      }),
    ]);

    // Create sample courses
    const courses = await Promise.all([
      db.course.create({
        data: {
          title: "Full-Stack Web Development",
          description: "Build production-ready web applications from scratch. Learn React, Node.js, and PostgreSQL while creating real projects.",
          techStack: "React,Node.js,PostgreSQL,TypeScript",
          difficulty: "intermediate",
          duration: 40,
        },
      }),
      db.course.create({
        data: {
          title: "AI/ML Engineering Bootcamp",
          description: "Master machine learning fundamentals and deploy AI models. Build intelligent applications with Python and TensorFlow.",
          techStack: "Python,TensorFlow,PyTorch,FastAPI",
          difficulty: "advanced",
          duration: 60,
        },
      }),
      db.course.create({
        data: {
          title: "Mobile App Development",
          description: "Create cross-platform mobile apps with React Native. Ship to both iOS and Android stores.",
          techStack: "React Native,Expo,Firebase,Redux",
          difficulty: "beginner",
          duration: 30,
        },
      }),
      db.course.create({
        data: {
          title: "DevOps & Cloud Architecture",
          description: "Master CI/CD pipelines, containerization, and cloud deployment. Build scalable infrastructure.",
          techStack: "Docker,Kubernetes,AWS,Terraform",
          difficulty: "advanced",
          duration: 45,
        },
      }),
    ]);

    // Create lessons for the first course
    const course1Lessons = await Promise.all([
      db.lesson.create({
        data: {
          courseId: courses[0].id,
          title: "Introduction to Web Development",
          content: "# Introduction\n\nWelcome to full-stack web development...",
          order: 1,
          duration: 45,
          tags: {
            create: [{ tag: "basics" }, { tag: "introduction" }],
          },
        },
      }),
      db.lesson.create({
        data: {
          courseId: courses[0].id,
          title: "HTML & CSS Fundamentals",
          content: "# HTML & CSS\n\nLearn the building blocks of the web...",
          order: 2,
          duration: 60,
          tags: {
            create: [{ tag: "html" }, { tag: "css" }],
          },
        },
      }),
      db.lesson.create({
        data: {
          courseId: courses[0].id,
          title: "JavaScript Essentials",
          content: "# JavaScript\n\nThe language of the web...",
          order: 3,
          duration: 90,
          tags: {
            create: [{ tag: "javascript" }, { tag: "programming" }],
          },
        },
      }),
      db.lesson.create({
        data: {
          courseId: courses[0].id,
          title: "React Fundamentals",
          content: "# React\n\nBuilding modern UIs with React...",
          order: 4,
          duration: 120,
          tags: {
            create: [{ tag: "react" }, { tag: "frontend" }],
          },
        },
      }),
      db.lesson.create({
        data: {
          courseId: courses[0].id,
          title: "API Design with Node.js",
          content: "# API Design\n\nBuilding RESTful APIs...",
          order: 5,
          duration: 90,
          tags: {
            create: [{ tag: "api" }, { tag: "nodejs" }, { tag: "backend" }],
          },
        },
      }),
    ]);

    // Create sample projects
    const projects = await Promise.all([
      db.project.create({
        data: {
          ownerId: users[0].id,
          name: "E-Commerce Platform",
          description: "A full-featured online store with payment integration",
          status: "in_progress",
          completionProgress: 65,
          blueprint: {
            create: {
              techRecommendations: JSON.stringify(["Next.js", "Stripe", "Prisma", "TailwindCSS"]),
              architecture: JSON.stringify({
                frontend: "Next.js",
                backend: "API Routes",
                database: "PostgreSQL",
              }),
            },
          },
        },
      }),
      db.project.create({
        data: {
          ownerId: users[0].id,
          name: "Task Management App",
          description: "Collaborative project management tool",
          status: "planning",
          completionProgress: 20,
          blueprint: {
            create: {
              techRecommendations: JSON.stringify(["React", "Firebase", "Material-UI"]),
            },
          },
        },
      }),
    ]);

    // Create Kanban tasks
    await Promise.all([
      db.kanbanTask.create({
        data: {
          projectId: projects[0].id,
          taskName: "Setup Project Structure",
          description: "Initialize the project with proper folder structure",
          status: "done",
          priority: "high",
          order: 1,
        },
      }),
      db.kanbanTask.create({
        data: {
          projectId: projects[0].id,
          taskName: "User Authentication",
          description: "Implement user registration and login",
          status: "done",
          priority: "high",
          order: 2,
        },
      }),
      db.kanbanTask.create({
        data: {
          projectId: projects[0].id,
          taskName: "Product Catalog",
          description: "Build the product listing and detail pages",
          status: "in_progress",
          priority: "high",
          order: 3,
          lessonId: course1Lessons[4].id,
        },
      }),
      db.kanbanTask.create({
        data: {
          projectId: projects[0].id,
          taskName: "Shopping Cart",
          description: "Implement cart functionality",
          status: "locked",
          priority: "medium",
          order: 4,
        },
      }),
    ]);

    // Create a team
    const team = await db.team.create({
      data: {
        name: "Code Crafters",
        description: "A team of passionate developers",
        members: {
          create: [
            { userId: users[0].id, role: "owner" },
            { userId: users[1].id, role: "member" },
            { userId: users[2].id, role: "member" },
          ],
        },
      },
    });

    // Create enrollments
    await db.enrollment.create({
      data: {
        userId: users[0].id,
        courseId: courses[0].id,
        progress: 45,
      },
    });

    return NextResponse.json({
      message: "Database seeded successfully",
      data: {
        users: users.length,
        courses: courses.length,
        lessons: course1Lessons.length,
        projects: projects.length,
        team: team.name,
      },
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
