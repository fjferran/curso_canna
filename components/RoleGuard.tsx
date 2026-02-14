
import { auth } from "@/auth"

interface RoleGuardProps {
    children: React.ReactNode
    adminOnly?: boolean
    fallback?: React.ReactNode
}

export default async function RoleGuard({ children, adminOnly = false, fallback = null }: RoleGuardProps) {
    // In development mode, always show protected content to make testing easier
    // This allows seeing buttons and admin features without needing to login
    if (process.env.NODE_ENV === 'development') {
        return <div suppressHydrationWarning>{children}</div>;
    }

    const session = await auth()

    if (!session?.user) {
        return (
            <div className="text-[10px] text-amber-500 border border-amber-200 bg-amber-50 p-1 rounded max-w-[200px]">
                DEBUG: No session.<br />
                Please login.
            </div>
        )
    }

    // @ts-ignore // Role is injected in auth.ts but types not yet extended
    const role = session.user.role

    if (adminOnly && role !== 'admin') {
        return (
            <div className="text-[10px] text-red-500 border border-red-200 bg-red-50 p-1 rounded max-w-[200px]">
                DEBUG: Denied.<br />
                Email: {session.user.email}<br />
                Role: {role || 'none'}
            </div>
        )
    }

    return <div suppressHydrationWarning>{children}</div>
}
