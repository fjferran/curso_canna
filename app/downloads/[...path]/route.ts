import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path: pathParts } = await params;
    const filePath = path.join(process.cwd(), 'public', 'downloads', ...pathParts);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('File not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const contentTypeMap: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.mp4': 'video/mp4',
        '.mp3': 'audio/mpeg',
        '.webm': 'video/webm',
        '.ogg': 'audio/ogg',
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    // Stream the file for efficient delivery (especially for large videos)
    const fileStream = fs.createReadStream(filePath);
    const body = new ReadableStream({
        start(controller) {
            fileStream.on('data', (chunk) => controller.enqueue(chunk));
            fileStream.on('end', () => controller.close());
            fileStream.on('error', (err) => controller.error(err));
        },
        cancel() {
            fileStream.destroy();
        }
    });

    return new NextResponse(body, {
        headers: {
            'Content-Type': contentType,
            'Content-Length': stat.size.toString(),
            'Cache-Control': 'public, max-age=86400',
            'Content-Disposition': ext === '.pdf' ? 'inline' : 'inline',
        },
    });
}
