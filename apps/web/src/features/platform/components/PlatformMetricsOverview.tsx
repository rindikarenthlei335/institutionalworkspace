import React from 'react';
import { Card } from '@/components/ui/Card';
import { Building2, TrendingUp, HardDrive, ShieldCheck } from 'lucide-react';

export function PlatformMetricsOverview() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-slate-950 border-slate-800 text-white space-y-1">
        <div className="flex justify-between items-center text-slate-400 text-xs">
          <span>Active Tenants</span>
          <Building2 className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="font-display font-bold text-2xl text-white">2 Schools</p>
        <p className="text-[10px] text-emerald-400">1 Pro · 1 Basic</p>
      </Card>

      <Card className="bg-slate-950 border-slate-800 text-white space-y-1">
        <div className="flex justify-between items-center text-slate-400 text-xs">
          <span>Estimated MRR</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="font-display font-bold text-2xl text-emerald-400 font-mono">₹ 9,499/mo</p>
        <p className="text-[10px] text-slate-400">SaaS recurring revenue</p>
      </Card>

      <Card className="bg-slate-950 border-slate-800 text-white space-y-1">
        <div className="flex justify-between items-center text-slate-400 text-xs">
          <span>Platform Storage</span>
          <HardDrive className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="font-display font-bold text-2xl text-white font-mono">0.42 GB</p>
        <p className="text-[10px] text-slate-400">of 25 GB combined quota</p>
      </Card>

      <Card className="bg-slate-950 border-slate-800 text-white space-y-1">
        <div className="flex justify-between items-center text-slate-400 text-xs">
          <span>Custom Hostnames</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="font-display font-bold text-2xl text-white">1 Active</p>
        <p className="text-[10px] text-emerald-400">Cloudflare SSL OK</p>
      </Card>
    </div>
  );
}
