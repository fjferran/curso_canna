
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

    if (!session?.user) return <>{fallback}</>

    // @ts-ignore // Role is injected in auth.ts but types not yet extended
    const role = session.user.role

    if (adminOnly && role !== 'admin') {
        return <>{fallback}</>
    }

    return <div suppressHydrationWarning>{children}</div>
}
