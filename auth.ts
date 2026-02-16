
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// List of allowed emails (Students & Admins)
const ALLOWED_EMAILS = (process.env.ALLOWED_USERS || "").split(",").map(e => e.trim().toLowerCase());
const ADMIN_EMAILS = (process.env.ADMIN_USERS || "").split(",").map(e => e.trim().toLowerCase());
const SHARED_CODE = process.env.STUDENT_ACCESS_CODE || "cannaua2026";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            name: "Código de Acceso",
            credentials: {
                code: { label: "Código de Alumno", type: "password", placeholder: "Introduce el código del curso" }
            },
            async authorize(credentials) {
                if (credentials?.code === SHARED_CODE) {
                    return {
                        id: "shared-student",
                        name: "Alumno del Curso",
                        email: "alumno@curso.com",
                        role: "student"
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            // Credentials login (shared code) is always allowed if authorize passed
            if (account?.provider === "credentials") return true;

            if (!user.email) return false;

            const email = user.email.toLowerCase();

            // Allow if present in ALLOWED whitelist OR is an Admin
            if (ALLOWED_EMAILS.length > 0 && !ALLOWED_EMAILS.includes(email) && !ADMIN_EMAILS.includes(email)) {
                console.log(`Access denied for: ${email}`);
                return false;
            }

            return true;
        },
        async session({ session, token, user: sessionUser }) {
            const user = session.user as any;

            // Handle Credentials user (id is set in authorize)
            if (token?.sub === "shared-student") {
                user.role = 'student';
                user.name = "Alumno del Curso";
                user.email = "alumno@curso.com";
                return session;
            }

            if (session.user && session.user.email) {
                const email = session.user.email.toLowerCase();
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
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/gm21') || nextUrl.pathname.startsWith('/gm20');

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
