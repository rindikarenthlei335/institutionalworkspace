import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connStr = process.env.DATABASE_URL || 'postgresql://postgres.wxspzgzrzichefggbbic:Cmstech2026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function migrate() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected successfully!');

  // Reset 00006 so corrected function is re-applied
  await client.query(`DELETE FROM public._schema_migrations WHERE filename = '00006_data_hub_and_staff.sql';`);

  // Create migrations tracking table
  await client.query(`
    CREATE TABLE IF NOT EXISTS public._schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const migrationsDir = path.resolve(__dirname, '../supabase/migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files in supabase/migrations/`);

  for (const file of files) {
    const checkRes = await client.query('SELECT 1 FROM public._schema_migrations WHERE filename = $1', [file]);
    if (checkRes.rows.length > 0) {
      console.log(`[SKIP] Migration already applied: ${file}`);
      continue;
    }

    console.log(`\n======================================================`);
    console.log(`[APPLYING] ${file}...`);
    const sqlPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO public._schema_migrations (filename) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`[SUCCESS] Applied ${file}`);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`\n[FAILED] Error in migration ${file}:`, err.message);
      console.error(err);
      process.exit(1);
    }
  }

  // Final check of created tables
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('\n======================================================');
  console.log(`MIGRATION COMPLETE! Found ${tablesRes.rows.length} tables in public schema:`);
  console.log(tablesRes.rows.map(r => r.table_name).join(', '));
  console.log('======================================================\n');

  await client.end();
}

migrate().catch(err => {
  console.error('Fatal migration error:', err);
  process.exit(1);
});
