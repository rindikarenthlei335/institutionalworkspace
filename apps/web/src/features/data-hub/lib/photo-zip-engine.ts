import JSZip from 'jszip';

export interface PhotoZipMatch {
  identifier: string;
  fileName: string;
  fileSizeBytes: number;
  dataUrl: string;
  targetRecordName?: string;
}

export interface PhotoZipUnmatched {
  fileName: string;
  reason: string;
}

export interface PhotoZipProcessResult {
  totalInZip: number;
  matchedCount: number;
  unmatchedCount: number;
  matched: PhotoZipMatch[];
  unmatched: PhotoZipUnmatched[];
}

/**
 * Parses a ZIP archive of student/staff photos and matches filenames to IDs
 */
export async function processPhotoZip(
  zipFile: File,
  validIdentifiersMap: Map<string, string> // Map<id.toLowerCase(), fullName>
): Promise<PhotoZipProcessResult> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(zipFile);

  const matched: PhotoZipMatch[] = [];
  const unmatched: PhotoZipUnmatched[] = [];

  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
    // Ignore folders, system files, Mac metadata
    if (zipEntry.dir || relativePath.startsWith('__MACOSX') || relativePath.includes('/.')) {
      continue;
    }

    const fileName = relativePath.split('/').pop() || relativePath;
    const lowerName = fileName.toLowerCase();

    const hasValidExt = validExtensions.some(ext => lowerName.endsWith(ext));
    if (!hasValidExt) {
      unmatched.push({
        fileName,
        reason: 'Unsupported image format. Allowed: .jpg, .jpeg, .png, .webp'
      });
      continue;
    }

    // Extract identifier without extension
    const baseName = fileName.replace(/\.[^/.]+$/, '').trim();
    const targetName = validIdentifiersMap.get(baseName.toLowerCase());

    if (targetName) {
      // Extract binary and create data URL
      const blob = await zipEntry.async('blob');
      const dataUrl = URL.createObjectURL(blob);

      matched.push({
        identifier: baseName,
        fileName,
        fileSizeBytes: blob.size,
        dataUrl,
        targetRecordName: targetName
      });
    } else {
      unmatched.push({
        fileName,
        reason: `No matching record found with ID "${baseName}".`
      });
    }
  }

  return {
    totalInZip: matched.length + unmatched.length,
    matchedCount: matched.length,
    unmatchedCount: unmatched.length,
    matched,
    unmatched
  };
}
