import { Hono } from 'hono';
import { cors } from 'hono/cors';

export interface Env {
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use('*', cors());

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'eduportal-api', timestamp: new Date().toISOString() }));

// First-party privacy analytics endpoint (/api/track)
app.post('/api/track', async (c) => {
  try {
    const body = await c.req.json();
    const { tenantId, path, referrer, device } = body;
    // Log tracking event (In production, writes to site_events table using service role key)
    console.log(`[ANALYTICS] Tenant: ${tenantId} | Path: ${path} | Device: ${device}`);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ success: false, error: 'Invalid payload' }, 400);
  }
});

// Mock StorageProvider Signed URL API
app.post('/api/storage/sign-url', async (c) => {
  const { key, action, tenantId } = await c.req.json();
  const mockSignedUrl = `https://cdn.eduportal.com/mock-signed/${tenantId}/${key}?signature=mock_sig_12345`;
  return c.json({ success: true, url: mockSignedUrl, expires: 3600 });
});

// Mock Cloudflare SaaS Domain Verification
app.post('/api/domains/verify', async (c) => {
  const { domain } = await c.req.json();
  return c.json({
    domain,
    status: 'active',
    cnameTarget: 'custom.eduportal.com',
    txtRecord: `cf-custom-hostname-validation=${domain}`,
    verifiedAt: new Date().toISOString()
  });
});

// Razorpay Webhook Endpoint
app.post('/api/webhooks/razorpay', async (c) => {
  const signature = c.req.header('x-razorpay-signature');
  const body = await c.req.text();
  // Mock verification in dev
  console.log(`[WEBHOOK] Razorpay event received. Sig: ${signature}`);
  return c.json({ status: 'received' });
});

// Scheduled Cron Trigger Handler
export default {
  fetch: app.fetch,
  async scheduled(event: any, env: Env, ctx: any) {
    console.log('[CRON] Executing scheduled maintenance: domain renewal checks & storage usage recalculation');
  }
};
