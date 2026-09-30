'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ServiceCatalogItem, ServiceOrder, ServiceOrderItem } from '../types';
import { PlanTier } from '@eduportal/shared';
import {
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  UploadCloud,
  FileCheck,
  AlertCircle,
  CreditCard,
  Building,
  ArrowRight,
  ArrowLeft,
  Lock
} from 'lucide-react';
import {
  createSchoolAuthorisationDocx,
  createPublisherAuthorisationDocx,
  createDomainDeclarationDocx,
  downloadDocxInBrowser
} from '../lib/docx-templates';
import { SERVICE_STORE_ETA_DISCLAIMER } from '../lib/eta';

interface ServiceCheckoutModalProps {
  selectedServices: ServiceCatalogItem[];
  currentPlan: PlanTier;
  schoolDetails: {
    name: string;
    principalName: string;
    email: string;
    phone: string;
    address: string;
    affiliationNumber?: string;
  };
  onClose: () => void;
  onOrderComplete: (order: ServiceOrder) => void;
}

export function ServiceCheckoutModal({
  selectedServices,
  currentPlan,
  schoolDetails,
  onClose,
  onOrderComplete
}: ServiceCheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [formDetails, setFormDetails] = useState({
    schoolName: schoolDetails.name,
    principalName: schoolDetails.principalName,
    email: schoolDetails.email,
    phone: schoolDetails.phone,
    address: schoolDetails.address,
    affiliationNumber: schoolDetails.affiliationNumber || 'CBSE-332019'
  });

  // Uploaded files map: [docKey]: File object or uploaded flag
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, { name: string; size: number }>>({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<ServiceOrder | null>(null);

  // Financial calculations
  const subtotal = selectedServices.reduce((acc, s) => {
    const p = s.pricing[currentPlan]?.amountINR || 0;
    return acc + p;
  }, 0);

  const discount = selectedServices.reduce((acc, s) => {
    // If standard price was higher on basic tier
    const basicPrice = s.pricing['basic']?.amountINR || 0;
    const currentPrice = s.pricing[currentPlan]?.amountINR || 0;
    const saved = Math.max(0, basicPrice - currentPrice);
    return acc + saved;
  }, 0);

  const gstRate = 0.18; // Optional GST
  const gstAmount = Math.round(subtotal * gstRate);
  const totalPayable = subtotal + gstAmount;

  // Documents checklist across all selected items
  const allRequiredDocs = selectedServices.flatMap(s =>
    s.requiredDocuments.map(doc => ({ ...doc, serviceTitle: s.titleEn, serviceId: s.id }))
  );

  const handleDownloadDocx = async (docKey: string, serviceTitle: string) => {
    const schoolPayload = {
      schoolName: formDetails.schoolName,
      principalName: formDetails.principalName,
      address: formDetails.address,
      phone: formDetails.phone,
      email: formDetails.email,
      affiliationNumber: formDetails.affiliationNumber
    };

    if (docKey.includes('publisher')) {
      const doc = createPublisherAuthorisationDocx(schoolPayload);
      await downloadDocxInBrowser(doc, `App_Publisher_Authorisation_${formDetails.schoolName.replace(/\s+/g, '_')}`);
    } else if (docKey.includes('recognition') || docKey.includes('declaration')) {
      const doc = createDomainDeclarationDocx(schoolPayload);
      await downloadDocxInBrowser(doc, `Domain_Registrant_Declaration_${formDetails.schoolName.replace(/\s+/g, '_')}`);
    } else {
      const doc = createSchoolAuthorisationDocx(schoolPayload);
      await downloadDocxInBrowser(doc, `School_Authorisation_Letter_${formDetails.schoolName.replace(/\s+/g, '_')}`);
    }
  };

  const handleFileUpload = (docKey: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [docKey]: {
        name: file.name,
        size: file.size
      }
    }));
  };

  const handleSimulatePayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const orderNum = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const orderItems: ServiceOrderItem[] = selectedServices.map((s, idx) => {
        const p = s.pricing[currentPlan]?.amountINR || 0;
        return {
          id: `item-${Date.now()}-${idx}`,
          orderId: `ord-${Date.now()}`,
          tenantId: 'tenant-active',
          serviceId: s.id,
          serviceTitle: s.titleEn,
          priceINR: p,
          recurringINR: s.isRecurring ? p : 0,
          status: 'documents_under_review',
          clockStartedAt: undefined, // clock will start only after doc approval
          etaWorkingDays: s.etaMaxDays || 5,
          documents: s.requiredDocuments.map(req => ({
            id: `doc-${Date.now()}-${req.key}`,
            itemId: `item-${Date.now()}-${idx}`,
            documentKey: req.key,
            label: req.labelEn,
            fileName: uploadedFiles[req.key]?.name || 'uploaded_document.pdf',
            fileSizeBytes: uploadedFiles[req.key]?.size || 204800,
            mimeType: 'application/pdf',
            storagePath: `tenants/active/orders/${orderNum}/${req.key}.pdf`,
            status: 'under_review',
            uploadedAt: new Date().toISOString()
          })),
          events: [
            {
              id: `evt-${Date.now()}-1`,
              itemId: `item-${Date.now()}-${idx}`,
              eventType: 'order_placed',
              title: 'Service Order Placed & Prepaid',
              description: 'Payment confirmed via Platform Razorpay. Documents queued for staff review.',
              createdAt: new Date().toISOString()
            }
          ],
          createdAt: new Date().toISOString()
        };
      });

      const newOrder: ServiceOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        tenantId: 'tenant-active',
        tenantName: formDetails.schoolName,
        status: 'paid',
        subtotalINR: subtotal,
        discountINR: discount,
        taxINR: gstAmount,
        totalAmountINR: totalPayable,
        paymentStatus: 'paid',
        paymentId: `pay_platform_${Date.now()}`,
        paymentGateway: 'PLATFORM_RAZORPAY',
        termsAcceptedAt: new Date().toISOString(),
        termsIpHash: 'sha256-client-sim-88f1a',
        termsVersion: 'v2.1',
        items: orderItems,
        createdAt: new Date().toISOString()
      };

      setCompletedOrder(newOrder);
      setIsProcessingPayment(false);
      setCurrentStep(5);
      onOrderComplete(newOrder);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Wizard Header & Steps */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Step {currentStep} of 5
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {currentStep === 1 && 'Review Services & Pricing'}
                {currentStep === 2 && 'Required Documents & Authorisations'}
                {currentStep === 3 && 'Terms & Cancellation Policy'}
                {currentStep === 4 && 'Prepaid Platform Payment'}
                {currentStep === 5 && 'Order Confirmation & Receipt'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Service Store Checkout
            </h2>
          </div>
          {currentStep < 5 && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: REVIEW SERVICES */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Selected Services ({selectedServices.length})
                </h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Plan: {currentPlan.toUpperCase()}
                </span>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                {selectedServices.map(s => {
                  const p = s.pricing[currentPlan];
                  const isFree = p?.priceType === 'free' || p?.amountINR === 0;

                  return (
                    <div key={s.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900 dark:text-white text-sm">
                            {s.titleEn}
                          </span>
                          {isFree ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                              Included
                            </span>
                          ) : p?.labelBadge ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                              {p.labelBadge}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {s.oneLineBenefitEn}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Est. Turnaround: {s.etaMinDays}-{s.etaMaxDays} working days after doc approval
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        {isFree ? (
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            ₹0 (Free)
                          </span>
                        ) : (
                          <div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">
                              ₹{p?.amountINR.toLocaleString('en-IN')}
                            </span>
                            {p?.priceType === 'work_fee_plus_actual' && (
                              <p className="text-[10px] text-slate-400">+ registrar cost</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Summary */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Plan Entitlement Savings</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated GST (18%)</span>
                  <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Amount Payable</span>
                  <span className="text-base text-blue-600 dark:text-blue-400">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: REQUIRED DOCUMENTS & FORMS */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Institutional Details & Required Documents
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  We pre-fill institutional authorisation letters and declarations using your school information.
                </p>
              </div>

              {/* Pre-fill Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    value={formDetails.schoolName}
                    onChange={e => setFormDetails({ ...formDetails, schoolName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Principal / Authorized Head
                  </label>
                  <input
                    type="text"
                    value={formDetails.principalName}
                    onChange={e => setFormDetails({ ...formDetails, principalName: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={formDetails.email}
                    onChange={e => setFormDetails({ ...formDetails, email: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    Board Affiliation Number
                  </label>
                  <input
                    type="text"
                    value={formDetails.affiliationNumber}
                    onChange={e => setFormDetails({ ...formDetails, affiliationNumber: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Document Upload / Download List */}
              {allRequiredDocs.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-emerald-900 dark:text-emerald-300 text-sm">
                    No preliminary documents required!
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    All your selected add-ons can be set up immediately without documentation delays.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Required Document Dossier ({allRequiredDocs.length} items)
                  </span>

                  {allRequiredDocs.map((doc, idx) => {
                    const isUploaded = !!uploadedFiles[doc.key];

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {doc.labelEn}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({doc.serviceTitle})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {doc.labelLus} • Accepted: {doc.types.join(', ').toUpperCase()} • Max {doc.maxMb} MB
                            </p>
                          </div>

                          {doc.hasTemplate && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleDownloadDocx(doc.key, doc.serviceTitle)}
                              className="shrink-0 flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download Pre-filled .docx
                            </Button>
                          )}
                        </div>

                        {/* File Upload Trigger */}
                        <div className="flex items-center gap-3 pt-1">
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors">
                            <UploadCloud className="w-4 h-4 text-blue-500" />
                            <span>{isUploaded ? 'Change File' : 'Upload Signed Copy'}</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleFileUpload(doc.key, f);
                              }}
                            />
                          </label>

                          {isUploaded ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                              <FileCheck className="w-4 h-4" />
                              {uploadedFiles[doc.key]?.name}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">
                              Upload pending (can also upload post-checkout)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: TERMS & REFUND POLICY */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                Service Store Agreement & Terms of Service (v2.1)
              </h3>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3 leading-relaxed text-slate-700 dark:text-slate-300 max-h-60 overflow-y-auto">
                <p>
                  <strong>1. Work Commencement Rule:</strong> Work on ordered services begins strictly upon receipt of full prepaid payment and approval of all required documents by our platform fulfillment team.
                </p>
                <p>
                  <strong>2. ETA Calculation & Working Days:</strong> Turnaround times are calculated based on working days (Monday through Friday, excluding Indian national holidays). Turnaround clocks remain paused while documents are pending or undergoing verification.
                </p>
                <p>
                  <strong>3. Third-Party Dependencies Disclaimer:</strong> {SERVICE_STORE_ETA_DISCLAIMER}
                </p>
                <p>
                  <strong>4. Cancellation & Refund Policy:</strong>
                  <br />
                  • <em>Before Work Commences:</em> Full refund minus standard gateway payment processing fees.
                  <br />
                  • <em>After Work Commences:</em> Non-refundable once domain registration, Play Store submission, or SEO verification work has been initiated.
                  <br />
                  • <em>Domain Registration Pass-Through:</em> Registrar registration fees are strictly non-refundable once allocated by the registry.
                </p>
              </div>

              {/* Agreement Checkbox */}
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termsCheck"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="termsCheck" className="text-slate-800 dark:text-slate-200 cursor-pointer">
                  <span className="font-semibold block mb-0.5">
                    I accept the Service Store Terms & Refund Policy
                  </span>
                  I confirm that I am an authorized school administrator (`school_super_admin`), and agree that work commences upon payment and document clearance.
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: PREPAID PLATFORM PAYMENT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950 text-white flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider block">
                    Prepaid Platform Gateway Context
                  </span>
                  <span className="text-lg font-bold font-display">
                    EduPortal Platform Invoicing
                  </span>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Platform Razorpay Account (`PLATFORM_RAZORPAY_*`) · Separate from Student Fees
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-blue-300 block">Total Due</span>
                  <span className="text-2xl font-bold font-display text-emerald-400">
                    ₹{totalPayable.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Select Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border-2 border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 flex items-center gap-3 cursor-pointer">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">UPI / QR Code</p>
                      <p className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-400">
                    <Building className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">Netbanking</p>
                      <p className="text-[10px] text-slate-500">All Indian Banks</p>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:border-slate-400">
                    <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="font-semibold text-xs text-slate-900 dark:text-white">Corporate Card</p>
                      <p className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Mandatory prepayment required. Institutional receipt with GSTIN generated immediately.</span>
              </div>
            </div>
          )}

          {/* STEP 5: ORDER CONFIRMED */}
          {currentStep === 5 && completedOrder && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Payment Cleared · Order Placed
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 dark:text-white mt-1">
                  Order #{completedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  Thank you! Your prepaid order of ₹{completedOrder.totalAmountINR.toLocaleString('en-IN')} has been registered.
                </p>
              </div>

              {/* Order Item Status Cards */}
              <div className="text-left rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 p-4 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  Order Items & Next Steps
                </span>
                <div className="space-y-2">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.serviceTitle}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Status: <span className="font-medium text-amber-600 dark:text-amber-400">Documents Under Review</span>
                        </p>
                      </div>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {item.etaWorkingDays} Working Days ETA
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-300">
                  <Clock className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                  <strong>Clock Start Notice:</strong> The working-day ETA clock will start as soon as our platform team verifies and approves your uploaded documents.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between">
          {currentStep > 1 && currentStep < 5 ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentStep((currentStep - 1) as any)}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep === 1 && (
            <Button
              variant="primary"
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-1.5 ml-auto"
            >
              Continue to Documents
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {currentStep === 2 && (
            <Button
              variant="primary"
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-1.5 ml-auto"
            >
              Review Terms & Policy
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {currentStep === 3 && (
            <Button
              variant="primary"
              disabled={!termsAccepted}
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-1.5 ml-auto"
            >
              Proceed to Payment
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}

          {currentStep === 4 && (
            <Button
              variant="primary"
              disabled={isProcessingPayment}
              onClick={handleSimulatePayment}
              className="flex items-center gap-2 ml-auto bg-emerald-600 hover:bg-emerald-700"
            >
              {isProcessingPayment ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Pay ₹{totalPayable.toLocaleString('en-IN')}
                </>
              )}
            </Button>
          )}

          {currentStep === 5 && (
            <div className="flex items-center gap-3 w-full justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Print / Save Receipt
              </Button>
              <Button
                variant="primary"
                onClick={onClose}
              >
                Go to Order Tracker
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
