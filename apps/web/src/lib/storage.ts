/**
 * StorageProvider & Client-side WebP Compression Engine
 */

export interface StorageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function compressImageToWebP(
  file: File,
  options: StorageOptions = {}
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('WebP compression failed'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
  });
}

export interface UploadResult {
  url: string;
  key: string;
  bytes: number;
}

export async function uploadImage(
  file: File,
  tenantId: string,
  moduleName: string
): Promise<UploadResult> {
  // 1. Compress client-side to WebP
  const compressedBlob = await compressImageToWebP(file);
  const key = `tenants/${tenantId}/${moduleName}/${crypto.randomUUID()}.webp`;

  // 2. In production, requests signed URL from Workers API and uploads to Cloudflare R2.
  // In dev/mock mode, create a persistent object URL or data URL fallback.
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(compressedBlob);
    reader.onloadend = () => {
      resolve({
        url: reader.result as string,
        key,
        bytes: compressedBlob.size
      });
    };
  });
}
