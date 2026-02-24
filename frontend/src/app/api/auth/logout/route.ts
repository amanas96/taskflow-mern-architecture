import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: request.headers.get("authorization") || "",
      },
      credentials: "include",
    });

    const res = NextResponse.json(
      { message: "Logged out" },
      { status: response.status },
    );

    // Clear Vercel refreshToken cookie
    res.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Logout proxy failed" },
      { status: 500 },
    );
  }
}
