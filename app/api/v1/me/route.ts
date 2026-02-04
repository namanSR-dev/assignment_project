import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { User } from "@/models/User";
import { z } from "zod";



export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // look for token in cookies

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 } // user not logged in, go away
      );
    }

    const payload = verifyToken(token); // check if token is legit
    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 } // token is fake or too old
      );
    }

    await connectDB(); // talk to db

    const user = await User.findById(payload.userId).select("-password"); // find user but skip password
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 } // user deleted or something?
      );
    }

    return NextResponse.json({
      success: true,
      data: user, // send user info to frontend
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 } // server had a bad time
    );
  }
}




// validation helper for api
const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"), // name cant be empty string
});

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // need token to change name

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

    const body = await req.json(); // get the new name from request
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 } // name input is bad
      );
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      payload.userId,
      { name: parsed.data.name },
      { new: true, select: "-password" } // {new: true} gives back the FRESH data, not old
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated",
      data: updatedUser,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
