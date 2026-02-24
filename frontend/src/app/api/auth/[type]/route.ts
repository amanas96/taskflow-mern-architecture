import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } },
) {
  const { type } = params;

  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/auth/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    const res = NextResponse.json(data);

    // Set refresh cookie on Vercel domain
    if (data.refreshToken) {
      res.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return res;
  } catch {
    return NextResponse.json({ message: "Proxy error" }, { status: 500 });
  }
}
