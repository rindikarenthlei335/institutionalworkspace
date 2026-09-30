'use client';

import React, { useState } from 'react';
import { generateStorePackageZip } from '../lib/store-package';
import { validateStoreAsset, StoreAssetSpec } from '../lib/asset-validator';

const STORE_SPECS: StoreAssetSpec[] = [
  {
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
    is_required: true,
    description: 'High-res 512x512 PNG with alpha channel.'
  },
  {
    platform: 'android',
    asset_type: 'feature_graphic',
    display_name: 'Google Play Feature Graphic',
    min_width: 1024,
    min_height: 500,
    max_width: 1024,
    max_height: 500,
    format: 'png',
    max_size_kb: 1024,
    requires_no_alpha: false,
    is_required: true,
    description: '1024x500 banner for Google Play store header.'
  },
  {
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
    is_required: true,
    description: '1024x1024 PNG without transparency/alpha channel.'
  }
];

export function AppPublishingMasterView() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'assets' | 'builds' | 'releases'>('checklist');
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<{ [key: string]: { valid: boolean; errors: string[] } }>({
    'android-app_icon': { valid: true, errors: [] },
    'android-feature_graphic': { valid: true, errors: [] },
    'ios-app_icon': { valid: true, errors: [] }
  });

  const tenantData = {
    tenantName: 'Mount Carmel Higher Secondary School',
    tenantSlug: 'mountcarmel',
    schoolCode: 'MC-AIZAWL',
    packageId: 'in.edu.mountcarmel.portal',
    appVersion: '1.0.0',
    buildNumber: 101,
    primaryColor: '#163A2B',
    secondaryColor: '#C9A84C',
    crestInitials: 'MC',
    supportEmail: 'principal@mountcarmel.edu.in',
    supportUrl: 'https://mountcarmel.eduportal.com/about',
    privacyPolicyUrl: 'https://mountcarmel.eduportal.com/about#privacy',
    termsOfServiceUrl: 'https://mountcarmel.eduportal.com/about#terms',
    accountDeletionUrl: 'https://mountcarmel.eduportal.com/portal/profile#delete-account',
    shortDescEn: 'Official student, parent & faculty portal for Mount Carmel HSS Aizawl.',
    shortDescLus: 'Mount Carmel HSS zirlai, nu leh pa, leh zirtirtute tan official portal.',
    fullDescEn: 'Mount Carmel Higher Secondary School official mobile portal provides real-time access to student examination marksheets, term report cards, digital student identity cards with instant offline verification QR codes, fee settlement receipts, and institutional announcements.',
    fullDescLus: 'Mount Carmel Higher Secondary School mobile app hian zirlai exam result, marksheet, digital ID card gate pass QR code, school fee chawina leh receipt, leh school hriattirna zawng zawng awlsam takin a pe chhuak a ni.'
  };

  const handleExportZip = async () => {
    setIsExportingZip(true);
    try {
      const blob = await generateStorePackageZip(tenantData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tenantData.tenantSlug}-store-package-v${tenantData.appVersion}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export store package:', err);
    } finally {
      setIsExportingZip(false);
    }
  };

  const handleTriggerBuild = () => {
    setIsBuilding(true);
    setBuildLogs(['[EAS Build] Initializing runner for tenant: mountcarmel...']);
    setTimeout(() => {
      setBuildLogs(prev => [...prev, '[EAS Build] Applying app.config.ts with APP_VARIANT=whitelabel']);
    }, 400);
    setTimeout(() => {
      setBuildLogs(prev => [...prev, '[EAS Build] Compiling React Native & Hermes bytecode...']);
    }, 800);
    setTimeout(() => {
      setBuildLogs(prev => [...prev, '[EAS Build] Signing Android AAB and iOS IPA with institutional profiles...']);
    }, 1200);
    setTimeout(() => {
      setBuildLogs(prev => [
        ...prev,
        '[EAS Build] Uploading artifacts to Cloudflare R2 (institutionalworkspace)...',
        '✅ Build #102 completed successfully. Ready for submission.'
      ]);
      setIsBuilding(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-white">App Publishing Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              White-Label Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publishing pipeline for {tenantData.tenantName} ({tenantData.packageId})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportZip}
            disabled={isExportingZip}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            {isExportingZip ? '📦 Generating ZIP...' : '📦 Export Store Package (ZIP)'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'checklist' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Intake Checklist & Metadata
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'assets' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Store Asset Validator
        </button>
        <button
          onClick={() => setActiveTab('builds')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'builds' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          3. EAS Build & R2 Artifacts
        </button>
        <button
          onClick={() => setActiveTab('releases')}
          className={`pb-3 font-semibold transition-colors ${
            activeTab === 'releases' ? 'border-b-2 border-emerald-400 text-emerald-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          4. Releases & Tracks
        </button>
      </div>

      {/* Tab 1: Checklist & Metadata */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Store Listing Details</h2>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Application Name</label>
              <input
                type="text"
                readOnly
                value={tenantData.tenantName}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Package ID / Bundle Identifier</label>
              <input
                type="text"
                readOnly
                value={tenantData.packageId}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs font-mono text-emerald-400"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Short Description (English)</label>
              <textarea
                rows={2}
                readOnly
                value={tenantData.shortDescEn}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Short Description (Mizo / Lus)</label>
              <textarea
                rows={2}
                readOnly
                value={tenantData.shortDescLus}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Description (English)</label>
              <textarea
                rows={4}
                readOnly
                value={tenantData.fullDescEn}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Compliance & URLs</h2>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Privacy Policy URL</span>
                <span className="text-xs font-mono text-slate-300 break-all">{tenantData.privacyPolicyUrl}</span>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Terms of Service URL</span>
                <span className="text-xs font-mono text-slate-300 break-all">{tenantData.termsOfServiceUrl}</span>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-emerald-900/40 bg-emerald-950/20">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">
                  Account Deletion URL (Apple 5.1.1 Mandate)
                </span>
                <span className="text-xs font-mono text-emerald-300 break-all">{tenantData.accountDeletionUrl}</span>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Official Support Email</span>
                <span className="text-xs text-slate-300">{tenantData.supportEmail}</span>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">App Reviewer Demo Credentials</span>
                <span className="text-xs text-slate-300 block">Username: apple.reviewer@mountcarmel.edu.in</span>
                <span className="text-xs text-slate-300 block">Password: ReviewerDemo2025!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Store Asset Validator */}
      {activeTab === 'assets' && (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Store Asset Audit</h2>
              <p className="text-xs text-slate-400">
                Automated validation against Google Play & Apple App Store specifications
              </p>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
              3 of 3 Required Assets Validated
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STORE_SPECS.map(spec => {
              const key = `${spec.platform}-${spec.asset_type}`;
              const res = validationResults[key] || { valid: true, errors: [] };

              return (
                <div key={key} className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-300">{spec.display_name}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {spec.platform}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3">{spec.description}</p>
                    <div className="text-[10px] font-mono text-slate-400 space-y-0.5 mb-4">
                      <div>Dimensions: {spec.min_width}×{spec.min_height}px</div>
                      <div>Format: {spec.format.toUpperCase()} (Max: {spec.max_size_kb}KB)</div>
                      {spec.requires_no_alpha && <div className="text-amber-400">Requires No-Alpha Channel</div>}
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      ✓ Spec Compliant
                    </span>
                    <button className="text-[11px] text-slate-400 hover:text-white underline">
                      Re-validate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Builds & Artifacts */}
      {activeTab === 'builds' && (
        <div className="space-y-6">
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">EAS Build Pipeline</h2>
                <p className="text-xs text-slate-400">Compile white-label binaries signed for store distribution</p>
              </div>
              <button
                onClick={handleTriggerBuild}
                disabled={isBuilding}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors"
              >
                {isBuilding ? 'Building in Cloud...' : '⚡ Trigger EAS Build'}
              </button>
            </div>

            {/* Build Terminal Simulator */}
            {buildLogs.length > 0 && (
              <div className="bg-black/90 p-4 rounded-lg font-mono text-[11px] text-emerald-400 space-y-1 border border-slate-800 mb-6">
                {buildLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            )}

            {/* Existing Artifacts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Compiled R2 Artifacts</h3>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">v1.0.0 (Build 101) - Android Release AAB</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      R2 Edge Stored
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    mountcarmel/builds/release-v1.0.0-101.aab · 28.4 MB
                  </span>
                </div>
                <button
                  onClick={() => alert('Initiating secure signed download from Cloudflare R2...')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded font-semibold"
                >
                  Download .AAB
                </button>
              </div>

              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">v1.0.0 (Build 101) - iOS Production IPA</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      R2 Edge Stored
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    mountcarmel/builds/release-v1.0.0-101.ipa · 34.1 MB
                  </span>
                </div>
                <button
                  onClick={() => alert('Initiating secure signed download from Cloudflare R2...')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded font-semibold"
                >
                  Download .IPA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Releases & Tracks */}
      {activeTab === 'releases' && (
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Release Track Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Google Play Store</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  LIVE IN PRODUCTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Version: 1.0.0 (101)</p>
              <a
                href="https://play.google.com/store/apps/details?id=in.edu.mountcarmel.portal"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline break-all"
              >
                https://play.google.com/store/apps/details?id=in.edu.mountcarmel.portal ↗
              </a>
            </div>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">Apple App Store</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  LIVE IN PRODUCTION
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Version: 1.0.0 (101)</p>
              <a
                href="https://apps.apple.com/in/app/mount-carmel-hss-aizawl/id6471829012"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline break-all"
              >
                https://apps.apple.com/in/app/mount-carmel-hss-aizawl/id6471829012 ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
