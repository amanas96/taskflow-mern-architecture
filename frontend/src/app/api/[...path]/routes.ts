import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const queryString = searchParams.toString();

    const response = await fetch(`${BACKEND_URL}/tasks?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("authorization") || "",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Tasks fetch failed" },
      { status: 500 },
    );
  }
}
