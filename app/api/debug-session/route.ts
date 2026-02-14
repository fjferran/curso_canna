
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const session = await auth()
    const headers = Object.fromEntries(request.headers)

    // Extract cookies manually for inspection
    const cookieHeader = request.headers.get('cookie') || 'No cookies'

    return NextResponse.json({
        status: 'debug_api_running',
        session_data: session,
        env_check: {
            node_env: process.env.NODE_ENV,
            auth_url: process.env.AUTH_URL,
            auth_trust_host: process.env.AUTH_TRUST_HOST,
        },
        request_data: {
            url: request.url,
            cookies_received: cookieHeader,
            host_header: request.headers.get('host'),
        }
    }, { status: 200 })
}
