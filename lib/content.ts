/**
 * All site copy in one place. Wording comes from the client's current site
 * (jirehhealthcarerevenuesolutions.com), lightly edited for typos
 * ("pairs" → payers, "insure" → ensure, "pay or" → payer, etc.).
 * Lines marked NEW are short connective copy written for this redesign —
 * have the client review them.
 */

export const SITE = {
  name: "Jireh Healthcare Revenue Solutions",
  shortName: "Jireh",
  legalName: "Jireh Healthcare Revenue Solutions, LLC",
  url: "https://jirehhealthcarerevenuesolutions.com",
  tagline: "Faith. Integrity. Excellence.",
  promise: "We handle your revenue cycle so you can focus on what matters most — your patients.",
  description:
    "Trusted home health billing and revenue cycle services specializing in Medicare and Medicaid claims with precise eligibility verification and compliant coding.",
  phone: "(757) 525-3874",
  phoneHref: "tel:+17575253874",
  email: "support@jirehhealthcarerevenuesolutions.com",
  region: "Serving home health agencies in Virginia",
  /** Copyright year (static: prerendered pages can't read the clock). */
  year: 2026,
  hours: [
    { days: "Monday – Friday", time: "9:00am – 7:00pm" },
    { days: "Saturday", time: "9:00am – 3:00pm" },
    { days: "Sunday", time: "Closed" },
  ],
} as const;

export const ROUTES = {
  home: "/",
  services: "/services",
  ceo: "/about-the-ceo",
  mission: "/mission-and-vision",
  book: "/book-a-free-consultation",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: ROUTES.home },
  { label: "Services", href: ROUTES.services },
  { label: "About the CEO", href: ROUTES.ceo },
  { label: "Mission & Vision", href: ROUTES.mission },
] as const;

/** Who the client bills for (hero list on the current site). */
export const PROVIDERS = [
  "Non-Skilled Home Healthcare Agencies",
  "Sponsored Residential Providers",
  "Group Homes",
  "Supported Living Providers",
  "In-Home Support Agencies",
  "Adult Day Support Centers",
  "Community Engagement Programs",
  "Community Coaching Programs",
  "Supported Employment Agencies",
  "Independent Living Support Providers",
  "Respite Care Agencies",
] as const;

export type IconName =
  | "shield"
  | "send"
  | "ledger"
  | "follow"
  | "denial"
  | "report"
  | "scale"
  | "heart"
  | "spark";

/** The revenue cycle, in order — the home page's pinned ring scene and the services list. */
export const CYCLE = [
  {
    key: "eligibility",
    short: "Eligibility",
    title: "Patient Coverage & Authorization",
    lead: "Verifying insurance coverage doesn't have to slow you down.",
    body: "Our specialists handle patient eligibility checks and ensure prior authorizations are accurate and up to date before claims are submitted. The result? Fewer errors, faster approvals, and more time for you to focus on patient care.",
    status: "Eligibility verified",
    icon: "shield",
  },
  {
    key: "claims",
    short: "Claims",
    title: "Billing & Claims Submission",
    lead: "Delayed claims mean delayed revenue.",
    body: "We deliver fast, accurate home care billing with streamlined electronic claim submissions to keep your revenue moving. By reducing administrative lag and accelerating the claims process — especially for Medicare — we help shorten reimbursement cycles and stabilize cash flow.",
    status: "Claim submitted",
    icon: "send",
  },
  {
    key: "posting",
    short: "Posting",
    title: "Payment Posting Accuracy",
    lead: "We ensure every dollar is accounted for.",
    body: "Our team carefully reviews and posts every payment — electronic and manual — accurately denoting payments from payers and patients, and tracking denials. The result is cleaner books and more reliable financial reporting.",
    status: "Payment posted",
    icon: "ledger",
  },
  {
    key: "ar",
    short: "A/R",
    title: "Proactive Accounts Receivable",
    lead: "We don't wait on payers — we follow up.",
    body: "Our team actively works unpaid claims, investigates delays, responds to rejections, and rapidly resubmits corrected claims to accelerate reimbursements.",
    status: "Follow-up complete",
    icon: "follow",
  },
  {
    key: "denials",
    short: "Denials",
    title: "Strategic Denial Management",
    lead: "We go beyond fixing denials — we prevent them.",
    body: "By analyzing denial trends, identifying root causes, and correcting payer or documentation issues, we reduce repeat errors and strengthen long-term billing performance.",
    status: "Denial resolved",
    icon: "denial",
  },
  {
    key: "reporting",
    short: "Reporting",
    title: "Credit Balances & Reporting",
    lead: "Clear insight into every financial process.",
    body: "We resolve credit balance issues by analyzing records, identifying overpayments, and sending refund letters — and provide personalized reports for a clear view of the status of all your financial processes.",
    status: "Report delivered",
    icon: "report",
  },
] as const satisfies ReadonlyArray<{
  key: string;
  short: string;
  title: string;
  lead: string;
  body: string;
  status: string;
  icon: IconName;
}>;

export const HOME = {
  hero: {
    eyebrow: "Medical billing & revenue cycle management",
    titleA: "We handle the revenue cycle.",
    titleB: "You handle the care.",
    body: "Professional medical billing and revenue cycle management for home and community-based care providers across Virginia.",
  },
  challenge: {
    label: "Key challenges in home health billing",
    text: "Home healthcare agencies face complex regulations, coding requirements, and varying insurance reimbursements. Managing accurate documentation, timely claims, multiple payers, and strict compliance can be overwhelming.",
    lit: ["complex regulations,", "coding requirements,", "overwhelming."],
    answer:
      "A reliable revenue cycle management partner helps simplify billing, reduce errors, and keep operations running smoothly.",
  },
  serve: {
    label: "Who we serve",
    title: "Billing support for the providers who keep communities cared for.", // NEW
  },
  cycle: {
    label: "End-to-end revenue cycle",
    title: "One partner for every step of the claim.", // NEW
    outro: "Together, our end-to-end approach protects your revenue, reduces leakage, and improves financial stability and reporting.",
  },
  benefits: {
    label: "Why outsource",
    title: "Top benefits of outsourcing home health revenue cycle management",
    items: [
      {
        title: "Specialized expertise",
        body: "Partnering with experienced billing professionals streamlines processes, reduces costly errors, and minimizes claim denials.",
        icon: "spark",
      },
      {
        title: "Faster, more predictable payments",
        body: "A dedicated partner keeps you compliant with ever-changing regulations while optimizing accuracy and reimbursement rates — for faster payments, improved cash flow, and a more predictable revenue stream.",
        icon: "ledger",
      },
      {
        title: "Your team, back on patient care",
        body: "Outsourcing frees your internal team from time-consuming administrative tasks, so your staff can focus on what matters most: delivering high-quality patient care.",
        icon: "heart",
      },
      {
        title: "Rapid scalability",
        body: "Grow without limits. Whether you're expanding services or handling sudden volume spikes, we align the right resources, expertise, and technology so you maintain accuracy, compliance, and steady cash flow.",
        icon: "scale",
      },
    ],
  },
  ceo: {
    label: "Leadership",
    quote: "A leader with purpose. A heart for people. A vision for excellence.",
    body: "Over a decade of healthcare experience spanning Medicaid and Medicare — a journey that began as a caregiver at just 15 years old.",
  },
  join: {
    title: "Join Jireh Healthcare Revenue Solutions",
    body: "In an ever-changing healthcare landscape, we understand the challenges you face — and we meet each one with expertise, precision, and unwavering commitment. More than just billing support, we become a trusted partner dedicated to your success.",
  },
} as const satisfies Record<string, unknown>;

export const WAIVER = {
  label: "Virginia ID/DD Waiver billing",
  title: "Compassionate billing support",
  intro:
    "Behind every claim is an individual who depends on compassionate, consistent care — and a provider dedicated to making a difference in that person's life.",
  body: "We provide professional billing and revenue cycle management services for Virginia's Community Living (CL), Family and Individual Supports (FIS), and Building Independence (BI) Waiver providers. Our goal is simple: to reduce the administrative burden so you can focus on what matters most — the individuals you serve.",
  systems:
    "Our expertise includes navigating Virginia's DMAS/MES systems for Medicaid eligibility verification and claims processing, as well as WaMS for ID/DD Waiver authorizations and Individual Support Plans (ISPs).",
  waivers: [
    { code: "CL", name: "Community Living" },
    { code: "FIS", name: "Family & Individual Supports" },
    { code: "BI", name: "Building Independence" },
  ],
  tools: [
    { code: "DMAS", name: "Medicaid eligibility & claims" },
    { code: "MES", name: "Medicaid Enterprise System" },
    { code: "WaMS", name: "Waiver authorizations" },
    { code: "ISPs", name: "Individual Support Plans" },
  ],
  outcomes: ["Accurate, compliant billing", "Fewer claim denials", "Faster reimbursements", "Maximized revenue"],
} as const;

export const TESTIMONIALS = {
  featured: {
    quote:
      "Working with Jireh Healthcare Revenue Solutions has been a great experience. Their team is professional, responsive, and knowledgeable in billing support, claims submissions, and revenue cycle management. They communicate clearly, address issues promptly, and help keep our billing operations organized and running smoothly. We highly recommend their services to other home health care agencies seeking dependable billing support.",
    name: "Brittany H.",
    role: "CEO, Guardian Light Home Health Care",
  },
  more: [
    { quote: "Jireh Healthcare Revenue Solutions' precise billing cut our claim errors in half — truly a game changer.", name: "M. Lee" },
    { quote: "Their expertise with Medicaid eligibility saved us hours every week — highly recommend.", name: "S. Patel" },
  ],
} as const;

export const CEO = {
  name: "Tammy Flowers-Hollis",
  role: "Chief Executive Officer",
  headline: ["A leader with purpose.", "A heart for people.", "A vision for excellence."],
  bio: [
    "The CEO of Jireh Healthcare Revenue Solutions brings over a decade of comprehensive healthcare experience spanning Medicaid and Medicare (Parts A, B, C, and D). Her journey in healthcare began long before the office setting, starting as a caregiver at just 15 years old. This early experience gave her a lifelong foundation of compassion and a deep, firsthand understanding of patient care.",
    "She carries this perspective into her leadership today, recognizing not only the administrative and billing side of healthcare, but also the love, dignity, and daily commitment required to care for patients.",
  ],
  career:
    "Throughout her professional career, she has worked with leading organizations including CVS Caremark, Anthem, Sentara, UnitedHealthcare, Aetna, and Humana, building extensive expertise in payer operations, billing compliance, and revenue cycle management.",
  organizations: ["CVS Caremark", "Anthem", "Sentara", "UnitedHealthcare", "Aetna", "Humana"],
  operations:
    "As an Operations Coordinator for the past two years, she oversees clinical and billing workflows to ensure seamless coordination between care delivery and reimbursement. She works closely with registered nurses, manages DMAS documentation, coordinates authorization requests with Managed Care Organizations (MCOs), and oversees a billing team responsible for submitting accurate claims — while monitoring claims for timely reimbursement and coordinating assessment scheduling to support continuous authorization coverage.",
  leadership:
    "Under her leadership, Jireh Healthcare Revenue Solutions provides end-to-end revenue cycle support, including claims submission and tracking, Medicaid and insurance billing, payment posting and reconciliation, denial management and resubmissions, and continuous process improvement.",
  advocacy: [
    "Beyond her healthcare expertise, she is an award-winning author. In 2023 she published Circles: Breaking the Chains of Generational Curses, a powerful memoir of healing and empowerment that reflects her journey of breaking cycles and inspiring transformation in others.",
    "She is also recognized for her transformative seminars, where she teaches with transparency, wisdom, and bold faith. After surviving a 10-year abusive marriage, she has become a strong advocate for domestic violence awareness, which now plays a central role in her ministry.",
    "She is the founder of Bridging the Gaps For Queens, a 501(c)(3) nonprofit dedicated to supporting women impacted by domestic violence and sexual assault. The organization provides tools for healing, restoration, and self-sufficiency, and was honored with the Mentorship Excellence Award in 2025.",
  ],
  closing:
    "Through both her professional leadership and community advocacy, she remains committed to building systems of care and support that promote stability, empowerment, and long-term success for the individuals and organizations she serves.",
  credentials: [
    { value: "10+", label: "Years in Medicaid & Medicare" },
    { value: "CBCS", label: "Certified Billing & Coding Specialist" },
    { value: "PTCB", label: "Nationally certified pharmacy technician" },
    { value: "2023", label: "Published author" },
  ],
  timeline: [
    { year: "Age 15", title: "Caregiver", body: "Began her healthcare journey caring for patients — a lifelong foundation of compassion." },
    { year: "2017", title: "Nationally certified", body: "Certified under the Pharmacy Technician Certification Board." },
    { year: "Career", title: "Payer operations", body: "CVS Caremark, Anthem, Sentara, UnitedHealthcare, Aetna and Humana." },
    { year: "CBCS", title: "Billing & coding", body: "Certified Billing and Coding Specialist; managed billing for multiple home healthcare agencies." },
    { year: "2023", title: "Award-winning author", body: "Published Circles: Breaking the Chains of Generational Curses." },
    { year: "2025", title: "Mentorship Excellence Award", body: "Honoring Bridging the Gaps For Queens, the nonprofit she founded." },
  ],
  education:
    "She holds a degree in Small Business Management and Entrepreneurship and is completing her degree in Human Services — reflecting her continued commitment to both professional growth and community impact.",
} as const;

export const MISSION = {
  mission:
    "To serve home healthcare agencies with integrity, compassion, and excellence by providing accurate, compliant, and dependable revenue cycle management solutions.",
  missionMore:
    "We are committed to protecting revenue, reducing financial leakage, and delivering reliable reporting so healthcare providers can focus their time, energy, and hearts on what matters most — caring for patients and strengthening the communities they serve. Guided by faith and purpose, we strive to build lasting partnerships that support financial stability, operational growth, and peace of mind for every agency we serve.",
  vision:
    "To be the most trusted and respected partner in home health revenue cycle management, recognized nationwide for our integrity, expertise, compassion, and unwavering commitment to excellence.",
  visionMore:
    "Guided by faith and purpose, we aspire to strengthen the financial health of home healthcare agencies, empowering them with stability, confidence, and sustainable growth so they can focus wholeheartedly on delivering exceptional patient care and enriching the lives of the communities they serve.",
  values: [
    { word: "Faith", body: "Guided by faith and purpose in every partnership we build." },
    { word: "Integrity", body: "Accurate, compliant, transparent billing — every dollar accounted for." },
    { word: "Excellence", body: "Expertise, precision, and unwavering commitment to your success." },
  ],
} as const;

export const BOOK = {
  title: "Book a free consultation",
  intro:
    "Feel free to contact us with any questions or concerns. Use the form or email us directly — we appreciate your interest and look forward to hearing from you.",
  steps: [
    // NEW
    { title: "Tell us about your agency", body: "A few details so we understand your programs and payers." },
    { title: "We reach out", body: "At the contact time that works best for you." },
    { title: "A clear plan", body: "We review your billing together and recommend next steps." },
  ],
} as const;
