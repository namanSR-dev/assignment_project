import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { signupSchema } from "@/lib/validator";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // get data from client
    const parsed = signupSchema.safeParse(body); // check if data is good or bad

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0].message },
        { status: 400 }, // bad request, fix your input
      );
    }

    const { name, email, password } = parsed.data;

    await connectDB(); // make sure db is awake

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already in use" },
        { status: 409 }, // user already exist
      );
    }

    const hashedPassword = await hashPassword(password); // never save raw password!!

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = signToken({ userId: user._id.toString() }); // make login stamp

    const response = NextResponse.json({
      success: true,
      message: "Signup successful",
    });

    // put token in browser cookie, more safe
    response.cookies.set("token", token, {
      httpOnly: true, // javascript cannot touch this, good for security
      secure: process.env.NODE_ENV === "production", // only https for live
      sameSite: "strict", // no cross-site hacking
      maxAge: 60 * 60 * 24 * 7, // live for 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Internal server error: \n${error}` },
      { status: 500 }, // something broke on server
    );
  }
}
