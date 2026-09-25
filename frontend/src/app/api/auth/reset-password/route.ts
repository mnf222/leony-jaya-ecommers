import { api } from "@/lib/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const res = await api.post("/auth/reset-password", body);

        return NextResponse.json(res);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to reset password";
        return NextResponse.json(
            { message },
            { status: 400 }
        );
    }
}