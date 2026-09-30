import React from 'react';

export default function PlatformPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Dynamic Feature Flags</span>
        <h1 className="font-display font-bold text-2xl text-white">SaaS Plans & Feature Matrices</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: 'Basic Plan', price: '₹ 1,499/mo', storage: '2 GB', features: ['Public website', 'Logo/Theme edit', 'Single Admin', 'Domain connect'] },
          { name: 'Essential Plan', price: '₹ 3,999/mo', storage: '5 GB', features: ['All Basic features', 'Roles & Multi-staff', 'Student Management', 'Day & Hosteller Fees', 'Online Admission', 'PWA Portal'] },
          { name: 'Pro Plan', price: '₹ 8,000/mo', storage: '20 GB', features: ['All Essential features', 'First-party Analytics', 'Principal Dashboard', 'UI Level 2 Components', 'Free SEO Submission'] }
        ].map((p, i) => (
          <div key={i} className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">{p.name}</h3>
            <p className="font-mono text-2xl font-bold text-emerald-400">{p.price}</p>
            <p className="text-xs text-slate-400">Storage limit: {p.storage}</p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {p.features.map((f, j) => (
                <li key={j}>✓ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
