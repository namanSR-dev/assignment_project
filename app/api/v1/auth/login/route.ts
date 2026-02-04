import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validator";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // get login data
    const parsed = loginSchema.safeParse(body); // validate input format

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }, // tell user they type wrong
      );
    }

    const { email, password } = parsed.data;

    await connectDB(); // open db pipe

    // we hide password in model, so must ask for it here with +password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }, // email not found
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }, // wrong password
      );
    }

    const token = signToken({ userId: user._id.toString() }); // give them access token

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // save token in cookie so browser remembers
    response.cookies.set("token", token, {
      httpOnly: true, // hacker script cannot read this
      secure: process.env.NODE_ENV === "production", // only work on https for live
      sameSite: "strict", // stop some fake requests
      maxAge: 60 * 60 * 24 * 7, // 1 week expire
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Internal server error: \n${error}` },
      { status: 500 }, // server crash or db error
    );
  }
}
