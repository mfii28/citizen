import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isStaff = token?.role === "ADMIN" || token?.role === "STAFF";

    if (req.nextUrl.pathname.startsWith("/admin") && !isStaff) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // /account/* just needs any signed-in user — handled by the `authorized` callback below.
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/account")) return !!token;
        return !!token;
      },
    },
    pages: { signIn: "/login" },
  }
);

export const config = { matcher: ["/admin/:path*", "/account/:path*"] };
