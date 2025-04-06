import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileParam = searchParams.get('file');

  if (!fileParam || fileParam.includes('..')) {
    return new NextResponse('Invalid file path', { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'public', fileParam);
  console.log("##", filePath);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();

  const contentType = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    svg: 'image/svg+xml',
  }[ext] || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': contentType,
    },
  });
}
