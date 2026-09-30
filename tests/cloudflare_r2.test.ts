import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = '6ebb10a9e8621cf9488443e75a8d0171';
const R2_BUCKET_NAME = 'institutionalworkspace';
const R2_ENDPOINT = 'https://6ebb10a9e8621cf9488443e75a8d0171.r2.cloudflarestorage.com';
const R2_ACCESS_KEY_ID = '8efac19abfe288ff5a3013d3313cc8a9';
const R2_SECRET_ACCESS_KEY = '828f7fb2ec7c352bd9958f74dbc9f835cfe841cb5546018352ca8ac27e901fb4';

describe('Cloudflare R2 Live Connection Tests', () => {
  const client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY
    }
  });

  const testKey = `test-verifications/r2-connection-${Date.now()}.json`;
  const testPayload = JSON.stringify({
    service: 'EduPortal Cloudflare R2 Storage',
    bucket: R2_BUCKET_NAME,
    timestamp: new Date().toISOString(),
    status: 'connected_and_verified'
  });

  it('1. Connects to Cloudflare R2 and lists bucket contents', async () => {
    const listCmd = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      MaxKeys: 5
    });

    const response = await client.send(listCmd);
    assert.ok(response.$metadata.httpStatusCode === 200, 'Bucket list request should return HTTP 200');
    console.log(`[R2 TEST] Successfully connected to bucket "${R2_BUCKET_NAME}". Current items: ${response.KeyCount ?? 0}`);
  });

  it('2. Uploads a test object to Cloudflare R2', async () => {
    const putCmd = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey,
      Body: testPayload,
      ContentType: 'application/json',
      Metadata: {
        'eduportal-test': 'verified-connection'
      }
    });

    const putRes = await client.send(putCmd);
    assert.equal(putRes.$metadata.httpStatusCode, 200, 'Upload should return HTTP 200');
    console.log(`[R2 TEST] Successfully uploaded test object to key: "${testKey}"`);
  });

  it('3. Generates presigned download and upload URLs', async () => {
    const getCmd = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey
    });

    const signedUrl = await getSignedUrl(client, getCmd, { expiresIn: 900 });
    assert.ok(signedUrl.includes(R2_BUCKET_NAME), 'Presigned URL should contain bucket name');
    assert.ok(signedUrl.includes('X-Amz-Signature'), 'Presigned URL should contain AWS signature');
    console.log(`[R2 TEST] Successfully generated presigned URL: ${signedUrl.substring(0, 80)}...`);
  });

  it('4. Reads object back and verifies integrity', async () => {
    const getCmd = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey
    });

    const getRes = await client.send(getCmd);
    assert.equal(getRes.$metadata.httpStatusCode, 200);

    const bodyString = await getRes.Body?.transformToString();
    assert.ok(bodyString, 'Body string should exist');

    const parsed = JSON.parse(bodyString);
    assert.equal(parsed.service, 'EduPortal Cloudflare R2 Storage');
    assert.equal(parsed.status, 'connected_and_verified');
    console.log(`[R2 TEST] Successfully read back object and verified contents!`);
  });

  it('5. Cleans up test object', async () => {
    const delCmd = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: testKey
    });

    const delRes = await client.send(delCmd);
    assert.equal(delRes.$metadata.httpStatusCode, 204, 'Delete should return HTTP 204');
    console.log(`[R2 TEST] Successfully cleaned up test object.`);
  });
});
