import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

// ======================
// PATCH /api/tasks/[id]
// ======================
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
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

// ======================
// DELETE /api/tasks/[id]
// ======================
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
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
