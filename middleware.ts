
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/gm21')

    console.log(`[MIDDLEWARE-DEBUG] URL: ${req.nextUrl.pathname}, LoggedIn: ${isLoggedIn}, IsDashboard/GM21: ${isOnDashboard}`)

    if (isOnDashboard) {
        if (isLoggedIn) return NextResponse.next()
        return NextResponse.redirect(new URL('/api/auth/signin', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
