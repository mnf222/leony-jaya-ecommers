"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Password tidak cocok");
            return;
        }

        if (password.length < 8) {
            setError("Password minimal 8 karakter");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.errors?.email?.[0] || data.message || "Registrasi gagal");
                setLoading(false);
                return;
            }

            // Auto login after register
            const loginRes = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (loginRes?.error) {
                setError("Registrasi berhasil, silakan login manual");
            } else {
                router.push("/account");
                router.refresh();
            }
        } catch {
            setError("Terjadi kesalahan, coba lagi");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="font-display text-xl font-bold">LEONY JAYA</Link>
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back</Link>
                </nav>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-bold tracking-tight">CREATE ACCOUNT</h1>
                        <p className="text-muted-foreground mt-2">Bergabung dengan Inner Circle Leony Jaya</p>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-8">
                        {error && (
                            <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nama kamu"
                                        required
                                        autoComplete="name"
                                        className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                                    Nomor HP (opsional)
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+62 8xx xxx xxxx"
                                        autoComplete="tel"
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
                                        placeholder="Minimal 8 karakter"
                                        required
                                        autoComplete="new-password"
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
                                        className="w-full pl-10 pr-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {loading ? "Creating account..." : "CREATE ACCOUNT"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Sudah punya akun?{" "}
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