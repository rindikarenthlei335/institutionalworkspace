import { SchoolTemplate, PlanTier } from '../types';

export const TIER_CONFIG: Record<PlanTier, { name: string; price: number; yearlyPrice: number; templateCount: number; label: string; badge?: string }> = {
  basic: {
    name: 'Basic',
    price: 1499,
    yearlyPrice: 14990,
    templateCount: 1,
    label: '1 Template (Heritage Classic)',
  },
  essential: {
    name: 'Essential',
    price: 3999,
    yearlyPrice: 39990,
    templateCount: 4,
    label: '4 Templates (Includes Basic + 3 Premium)',
    badge: 'Most Popular'
  },
  pro: {
    name: 'Pro',
    price: 8000,
    yearlyPrice: 79990,
    templateCount: 10,
    label: '10 Templates (Includes Essential + 6 Enterprise)',
    badge: 'Executive Suite'
  },
  pro_plus: {
    name: 'Pro+ / Ultimate',
    price: 9999,
    yearlyPrice: 99990,
    templateCount: 15,
    label: '15 Templates (Complete Architecture Suite)',
    badge: 'All-Inclusive'
  }
};

export const MASTER_TEMPLATES: SchoolTemplate[] = [
  // ==================== TIER 1: BASIC (1 Template - Available in ALL tiers) ====================
  {
    id: 'template-1-trident',
    code: 'T01',
    name: 'Trident Public Classic Campus',
    category: 'K-12 Day & Boarding School',
    minTier: 'basic',
    tierLabel: 'Basic & Above (₹1,499)',
    tierPrice: '₹1,499 / mo',
    previewImage: '/templates/template-1-trident.png',
    description: 'Prestigious Indian school campus architecture with lush front lawns, smart classroom facility ticker, CBSE affiliation stats, circular holistic growth badge, yellow school transport buses, and science lab showcase.',
    accentColor: '#163A2B',
    themeStyle: {
      primaryHex: '#163A2B',
      secondaryHex: '#D4AF37',
      bgAccent: '#F3F6F4',
      tagline: 'Inspiring Excellence, Building Futures'
    },
    heroTitle: 'Inspiring Excellence, Building Futures',
    heroSubtitle: 'At Trident Public School, we nurture young minds with strong values, modern learning, and boundless opportunities.',
    heroBadge: 'Admissions Open for Academic Year 2025–26',
    heroCtaText: 'Admission Open',
    features: [
      'Facility ticker: Smart Classrooms, Experienced Faculty, Safe Transport, Holistic Growth, Modern Labs',
      'CBSE Affiliation, 1:20 Teacher Ratio, 20+ Years, 100% Commitment',
      'Explore. Learn. Excel. 4-card grid + Circular "Holistic Growth" photo badge',
      'World-Class Infrastructure: Smart Classrooms, Science Labs, Library, GPS School Bus',
      'Learning Beyond Classrooms student activity gallery'
    ],
    sections: ['Hero Campus Facade', 'Facilities Ribbon', 'About & CBSE Stats', 'Curriculum Grid', 'Infrastructure Gallery', 'Enquire Banner'],
    stats: [
      { label: 'Affiliation', value: 'CBSE' },
      { label: 'Teacher Ratio', value: '1:20' },
      { label: 'Excellence', value: '20+ Yrs' },
      { label: 'Commitment', value: '100%' }
    ]
  },

  // ==================== TIER 2: ESSENTIAL (Templates 2, 3, 4 - Total 4 in Essential) ====================
  {
    id: 'template-2-brightfuture',
    code: 'T02',
    name: 'Bright Future International Academy',
    category: 'International Baccalaureate & Cambridge',
    minTier: 'essential',
    tierLabel: 'Essential & Above (₹3,999)',
    tierPrice: '₹3,999 / mo',
    previewImage: '/templates/template-2-brightfuture.png',
    description: 'Prestigious navy blue & warm gold international school aesthetic. Smiling students in blazer uniforms with school ties, "A Legacy of Excellence Since 1998" golden medal, 5-stage age progression, and 98% university acceptance.',
    accentColor: '#0F2C59',
    themeStyle: {
      primaryHex: '#0F2C59',
      secondaryHex: '#E5A93C',
      bgAccent: '#F4F7FB',
      tagline: 'Inspiring Minds. Shaping Futures.'
    },
    heroTitle: 'Inspiring Minds. Shaping Futures.',
    heroSubtitle: 'A nurturing environment where students learn, grow, and thrive to become tomorrow\'s global leaders.',
    heroBadge: 'A Legacy of Excellence Since 1998',
    heroCtaText: 'Discover Our School',
    features: [
      'Smiling students in classic navy blazers and striped school ties',
      'Golden medal badge: A Legacy of Excellence Since 1998',
      '5 Age-staged Program Cards: Early Years (3-5), Primary (1-5), Middle (6-8), High School (9-12), Co-Curricular',
      'Navy leadership pill bar: Holistic Education, Expert Educators, Innovative Learning, Global Perspective, Safe Campus',
      'Dark navy executive stats banner: 25+ Years, 1500+ Students, 120+ Teachers, 100+ Awards, 98% University Acceptance'
    ],
    sections: ['Blazer Uniform Hero', 'Pill Highlights Bar', 'Character For Life Story', '5-Stage Programs', 'Executive Stat Banner', 'Begin Journey CTA'],
    stats: [
      { label: 'Experience', value: '25+ Yrs' },
      { label: 'Enrolled', value: '1,500+' },
      { label: 'Faculty', value: '120+' },
      { label: 'Uni Acceptance', value: '98%' }
    ]
  },
  {
    id: 'template-3-unipix',
    code: 'T03',
    name: 'Unipix Collegiate & Higher Secondary',
    category: 'Higher Secondary, Junior College & University',
    minTier: 'essential',
    tierLabel: 'Essential & Above (₹3,999)',
    tierPrice: '₹3,999 / mo',
    previewImage: '/templates/template-3-unipix.png',
    description: 'Vibrant crimson red & gold university collegiate layout. Graduation caps celebration in the air, undergraduate & graduate degree program cards, campus life photography mosaic, and tuition fee calculator.',
    accentColor: '#7A1C29',
    themeStyle: {
      primaryHex: '#7A1C29',
      secondaryHex: '#D4AF37',
      bgAccent: '#FAF4F5',
      tagline: 'Unleashing Potential Fostering Excellence'
    },
    heroTitle: 'Unleashing Potential Fostering Excellence',
    heroSubtitle: 'Knowledge meets innovation. Transforming curious students into world-class researchers, thinkers, and ethical leaders.',
    heroBadge: 'Top 10 Colleges That Create Futures',
    heroCtaText: 'View Our Programs',
    features: [
      'Graduation caps throwing celebration hero photography',
      'Crimson stats bar: 90% Post-Graduation Success, Top 10 Colleges, No. 1 in Nation R&D',
      'Academics 3-Column Pillar: Undergraduate, Graduate (Highlighted Crimson Card), Lifelong Learning',
      'Campus Life visual mosaic: Student Life, Arts & Culture, Recreation & Wellness',
      'Tuition Fees schedule and scholarship financial aid explorer'
    ],
    sections: ['Graduation Cap Toss Hero', 'Collegiate Stats Banner', 'About University & Mission', '3-Pillar Academic Grid', 'Campus Life Mosaic', 'Feedback Carousel'],
    stats: [
      { label: 'Success Rate', value: '90%' },
      { label: 'College Rank', value: 'Top 10' },
      { label: 'National R&D', value: 'No. 1' },
      { label: 'Scholarships', value: '₹2.4 Cr' }
    ]
  },
  {
    id: 'template-4-nuova',
    code: 'T04',
    name: 'Nuova Modern Architectural Academy',
    category: 'Modern Progressive & Architectural Academy',
    minTier: 'essential',
    tierLabel: 'Essential & Above (₹3,999)',
    tierPrice: '₹3,999 / mo',
    previewImage: '/templates/template-4-nuova.png',
    description: 'Sage green & off-white modern minimalist design. Asymmetric curved photo frames, clock tower architecture, graduation team photo, 3 core benefit cards, interactive video modal, and admissions FAQ accordion.',
    accentColor: '#2B5844',
    themeStyle: {
      primaryHex: '#2B5844',
      secondaryHex: '#8DA89A',
      bgAccent: '#F3F7F5',
      tagline: 'Turn Your Ambition into Achievement'
    },
    heroTitle: 'Turn Your Ambition into Achievement',
    heroSubtitle: 'Empowering students with world-class education, innovation, and boundless global opportunities in a serene modern campus.',
    heroBadge: 'Since 1990 · Nuova Edile Costanza',
    heroCtaText: 'Apply Now',
    features: [
      'Modern sage green palette with sleek asymmetric photo frames',
      'Dual stat badges: 99% Success Rate, 30K Total Students enrolled',
      'Story block: "The right opportunity can turn dreams into limitless potential"',
      '3 Core Solution cards: Inspiring Student Life, Education Affordability, Core-level Academics',
      'Marco Selene Ceremony video highlight and admissions FAQ accordion'
    ],
    sections: ['Modern Curves Hero', 'Graduation Team Story', 'Why Choose Us 3-Cards', 'Video Highlight Reel', 'Community Testimonials', 'Admissions FAQ'],
    stats: [
      { label: 'Success Rate', value: '99%' },
      { label: 'Total Alumni', value: '30,000+' },
      { label: 'Job Related', value: '95%' },
      { label: 'Daily Active', value: '30%' }
    ]
  },

  // ==================== TIER 3: PRO (Templates 5 to 10 - Total 10 in Pro) ====================
  {
    id: 'template-5-xavier',
    code: 'T05',
    name: 'St. Xavier\'s Heritage Residential School',
    category: 'Heritage Anglo-Indian & Residential Boarding',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-1-trident.png',
    description: 'Victorian red-brick architecture with bell tower, Latin motto, 4-house residential dormitory system (Red, Blue, Green, Gold), and traditional boarding pastoral care.',
    accentColor: '#8B1E1E',
    themeStyle: { primaryHex: '#8B1E1E', secondaryHex: '#D4AF37', bgAccent: '#FBF5F5', tagline: 'Fortiter in Re, Suaviter in Modo' },
    heroTitle: 'Tradition, Discipline & Moral Fortitude',
    heroSubtitle: 'Over 100 years of boarding excellence shaping leaders for society and the nation.',
    heroBadge: 'Est. 1912 · Anglo-Indian Heritage',
    heroCtaText: 'Boarding Admissions',
    features: ['Victorian heritage clock tower layout', '4-House Residential Dormitory scoreboard', 'Pastoral care & dining hall schedule', 'Annual inter-house athletic shield'],
    sections: ['Heritage Tower Hero', 'House System Scoreboard', 'Boarding Life', 'Pastoral Care', 'Alumni Roll of Honor'],
    stats: [{ label: 'Heritage', value: '112 Yrs' }, { label: 'Hostellers', value: '650' }, { label: 'Houses', value: '4' }, { label: 'Distinctions', value: '99%' }]
  },
  {
    id: 'template-6-apex-stem',
    code: 'T06',
    name: 'Apex STEM & Robotics Innovation School',
    category: 'STEM, Robotics & Coding High School',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-4-nuova.png',
    description: 'Futuristic slate & glowing cyan tech interface. 3D robotics simulation showcase, AI curriculum, coding hackathon trophies, and Olympiad leaderboards.',
    accentColor: '#0EA5E9',
    themeStyle: { primaryHex: '#0F172A', secondaryHex: '#0EA5E9', bgAccent: '#0B1120', tagline: 'Coding the Future of Tomorrow' },
    heroTitle: 'Pioneering STEM, Robotics & Artificial Intelligence',
    heroSubtitle: 'Equipping young engineers and innovators with cutting-edge maker labs, Python programming, and satellite design.',
    heroBadge: 'National Robotics Champions 2025',
    heroCtaText: 'Explore STEM Lab',
    features: ['Dark mode futuristic tech interface', 'Live IoT maker lab telemetry feed', 'Python & Robotics syllabus roadmap', 'International Olympiad medal registry'],
    sections: ['Cyberpunk STEM Hero', 'Robotics Showcase', 'Coding Curriculum', 'Hackathon Leaderboard', 'Patents & Innovations'],
    stats: [{ label: 'Robotics Labs', value: '4' }, { label: 'Patents Filed', value: '18' }, { label: 'Code Hours', value: '50K+' }, { label: 'Medals Won', value: '84' }]
  },
  {
    id: 'template-7-greenwood',
    code: 'T07',
    name: 'Greenwood Montessori & Kindergarten',
    category: 'Early Childhood & Primary School',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-2-brightfuture.png',
    description: 'Playful rainbow pastel design with soft rounded cards, phonics learning tree, joyful activity illustrations, and parent live-cam transparency.',
    accentColor: '#EA580C',
    themeStyle: { primaryHex: '#059669', secondaryHex: '#F59E0B', bgAccent: '#FFFBEB', tagline: 'Where Joyful Learning Begins' },
    heroTitle: 'Nurturing Curiosity, Play & Creative Wonder',
    heroSubtitle: 'A safe, colorful haven where early learners discover the world through hands-on Montessori activities and storytelling.',
    heroBadge: 'Certified AMI Montessori Environment',
    heroCtaText: 'Schedule Campus Tour',
    features: ['Soft rounded kid-friendly pastel visual design', 'Montessori sensorial apparatus explorer', 'Daily organic nutrition menu calendar', 'Secure parent app live classroom updates'],
    sections: ['Playful Wonder Hero', 'Sensory Curriculum', 'Daily Routine & Meals', 'Safety First Assurance', 'Enroll Little Ones'],
    stats: [{ label: 'Student-Teacher', value: '8:1' }, { label: 'Outdoor Parks', value: '3' }, { label: 'Play Kits', value: '500+' }, { label: 'Happy Kids', value: '320' }]
  },
  {
    id: 'template-8-olympian',
    code: 'T08',
    name: 'Olympian Elite Sports & Athletics Academy',
    category: 'Sports Excellence & Physical Training',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-3-unipix.png',
    description: 'High-energy electric orange & navy sports theme. Olympic-size turf highlights, athlete fitness biomechanics, tournament records, and trophy cabinet.',
    accentColor: '#F97316',
    themeStyle: { primaryHex: '#1E293B', secondaryHex: '#F97316', bgAccent: '#FFF7ED', tagline: 'Champions in Mind, Body & Character' },
    heroTitle: 'Forging National & Olympic Champions',
    heroSubtitle: 'Integrating rigorous academic schooling with international sports training, turf arenas, and sports medicine.',
    heroBadge: '14 National Gold Medals in 2024–25',
    heroCtaText: 'Sports Trials 2025',
    features: ['High-contrast athletic tournament styling', 'Olympic swimming pool & FIFA turf specs', 'Sports nutrition & physiotherapy center', 'Annual sports trial registration portal'],
    sections: ['Arena Floodlights Hero', 'Sports Facilities Tour', 'Athlete Roster', 'Tournament Trophies', 'Trials Registration'],
    stats: [{ label: 'Acre Sports Complex', value: '25' }, { label: 'National Medals', value: '48' }, { label: 'Olympic Coaches', value: '12' }, { label: 'Sports Disciplines', value: '16' }]
  },
  {
    id: 'template-9-oxford-grammar',
    code: 'T09',
    name: 'Oxford Classical Grammar & Humanities',
    category: 'Classical Literature & Liberal Arts',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-1-trident.png',
    description: 'Timeless parchment & dark timber styling with elegant serif fonts. Parliamentary debate society roster, Shakespearean theater club, and classical philosophy.',
    accentColor: '#4A3B32',
    themeStyle: { primaryHex: '#3E2723', secondaryHex: '#C5A059', bgAccent: '#FAF8F5', tagline: 'Veritas, Eloquentia et Sapientia' },
    heroTitle: 'Eloquent Minds, Classical Arts & Critical Thought',
    heroSubtitle: 'Inspiring mastery of rhetoric, literature, philosophy, and history to develop cultured and thoughtful citizens.',
    heroBadge: 'National Parliamentary Debate Champions',
    heroCtaText: 'Explore Humanities',
    features: ['Classical parchment paper texture & typography', 'Great Books curriculum reading list', 'Annual Shakespearean Festival gallery', 'Model Parliament & Debate registry'],
    sections: ['Classical Library Hero', 'Great Books Reading List', 'Debate Society', 'Literary Journal', 'Admissions Inquiry'],
    stats: [{ label: 'Debate Titles', value: '22' }, { label: 'Library Volumes', value: '45,000' }, { label: 'Student Essays', value: '1,200+' }, { label: 'Ivy Admits', value: '38%' }]
  },
  {
    id: 'template-10-vanguard-hybrid',
    code: 'T10',
    name: 'Vanguard Global Hybrid & Digital Academy',
    category: 'Virtual & Hybrid Smart School',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-4-nuova.png',
    description: 'Modern glassmorphic virtual academy layout. Real-time class broadcast status, interactive LMS timetable, student cloud dashboard, and VR virtual campus tours.',
    accentColor: '#6366F1',
    themeStyle: { primaryHex: '#1E1B4B', secondaryHex: '#818CF8', bgAccent: '#EEF2FF', tagline: 'Borderless Education Anytime, Anywhere' },
    heroTitle: 'World-Class Hybrid Learning Without Boundaries',
    heroSubtitle: 'Combining top-tier on-campus laboratory sessions with flexible digital live streaming from anywhere on earth.',
    heroBadge: 'NextGen Cloud Campus 3.0',
    heroCtaText: 'Join Virtual Open House',
    features: ['Glassmorphic modern UI with real-time stream status', 'Interactive weekly timetable with 1-click Zoom links', 'Student digital homework submission preview', 'VR 360-degree virtual lab immersion'],
    sections: ['Hybrid Stream Hero', 'Live Schedule Timetable', 'Cloud LMS Features', 'Global Student Map', 'Enroll Digitally'],
    stats: [{ label: 'Countries Connected', value: '28' }, { label: 'Online Lectures', value: '4,500+' }, { label: 'Uptime', value: '99.9%' }, { label: 'Active Students', value: '2,800' }]
  },

  // ==================== TIER 4: PRO+ / ULTIMATE (Templates 11 to 15 - Total 15 in Pro+) ====================
  {
    id: 'template-11-ivy-league',
    code: 'T11',
    name: 'Cambridge Ivy League Preparatory',
    category: 'Elite Ivy League Collegiate',
    minTier: 'pro_plus',
    tierLabel: 'Pro+ / Ultimate (₹9,999)',
    tierPrice: '₹9,999 / mo',
    previewImage: '/templates/template-2-brightfuture.png',
    description: 'Deep navy & platinum gold prestige layout. Harvard/Oxbridge admission records, Rhodes scholar alumni spotlight, and peer-reviewed faculty research.',
    accentColor: '#1E3A8A',
    themeStyle: { primaryHex: '#172554', secondaryHex: '#E2E8F0', bgAccent: '#F8FAFC', tagline: 'The Gateway to World-Class Universities' },
    heroTitle: 'Prestige, Intellect & Global Ivy Admissions',
    heroSubtitle: 'Dedicated college counseling sending graduates to Harvard, Oxford, MIT, Stanford, and premier institutions worldwide.',
    heroBadge: '94% Ivy & Russell Group Placement',
    heroCtaText: 'College Counseling Track',
    features: ['Ultra-premium collegiate crest & typography', 'College placement track record by university', 'International AP & IB Diploma course finder', 'Faculty research publication archive'],
    sections: ['Ivy Crest Hero', 'University Placement Grid', 'Counseling Program', 'Rhodes Scholars Alumni', 'Exclusive Admissions'],
    stats: [{ label: 'Ivy League Admits', value: '142' }, { label: 'Avg SAT Score', value: '1520' }, { label: 'Scholarship Total', value: '$8.2M' }, { label: 'Counselor Ratio', value: '15:1' }]
  },
  {
    id: 'template-12-st-pauls-convent',
    code: 'T12',
    name: 'St. Paul\'s Christian Missionary Convent',
    category: 'Christian Convent & Church Educational Mission',
    minTier: 'pro_plus',
    tierLabel: 'Pro+ / Ultimate (₹9,999)',
    tierPrice: '₹9,999 / mo',
    previewImage: '/templates/template-1-trident.png',
    description: 'Serene forest convent green & gold with chapel bell iconography. Daily Scripture memory calendar, cathedral choir ministry, and rural charitable missions.',
    accentColor: '#1B4332',
    themeStyle: { primaryHex: '#1B4332', secondaryHex: '#D8B4E2', bgAccent: '#F4F9F6', tagline: 'Walk in Truth, Love & Service' },
    heroTitle: 'Grounded in Faith, Excellence & Loving Service',
    heroSubtitle: 'A sanctuary of peaceful learning rooted in Christian values, moral integrity, choral music, and service to humanity.',
    heroBadge: 'Diocese of Northeast India · Est. 1954',
    heroCtaText: 'Convent Admissions',
    features: ['Peaceful sanctuary aesthetic with cathedral cross motif', 'Daily Scripture & character values calendar', 'Choir & orchestral music performance schedule', 'Community welfare & rural education outreach'],
    sections: ['Sanctuary Bells Hero', 'Faith & Character Values', 'Cathedral Choir', 'Community Outreach', 'Convent Enquiries'],
    stats: [{ label: 'Years Serving', value: '71' }, { label: 'Sisters & Faculty', value: '64' }, { label: 'Charity Drives', value: '12 / yr' }, { label: 'Pass Rate', value: '100%' }]
  },
  {
    id: 'template-13-polytechnic',
    code: 'T13',
    name: 'Polytechnic & Vocational Technical Institute',
    category: 'Industrial & Technical Skill Institute',
    minTier: 'pro_plus',
    tierLabel: 'Pro+ / Ultimate (₹9,999)',
    tierPrice: '₹9,999 / mo',
    previewImage: '/templates/template-3-unipix.png',
    description: 'Industrial amber & carbon steel layout. CNC engineering workshop blueprints, ITI diploma trade catalog, and direct corporate recruitment partnerships.',
    accentColor: '#D97706',
    themeStyle: { primaryHex: '#27272A', secondaryHex: '#D97706', bgAccent: '#FAFAFA', tagline: 'Mastering Trades, Building Industry' },
    heroTitle: 'Practical Engineering & Industrial Trades',
    heroSubtitle: 'Hands-on technical diploma programs in Mechatronics, Automotive, Electrical Systems, Civil Cad, and Software Tools.',
    heroBadge: '100% Industry Placement Assurance',
    heroCtaText: 'View Diploma Courses',
    features: ['Industrial schematic blueprints & technical design', 'Workshop machinery & safety certification roster', 'Corporate apprenticeship tie-ups with Tata, L&T, Maruti', 'Direct job campus placement register'],
    sections: ['Workshop Machinery Hero', 'Diploma Trade Matrix', 'Corporate Partners', 'Apprenticeship Log', 'Apply for Technical Batch'],
    stats: [{ label: 'Trade Workshops', value: '8' }, { label: 'Corporate Partners', value: '45' }, { label: 'Placement Rate', value: '96%' }, { label: 'Avg Salary', value: '₹4.8 LPA' }]
  },
  {
    id: 'template-14-gurukul',
    code: 'T14',
    name: 'Vedic Gurukul Traditional Heritage Institute',
    category: 'Traditional Heritage & Cultural Gurukul',
    minTier: 'pro_plus',
    tierLabel: 'Pro+ / Ultimate (₹9,999)',
    tierPrice: '₹9,999 / mo',
    previewImage: '/templates/template-1-trident.png',
    description: 'Warm saffron & natural timber earthy palette. Yoga & sunrise pranayama routine, Sanskrit shloka audio player, Vedic mathematics, and herbal botanical gardens.',
    accentColor: '#C2410C',
    themeStyle: { primaryHex: '#9A3412', secondaryHex: '#FDBA74', bgAccent: '#FFF7ED', tagline: 'Ancient Wisdom for the Modern Age' },
    heroTitle: 'Ancient Wisdom, Holistic Health & Vedic Science',
    heroSubtitle: 'Integrating traditional Indian knowledge systems, yoga, and meditation with standard modern school curriculums.',
    heroBadge: 'Shastra & Modern Sciences Integrated',
    heroCtaText: 'Gurukul Admissions',
    features: ['Earthy terracotta & saffron spiritual palette', 'Daily Dinacharya sunrise schedule & yoga sessions', 'Vedic Mathematics speed calculation syllabus', 'Medicinal herbal plant botany garden tour'],
    sections: ['Sunrise Ashram Hero', 'Dinacharya Schedule', 'Vedic Math & Shastra', 'Botanical Herbal Garden', 'Gurukul Onboarding'],
    stats: [{ label: 'Shloka Mastery', value: '500+' }, { label: 'Acre Eco Ashram', value: '40' }, { label: 'Daily Meditation', value: '60 min' }, { label: 'Alumni Achievers', value: '1,800+' }]
  },
  {
    id: 'template-15-diplomatic',
    code: 'T15',
    name: 'International Diplomatic World School',
    category: 'Diplomatic & United Nations Model School',
    minTier: 'pro_plus',
    tierLabel: 'Pro+ / Ultimate (₹9,999)',
    tierPrice: '₹9,999 / mo',
    previewImage: '/templates/template-2-brightfuture.png',
    description: 'United Nations azure blue & marble styling. Multi-language flag selector (English, French, Mizo, Spanish, Mandarin), Model UN conference calendar, and diplomatic delegations.',
    accentColor: '#0284C7',
    themeStyle: { primaryHex: '#0C4A6E', secondaryHex: '#38BDF8', bgAccent: '#F0F9FF', tagline: 'Diplomacy, Dialogue & Global Peace' },
    heroTitle: 'Educating Ambassadors for Global Peace & Progress',
    heroSubtitle: 'Cultivating future diplomats, international policy leaders, and multilingual scholars equipped to solve planetary challenges.',
    heroBadge: 'Official Model United Nations Secretariat',
    heroCtaText: 'International Admissions',
    features: ['United Nations diplomatic blue & crisp marble aesthetic', 'Multi-language flag switcher and translation keys', 'Model UN Conference committee archives & resolutions', 'Youth Climate & Human Rights forum gallery'],
    sections: ['UN Assembly Hero', 'Model UN Secretariat', 'Diplomatic Languages', 'Global Delegations', 'Diplomatic Enrollment'],
    stats: [{ label: 'Member Nationalities', value: '34' }, { label: 'Languages Taught', value: '6' }, { label: 'UN Resolutions', value: '52' }, { label: 'MUN Trophies', value: '28' }]
  }
];

// Helper to check if a template is unlocked for a given user subscription plan
export function isTemplateUnlocked(templateTier: PlanTier, currentPlan: PlanTier): boolean {
  const tierWeight: Record<PlanTier, number> = {
    basic: 1,
    essential: 2,
    pro: 3,
    pro_plus: 4
  };
  return tierWeight[currentPlan] >= tierWeight[templateTier];
}

// Get all templates unlocked for a given subscription plan
export function getUnlockedTemplates(plan: PlanTier): SchoolTemplate[] {
  return MASTER_TEMPLATES.filter(t => isTemplateUnlocked(t.minTier, plan));
}
