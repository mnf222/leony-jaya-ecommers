import { auth } from "@/auth/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnLogin = req.nextUrl.pathname.startsWith("/login");
    const isOnRegister = req.nextUrl.pathname.startsWith("/register");
    const isOnAuth = isOnLogin || isOnRegister;
    const isProtected = ["/account", "/cart", "/checkout"].some((path) =>
        req.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !isLoggedIn) {
        const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
        return Response.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.nextUrl));
    }

    if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/account", req.nextUrl));
    }

    return undefined;
});

export const config = {
    matcher: ["/account/:path*", "/cart/:path*", "/checkout/:path*", "/login", "/register"],
};