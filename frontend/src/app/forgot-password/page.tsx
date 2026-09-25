"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setMessage(data.message || "Gagal mengirim link reset");
            } else {
                setStatus("success");
                setMessage("Link reset password dikirim ke email kamu");
            }
        } catch {
            setStatus("error");
            setMessage("Terjadi kesalahan, coba lagi");
        }
    }

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
                        <h1 className="font-display text-3xl font-bold tracking-tight">FORGOT PASSWORD</h1>
                        <p className="text-muted-foreground mt-2">Masukkan email untuk reset password</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-8">
                        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        autoComplete="email"
                                        disabled={status === "loading"}
                                        className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {status === "loading" ? "Sending..." : "SEND RESET LINK"}
                            </button>
                        </form>

                        {message && (
                            <div
                                className={`mt-6 p-4 rounded-md text-sm ${
                                    status === "success"
                                        ? "bg-green-500/10 border border-green-500/20 text-green-500"
                                        : "bg-red-500/10 border border-red-500/20 text-red-500"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Ingat password?{" "}
                            <Link href="/login" className="font-medium text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}