import React, { useState } from 'react';
import { GraduationCap, ScanLine, Building2, ArrowRight, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export function AppSplash({ onContinue }: { onContinue: () => void }) {
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);

  return (
    <div className="h-full flex flex-col text-white" style={{ background: 'radial-gradient(circle at 50% 18%, rgba(227,238,232,0.10), transparent 34%), linear-gradient(160deg, #163A2B 0%, #1F4D3A 100%)' }}>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12">
        {/* Logo */}
        <div className="w-20 h-20 rounded-[8px] border border-white/25 flex items-center justify-center mb-6">
          <GraduationCap className="w-10 h-10 text-white" strokeWidth={1.5} />
        </div>
        <h1 className="text-[28px] font-semibold text-white mb-2 font-display">EduPortal</h1>
        <p className="text-sm text-white/75 text-center leading-relaxed mb-10">Access school fees, circulars and academic updates through one secure portal.</p>

        {/* QR scan area */}
        {scanning ? (
          <div className="relative w-56 h-56 rounded-[24px] border-2 border-brand/60 bg-elevated flex flex-col items-center justify-center gap-3 mb-6">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand rounded-tl-[12px]"/>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand rounded-tr-[12px]"/>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand rounded-bl-[12px]"/>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand rounded-br-[12px]"/>
            </div>
            <ScanLine className="w-8 h-8 text-brand animate-pulse" strokeWidth={1.5} />
            <p className="text-xs text-fg-muted">Scanning for QR code…</p>
            <button onClick={() => setScanning(false)} className="flex items-center gap-1 text-xs text-fg-muted underline">
              <X className="w-3 h-3" strokeWidth={2} /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setScanning(true)}
            className="w-56 h-56 rounded-[8px] border border-dashed border-white/35 hover:border-white/70 transition-colors flex flex-col items-center justify-center gap-3 mb-6"
          >
            <ScanLine className="w-10 h-10 text-white/70" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-white">Scan school QR code</p>
            <p className="text-xs text-white/60">Position the code within the frame</p>
          </button>
        )}

        <div className="flex items-center gap-3 w-full mb-4">
          <div className="flex-1 h-px bg-border-default" />
          <span className="text-xs text-white/70">or enter the school code</span>
          <div className="flex-1 h-px bg-border-default" />
        </div>

        <Input
          placeholder="School code (e.g. DPS-2024)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mb-4"
          icon={<Building2 className="w-4 h-4" strokeWidth={2} />}
        />
        <Button fullWidth onClick={onContinue} disabled={!code && !scanning}>
          Continue
        </Button>
      </div>

      <p className="text-center text-xs text-white/65 pb-8 px-8">
        The school administrator will provide the QR code or school code.
      </p>
    </div>
  );
}
