import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '6ebb10a9e8621cf9488443e75a8d0171';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'institutionalworkspace';
const R2_ENDPOINT = process.env.R2_ENDPOINT || `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '8efac19abfe288ff5a3013d3313cc8a9';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '828f7fb2ec7c352bd9958f74dbc9f835cfe841cb5546018352ca8ac27e901fb4';

let cachedClient: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY
      }
    });
  }
  return cachedClient;
}

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  bucket?: string;
  metadata?: Record<string, string>;
}

/**
 * Upload an object directly to Cloudflare R2
 */
export async function uploadToR2(options: UploadOptions): Promise<{ key: string; bucket: string; url: string }> {
  const client = getR2Client();
  const bucket = options.bucket || R2_BUCKET_NAME;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: options.key,
    Body: options.body,
    ContentType: options.contentType || 'application/octet-stream',
    Metadata: options.metadata
  });

  await client.send(command);

  return {
    key: options.key,
    bucket,
    url: `${R2_ENDPOINT}/${bucket}/${options.key}`
  };
}

/**
 * Generate a pre-signed download URL for private R2 object access
 */
export async function getR2SignedDownloadUrl(
  key: string,
  expiresInSeconds: number = 3600,
  bucket: string = R2_BUCKET_NAME
): Promise<string> {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Generate a pre-signed upload URL for direct browser-to-R2 upload
 */
export async function getR2SignedUploadUrl(
  key: string,
  contentType: string = 'application/octet-stream',
  expiresInSeconds: number = 3600,
  bucket: string = R2_BUCKET_NAME
): Promise<string> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete an object from Cloudflare R2
 */
export async function deleteFromR2(key: string, bucket: string = R2_BUCKET_NAME): Promise<void> {
  const client = getR2Client();
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key
  });

  await client.send(command);
}

/**
 * Verify Cloudflare R2 Connectivity and Bucket Access
 */
export async function testR2Connection(): Promise<{
  connected: boolean;
  bucket: string;
  endpoint: string;
  itemCount: number;
  message: string;
}> {
  try {
    const client = getR2Client();
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 10
    });

    const response = await client.send(command);
    return {
      connected: true,
      bucket: R2_BUCKET_NAME,
      endpoint: R2_ENDPOINT,
      itemCount: response.KeyCount || 0,
      message: `Successfully connected to Cloudflare R2 bucket "${R2_BUCKET_NAME}".`
    };
  } catch (err: any) {
    return {
      connected: false,
      bucket: R2_BUCKET_NAME,
      endpoint: R2_ENDPOINT,
      itemCount: 0,
      message: `Cloudflare R2 connection failed: ${err.message}`
    };
  }
}
