'use client';

import React, { useState } from 'react';
import type { IssuedIDCard, IDCardTemplate } from '../types';

interface CR80CardPreviewProps {
  card: IssuedIDCard;
  template?: Partial<IDCardTemplate>;
  side?: 'front' | 'back';
  allowFlip?: boolean;
  schoolName?: string;
  schoolTagline?: string;
}

export function CR80CardPreview({
  card,
  template = {
    layout: 'vertical',
    primaryColor: '#163A2B',
    secondaryColor: '#C9A84C',
    backgroundColor: '#FFFFFF',
    showBloodGroup: true,
    showGuardianPhone: true,
    showAddress: true,
    showEmergencyContact: true,
    showQr: true,
    showBarcode: true
  },
  side = 'front',
  allowFlip = true,
  schoolName = 'Mount Carmel Higher Secondary School',
  schoolTagline = 'Excellence in Character & Wisdom'
}: CR80CardPreviewProps) {
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>(side);

  const isVertical = template.layout !== 'horizontal';
  const primaryBg = template.primaryColor || '#163A2B';
  const secondaryColor = template.secondaryColor || '#C9A84C';

  const verifyUrl = `/verify/id/${card.qrVerificationToken}`;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {allowFlip && (
        <div className="flex items-center gap-2 mb-1 print:hidden">
          <button
            onClick={() => setCurrentSide('front')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              currentSide === 'front'
                ? 'bg-[#163A2B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Front Side
          </button>
          <button
            onClick={() => setCurrentSide('back')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
              currentSide === 'back'
                ? 'bg-[#163A2B] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Back Side (Emergency & QR)
          </button>
        </div>
      )}

      {/* CR80 Card Dimensions: standard 85.6mm × 53.98mm ratio */}
      <div
        className={`relative rounded-xl border border-slate-300 shadow-md overflow-hidden bg-white text-slate-900 transition-all ${
          isVertical ? 'w-[260px] h-[410px]' : 'w-[410px] h-[260px]'
        }`}
        style={{
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)'
        }}
      >
        {/* ===================== FRONT SIDE ===================== */}
        {currentSide === 'front' && (
          <div className="h-full flex flex-col justify-between">
            {/* Header */}
            <div
              className="p-3 text-center text-white relative"
              style={{ backgroundColor: primaryBg }}
            >
              <div className="flex items-center justify-center gap-2 mb-0.5">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shadow-xs"
                  style={{ backgroundColor: secondaryColor, color: primaryBg }}
                >
                  MC
                </div>
                <h3 className="font-display font-black text-xs leading-tight tracking-wide uppercase">
                  {schoolName}
                </h3>
              </div>
              <p className="text-[8px] text-white/80 uppercase tracking-widest font-medium">
                {card.cardType === 'student' ? 'Student Identity Card' : 'Staff Credential Card'}
              </p>
              <div
                className="absolute bottom-0 left-0 right-0 h-1"
                style={{ backgroundColor: secondaryColor }}
              />
            </div>

            {/* Body */}
            <div className="p-3 flex-1 flex flex-col items-center justify-center text-center">
              {/* Photo Frame */}
              <div className="relative mb-2">
                <div className="w-20 h-24 rounded-lg border-2 border-slate-300 bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                  {card.photoUrl ? (
                    <img
                      src={card.photoUrl}
                      alt={card.personName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <span className="text-2xl">👤</span>
                      <span className="text-[8px] font-semibold mt-1">PHOTO</span>
                    </div>
                  )}
                </div>
                {template.showBloodGroup && card.bloodGroup && (
                  <span className="absolute -bottom-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-xs border border-white">
                    {card.bloodGroup}
                  </span>
                )}
              </div>

              {/* Name & Title */}
              <h4 className="font-display font-extrabold text-sm text-slate-900 leading-tight">
                {card.personName}
              </h4>
              <p className="text-[11px] font-bold text-[#163A2B] mt-0.5">
                {card.roleOrClass}
              </p>

              {/* Metadata Details */}
              <div className="mt-2 w-full text-left text-[10px] space-y-0.5 px-2 bg-slate-50 py-1.5 rounded-md border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[8px]">
                    {card.cardType === 'student' ? 'Adm No:' : 'Emp ID:'}
                  </span>
                  <span className="font-mono font-bold text-slate-800">{card.identifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[8px]">Card ID:</span>
                  <span className="font-mono font-semibold text-slate-700">{card.cardNumber}</span>
                </div>
                {card.dob && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 uppercase font-semibold text-[8px]">DOB:</span>
                    <span className="text-slate-700">{card.dob}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-semibold text-[8px]">Valid Thru:</span>
                  <span className="font-bold text-emerald-800">{card.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Footer with Barcode Strip */}
            <div className="bg-slate-100 px-3 py-1.5 border-t border-slate-200 flex items-center justify-between">
              {/* Simulated Barcode */}
              <div className="flex items-center gap-0.5 h-5">
                {[1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2].map((w, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-slate-800"
                    style={{ width: `${w * 1.5}px` }}
                  />
                ))}
              </div>
              <div className="text-right">
                <span className="text-[8px] font-serif italic text-slate-600 block">Authorized Sign</span>
                <span className="text-[7px] text-slate-400">Principal</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================== BACK SIDE ===================== */}
        {currentSide === 'back' && (
          <div className="h-full flex flex-col justify-between p-3.5 bg-slate-50 text-[10px]">
            {/* Top Back Details */}
            <div className="space-y-2">
              <div className="border-b pb-1.5 text-center">
                <span className="text-[9px] font-bold text-slate-800 uppercase block">
                  Important Information
                </span>
                <p className="text-[8px] text-slate-500 leading-tight">
                  This card is property of {schoolName}. Found cards must be returned to the office.
                </p>
              </div>

              <div className="space-y-1">
                {template.showGuardianPhone && card.phone && (
                  <div>
                    <span className="text-[8px] font-bold uppercase text-slate-500 block">
                      {card.cardType === 'student' ? 'Guardian Contact:' : 'Personal Contact:'}
                    </span>
                    <span className="font-mono font-bold text-slate-800">{card.phone}</span>
                  </div>
                )}

                {template.showAddress && card.address && (
                  <div>
                    <span className="text-[8px] font-bold uppercase text-slate-500 block">
                      Residential Address:
                    </span>
                    <span className="text-slate-700 text-[9px] line-clamp-2">{card.address}</span>
                  </div>
                )}

                <div>
                  <span className="text-[8px] font-bold uppercase text-slate-500 block">
                    Campus Helpline:
                  </span>
                  <span className="text-slate-700 font-mono">+91 98621 55667</span>
                </div>
              </div>
            </div>

            {/* QR Code Verification Section */}
            <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-50 border border-slate-300 rounded p-1 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 text-[#163A2B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-5 0h3v3h-3v-3zm2 5h3v3h-3v-3zm3 0h3v3h-3v-3z" />
                </svg>
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-900 block">INSTANT QR VERIFY</span>
                <span className="text-[8px] text-slate-500 block leading-tight">
                  Scan with any camera to verify validity status online.
                </span>
                <span className="text-[8px] font-mono text-emerald-800 mt-1 block truncate max-w-[130px]">
                  {card.qrVerificationToken}
                </span>
              </div>
            </div>

            {/* Back Footer */}
            <div className="text-center text-[8px] text-slate-400 border-t pt-1">
              Valid until: {card.expiryDate} · Card #{card.cardNumber}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
