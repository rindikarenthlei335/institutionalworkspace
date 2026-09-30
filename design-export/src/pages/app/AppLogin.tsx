import React, { useState } from 'react';
import { GraduationCap, ArrowLeft, User, Phone, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, PasswordInput } from '../../components/ui/Input';

export function AppLogin({ onLogin, onBack }: { onLogin: () => void; onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-base overflow-y-auto relative">
      <div className="absolute inset-x-0 top-0 h-36" style={{ background: 'radial-gradient(circle at 70% 20%, rgba(227,238,232,0.10), transparent 38%), linear-gradient(160deg, #163A2B 0%, #1F4D3A 100%)' }} />
      <div className="p-4 pt-2 relative">
        <button onClick={onBack} className="w-10 h-10 rounded-[6px] flex items-center justify-center hover:bg-surface transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={1.5} />
        </button>
      </div>

      <div className="px-6 flex-1 relative">
        {/* School badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-[8px] border border-white/25 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base font-semibold text-white font-display">Delhi Public School</p>
            <p className="text-xs text-white/70">School code: DPS-2024</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface border border-border-default rounded-[8px] p-1 mb-6">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 h-9 rounded-[4px] text-sm font-medium transition-colors border-b-2 ${tab === t ? 'text-brand border-brand' : 'text-fg-muted border-transparent'}`}
            >
              {t === 'login' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <div className="flex flex-col gap-4">
            <Input
              label="Username / Student ID"
              placeholder="e.g. 2024001 or parent@email.com"
              icon={<User className="w-4 h-4" strokeWidth={2} />}
            />
            <PasswordInput label="Password" placeholder="Enter your password" />
            <button className="text-sm text-brand text-right font-semibold">Forgot password?</button>
            <Button fullWidth loading={loading} onClick={handleSubmit}>Sign in</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="Parent Name"
              placeholder="Full name"
              icon={<User className="w-4 h-4" strokeWidth={2} />}
            />
            <Input
              label="Mobile Number"
              placeholder="+91 98765 43210"
              type="tel"
              icon={<Phone className="w-4 h-4" strokeWidth={2} />}
            />
            <Input
              label="Student Admission No."
              placeholder="e.g. 2024001"
              icon={<Shield className="w-4 h-4" strokeWidth={2} />}
            />
            <PasswordInput label="Create Password" placeholder="Min 8 characters" />
            <PasswordInput label="Confirm Password" placeholder="Re-enter password" />
            <Button fullWidth loading={loading} onClick={handleSubmit}>Create Account</Button>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-fg-muted pb-8 pt-4 px-6">
        By continuing you agree to EduPortal's Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
