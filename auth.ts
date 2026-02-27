
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// List of allowed emails (Students & Admins)
const ALLOWED_EMAILS = (process.env.ALLOWED_USERS || "").split(",").map(e => e.trim().toLowerCase());
const ADMIN_EMAILS = (process.env.ADMIN_USERS || "").split(",").map(e => e.trim().toLowerCase());

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            const email = user.email.toLowerCase();

            // Allow if present in ALLOWED whitelist OR is an Admin
            if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(email) && !ADMIN_EMAILS.includes(email)) {
                console.log(`Access denied for: ${email}`);
                return false;
            }

            return true;
        },
        async session({ session, token }) {
            if (session.user && session.user.email) {
                const email = session.user.email.toLowerCase();
                // Inject role into session
                const user = session.user as any;
                if (process.env.NODE_ENV === 'development') {
                    user.role = 'admin';
                } else {
                    const isAdmin = ADMIN_EMAILS.includes(email);
                    user.role = isAdmin ? 'admin' : 'student';
                }
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            if (process.env.NODE_ENV === 'development') return true;
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;
            const isOnDashboard = pathname.startsWith('/dashboard') ||
                pathname.startsWith('/gm21') ||
                pathname.startsWith('/gm20');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            }
            return true;
        },
    },
    debug: false,
    trustHost: true,
})
