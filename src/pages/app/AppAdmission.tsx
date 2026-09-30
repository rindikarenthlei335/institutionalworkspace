import React, { useState } from 'react';
import { Check, FileText, Upload, User, Phone, Mail, Calendar, Shield } from 'lucide-react';
import { TopAppBar } from '../../components/layout/TopAppBar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SuccessCheck } from '../../components/ui/Toast';

const steps = ['Student Info', 'Parent Info', 'Documents', 'Fee & Submit'];

export function AppAdmission({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(s => s + 1);
    else {
      setLoading(true);
      setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
    }
  };

  if (submitted) {
    return (
      <div className="h-full flex flex-col bg-base">
        <TopAppBar title="Admission Form" onBack={onBack} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <SuccessCheck />
          <h2 className="text-xl font-semibold text-fg mb-2 mt-5 font-display">Application Submitted</h2>
          <p className="text-sm text-fg-muted leading-relaxed mb-2">Your admission application has been received. Application ID: <span className="text-brand font-semibold">ADM-2025-0847</span></p>
          <p className="text-xs text-fg-muted">You'll receive updates via notification. The school will contact you within 3–5 working days.</p>
          <Button className="mt-8" onClick={onBack} variant="secondary">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-base">
      <TopAppBar title="Online Admission" subtitle={`Step ${step + 1} of ${steps.length}`} onBack={step === 0 ? onBack : () => setStep(s => s - 1)} />

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
                    : <span className="text-[10px] font-bold">{i + 1}</span>
                  }
                </div>
                <span className={`text-[8px] mt-1 font-semibold text-center w-16 leading-tight ${i === step ? 'text-brand' : 'text-fg-muted'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-px mb-4 ${i < step ? 'bg-success' : 'bg-border-default'}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">Student Information</p>
            <Input
              label="Full Name"
              placeholder="As per birth certificate"
              icon={<User className="w-4 h-4" strokeWidth={2} />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Date of Birth" type="date" icon={<Calendar className="w-4 h-4" strokeWidth={2} />} />
              <div>
                <label className="text-sm font-semibold text-fg block mb-1.5">Gender</label>
                <select className="w-full h-12 bg-elevated border border-border-default rounded-[6px] px-4 text-sm text-fg focus:outline-none focus:border-brand/60">
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-fg block mb-1.5">Applying for Class</label>
              <select className="w-full h-12 bg-elevated border border-border-default rounded-[6px] px-4 text-sm text-fg focus:outline-none focus:border-brand/60">
                {['Nursery', 'KG', ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`)].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <Input label="Previous School (if any)" placeholder="School name and city" />
            <Input label="Previous Class" placeholder="e.g. Class VI" />
            <Input label="Percentage / Grade" placeholder="e.g. 85% or A+" />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">Parent / Guardian Information</p>
            <Input label="Father's Name" placeholder="Full name" icon={<User className="w-4 h-4" strokeWidth={2} />} />
            <Input label="Father's Occupation" placeholder="e.g. Engineer" />
            <Input label="Mother's Name" placeholder="Full name" icon={<User className="w-4 h-4" strokeWidth={2} />} />
            <Input label="Mother's Occupation" placeholder="e.g. Doctor" />
            <Input label="Mobile Number" placeholder="+91 98765 43210" type="tel" icon={<Phone className="w-4 h-4" strokeWidth={2} />} />
            <Input label="Email Address" placeholder="parent@email.com" type="email" icon={<Mail className="w-4 h-4" strokeWidth={2} />} />
            <Input label="Aadhaar Number (Parent)" placeholder="XXXX XXXX XXXX" maxLength={12} icon={<Shield className="w-4 h-4" strokeWidth={2} />} />
            <div>
              <label className="text-sm font-semibold text-fg block mb-1.5">Home Address</label>
              <textarea
                rows={3}
                placeholder="Full residential address with PIN code"
                className="w-full bg-elevated border border-border-default rounded-[6px] px-4 py-3 text-sm text-fg placeholder:text-fg-muted/60 focus:outline-none focus:border-brand/60 resize-none"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">Required Documents</p>
            <p className="text-xs text-fg-muted">Upload clear scans or photos of the following documents (JPG/PNG/PDF, max 2MB each).</p>
            {[
              { label: 'Birth Certificate', required: true },
              { label: 'Aadhaar Card (Student)', required: true },
              { label: 'Previous Year Marksheet', required: true },
              { label: 'Transfer Certificate', required: false },
              { label: 'Passport Size Photo', required: true },
              { label: 'Address Proof', required: true },
            ].map((doc, i) => {
              const uploaded = i === 0 || i === 4;
              return (
                <div key={doc.label} className="bg-surface border border-border-default rounded-[6px] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${uploaded ? 'bg-success/15' : 'bg-elevated'}`}>
                      {uploaded
                        ? <Check className="w-4 h-4 text-success-fg" strokeWidth={2.5} />
                        : <FileText className="w-4 h-4 text-fg-muted" strokeWidth={1.5} />
                      }
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-fg">{doc.label}</p>
                      {doc.required && !uploaded && <p className="text-[10px] text-error-fg">Required</p>}
                      {uploaded && <p className="text-[10px] text-success-fg">Uploaded</p>}
                    </div>
                  </div>
                  <button
                    className={`h-8 px-3 rounded-[8px] text-xs font-semibold border transition-colors flex items-center gap-1 ${
                      uploaded ? 'bg-success/15 text-success-fg border-success/50' : 'border-brand/40 text-brand hover:bg-brand/10'
                    }`}
                  >
                    {uploaded
                      ? <><Check className="w-3 h-3" strokeWidth={2.5} /> Done</>
                      : <><Upload className="w-3 h-3" strokeWidth={2} /> Upload</>
                    }
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">Admission Fee Payment</p>
            <div className="bg-surface border border-border-default rounded-[8px] p-4">
              <div className="flex justify-between py-1.5">
                <span className="text-xs text-fg-muted">Registration Fee</span>
                <span className="text-xs font-semibold text-fg tabular-nums">₹ 500</span>
              </div>
              <div className="flex justify-between py-1.5 pb-3 border-b border-border-default">
                <span className="text-xs text-fg-muted">Admission Processing Fee</span>
                <span className="text-xs font-semibold text-fg tabular-nums">₹ 1,000</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-sm font-semibold text-fg">Total to Pay</span>
                <span className="text-sm font-semibold text-brand tabular-nums">₹ 1,500</span>
              </div>
            </div>
            <div className="bg-surface border border-border-default rounded-[8px] p-4 flex flex-col items-center gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted">Scan to Pay via UPI</p>
              <div className="w-32 h-32 bg-elevated rounded-[8px] border border-border-default flex items-center justify-center">
                <div className="grid grid-cols-3 gap-0.5 p-2">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded-[2px] ${[0,2,6,8].includes(i) ? 'bg-border-default/60' : i===4 ? 'bg-brand/50' : 'bg-elevated border border-border-default/40'}`} />
                  ))}
                </div>
              </div>
              <p className="text-xs text-fg-muted">UPI: <span className="text-brand font-semibold">dps-admission@ybl</span></p>
            </div>
            <Input
              label="UTR / Transaction Reference"
              placeholder="12-digit UTR number"
              maxLength={12}
            />
            <div className="bg-surface border border-border-default rounded-[6px] p-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" className="mt-0.5 accent-brand" />
                <span className="text-xs text-fg-muted leading-relaxed">I confirm that all information provided is accurate and I agree to the school's admission terms and conditions.</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-4 pt-2 border-t border-border-default bg-base">
        <Button fullWidth loading={loading} onClick={handleNext}>
          {step === steps.length - 1 ? 'Submit Application' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
