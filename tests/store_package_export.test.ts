import { describe, it } from 'node:test';
import assert from 'node:assert';
import JSZip from 'jszip';

// Store asset validator pure logic
interface StoreAssetSpec {
  platform: 'android' | 'ios' | 'both';
  asset_type: string;
  display_name: string;
  min_width: number;
  min_height: number;
  max_width: number;
  max_height: number;
  format: 'png' | 'jpeg' | 'webp';
  max_size_kb: number;
  requires_no_alpha: boolean;
  is_required: boolean;
}

interface AssetValidationInput {
  fileName: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  mimeType: string;
  hasAlpha?: boolean;
}

function validateStoreAsset(input: AssetValidationInput, spec: StoreAssetSpec) {
  const errors: string[] = [];

  if (spec.format === 'png' && !input.mimeType.includes('png') && !input.fileName.toLowerCase().endsWith('.png')) {
    errors.push(`Invalid format: Must be a PNG image for ${spec.display_name}.`);
  }

  const maxBytes = spec.max_size_kb * 1024;
  if (input.fileSizeBytes > maxBytes) {
    errors.push(`File size exceeds maximum allowed ${spec.max_size_kb} KB.`);
  }

  const isExactWidth = spec.min_width === spec.max_width;
  const isExactHeight = spec.min_height === spec.max_height;

  if (isExactWidth && input.width !== spec.min_width) {
    errors.push(`Width must be exactly ${spec.min_width}px (received: ${input.width}px).`);
  }

  if (isExactHeight && input.height !== spec.min_height) {
    errors.push(`Height must be exactly ${spec.min_height}px (received: ${input.height}px).`);
  }

  if (spec.requires_no_alpha && input.hasAlpha) {
    errors.push(`Alpha channel detected: ${spec.display_name} must NOT contain transparency.`);
  }

  return { valid: errors.length === 0, errors };
}

// Store Package generator function matching web engine
async function buildStorePackageZip(options: any): Promise<Buffer> {
  const zip = new JSZip();

  const appConfig = {
    expo: {
      name: options.tenantName,
      slug: options.tenantSlug,
      version: options.appVersion,
      ios: { bundleIdentifier: options.packageId },
      android: { package: options.packageId },
      extra: { appVariant: 'whitelabel', tenantSlug: options.tenantSlug }
    }
  };
  zip.file('app.config.json', JSON.stringify(appConfig, null, 2));

  const metadata = zip.folder('metadata');
  if (metadata) {
    metadata.file('listing_en.json', JSON.stringify({ title: options.tenantName, desc: options.shortDescEn }, null, 2));
    metadata.file('listing_lus.json', JSON.stringify({ title: options.tenantName, desc: options.shortDescLus }, null, 2));
    metadata.file('data_safety_answers.json', JSON.stringify({
      dataCollected: true,
      encryptedInTransit: true,
      accountDeletionSupported: true
    }, null, 2));
    metadata.file('apple_privacy_nutrition_labels.json', JSON.stringify({
      dataLinkedToYou: ['Contact Info', 'Identifiers']
    }, null, 2));
    metadata.file('content_rating_questionnaire.json', JSON.stringify({
      targetAudience: 'Parents & Faculty (18+)'
    }, null, 2));
  }

  const creds = zip.folder('credentials');
  if (creds) {
    creds.file('KEYSTORE_INSTRUCTIONS.md', '# Keystore Instructions');
  }

  zip.file('README.md', `# Store Publishing Package: ${options.tenantName}`);

  return await zip.generateAsync({ type: 'nodebuffer' });
}

describe('App Store Publishing Pipeline & Package Export (P2-M5)', () => {
  const playIconSpec: StoreAssetSpec = {
    platform: 'android',
    asset_type: 'app_icon',
    display_name: 'Google Play App Icon',
    min_width: 512,
    min_height: 512,
    max_width: 512,
    max_height: 512,
    format: 'png',
    max_size_kb: 1024,
    requires_no_alpha: false,
    is_required: true
  };

  const appleIconSpec: StoreAssetSpec = {
    platform: 'ios',
    asset_type: 'app_icon',
    display_name: 'Apple App Store Icon',
    min_width: 1024,
    min_height: 1024,
    max_width: 1024,
    max_height: 1024,
    format: 'png',
    max_size_kb: 2048,
    requires_no_alpha: true,
    is_required: true
  };

  describe('Store Asset Specification Validator', () => {
    it('accepts compliant 512x512 Google Play icon', () => {
      const res = validateStoreAsset(
        {
          fileName: 'icon.png',
          width: 512,
          height: 512,
          fileSizeBytes: 245000,
          mimeType: 'image/png'
        },
        playIconSpec
      );
      assert.strictEqual(res.valid, true);
      assert.strictEqual(res.errors.length, 0);
    });

    it('rejects icon with incorrect dimensions or non-square aspect ratio', () => {
      const res = validateStoreAsset(
        {
          fileName: 'icon.png',
          width: 500,
          height: 512,
          fileSizeBytes: 200000,
          mimeType: 'image/png'
        },
        playIconSpec
      );
      assert.strictEqual(res.valid, false);
      assert.ok(res.errors.some(e => e.includes('Width must be exactly 512px')));
    });

    it('rejects icon exceeding maximum allowed file size', () => {
      const res = validateStoreAsset(
        {
          fileName: 'icon.png',
          width: 512,
          height: 512,
          fileSizeBytes: 2 * 1024 * 1024, // 2MB > 1024KB
          mimeType: 'image/png'
        },
        playIconSpec
      );
      assert.strictEqual(res.valid, false);
      assert.ok(res.errors.some(e => e.includes('exceeds maximum allowed')));
    });

    it('rejects Apple App Store icon if transparency or alpha channel is present', () => {
      const res = validateStoreAsset(
        {
          fileName: 'app-store-icon.png',
          width: 1024,
          height: 1024,
          fileSizeBytes: 500000,
          mimeType: 'image/png',
          hasAlpha: true
        },
        appleIconSpec
      );
      assert.strictEqual(res.valid, false);
      assert.ok(res.errors.some(e => e.includes('Alpha channel detected')));
    });

    it('accepts Apple App Store icon when alpha channel is absent', () => {
      const res = validateStoreAsset(
        {
          fileName: 'app-store-icon.png',
          width: 1024,
          height: 1024,
          fileSizeBytes: 500000,
          mimeType: 'image/png',
          hasAlpha: false
        },
        appleIconSpec
      );
      assert.strictEqual(res.valid, true);
    });
  });

  describe('Store Package ZIP Generator', () => {
    it('generates a valid, complete ZIP package with all required store files', async () => {
      const options = {
        tenantName: 'Mount Carmel Higher Secondary School',
        tenantSlug: 'mountcarmel',
        schoolCode: 'MC-AIZAWL',
        packageId: 'in.edu.mountcarmel.portal',
        appVersion: '1.0.0',
        shortDescEn: 'Official portal for Mount Carmel HSS.',
        shortDescLus: 'Mount Carmel HSS official portal.'
      };

      const zipBuffer = await buildStorePackageZip(options);
      assert.ok(zipBuffer.length > 0);

      // Load back using JSZip to verify entries
      const unzipped = await JSZip.loadAsync(zipBuffer);

      assert.ok(unzipped.file('app.config.json') !== null);
      assert.ok(unzipped.file('README.md') !== null);
      assert.ok(unzipped.file('metadata/listing_en.json') !== null);
      assert.ok(unzipped.file('metadata/listing_lus.json') !== null);
      assert.ok(unzipped.file('metadata/data_safety_answers.json') !== null);
      assert.ok(unzipped.file('metadata/apple_privacy_nutrition_labels.json') !== null);
      assert.ok(unzipped.file('credentials/KEYSTORE_INSTRUCTIONS.md') !== null);

      // Verify app.config.json contents
      const configStr = await unzipped.file('app.config.json')?.async('string');
      const configObj = JSON.parse(configStr!);
      assert.strictEqual(configObj.expo.name, 'Mount Carmel Higher Secondary School');
      assert.strictEqual(configObj.expo.ios.bundleIdentifier, 'in.edu.mountcarmel.portal');
      assert.strictEqual(configObj.expo.android.package, 'in.edu.mountcarmel.portal');
      assert.strictEqual(configObj.expo.extra.appVariant, 'whitelabel');

      // Verify Data Safety contents
      const dataSafetyStr = await unzipped.file('metadata/data_safety_answers.json')?.async('string');
      const dataSafetyObj = JSON.parse(dataSafetyStr!);
      assert.strictEqual(dataSafetyObj.dataCollected, true);
      assert.strictEqual(dataSafetyObj.accountDeletionSupported, true);
      assert.strictEqual(dataSafetyObj.encryptedInTransit, true);
    });
  });
});
