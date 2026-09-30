import React from 'react';

export default function PlatformTenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Multi-Tenant Management</span>
          <h1 className="font-display font-bold text-2xl text-white">Tenants Directory</h1>
        </div>
        <button className="px-4 h-9 rounded bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white">
          + Onboard New School
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="p-4">School Name</th>
              <th className="p-4">Subdomain</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="p-4 font-semibold text-white">Mount Carmel School</td>
              <td className="p-4 font-mono text-emerald-400">mountcarmel</td>
              <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold">Pro (₹8,000/mo)</span></td>
              <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">Active</span></td>
              <td className="p-4 text-emerald-400 hover:underline cursor-pointer">Impersonate Admin</td>
            </tr>
            <tr>
              <td className="p-4 font-semibold text-white">St Marys School</td>
              <td className="p-4 font-mono text-emerald-400">stmarys</td>
              <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold">Basic (₹1,499/mo)</span></td>
              <td className="p-4"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold">Active</span></td>
              <td className="p-4 text-emerald-400 hover:underline cursor-pointer">Impersonate Admin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
