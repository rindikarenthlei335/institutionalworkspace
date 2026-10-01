export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';
import { getR2SignedUploadUrl, getR2SignedDownloadUrl } from '@/lib/r2';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, action, contentType, expiresIn } = body;

    if (!key) {
      return NextResponse.json({ error: 'Missing required object key' }, { status: 400 });
    }

    if (action === 'download') {
      const url = await getR2SignedDownloadUrl(key, expiresIn || 3600);
      return NextResponse.json({
        success: true,
        action: 'download',
        key,
        url,
        expiresIn: expiresIn || 3600
      });
    }

    // Default: upload presigned URL
    const url = await getR2SignedUploadUrl(key, contentType || 'application/octet-stream', expiresIn || 3600);
    return NextResponse.json({
      success: true,
      action: 'upload',
      key,
      url,
      expiresIn: expiresIn || 3600
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: `Cloudflare R2 sign error: ${err.message}` },
      { status: 500 }
    );
  }
}
