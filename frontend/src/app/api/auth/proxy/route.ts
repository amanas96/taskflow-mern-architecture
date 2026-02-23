import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "login";

    const backendEndpoint =
      type === "register" ? "/auth/register" : "/auth/login";

    // Call the actual Render Backend
    const response = await fetch(`${BACKEND_URL}${backendEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const res = NextResponse.json(data);

    // This sets the "Bridge" cookie on the Vercel domain
    res.cookies.set("refreshToken", "active", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Proxy Error" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
  return res;
}
