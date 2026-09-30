import React, { useState } from 'react';
import { Check, Upload, AlertCircle, Smartphone } from 'lucide-react';
import { TopAppBar } from '../../components/layout/TopAppBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const steps = ['Amount', 'Pay via UPI', 'Upload Receipt', 'Submit'];

export function AppFeePayment({
  fee,
  onBack,
  onSubmit,
}: {
  fee: { label: string; amount: string };
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [utr, setUtr] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else {
      setLoading(true);
      setTimeout(() => { setLoading(false); onSubmit(); }, 1400);
    }
  };

  return (
    <div className="h-full flex flex-col bg-base">
      <TopAppBar title="Pay Fee" subtitle={fee.label} onBack={onBack} />

      {/* Stepper */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  i < step ? 'bg-success text-white' : i === step ? 'bg-brand text-on-brand' : 'bg-elevated text-fg-muted'
                }`}>
                  {i < step
                    ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    : <span className="text-[10px] font-semibold">{i + 1}</span>
                  }
                </div>
                <span className={`text-[9px] mt-1 font-semibold text-center w-14 leading-tight ${i === step ? 'text-brand' : 'text-fg-muted'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mb-4 transition-all ${i < step ? 'bg-success' : 'bg-border-default'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {/* Step 0: Amount */}
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-border-default rounded-[8px] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-1">Amount to Pay</p>
              <p className="text-3xl font-semibold text-brand tabular-nums font-display">{fee.amount}</p>
              <p className="text-xs text-fg-muted mt-1">All Pending Fee Heads · Term 2</p>
            </div>
            <div className="bg-surface border border-border-default rounded-[8px] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-3">Fee Breakdown</p>
              {[
                { label: 'Term 2 Tuition', amt: '₹ 8,400' },
                { label: 'Activity Fee', amt: '₹ 2,000' },
                { label: 'Library Fee', amt: '₹ 500' },
                { label: 'Computer Lab', amt: '₹ 1,500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border-default/50 last:border-0">
                  <span className="text-xs text-fg">{item.label}</span>
                  <span className="text-xs font-semibold text-fg tabular-nums">{item.amt}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-fg">Total</span>
                <span className="text-sm font-semibold text-brand tabular-nums">{fee.amount}</span>
              </div>
            </div>
            <div className="bg-warning/10 border border-warning/50 rounded-[6px] p-3 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warning-fg shrink-0 mt-0.5" strokeWidth={2} />
              <div>
                <p className="text-xs text-warning-fg font-semibold">Due by 31 December 2024</p>
                <p className="text-xs text-fg-muted mt-0.5">Late fee of ₹200/day applies after due date.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: UPI */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-border-default rounded-[8px] p-5 flex flex-col items-center">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-4">Scan QR to Pay</p>
              <div className="w-44 h-44 bg-elevated rounded-[16px] border border-border-default flex items-center justify-center mb-4">
                <div className="grid grid-cols-3 gap-1 p-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-[3px] ${[0,2,6,8].includes(i) ? 'bg-border-default/60' : i===4 ? 'bg-brand/50' : 'bg-elevated border border-border-default/40'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-fg-muted text-center">UPI ID: <span className="text-brand font-semibold">dps2024@ybl</span></p>
              <p className="text-lg font-semibold text-fg mt-1 tabular-nums">{fee.amount}</p>
            </div>
            <button
              className="w-full h-12 rounded-[6px] bg-elevated border border-border-default text-sm font-semibold text-fg hover:border-brand transition-colors flex items-center justify-center gap-2"
            >
              <Smartphone className="w-5 h-5 text-brand" strokeWidth={2} />
              Pay with UPI App
            </button>
            <p className="text-xs text-center text-fg-muted">Supports GPay, PhonePe, Paytm, BHIM and all UPI apps</p>
          </div>
        )}

        {/* Step 2: Upload */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-fg-muted">After completing the UPI payment, upload a screenshot of the success screen as proof.</p>
            <button
              onClick={() => setFileUploaded(true)}
              className={`w-full rounded-[8px] border-2 border-dashed p-8 flex flex-col items-center gap-3 transition-colors ${
                fileUploaded ? 'border-success/60 bg-success/10' : 'border-border-default hover:border-brand'
              }`}
            >
              {fileUploaded ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-6 h-6 text-success-fg" strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-semibold text-success-fg">Screenshot uploaded</p>
                  <p className="text-xs text-fg-muted">payment_screenshot.jpg · 284 KB</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-fg-muted" strokeWidth={1.5} />
                  <p className="text-sm font-semibold text-fg-muted">Tap to upload screenshot</p>
                  <p className="text-xs text-fg-muted/60">JPG, PNG · Max 5MB</p>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: UTR */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-border-default rounded-[8px] p-4">
              <p className="text-sm font-semibold text-fg mb-1">Payment Reference (UTR)</p>
              <p className="text-xs text-fg-muted mb-3">Enter the 12-digit UTR number from your UPI payment confirmation.</p>
              <input
                type="text"
                maxLength={12}
                value={utr}
                onChange={(e) => setUtr(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="123456789012"
                className="w-full h-14 bg-elevated border border-border-default rounded-[6px] px-4 text-xl font-semibold tracking-[0.2em] text-fg placeholder:text-fg-muted/40 text-center focus:outline-none focus:border-brand/60 transition-colors tabular-nums"
              />
              <div className="flex justify-between mt-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`w-2 h-0.5 rounded-full transition-colors ${i < utr.length ? 'bg-brand' : 'bg-border-default'}`} />
                ))}
              </div>
              <p className="text-xs text-fg-muted text-center mt-2 tabular-nums">{utr.length}/12 digits</p>
            </div>
            <div className="bg-surface border border-border-default rounded-[8px] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-2">Payment Summary</p>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-fg-muted">Amount</span>
                <span className="text-xs font-semibold text-fg tabular-nums">{fee.amount}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-fg-muted">Screenshot</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-fg">
                  <Check className="w-3 h-3" strokeWidth={2.5} /> Uploaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2 border-t border-border-default bg-base">
        <Button
          fullWidth
          loading={loading}
          onClick={handleNext}
          disabled={step === 3 && utr.length < 12}
        >
          {step === 3 ? 'Submit Payment' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
