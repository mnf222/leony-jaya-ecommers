"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/account";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const res = await signIn("credentials", {
            email,
            password,
            remember: String(remember),
            redirect: false,
        });

        setLoading(false);

        if (res?.error) {
            setError("Email atau password salah");
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-8">
            {error && (
                <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                    {error}
                </div>
            )}

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
                            className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                            className="w-full pl-10 pr-12 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "SIGN IN"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                    Daftar
                </Link>
            </p>
        </div>
    );
}