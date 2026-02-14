
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// List of allowed emails (Students & Admins)
// In a real production app, this might come from a DB.
// For now, we use Environment Variables or a hardcoded list.
const ALLOWED_EMAILS = (process.env.ALLOWED_USERS || "").split(",").map(e => e.trim().toLowerCase());
const ADMIN_EMAILS = (process.env.ADMIN_USERS || "").split(",").map(e => e.trim().toLowerCase());

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            const email = user.email.toLowerCase();

            // Allow if present in ALLOWED whitelist OR is an Admin
            // If ALLOWED_USERS is empty (not configured), we might want to block everyone or allow everyone (dev mode).
            // Security first: Block if list is configured but user not in it.
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
                    console.log(`[AUTH] Session for ${email}. Is Admin? ${isAdmin}. Admin List: ${JSON.stringify(ADMIN_EMAILS)}`);
                    user.role = isAdmin ? 'admin' : 'student';
                }
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/gm21');
            // Protect specific routes or all
            // For now, let's say we protect everything except landing page "/" and public assets

            // If looking for a specific restricted page
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },

    debug: true, // Enable debug logs in container
    trustHost: true, // Trust the host header (crucial for proxy/docker)
    useSecureCookies: false, // FORCE INSECURE FOR HTTP VPS
    cookies: {
        sessionToken: {
            name: `custom-canna-session`, // New name to force fresh cookie
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false,
                domain: '.cursoindustriayagronomiacannaua.com' // Explicit domain (with dot for subdomains support)
            }
        }
    }
})
