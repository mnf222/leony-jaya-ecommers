"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const isInvalidLink = !token || !email;

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(isInvalidLink ? "error" : "idle");
    const [message, setMessage] = useState(isInvalidLink ? "Link reset tidak valid atau sudah kadaluarsa" : "");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token || !email) return;

        if (password !== confirmPassword) {
            setMessage("Password tidak cocok");
            return;
        }

        if (password.length < 8) {
            setMessage("Password minimal 8 karakter");
            return;
        }

        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email, password, password_confirmation: confirmPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus("error");
                setMessage(data.message || "Gagal reset password");
            } else {
                setStatus("success");
                setMessage("Password berhasil direset");
                setTimeout(() => router.push("/login"), 2000);
            }
        } catch {
            setStatus("error");
            setMessage("Terjadi kesalahan, coba lagi");
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                        Password Baru
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            required
                            autoComplete="new-password"
                            disabled={status === "loading" || status === "success"}
                            className="w-full pl-10 pr-12 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                        Konfirmasi Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password"
                            required
                            autoComplete="new-password"
                            disabled={status === "loading" || status === "success"}
                            className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {status === "loading" ? "Resetting..." : "RESET PASSWORD"}
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
                <Link href="/login" className="font-medium text-primary hover:underline">
                    ← Back to Sign In
                </Link>
            </p>
        </div>
    );
}