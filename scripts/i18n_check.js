import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enPath = path.resolve(__dirname, '../packages/shared/src/i18n/en.json');
const lusPath = path.resolve(__dirname, '../packages/shared/src/i18n/lus.json');

if (!fs.existsSync(enPath)) {
  console.error(`[i18n:check] ERROR: English file missing at ${enPath}`);
  process.exit(1);
}

if (!fs.existsSync(lusPath)) {
  console.error(`[i18n:check] ERROR: Mizo (lus) file missing at ${lusPath}`);
  process.exit(1);
}

const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const lus = JSON.parse(fs.readFileSync(lusPath, 'utf8'));

function getFlatKeys(obj, prefix = '') {
  let keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(getFlatKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const enKeys = getFlatKeys(en);
const lusKeys = new Set(getFlatKeys(lus));

const missingKeys = [];
for (const key of enKeys) {
  if (!lusKeys.has(key)) {
    missingKeys.push(key);
  }
}

console.log(`[i18n:check] Auditing ${enKeys.length} keys in English (en) against Mizo (lus)...`);

if (missingKeys.length > 0) {
  console.error(`\n[i18n:check] FAILED: ${missingKeys.length} keys missing in Mizo (lus):`);
  for (const k of missingKeys) {
    console.error(`  - ${k}`);
  }
  process.exit(1);
}

console.log(`[i18n:check] SUCCESS: All ${enKeys.length} English keys have matching Mizo (lus) translations!\n`);
process.exit(0);
