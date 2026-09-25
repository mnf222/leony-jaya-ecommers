"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="font-display text-xl font-bold">LEONY JAYA</Link>
                    <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                </nav>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-bold tracking-tight">RESET PASSWORD</h1>
                        <p className="text-muted-foreground mt-2">Masukkan password baru</p>
                    </div>

                    <Suspense fallback={<div className="rounded-xl border border-border bg-card p-8 animate-pulse"><div className="h-8 w-3/4 bg-secondary rounded mb-4" /><div className="h-4 w-full bg-secondary rounded" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </main>
        </div>
    );
}