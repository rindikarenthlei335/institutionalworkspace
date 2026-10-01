'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChatMessage,
  CopilotLanguage,
  CopilotMode,
  CopilotQuotaStatus
} from '../lib/types';

const SAMPLE_PROMPTS = [
  { label: 'How to enroll students via Excel?', mode: 'guide', lang: 'en', prompt: 'How do I enroll new students using Excel bulk import?' },
  { label: 'Fee defaulters list', mode: 'data', lang: 'en', prompt: 'List all students with overdue fee balances.' },
  { label: 'Draft holiday notice', mode: 'action', lang: 'en', prompt: 'Draft a notice announcing holiday for school sports day.' },
  { label: 'Zirlai lakluh dan (Mizo)', mode: 'guide', lang: 'lus', prompt: 'Khawi atangin nge zirlai lakluh theih?' },
  { label: 'Kallam dinhmun (Mizo)', mode: 'data', lang: 'lus', prompt: 'Zirlaite attendance dinhmun min hrilh teh.' },
  { label: 'Exam rank & marksheet', mode: 'guide', lang: 'en', prompt: 'How do I enter exam marks and calculate ranks?' }
];

export function CopilotFullPageView() {
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
        'Welcome to the full-page EduPortal AI Copilot workspace. Ask questions, inspect school health metrics, draft announcements, or translate between English and Mizo.',
      createdAt: new Date().toISOString()
    }
  ]);

  const [quota, setQuota] = useState<CopilotQuotaStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: prompt,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          language,
          history: messages.slice(-4),
          tenantId: '00000000-0000-0000-0000-000000000001',
          planId: 'ultimate'
        })
      });

      if (!res.ok) throw new Error('API failed');
      const data = await res.json();

      setMessages((prev) => [...prev, data.message]);
      if (data.quota) setQuota(data.quota);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'An error occurred while contacting AI Copilot. Please try again.',
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
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Left Sidebar */}
      <aside className="w-72 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h2 className="font-display font-bold text-sm text-[#163A2B]">Copilot Console</h2>
            </div>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              ULTIMATE
            </span>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() =>
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  role: 'assistant',
                  content:
                    language === 'lus'
                      ? 'Inbiakna thar kan tan e. Eng nge ka puih theih ang che?'
                      : 'New conversation started. How may I assist you today?',
                  createdAt: new Date().toISOString()
                }
              ])
            }
            className="w-full mb-4 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span>+</span>
            <span>New Conversation</span>
          </button>

          {/* Sample Prompts */}
          <div className="mb-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Suggested Prompts
            </h4>
            <div className="space-y-1.5">
              {SAMPLE_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setMode(p.mode as CopilotMode);
                    setLanguage(p.lang as CopilotLanguage);
                    handleSendMessage(p.prompt);
                  }}
                  className="w-full text-left text-[11px] p-2 rounded-lg bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-gray-700 transition-colors"
                >
                  <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">
                    {p.mode} • {p.lang.toUpperCase()}
                  </span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quota & Model Info */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-[11px] text-gray-600 mb-1.5 font-medium">
            <span>Monthly Usage</span>
            <span>{quota ? `${quota.usedMessagesThisMonth} / ${quota.monthlyQuota}` : '14 / 3,000'}</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  ((quota?.usedMessagesThisMonth || 14) / (quota?.monthlyQuota || 3000)) * 100
                )}%`
              }}
            />
          </div>
          <p className="text-[9px] text-gray-400 mt-2">
            Models: Claude Haiku 4.5 & Sonnet 5.5
          </p>
        </div>
      </aside>

      {/* Main Chat Pane */}
      <section className="flex-1 flex flex-col min-w-0">
        {/* Controls Header */}
        <header className="p-3 border-b border-gray-200 bg-white flex items-center justify-between">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-500 mr-1">Mode:</span>
            {(
              [
                { id: 'general', label: 'General / 💬', tip: 'School writing & translation' },
                { id: 'guide', label: 'Guide / 📖', tip: 'Help articles with deep links' },
                { id: 'data', label: 'Data / 📊', tip: 'Live stats from Data Hub' },
                { id: 'action', label: 'Action / 📝', tip: 'Safe drafts requiring confirmation' }
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                title={m.tip}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                  mode === m.id
                    ? 'bg-[#163A2B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Language Switch */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Language:</span>
            <div className="inline-flex rounded-md shadow-sm border border-gray-200 p-0.5 bg-gray-50">
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs px-2.5 py-0.5 rounded font-semibold transition-colors ${
                  language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                English (en)
              </button>
              <button
                onClick={() => setLanguage('lus')}
                className={`text-xs px-2.5 py-0.5 rounded font-semibold transition-colors ${
                  language === 'lus' ? 'bg-[#163A2B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Mizo (lus)
              </button>
            </div>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-2xl rounded-2xl p-4 leading-relaxed text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#163A2B] text-white rounded-br-none shadow'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Deep Links in Guide Mode */}
                {msg.metadata?.deepLinks && msg.metadata.deepLinks.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Suggested School Pages:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.metadata.deepLinks.map((link, idx) => (
                        <Link
                          key={idx}
                          href={link.url}
                          className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 transition-colors text-xs"
                        >
                          <div>
                            <span className="font-semibold block">{link.title}</span>
                            {link.description && (
                              <span className="text-[10px] text-emerald-700 block truncate">
                                {link.description}
                              </span>
                            )}
                          </div>
                          <span className="text-sm font-bold ml-2">↗</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tool Results in Data Mode */}
                {msg.metadata?.toolResult && (
                  <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <span className="font-bold text-xs text-gray-700 block mb-1">
                      📊 Live Data Hub Inspection ({msg.metadata.toolResult.toolName})
                    </span>
                    <p className="text-xs text-gray-600">{msg.metadata.toolResult.summary}</p>
                  </div>
                )}

                {/* Action Draft Cards in Action Mode */}
                {msg.metadata?.actionDraft && (
                  <div className="mt-3 pt-3 border-t border-amber-200 bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">
                        📝 Draft {msg.metadata.actionDraft.type}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          appliedDrafts.has(msg.metadata.actionDraft.id)
                            ? 'bg-emerald-200 text-emerald-800'
                            : 'bg-amber-200 text-amber-800'
                        }`}
                      >
                        {appliedDrafts.has(msg.metadata.actionDraft.id)
                          ? 'Applied'
                          : 'Requires Confirmation'}
                      </span>
                    </div>
                    <p className="font-bold text-gray-900 mb-1 text-sm">
                      {msg.metadata.actionDraft.title}
                    </p>
                    <p className="text-gray-700 italic text-xs mb-3 p-2 bg-white/80 rounded border border-amber-100">
                      "{msg.metadata.actionDraft.previewContent}"
                    </p>
                    {!appliedDrafts.has(msg.metadata.actionDraft.id) ? (
                      <button
                        onClick={() => handleApplyDraft(msg.metadata!.actionDraft!.id)}
                        disabled={applyingDraftId === msg.metadata.actionDraft.id}
                        className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-1.5 px-3 rounded text-xs shadow-sm transition-colors"
                      >
                        {applyingDraftId === msg.metadata.actionDraft.id
                          ? 'Applying...'
                          : '✓ Confirm & Publish Draft'}
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold block text-center">
                        ✓ Confirmed & Applied to School Records
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-2">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400 text-xs italic p-3">
              <span className="inline-block animate-bounce">●</span>
              <span className="inline-block animate-bounce [animation-delay:0.2s]">●</span>
              <span className="inline-block animate-bounce [animation-delay:0.4s]">●</span>
              <span>Copilot is formulating response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-4 bg-white border-t border-gray-200 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'lus'
                ? 'Copilot zawt rawh (e.g. Zirlai lakluh dan, fee ba zirlaite, thuchhuah siam...)'
                : 'Message EduPortal AI Copilot (e.g. How to enter marks, fee defaulters, draft a circular...)'
            }
            className="flex-1 text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#163A2B]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-[#163A2B] hover:bg-[#1f4e3b] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow transition-colors"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
