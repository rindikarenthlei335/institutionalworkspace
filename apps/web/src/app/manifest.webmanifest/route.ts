import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Mount Carmel School Portal',
    short_name: 'Mount Carmel',
    description: 'Mount Carmel Higher Secondary School Portal & Parent PWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#EAEFEC',
    theme_color: '#1F4D3A',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json'
    }
  });
}
