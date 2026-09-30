import React, { useState } from 'react';
import { ArrowRight, Microscope, Dumbbell, BookOpen, Monitor, Palette, UtensilsCrossed, MapPin, Phone, Mail, Clock, Target, Telescope, Scale, ChevronRight } from 'lucide-react';

// ── Activities ──────────────────────────────────────────────────────────────

const achievements = [
  { title: 'State Science Olympiad — 1st Place', category: 'Academic', year: '2024', img: 'https://images.unsplash.com/photo-1532094349884-543559242c27?w=400&h=260&fit=crop&auto=format&q=80' },
  { title: 'Zonal Football Championship', category: 'Sports', year: '2024', img: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=400&h=260&fit=crop&auto=format&q=80' },
  { title: 'National Art Festival — 3 Gold Medals', category: 'Arts', year: '2024', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=260&fit=crop&auto=format&q=80' },
  { title: 'Inter-school Debate — Winners', category: 'Academic', year: '2024', img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=260&fit=crop&auto=format&q=80' },
  { title: 'Robotics Challenge — Runner-up', category: 'Technology', year: '2024', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=260&fit=crop&auto=format&q=80' },
  { title: 'Classical Dance — State Champions', category: 'Arts', year: '2023', img: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&h=260&fit=crop&auto=format&q=80' },
];

const cats = ['All', 'Academic', 'Sports', 'Arts', 'Technology'];

export function WebsiteActivities() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? achievements : achievements.filter(a => a.category === cat);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Recognition & Excellence</p>
        <h1 className="font-display font-bold text-[40px] text-fg mb-3" style={{ letterSpacing: '-0.02em' }}>Achievements & Activities</h1>
        <p className="text-fg-muted max-w-xl mx-auto leading-relaxed">Our students consistently excel across academic, sports, and cultural domains.</p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center mb-10">
        {cats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 h-9 rounded-[4px] text-[13px] font-semibold transition-all ${cat === c ? 'bg-brand text-on-brand' : 'bg-surface border border-border-default text-fg-muted hover:text-fg'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        {filtered.map((a) => (
          <div key={a.title} className="bg-surface border border-border-default rounded-[8px] overflow-hidden hover:border-brand transition-colors group cursor-pointer card-hover">
            <div className="relative h-44 overflow-hidden bg-elevated">
              <img src={a.img} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-[4px] bg-brand/90 text-on-brand">{a.category}</span>
              <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-[4px] bg-black/50 text-white tabular-nums">{a.year}</span>
            </div>
            <div className="p-4">
              <p className="text-[13px] font-semibold text-fg leading-snug">{a.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Faculty ──────────────────────────────────────────────────────────────────

const facultyList = [
  { name: 'Dr. Meera Pillai', subject: 'Principal', exp: '22 years', qual: 'PhD Education, Delhi University', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format&q=80' },
  { name: 'Mr. Rajesh Nair', subject: 'Mathematics', exp: '15 years', qual: 'M.Sc. Mathematics, IIT Delhi', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format&q=80' },
  { name: 'Ms. Sunita Kapoor', subject: 'Science', exp: '18 years', qual: 'M.Sc. Physics, Jamia Millia', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&auto=format&q=80' },
  { name: 'Mr. Arun Verma', subject: 'English', exp: '12 years', qual: 'MA English, Delhi University', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&auto=format&q=80' },
  { name: 'Ms. Priya Chandran', subject: 'Social Studies', exp: '9 years', qual: 'MA History, JNU', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format&q=80' },
  { name: 'Mr. Vivek Sharma', subject: 'Computer Science', exp: '7 years', qual: 'B.Tech CSE, NSIT', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format&q=80' },
];

export function WebsiteFaculty() {
  const [selected, setSelected] = useState<typeof facultyList[0] | null>(null);
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Meet The Team</p>
        <h1 className="font-display font-bold text-[40px] text-fg mb-3" style={{ letterSpacing: '-0.02em' }}>Our Faculty</h1>
        <p className="text-fg-muted max-w-xl mx-auto leading-relaxed">Dedicated educators with deep expertise, committed to holistic student development.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {facultyList.map((f) => (
          <button key={f.name} onClick={() => setSelected(f)}
            className="bg-surface border border-border-default rounded-[8px] p-5 flex flex-col items-center text-center hover:border-brand transition-colors group card-hover">
            <img src={f.img} alt={f.name} className="w-20 h-20 rounded-full object-cover mb-3 bg-elevated border-2 border-border-default group-hover:border-brand transition-colors" />
            <p className="text-[13px] font-semibold text-fg">{f.name}</p>
            <p className="text-[12px] text-brand font-semibold mt-0.5">{f.subject}</p>
            <p className="text-[11px] text-fg-muted mt-1">{f.exp} experience</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,31,24,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="bg-surface border border-border-default rounded-[20px] p-8 max-w-sm w-full animate-fade-up">
            <img src={selected.img} alt={selected.name} className="w-24 h-24 rounded-full object-cover mx-auto mb-4 bg-elevated" />
            <h3 className="font-display font-bold text-[22px] text-fg text-center" style={{ letterSpacing: '-0.02em' }}>{selected.name}</h3>
            <p className="text-brand font-semibold text-center text-[13px] mt-0.5">{selected.subject}</p>
            <div className="mt-5 bg-base rounded-[8px] p-4 flex flex-col gap-3">
              <div className="flex justify-between gap-4">
                <span className="text-[11px] text-fg-muted shrink-0">Qualification</span>
                <span className="text-[11px] text-fg font-semibold text-right">{selected.qual}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[11px] text-fg-muted">Experience</span>
                <span className="text-[11px] text-fg font-semibold">{selected.exp}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-5 h-10 rounded-[6px] bg-brand text-on-brand text-[13px] font-semibold hover:opacity-90 transition-opacity">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Facilities ───────────────────────────────────────────────────────────────

const facilities = [
  { title: 'Science Laboratories', desc: 'State-of-the-art Physics, Chemistry and Biology labs with modern equipment for hands-on learning.', img: 'https://images.unsplash.com/photo-1532094349884-543559242c27?w=600&h=400&fit=crop&auto=format&q=80', Icon: Microscope },
  { title: 'Sports Complex', desc: 'Indoor courts, outdoor fields, swimming pool, and a fully-equipped gymnasium for holistic fitness.', img: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=600&h=400&fit=crop&auto=format&q=80', Icon: Dumbbell },
  { title: 'Library & Resource Centre', desc: 'Over 12,000 books, e-journals, and a dedicated digital reading zone for students and staff.', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop&auto=format&q=80', Icon: BookOpen },
  { title: 'Computer Laboratory', desc: 'High-speed internet, 80 workstations, and latest software for coding, design, and research.', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&auto=format&q=80', Icon: Monitor },
  { title: 'Art & Music Rooms', desc: 'Dedicated studios for visual arts, classical music, and performing arts with professional instruments.', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop&auto=format&q=80', Icon: Palette },
  { title: 'Canteen & Nutrition', desc: 'Hygienic, nutritious meal options prepared fresh daily under a certified nutritionist\'s guidance.', img: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop&auto=format&q=80', Icon: UtensilsCrossed },
];

export function WebsiteFacilities() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Infrastructure</p>
        <h1 className="font-display font-bold text-[40px] text-fg mb-3" style={{ letterSpacing: '-0.02em' }}>Campus facilities</h1>
        <p className="text-fg-muted max-w-xl mx-auto leading-relaxed">Every infrastructure element is designed to foster curiosity, creativity, and comprehensive growth.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {facilities.map((f) => (
          <div key={f.title} className="bg-surface border border-border-default rounded-[8px] overflow-hidden hover:border-brand transition-colors group card-hover">
            <div className="relative h-44 overflow-hidden bg-elevated">
              <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 w-9 h-9 rounded-[6px] bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <f.Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.5}/>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display font-semibold text-[15px] text-fg mb-2">{f.title}</h3>
              <p className="text-[13px] text-fg-muted leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── About ────────────────────────────────────────────────────────────────────

const aboutValues = [
  { title: 'Our Mission', Icon: Target, content: 'To provide a safe, inclusive, and intellectually stimulating environment where every student is empowered to reach their fullest potential through quality education, character development, and innovation.' },
  { title: 'Our Vision', Icon: Telescope, content: 'To be a nationally recognized institution of academic excellence that cultivates lifelong learners, responsible citizens, and compassionate leaders who contribute positively to society.' },
  { title: 'Our Values', Icon: Scale, content: 'Integrity, Excellence, Respect, Inclusivity, Innovation. We instil these core values in every student through curriculum, co-curricular activities, and day-to-day conduct.' },
];

const contactItems = [
  { Icon: MapPin, label: 'Address', value: '12 School Road, Connaught Place, New Delhi – 110001' },
  { Icon: Phone, label: 'Phone', value: '+91 11 2345 6789' },
  { Icon: Mail, label: 'Email', value: 'info@dps-delhi.edu.in' },
  { Icon: Clock, label: 'Office Hours', value: 'Mon – Sat, 8:00 AM – 4:00 PM' },
];

export function WebsiteAbout() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Est. 1982</p>
        <h1 className="font-display font-bold text-[40px] text-fg mb-3" style={{ letterSpacing: '-0.02em' }}>About the school</h1>
        <p className="text-fg-muted max-w-xl mx-auto leading-relaxed">Founded in 1982, Delhi Public School has been a beacon of quality education for over four decades.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5 mb-14">
        {aboutValues.map((item) => (
          <div key={item.title} className="bg-surface border border-border-default rounded-[8px] p-6">
            <div className="w-10 h-10 rounded-[6px] bg-brand/12 border border-brand/50 flex items-center justify-center mb-5">
              <item.Icon className="w-5 h-5 text-brand" strokeWidth={1.5}/>
            </div>
            <h3 className="font-display font-semibold text-[17px] text-fg mb-3">{item.title}</h3>
            <p className="text-[13px] text-fg-muted leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>

      {/* Contact & Map */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-surface border border-border-default rounded-[8px] p-6">
          <h3 className="font-display font-semibold text-[17px] text-fg mb-5">Contact & Address</h3>
          {contactItems.map((c) => (
            <div key={c.label} className="flex items-start gap-3 mb-4 last:mb-0">
              <div className="w-8 h-8 rounded-[8px] bg-elevated flex items-center justify-center shrink-0 mt-0.5">
                <c.Icon className="w-4 h-4 text-fg-muted" strokeWidth={1.5}/>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-fg-muted">{c.label}</p>
                <p className="text-[13px] text-fg mt-0.5">{c.value}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Map placeholder */}
        <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
          <div className="h-full min-h-[240px] flex flex-col items-center justify-center gap-4 p-8" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #E3EAE6 100%)' }}>
            <div className="w-14 h-14 rounded-[4px] bg-brand/20 border border-brand/50 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-brand" strokeWidth={1.5}/>
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-fg">Map placeholder</p>
              <p className="text-[12px] text-fg-muted mt-1">12 School Road, New Delhi</p>
            </div>
            <a href="#" className="text-[12px] text-brand font-semibold border border-brand/50 px-4 py-2 rounded-[4px] hover:bg-brand/10 transition-colors flex items-center gap-1.5">
              Open in Maps <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notice Board ─────────────────────────────────────────────────────────────

const allNotices = [
  { title: 'Annual Day Celebration — Save the Date', body: 'DPS is proud to announce its Annual Day on 25 January 2025. All parents are cordially invited.', category: 'Event', date: '18 Dec 2024' },
  { title: 'Term 2 Fee Payment — Final Reminder', body: 'Final reminder: Term 2 fees due by 31 December 2024. Pay via EduPortal parent app.', category: 'Finance', date: '15 Dec 2024' },
  { title: 'Winter Vacation Notice', body: 'School closed from 22 December 2024 to 5 January 2025. Reopens 6 January 2025.', category: 'Holiday', date: '12 Dec 2024' },
  { title: 'Half-Yearly Exam Timetable Released', body: 'Timetable for Classes I–XII is available on the school website and EduPortal app.', category: 'Academic', date: '10 Dec 2024' },
  { title: 'Sports Day Trials — 20 December', body: 'Students interested in Annual Sports Day events must register with the Sports department.', category: 'Event', date: '8 Dec 2024' },
  { title: 'Parent-Teacher Meeting — 14 December', body: 'PTM for Classes VI–X scheduled on 14 December from 10 AM – 1 PM. Attendance mandatory.', category: 'Academic', date: '5 Dec 2024' },
];

const noticeCats = ['All', 'Academic', 'Finance', 'Event', 'Holiday'];

export function WebsiteNotices() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? allNotices : allNotices.filter(n => n.category === cat);
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Announcements</p>
        <h1 className="font-display font-bold text-[40px] text-fg mb-3" style={{ letterSpacing: '-0.02em' }}>Notice Board</h1>
        <p className="text-fg-muted leading-relaxed">Stay updated with the latest announcements from school administration.</p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center mb-8">
        {noticeCats.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 h-9 rounded-[4px] text-[13px] font-semibold transition-all ${cat === c ? 'bg-brand text-on-brand' : 'bg-surface border border-border-default text-fg-muted hover:text-fg'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((n) => (
          <div key={n.title} className="bg-surface border border-border-default rounded-[8px] p-5 hover:border-brand transition-colors cursor-pointer group card-hover">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-[4px] bg-brand/12 text-brand border border-brand/50">{n.category}</span>
                  <span className="text-[11px] text-fg-muted tabular-nums">{n.date}</span>
                </div>
                <h4 className="font-display font-semibold text-[15px] text-fg mb-1 group-hover:text-brand transition-colors leading-snug">{n.title}</h4>
                <p className="text-[13px] text-fg-muted leading-relaxed">{n.body}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-fg-muted shrink-0 mt-1.5 group-hover:text-brand transition-colors" strokeWidth={1.5}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
