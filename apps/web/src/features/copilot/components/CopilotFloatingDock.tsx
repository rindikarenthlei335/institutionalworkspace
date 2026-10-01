'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChatMessage,
  CopilotLanguage,
  CopilotMode,
  CopilotQuotaStatus
} from '../lib/types';

export function CopilotFloatingDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CopilotMode>('general');
  const [language, setLanguage] = useState<CopilotLanguage>('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [applyingDraftId, setApplyingDraftId] = useState<string | null>(null);
  const [appliedDrafts, setAppliedDrafts] = useState<Set<string>>(new Set());

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Chibai! I am your School AI Assistant (Pro & Pro+ Plan Feature). I can answer your questions about school admissions, fees, syllabus, facilities, and notices in Mizo (lus) and English!',
      createdAt: new Date().toISOString()
    }
  ]);

  const [quota, setQuota] = useState<CopilotQuotaStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg.content,
          mode,
          language,
          history: messages.slice(-4),
          tenantId: '00000000-0000-0000-0000-000000000001',
          planId: 'ultimate'
        })
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();

      setMessages((prev) => [...prev, data.message]);
      if (data.quota) setQuota(data.quota);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Sorry, I encountered an issue processing your request. Please try again.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyDraft = async (draftId: string) => {
    setApplyingDraftId(draftId);
    try {
      const res = await fetch('/api/copilot/action/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedDrafts((prev) => new Set([...prev, draftId]));
      }
    } catch (err) {
      console.error('Error confirming draft:', err);
    } finally {
      setApplyingDraftId(null);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button (Bottom Right Corner) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-[#163A2B] hover:bg-[#1f4e3b] text-white px-4 py-2.5 rounded-full shadow-2xl border border-emerald-400/40 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Open School AI Copilot (Pro & Pro+ Feature)"
        >
          <span className="text-lg">✨</span>
          <span className="font-display font-semibold text-xs tracking-wide">AI Copilot</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-bold uppercase">
            Pro & Pro+
          </span>
        </button>
      )}

      {/* Floating Drawer */}
      {isOpen && (
        <div className="w-96 max-w-[calc(100vw-2rem)] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#163A2B] p-3 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-display font-bold text-xs">AI Copilot</h3>
                  <span className="text-[8px] bg-emerald-500/40 text-emerald-200 px-1 py-0.2 rounded font-mono font-bold">
                    PRO & PRO+
                  </span>
                </div>
                <p className="text-[10px] text-white/70">Mizo + English School Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'lus' : 'en')}
                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded font-semibold text-emerald-200 border border-white/20 transition-colors"
                title="Toggle between English and Mizo"
              >
                {language === 'en' ? '🇬🇧 EN' : '🇲🇿 LUS'}
              </button>

              {/* Full Page Link */}
              <Link
                href="/admin/copilot"
                className="text-white/80 hover:text-white text-xs px-1"
                title="Expand to Full Page Chat"
              >
                ⤢
              </Link>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white text-sm font-bold px-1"
                title="Close Drawer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mode Selector Strip */}
          <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-3 py-1.5 text-[10px]">
            <span className="text-gray-500 font-medium">Mode:</span>
            <div className="flex gap-1">
              {(['general', 'guide', 'data', 'action'] as CopilotMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-2 py-0.5 rounded capitalize font-medium transition-colors ${
                    mode === m
                      ? 'bg-[#163A2B] text-white font-semibold'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#163A2B] text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Deep Links in Guide Mode */}
                  {msg.metadata?.deepLinks && msg.metadata.deepLinks.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 space-y-1.5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Suggested Pages:
                      </p>
                      {msg.metadata.deepLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          className="flex items-center justify-between p-1.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors text-[11px]"
                        >
                          <span className="font-semibold">{link.title}</span>
                          <span className="text-xs">↗</span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Tool Results in Data Mode */}
                  {msg.metadata?.toolResult && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 bg-gray-50 p-2 rounded text-[11px] border border-gray-200">
                      <span className="font-bold text-gray-700 block mb-0.5">
                        📊 {msg.metadata.toolResult.toolName}
                      </span>
                      <p className="text-gray-600">{msg.metadata.toolResult.summary}</p>
                    </div>
                  )}

                  {/* Action Draft Cards in Action Mode */}
                  {msg.metadata?.actionDraft && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200 text-[11px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-amber-900 uppercase text-[9px] tracking-wider">
                          📝 Draft {msg.metadata.actionDraft.type}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            appliedDrafts.has(msg.metadata.actionDraft.id)
                              ? 'bg-emerald-200 text-emerald-800'
                              : 'bg-amber-200 text-amber-800'
                          }`}
                        >
                          {appliedDrafts.has(msg.metadata.actionDraft.id)
                            ? 'Applied'
                            : 'Pending Confirmation'}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {msg.metadata.actionDraft.title}
                      </p>
                      <p className="text-gray-700 italic text-[10px] mb-2 p-1.5 bg-white/70 rounded border border-amber-100">
                        "{msg.metadata.actionDraft.previewContent}"
                      </p>
                      {!appliedDrafts.has(msg.metadata.actionDraft.id) ? (
                        <button
                          onClick={() => handleApplyDraft(msg.metadata!.actionDraft!.id)}
                          disabled={applyingDraftId === msg.metadata.actionDraft.id}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-1 px-2 rounded text-[10px] shadow-sm transition-colors"
                        >
                          {applyingDraftId === msg.metadata.actionDraft.id
                            ? 'Applying...'
                            : '✓ Confirm & Apply'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold block text-center">
                          ✓ Confirmed and added to school notices
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-[9px] text-gray-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs italic p-2">
                <span className="inline-block animate-bounce">●</span>
                <span className="inline-block animate-bounce [animation-delay:0.2s]">●</span>
                <span className="inline-block animate-bounce [animation-delay:0.4s]">●</span>
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-white border-t border-gray-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'lus'
                  ? 'Zawt rawh (e.g. Zirlai lakluh dan, fee ba...)'
                  : 'Ask Copilot (e.g. How to enroll students, fee dues...)'
              }
              className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#163A2B]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-[#163A2B] hover:bg-[#1f4e3b] disabled:opacity-40 text-white px-3 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Send
            </button>
          </form>

          {/* Quota Footnote */}
          <div className="bg-gray-100 px-3 py-1 border-t border-gray-200 text-[9px] text-gray-500 flex justify-between items-center">
            <span>
              Quota: {quota ? `${quota.usedMessagesThisMonth} / ${quota.monthlyQuota}` : '3,000'}{' '}
              msgs/mo
            </span>
            <span className="text-[8px] text-gray-400">Claude Haiku / Sonnet</span>
          </div>
        </div>
      )}
    </div>
  );
}
