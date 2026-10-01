'use client';

import React, { useState } from 'react';
import { MODULE_REGISTRY } from '../registry';
import type { ModuleManifest, ModuleCategory, ModuleStatus } from '@eduportal/shared';

export function ModuleManagerView() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeWizardModule, setActiveWizardModule] = useState<ModuleManifest | null>(null);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardSettings, setWizardSettings] = useState<Record<string, any>>({});
  const [installedModules, setInstalledModules] = useState<Record<string, ModuleStatus>>({
    settings: 'installed_enabled',
    data_hub: 'installed_enabled',
    staff: 'installed_enabled',
    cms: 'installed_enabled',
    students: 'installed_enabled',
    fees: 'installed_enabled',
    exams: 'installed_enabled',
    id_cards: 'installed_enabled',
    attendance: 'available',
    certificates: 'available'
  });

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Modules' },
    { id: 'academics', label: 'Academics & Exams' },
    { id: 'administration', label: 'Administration & Staff' },
    { id: 'finance', label: 'Fees & Finance' },
    { id: 'communication', label: 'Website & CMS' }
  ];

  const modulesList = Object.values(MODULE_REGISTRY);

  const filteredModules = modulesList.filter(m => {
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesQuery =
      m.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.name.lus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleToggleModule = (id: string, currentStatus: ModuleStatus, isCore: boolean) => {
    if (isCore) {
      alert('Core institutional modules cannot be disabled as they provide foundation security and data.');
      return;
    }

    if (currentStatus === 'installed_enabled') {
      setInstalledModules(prev => ({ ...prev, [id]: 'installed_disabled' }));
    } else if (currentStatus === 'installed_disabled') {
      setInstalledModules(prev => ({ ...prev, [id]: 'installed_enabled' }));
    }
  };

  const startInstallWizard = (module: ModuleManifest) => {
    setActiveWizardModule(module);
    setWizardStep(1);
    const defaults: Record<string, any> = {};
    module.settingsSchema.forEach(field => {
      defaults[field.key] = field.defaultValue;
    });
    setWizardSettings(defaults);
  };

  const completeInstallation = () => {
    if (activeWizardModule) {
      setInstalledModules(prev => ({
        ...prev,
        [activeWizardModule.id]: 'installed_enabled'
      }));
    }
    setActiveWizardModule(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-display font-bold text-[var(--text-primary)]">
              Module Manager & Extensions
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Ultimate Plan Active
            </span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Install, configure, or extend modular services. Changes update navigation menus and role access in real time.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]">
            <span className="text-[var(--text-muted)]">Installed: </span>
            <span className="font-bold text-emerald-400">
              {Object.values(installedModules).filter(s => s === 'installed_enabled').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]">
            <span className="text-[var(--text-muted)]">Available: </span>
            <span className="font-bold text-indigo-400">
              {Object.values(installedModules).filter(s => s === 'available').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#163A2B] text-white shadow-sm'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-default)] hover:border-slate-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredModules.map(module => {
          const status = installedModules[module.id] || 'available';
          const isInstalled = status === 'installed_enabled';
          const isDisabled = status === 'installed_disabled';

          return (
            <div
              key={module.id}
              className={`rounded-xl border p-5 flex flex-col justify-between transition-all bg-[var(--bg-surface)] ${
                isInstalled
                  ? 'border-[var(--border-default)] shadow-sm'
                  : isDisabled
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-dashed border-[var(--border-default)] opacity-90'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)]">
                      {module.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)]">
                        {module.name.en}
                      </h3>
                      <span className="text-[11px] text-[var(--text-muted)] italic block">
                        {module.name.lus}
                      </span>
                    </div>
                  </div>

                  {module.isCore ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
                      CORE
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {module.minPlan}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                  {module.description.en}
                </p>

                {/* Dependencies or Tags */}
                {module.dependencies.length > 0 && (
                  <div className="text-[10px] text-[var(--text-muted)] mb-3">
                    <span>Prerequisites: </span>
                    {module.dependencies.map(dep => (
                      <span key={dep} className="px-1.5 py-0.5 rounded bg-[var(--bg-base)] text-[var(--text-secondary)] font-mono mr-1">
                        {dep}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="pt-3 border-t border-[var(--border-default)] flex items-center justify-between">
                <div>
                  {isInstalled ? (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                      Active
                    </span>
                  ) : isDisabled ? (
                    <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      Disabled
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Not Installed</span>
                  )}
                </div>

                <div>
                  {status === 'available' ? (
                    <button
                      onClick={() => startInstallWizard(module)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#163A2B] hover:bg-[#1f4e3b] text-white transition-colors"
                    >
                      Install Module →
                    </button>
                  ) : module.isCore ? (
                    <span className="text-[11px] text-[var(--text-muted)] italic">Core Protected</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleModule(module.id, status, module.isCore)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                          isInstalled
                            ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                        }`}
                      >
                        {isInstalled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6-Step Guided Setup Wizard Modal */}
      {activeWizardModule && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] w-full max-w-xl rounded-2xl border border-[var(--border-default)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-base)]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeWizardModule.icon}</span>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Install {activeWizardModule.name.en}
                  </h2>
                  <span className="text-xs text-[var(--text-muted)]">
                    Step {wizardStep} of 6 · Guided Setup Wizard
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveWizardModule(null)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Step Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* Step 1: Overview */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Module Overview & Benefits
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {activeWizardModule.description.en}
                  </p>
                  <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-default)] space-y-2">
                    <div className="text-xs">
                      <span className="font-bold text-[var(--text-primary)]">Who uses this: </span>
                      <span className="text-[var(--text-secondary)]">
                        {activeWizardModule.permissions.join(', ')}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-[var(--text-primary)]">Setup time: </span>
                      <span className="text-emerald-500 font-semibold">~3 to 5 minutes</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Prerequisites */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    System Prerequisites Verification
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ✓ Plan Entitlement: {activeWizardModule.minPlan.toUpperCase()} (Satisfied)
                      </span>
                      <span className="text-emerald-500">Verified</span>
                    </div>

                    {activeWizardModule.dependencies.length > 0 ? (
                      activeWizardModule.dependencies.map(dep => (
                        <div
                          key={dep}
                          className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs"
                        >
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                            ✓ Dependency: {dep} (Installed & Active)
                          </span>
                          <span className="text-emerald-500">Verified</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-xs text-[var(--text-muted)]">
                        No external module dependencies required.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Configuration */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Module Configuration
                  </h3>
                  {activeWizardModule.settingsSchema.length > 0 ? (
                    activeWizardModule.settingsSchema.map(field => (
                      <div key={field.key} className="space-y-1">
                        <label className="text-xs font-semibold text-[var(--text-primary)] block">
                          {field.label.en}
                        </label>
                        {field.type === 'boolean' ? (
                          <input
                            type="checkbox"
                            checked={!!wizardSettings[field.key]}
                            onChange={e =>
                              setWizardSettings(prev => ({
                                ...prev,
                                [field.key]: e.target.checked
                              }))
                            }
                            className="rounded border-[var(--border-default)] text-emerald-600 focus:ring-emerald-500"
                          />
                        ) : field.type === 'number' ? (
                          <input
                            type="number"
                            value={wizardSettings[field.key] || ''}
                            onChange={e =>
                              setWizardSettings(prev => ({
                                ...prev,
                                [field.key]: Number(e.target.value)
                              }))
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                          />
                        ) : (
                          <input
                            type="text"
                            value={wizardSettings[field.key] || ''}
                            onChange={e =>
                              setWizardSettings(prev => ({
                                ...prev,
                                [field.key]: e.target.value
                              }))
                            }
                            className="w-full px-3 py-2 text-xs rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] text-[var(--text-primary)]"
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">
                      Standard settings will be auto-applied. No initial parameters required.
                    </p>
                  )}
                </div>
              )}

              {/* Step 4: Roles & Permissions */}
              {wizardStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Role-Based Access Delegation
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Select roles permitted to view and record entries in this module.
                  </p>
                  <div className="space-y-2">
                    {activeWizardModule.permissions.map(role => (
                      <div
                        key={role}
                        className="p-2.5 rounded-lg bg-[var(--bg-base)] border border-[var(--border-default)] flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[var(--text-primary)] capitalize">
                          {role.replace('_', ' ')}
                        </span>
                        <span className="text-emerald-500 font-bold">Authorized</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Optional Data Import */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Optional Data Import
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    You can import existing master records or start with a clean slate.
                  </p>
                  <div className="p-8 text-center border-2 border-dashed border-[var(--border-default)] rounded-xl bg-[var(--bg-base)]">
                    <span className="text-3xl block mb-2">📊</span>
                    <button className="text-xs text-emerald-600 font-bold hover:underline block mx-auto mb-1">
                      Download Sample Excel (.xlsx) Template
                    </button>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      Or drag and drop completed spreadsheet to import now
                    </span>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Confirm */}
              {wizardStep === 6 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Ready to Activate Module
                  </h3>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 text-emerald-800 dark:text-emerald-300">
                    <p className="font-bold">✓ Ready for deployment</p>
                    <p>
                      Clicking confirm will inject the module into the Admin sidebar and grant permissions to selected faculty roles.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 border-t border-[var(--border-default)] flex items-center justify-between bg-[var(--bg-base)]">
              {wizardStep > 1 ? (
                <button
                  onClick={() => setWizardStep(prev => prev - 1)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)]"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {wizardStep < 6 ? (
                <button
                  onClick={() => setWizardStep(prev => prev + 1)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#163A2B] hover:bg-[#1f4e3b] text-white"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={completeInstallation}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  Complete Installation & Activate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
