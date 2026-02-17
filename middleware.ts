
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    // Protect dashboard and specific course paths
    const isProtected = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/gm21') ||
        pathname.startsWith('/gm20')

    if (isProtected) {
        if (isLoggedIn) return NextResponse.next()
        return NextResponse.redirect(new URL('/api/auth/signin', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
