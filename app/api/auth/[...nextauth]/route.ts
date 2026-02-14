import { handlers } from "@/auth"
import { NextRequest } from "next/server"

const { GET: originalGET, POST: originalPOST } = handlers

export async function GET(req: NextRequest) {
    console.log(`[AUTH-DEBUG] GET Request: ${req.url}`);
    return originalGET(req);
}

export async function POST(req: NextRequest) {
    console.log(`[AUTH-DEBUG] POST Request: ${req.url}`);
    return originalPOST(req);
}
