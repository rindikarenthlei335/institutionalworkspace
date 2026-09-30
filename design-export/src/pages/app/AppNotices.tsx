import React, { useState } from 'react';
import { Bell, BookOpen, AlertCircle, ChevronRight } from 'lucide-react';
import { TopAppBar } from '../../components/layout/TopAppBar';

const categories = ['All', 'Academic', 'Finance', 'Event', 'Holiday', 'Urgent'];

const notices = [
  { id: 1, title: 'Annual Day Celebration — Save the Date', body: 'Delhi Public School is proud to announce its Annual Day on 25 January 2025. All parents are cordially invited to attend. Detailed schedule will be shared soon.', category: 'Event', date: '18 Dec 2024', urgent: false },
  { id: 2, title: 'Term 2 Fee Payment — Final Reminder', body: 'This is a final reminder that Term 2 fees are due by 31 December 2024. Kindly complete the payment via EduPortal to avoid late fees. Contact the admin for any queries.', category: 'Finance', date: '15 Dec 2024', urgent: true },
  { id: 3, title: 'Winter Vacation Notice', body: 'School will remain closed for Winter Vacation from 22 December 2024 to 5 January 2025. School reopens on 6 January 2025.', category: 'Holiday', date: '12 Dec 2024', urgent: false },
  { id: 4, title: 'Half-Yearly Exam Timetable Released', body: 'The half-yearly examination timetable for Classes I–XII has been released. Parents can download the timetable from the school website.', category: 'Academic', date: '10 Dec 2024', urgent: false },
  { id: 5, title: 'Sports Day Selection Trials', body: 'Trials for Annual Sports Day events will be held on 20 December 2024 on the school grounds. Students interested in participating must register with the Sports department.', category: 'Event', date: '8 Dec 2024', urgent: false },
];

export function AppNotices({ onBack }: { onBack?: () => void }) {
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState<typeof notices[0] | null>(null);

  const filtered = cat === 'All' ? notices : notices.filter(n => n.category === cat);

  if (selected) {
    return (
      <div className="h-full flex flex-col bg-base">
        <TopAppBar title={selected.category} subtitle={selected.date} onBack={() => setSelected(null)} />
        <div className="flex-1 overflow-y-auto p-5">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold border mb-4 ${selected.urgent ? 'bg-warning/15 text-warning-fg border-warning/50' : 'bg-brand/15 text-brand border-brand/50'}`}>
            {selected.urgent
              ? <AlertCircle className="w-3 h-3" strokeWidth={2} />
              : <BookOpen className="w-3 h-3" strokeWidth={2} />
            }
            {selected.urgent ? 'Urgent' : selected.category}
          </div>
          <h2 className="text-lg font-semibold text-fg leading-snug mb-4 font-display">{selected.title}</h2>
          <p className="text-sm text-fg-muted leading-relaxed">{selected.body}</p>
          <p className="text-xs text-fg-muted mt-4">— School Administration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-base">
      <TopAppBar title="Notices" onBack={onBack} />

      {/* Category filter */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3.5 h-8 rounded-[4px] text-xs font-semibold transition-all whitespace-nowrap ${
                cat === c ? 'bg-brand text-on-brand' : 'bg-surface border border-border-default text-fg-muted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Notice list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-2">
          {filtered.map((notice) => (
            <button
              key={notice.id}
              onClick={() => setSelected(notice)}
              className={`bg-surface border rounded-[8px] p-4 text-left w-full transition-colors hover:border-brand ${notice.urgent ? 'border-warning/50' : 'border-border-default'}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-[4px] ${notice.urgent ? 'bg-warning/15 text-warning-fg' : 'bg-brand/15 text-brand'}`}>
                  {notice.urgent
                    ? <AlertCircle className="w-3 h-3" strokeWidth={2} />
                    : <Bell className="w-3 h-3" strokeWidth={1.5} />
                  }
                  {notice.urgent ? 'Urgent' : notice.category}
                </span>
                <span className="text-[10px] text-fg-muted shrink-0">{notice.date}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-fg leading-snug mb-1 font-display">{notice.title}</h4>
                  <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">{notice.body}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-fg-muted shrink-0 mt-0.5" strokeWidth={1.5} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
