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

  // ==================== TIER 3: PRO (Templates 5 to 10 - Total 10 in Pro - ₹8,000/mo) ====================
  {
    id: 'template-5-eudaimonia',
    code: 'T05',
    name: 'Eudaimonia Prestigious Collegiate',
    category: 'Collegiate & Classical University',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-5-eudaimonia.png',
    description: 'Collegiate architecture with Romanesque brick arches, "Most reputed educational institution in Booston", founder\'s message from Alexis D. Dowson, circular "Since 1990" badge, 3 academic pillars in deep maroon ribbon, and dated announcements news feeds.',
    accentColor: '#5C1324',
    themeStyle: {
      primaryHex: '#5C1324',
      secondaryHex: '#D4AF37',
      bgAccent: '#FBF8F5',
      tagline: 'Most Reputed Educational Institution in Booston'
    },
    heroTitle: 'Most reputed educational institution in Booston',
    heroSubtitle: 'We have focused on generating new knowledge and promoting critical thinking amongst our students, graduating more than 7,000 young men and women.',
    heroBadge: 'Since 1990 · Quality Education',
    heroCtaText: 'Apply Now →',
    features: [
      'Romanesque brick collegiate arches and walking campus grounds',
      'Message from the main founder (Alexis D. Dowson) with circular "Since 1990" badge',
      'Deep maroon ribbon: "One of the largest, most diverse universities in the nyc"',
      '3 Pillar solution cards: Education Affordability, Core level academics, Inspiring Student Life',
      'Announcements & news feeds with calendar date stamps (01 Jan)',
      'Academics expertise: Arts & Humanities, Social Sciences, Business, Science & Tech, Engineering',
      'Direct Apply for Admission box with student counselor avatar'
    ],
    sections: ['Collegiate Arch Hero', 'Founder Message Block', 'Diversity Ribbon & 3 Pillars', 'Announcements & News Feeds', 'Academics Expertise List', 'Apply for Admission Box'],
    stats: [
      { label: 'Employability', value: '98%' },
      { label: 'Diversity', value: '16%' },
      { label: 'Campuses', value: '3' },
      { label: 'Graduates', value: '7,000+' }
    ]
  },
  {
    id: 'template-6-eduka',
    code: 'T06',
    name: 'Eduka Modern Bright Academy',
    category: 'Modern Career & Higher Secondary Academy',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-6-eduka.png',
    description: 'Vibrant modern teal and warm amber aesthetic. 4 floating numbered cards (01 Scholarship, 02 Lecturers, 03 Library, 04 Affordable), "30 Years of Quality Service" badge, teal stats ribbon (500+ Courses, 1900+ Students, 750+ Lecturers, 30+ Awards), and interactive course catalog with star ratings.',
    accentColor: '#0D9488',
    themeStyle: {
      primaryHex: '#0D9488',
      secondaryHex: '#F59E0B',
      bgAccent: '#F0FDFA',
      tagline: 'Start Your Beautiful And Bright Future'
    },
    heroTitle: 'Start Your Beautiful And Bright Future',
    heroSubtitle: 'Welcome to Eduka! Where modern education inspires young minds to achieve limitless global opportunities with expert faculty and world-class facilities.',
    heroBadge: 'Welcome to Eduka! · 30 Years of Service',
    heroCtaText: 'Discover More →',
    features: [
      '4 Floating numbered cards: 01 Scholarship Facility, 02 Skilled Lecturers, 03 Book Library Facility, 04 Affordable Price',
      'About Us collage: "Our Edukation System Inspires You More" with "30 Years of Quality Service" orange badge',
      'Vibrant Teal Stats Banner: 500 Total Courses, 1900+ Students, 750 Skilled Lecturers, 30 Win Awards',
      'Course Catalog cards with star ratings (4.8), lessons count, and category tags (Drama, Design, Science)',
      'Direct call hotline (+2 123 654 7898) and Apply Now prompt'
    ],
    sections: ['Bright Hero Banner', '01-04 Floating Cards', 'About Us Multi-Frame Collage', 'Teal & Orange Stats Bar', 'Course Showcase Grid', 'Upcoming Events & Video'],
    stats: [
      { label: 'Total Courses', value: '500+' },
      { label: 'Students', value: '1,900+' },
      { label: 'Lecturers', value: '750+' },
      { label: 'Awards Won', value: '30+' }
    ]
  },
  {
    id: 'template-7-edugate',
    code: 'T07',
    name: 'Edugate Online & Skills Institute',
    category: 'Digital Learning, STEM & Distance Academy',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-7-edugate.png',
    description: 'Modern electric blue and vibrant yellow online education portal. "EDUCATE YOURSELF - Unlock your potential with the best online courses", bright course cards with progress bars (Digital Marketing, Coding, Environmental Studies), student stories, and education blog.',
    accentColor: '#0284C7',
    themeStyle: {
      primaryHex: '#0284C7',
      secondaryHex: '#FBBF24',
      bgAccent: '#F0F9FF',
      tagline: 'Educate Yourself · Unlock Your Potential'
    },
    heroTitle: 'EDUCATE YOURSELF – Unlock Your Potential',
    heroSubtitle: 'Unlock your potential with the best online courses, certified mentor tracks, and career-oriented skill pathways.',
    heroBadge: 'Interactive Skill Tracks & Certificates',
    heroCtaText: 'Enroll Now',
    features: [
      'Electric blue hero with classroom chalkboard photography & bold yellow [ENROLL NOW] CTA',
      'Our Courses cards with percentage progress meters: Digital Marketing (45%), Coding for Beginners (70%), Environmental Studies (30%)',
      'Student Stories spotlight (Lisa Bocker testimonial) with verified student badge',
      'Education Blog cards: Benefits of Lifelong Learning & Tips for Effective Online Study',
      'Vibrant sunflower yellow community banner: "Join our community – Enrich your learning today!"'
    ],
    sections: ['Classroom Hero with Yellow CTA', 'Course Cards with Progress Bars', 'Student Stories Spotlight', 'Education Blog Articles', 'Community Join Box'],
    stats: [
      { label: 'Active Learners', value: '12K+' },
      { label: 'Course Completion', value: '94%' },
      { label: 'Skill Tracks', value: '45+' },
      { label: 'Mentor Rating', value: '4.9/5' }
    ]
  },
  {
    id: 'template-8-qeducato',
    code: 'T08',
    name: 'Qeducato Professional Academic Faculty',
    category: 'Professional Faculty & Degree Programs',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-8-qeducato.png',
    description: 'Dark slate navy header with architectural line sketch and vibrant coral badges. 6-card professional course grid (Biochemistry, Economics, Business Media, Public Administration, Biotechnology, Corporate Finance), recent articles, and institutional hotline.',
    accentColor: '#0F243A',
    themeStyle: {
      primaryHex: '#0F243A',
      secondaryHex: '#FF6B52',
      bgAccent: '#F8FAFC',
      tagline: 'Excellence in Professional Faculties'
    },
    heroTitle: 'Professional Academic Faculty & Courses',
    heroSubtitle: 'Seamlessly visualize quality intellectual capital without superior collaboration and innovative faculty mentors.',
    heroBadge: 'Admissions Open · Top-Tier Faculty',
    heroCtaText: 'Admission Open',
    features: [
      'Header with phone (+91 7052 101 786), email, social icons, and coral [ADMISSION OPEN] button',
      'Elegant campus architectural sketch banner backdrop behind "Our Courses" title',
      '6-Card Academic Grid: Biochemistry, Major in Economics, Business Media, Public Administration, Biotechnology, Corporate Finance',
      'Color-coded category badges on each course card with book icon links',
      'Dark midnight footer with quick links, recent post thumbnails, and campus desk'
    ],
    sections: ['Architectural Banner Hero', '6-Card Academic Faculty Grid', 'Faculty Research Highlights', 'Latest News & Blog Thumbnails', 'Campus Desk Footer'],
    stats: [
      { label: 'Faculties', value: '6 Majors' },
      { label: 'Faculty Ratio', value: '1:12' },
      { label: 'Research Papers', value: '240+' },
      { label: 'Placement', value: '96%' }
    ]
  },
  {
    id: 'template-9-universitybridge',
    code: 'T09',
    name: 'UniversityBridge Heritage Collegiate',
    category: 'Classical University & Century-Old Heritage',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-9-universitybridge.png',
    description: 'Prestigious royal blue collegiate theme celebrating two centuries of academic excellence. Majestic clock tower red-brick campus, "Educating Generations" 3-column cards + "Diversity on campus" blue card, alumni video interview report modal, and bronze newsletter subscription bar.',
    accentColor: '#0B47A8',
    themeStyle: {
      primaryHex: '#0B47A8',
      secondaryHex: '#8C6D46',
      bgAccent: '#F8FAFC',
      tagline: 'Two Centuries of Teaching Excellence'
    },
    heroTitle: 'Teach. Learn. Grow. – Celebrating Two Centuries',
    heroSubtitle: 'Two centuries of teaching excellence. Inspiring thinkers, researchers, and global citizens across generations in our historic collegiate sanctuary.',
    heroBadge: 'Two Centuries of Teaching Excellence · Est. 1826',
    heroCtaText: 'Explore Campus',
    features: [
      'University shield crest emblem logo with "Two centuries of teaching excellence" motto',
      'Grand historic campus facade hero with [Explore] and [Contact] dual buttons',
      '3 "Educating Generations" photo columns + 4th Royal Blue "Diversity on campus – Sign up now" card',
      'Join our alumni programs feature with video modal player ("Alumni video report stories")',
      'Clean footer with bronze [Subscribe] button for university gazette'
    ],
    sections: ['Bicentennial Historic Hero', 'Educating Generations & Diversity Cards', 'Alumni Video Report Showcase', 'Campus Gazettes & Blog', 'Bicentennial Newsletter Subscription'],
    stats: [
      { label: 'Heritage', value: '200 Yrs' },
      { label: 'Living Alumni', value: '45,000+' },
      { label: 'Global Rank', value: 'Top 50' },
      { label: 'Campus Acres', value: '180' }
    ]
  },
  {
    id: 'template-10-apex-stem',
    code: 'T10',
    name: 'Apex STEM & Robotics Innovation School',
    category: 'STEM, Robotics & Coding High School',
    minTier: 'pro',
    tierLabel: 'Pro Tier & Above (₹8,000)',
    tierPrice: '₹8,000 / mo',
    previewImage: '/templates/template-6-eduka.png',
    description: 'Futuristic slate & glowing cyan tech interface. 3D robotics simulation showcase, AI curriculum, coding hackathon trophies, and Olympiad leaderboards.',
    accentColor: '#0EA5E9',
    themeStyle: {
      primaryHex: '#0F172A',
      secondaryHex: '#0EA5E9',
      bgAccent: '#0B1120',
      tagline: 'Coding the Future of Tomorrow'
    },
    heroTitle: 'Pioneering STEM, Robotics & Artificial Intelligence',
    heroSubtitle: 'Equipping young engineers and innovators with cutting-edge maker labs, Python programming, and satellite design.',
    heroBadge: 'National Robotics Champions 2025',
    heroCtaText: 'Explore STEM Lab',
    features: [
      'Dark mode futuristic tech interface with glowing cyan accents',
      'Live IoT maker lab telemetry feed and robotics prototyping stations',
      'Python, AI & Robotics syllabus roadmap for middle and high school',
      'International Olympiad medal registry & hackathon trophies'
    ],
    sections: ['Cyberpunk STEM Hero', 'Robotics Showcase', 'Coding Curriculum', 'Hackathon Leaderboard', 'Patents & Innovations'],
    stats: [
      { label: 'Robotics Labs', value: '4' },
      { label: 'Patents Filed', value: '18' },
      { label: 'Code Hours', value: '50K+' },
      { label: 'Medals Won', value: '84' }
    ]
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
