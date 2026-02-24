import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "login";

    const backendEndpoint =
      type === "register" ? "/auth/register" : "/auth/login";

    const response = await fetch(`${BACKEND_URL}${backendEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include", // important
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Proxy Error" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  return NextResponse.json({ message: "Logged out" });
}
