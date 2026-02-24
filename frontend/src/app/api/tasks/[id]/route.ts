import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/tasks/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: request.headers.get("authorization") || "",
      },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Task update failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const response = await fetch(`${BACKEND_URL}/tasks/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: request.headers.get("authorization") || "",
      },
      credentials: "include",
    });

    return new NextResponse(null, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Task deletion failed" },
      { status: 500 },
    );
  }
}
