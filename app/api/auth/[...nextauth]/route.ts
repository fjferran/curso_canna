
import { handlers } from "@/auth" // Referring to the auth.ts we just created
const { GET: originalGET, POST: originalPOST } = handlers

export async function GET(req: Request) {
    console.log(`[AUTH-DEBUG] GET Request: ${req.url}`);
    return originalGET(req);
}

export async function POST(req: Request) {
    console.log(`[AUTH-DEBUG] POST Request: ${req.url}`);
    return originalPOST(req);
}
