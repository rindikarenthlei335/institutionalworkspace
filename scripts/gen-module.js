#!/usr/bin/env node

/**
 * EduPortal CLI: First-Class Module Scaffolder
 * Usage: node scripts/gen-module.js <module_id>
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const moduleId = process.argv[2];

if (!moduleId || !/^[a-z0-9_-]+$/.test(moduleId)) {
  console.error('\n❌ Usage: pnpm gen:module <module_id>');
  console.error('Example: pnpm gen:module transport\n');
  process.exit(1);
}

function toPascalCase(str) {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const componentName = `${toPascalCase(moduleId)}MasterView`;
const featureDir = path.join(rootDir, 'apps/web/src/features', moduleId);
const componentsDir = path.join(featureDir, 'components');
const appAdminDir = path.join(rootDir, 'apps/web/src/app/admin', moduleId);
const helpDir = path.join(rootDir, 'content/help', moduleId);

// 1. Create directories
fs.mkdirSync(componentsDir, { recursive: true });
fs.mkdirSync(appAdminDir, { recursive: true });
fs.mkdirSync(helpDir, { recursive: true });

// 2. Scaffold Component
const componentContent = `'use client';

import React from 'react';

export function ${componentName}() {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-default)]">
        <h1 className="text-xl font-display font-bold text-[var(--text-primary)]">
          ${toPascalCase(moduleId)} Module
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Scaffolded first-class institutional module.
        </p>
      </div>

      <div className="p-12 text-center border-2 border-dashed border-[var(--border-default)] rounded-xl">
        <span className="text-3xl block mb-2">📦</span>
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          ${toPascalCase(moduleId)} Dashboard
        </h3>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto mt-1">
          Implement module workflows, Data Hub integrations, and administrative controls here.
        </p>
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(componentsDir, `${componentName}.tsx`), componentContent, 'utf8');

// 3. Scaffold Route
const routeContent = `import React from 'react';
import { ${componentName} } from '@/features/${moduleId}/components/${componentName}';

export const metadata = {
  title: '${toPascalCase(moduleId)} | Admin Portal'
};

export default function ${toPascalCase(moduleId)}Page() {
  return <${componentName} />;
}
`;
fs.writeFileSync(path.join(appAdminDir, 'page.tsx'), routeContent, 'utf8');

// 4. Scaffold Manifest
const manifestContent = `import type { ModuleManifest } from '@eduportal/shared';

export const ${toPascalCase(moduleId)}Manifest: ModuleManifest = {
  id: '${moduleId}',
  name: {
    en: '${toPascalCase(moduleId)} Module',
    lus: '${toPascalCase(moduleId)} Enkawlna'
  },
  description: {
    en: 'Institutional ${moduleId} management and records.',
    lus: 'School ${moduleId} enkawlna leh vawn thatna.'
  },
  icon: '📦',
  category: 'administration',
  minPlan: 'ultimate',
  dependencies: ['data_hub'],
  permissions: ['school_super_admin', 'school_admin'],
  routes: ['/admin/${moduleId}'],
  navEntries: [
    {
      label: { en: '${toPascalCase(moduleId)}', lus: '${toPascalCase(moduleId)}' },
      path: '/admin/${moduleId}',
      icon: 'Package',
      badge: 'NEW'
    }
  ],
  settingsSchema: [],
  guidedSetupSteps: [
    {
      step: 1,
      title: { en: 'Initial Setup', lus: 'Bul Tanna' },
      description: { en: 'Configure ${moduleId} parameters', lus: '${moduleId} ruahmanna siam rawh' }
    }
  ],
  helpArticles: ['${moduleId}/overview'],
  isCore: false,
  version: '1.0.0'
};
`;
fs.writeFileSync(path.join(featureDir, 'manifest.ts'), manifestContent, 'utf8');

// 5. Scaffold Help Articles (en + lus)
const helpEnContent = `# ${toPascalCase(moduleId)} Module Guide

## Overview
This article explains how to configure and utilize the ${toPascalCase(moduleId)} module within the EduPortal platform.

## Getting Started
1. Access the module from the Admin sidebar.
2. Complete the initial guided setup.
3. Review user permissions and Data Hub bindings.
`;
fs.writeFileSync(path.join(helpDir, 'index.en.md'), helpEnContent, 'utf8');

const helpLusContent = `# ${toPascalCase(moduleId)} Hman Dan Guide

## Tlangpui
He thuziak hian EduPortal chhunga ${toPascalCase(moduleId)} enkawl dan leh hman dan a hrilhfiah a ni.

## Bul Tanna
1. Admin sidebar atangin ${toPascalCase(moduleId)} hi hawng rawh.
2. Setup ruahmanna hmasa tifel rawh.
3. User thuneihna leh Data Hub thlunzawm dan endik rawh.
`;
fs.writeFileSync(path.join(helpDir, 'index.lus.md'), helpLusContent, 'utf8');

console.log(`\n✅ Successfully scaffolded module: ${moduleId}`);
console.log(`  - Component: apps/web/src/features/${moduleId}/components/${componentName}.tsx`);
console.log(`  - Admin Route: apps/web/src/app/admin/${moduleId}/page.tsx`);
console.log(`  - Manifest: apps/web/src/features/${moduleId}/manifest.ts`);
console.log(`  - Help (EN): content/help/${moduleId}/index.en.md`);
console.log(`  - Help (LUS): content/help/${moduleId}/index.lus.md\n`);
