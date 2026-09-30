export interface StoreAssetSpec {
  id?: string;
  platform: 'android' | 'ios' | 'both';
  asset_type: string;
  display_name: string;
  min_width: number;
  min_height: number;
  max_width: number;
  max_height: number;
  aspect_ratio?: string;
  format: 'png' | 'jpeg' | 'webp';
  max_size_kb: number;
  requires_no_alpha: boolean;
  is_required: boolean;
  description?: string;
}

export interface AssetValidationInput {
  fileName: string;
  width: number;
  height: number;
  fileSizeBytes: number;
  mimeType: string;
  hasAlpha?: boolean;
}

export interface AssetValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateStoreAsset(
  input: AssetValidationInput,
  spec: StoreAssetSpec
): AssetValidationResult {
  const errors: string[] = [];

  // 1. Format / MIME Type check
  const expectedMime = spec.format === 'jpeg' ? 'image/jpeg' : `image/${spec.format}`;
  if (spec.format === 'png' && !input.mimeType.includes('png') && !input.fileName.toLowerCase().endsWith('.png')) {
    errors.push(`Invalid format: Must be a PNG image for ${spec.display_name}.`);
  } else if (spec.format === 'jpeg' && !input.mimeType.includes('jpeg') && !input.fileName.toLowerCase().match(/\.(jpg|jpeg)$/)) {
    errors.push(`Invalid format: Must be a JPEG image for ${spec.display_name}.`);
  }

  // 2. File size check
  const maxBytes = spec.max_size_kb * 1024;
  if (input.fileSizeBytes > maxBytes) {
    const sizeKB = (input.fileSizeBytes / 1024).toFixed(1);
    errors.push(
      `File size (${sizeKB} KB) exceeds maximum allowed ${spec.max_size_kb} KB.`
    );
  }

  // 3. Exact or Range Dimension checks
  const isExactWidth = spec.min_width === spec.max_width;
  const isExactHeight = spec.min_height === spec.max_height;

  if (isExactWidth && input.width !== spec.min_width) {
    errors.push(`Width must be exactly ${spec.min_width}px (received: ${input.width}px).`);
  } else if (!isExactWidth && (input.width < spec.min_width || input.width > spec.max_width)) {
    errors.push(
      `Width ${input.width}px is out of allowed range [${spec.min_width}px - ${spec.max_width}px].`
    );
  }

  if (isExactHeight && input.height !== spec.min_height) {
    errors.push(`Height must be exactly ${spec.min_height}px (received: ${input.height}px).`);
  } else if (!isExactHeight && (input.height < spec.min_height || input.height > spec.max_height)) {
    errors.push(
      `Height ${input.height}px is out of allowed range [${spec.min_height}px - ${spec.max_height}px].`
    );
  }

  // 4. Alpha transparency check (Apple Guideline: App Store icon cannot contain alpha channel)
  if (spec.requires_no_alpha && input.hasAlpha) {
    errors.push(
      `Alpha channel detected: ${spec.display_name} must NOT contain transparency or alpha channel per App Store guidelines.`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
