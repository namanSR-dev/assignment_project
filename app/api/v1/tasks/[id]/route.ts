import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Task } from "@/models/Task";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

/* -------------------- VALIDATION -------------------- */

const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  completed: z.boolean().optional(),
});

/* -------------------- GET /tasks/:id -------------------- */

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const cookiesStore = await cookies()
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const task = await Task.findOne({
      _id: id,
      userId: payload.userId,
    });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: task });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* -------------------- PUT /tasks/:id -------------------- */

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const cookiesStore = await cookies()
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = updateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: payload.userId },
      parsed.data,
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated",
      data: updatedTask,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/* -------------------- DELETE /tasks/:id -------------------- */

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const cookiesStore = await cookies()
    const token = cookiesStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: payload.userId,
    });

    if (!deletedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
