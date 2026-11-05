import { withAuth } from "next-auth/middleware";
import { ADMIN_EMAIL } from "@/lib/admin";

export default withAuth({
  pages: {
    signIn: "/login",
  },

  callbacks: {
    authorized: ({ req, token }) => {
      const pathname = req.nextUrl.pathname;

      // Only the designated administrator can access admin pages
      // and the users API.
      if (
        pathname.startsWith("/admin") ||
        pathname === "/api/users"
      ) {
        return (
          token?.email?.toLowerCase() ===
          ADMIN_EMAIL.toLowerCase()
        );
      }

      // Preserve the existing authentication requirement
      // for onboarding pages.
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/onboarding/:path*",
    "/admin/:path*",
    "/api/users",
  ],
};