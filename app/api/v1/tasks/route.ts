import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { Task } from "@/models/Task";

/* -------------------- VALIDATION -------------------- */

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"), // task must have a name
});

/* -------------------- GET /tasks -------------------- */

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // check if user logged in
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token); // check if token is good
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    await connectDB();

    // find tasks only for this user, show newest first
    const tasks = await Task.find({ userId: payload.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }, // something went wrong in db
    );
  }
}

/* -------------------- POST /tasks -------------------- */

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // need token to make task
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const body = await req.json(); // get task title from body
    const parsed = createTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }, // title is missing or empty
      );
    }

    await connectDB();

    // save new task and link it to this user
    const task = await Task.create({
      title: parsed.data.title,
      userId: payload.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Task created",
      data: task,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
