import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const res = await api.post("/auth/register", body);

        return NextResponse.json(res, { status: 201 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Registration failed";
        return NextResponse.json(
            { message, errors: {} },
            { status: 422 }
        );
    }
}