import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { api, AuthResponse } from "@/lib/api";

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: {
        signIn: "/login",
        error: "/login",
    },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember me", type: "checkbox" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const res = await api.post<AuthResponse>("/auth/login", {
                        email: credentials.email as string,
                        password: credentials.password as string,
                        remember: credentials.remember === "true",
                    });

                    if (res.user && res.token) {
                        return {
                            id: String(res.user.id),
                            name: res.user.name,
                            email: res.user.email,
                            image: res.user.avatar,
                            token: res.token,
                        };
                    }
                    return null;
                } catch {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as { token?: string; id?: string };
                token.accessToken = u.token ?? "";
                token.id = u.id ?? "";
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id ?? "";
                session.accessToken = token.accessToken ?? "";
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.AUTH_SECRET,
});