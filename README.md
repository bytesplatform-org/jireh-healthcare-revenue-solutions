# Jireh Healthcare Revenue Solutions — website

Redesign of jirehhealthcarerevenuesolutions.com (currently on Hostinger AI Builder) as a
Next.js 16 site, built on the same motion system as FernGrid Energy and Mobile Lab Draws
(GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, loader / page transitions, curved
section edges).

```bash
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Pages

| Route | Highlights |
| --- | --- |
| `/` | Editorial hero (serif headline, two photos, certification strip), scrubbed "challenge" statement, provider marquee, **pinned revenue-cycle ring** (scroll drives a claim through the six stages), stacking benefit cards, Virginia ID/DD Waiver, CEO teaser, testimonials |
| `/services` | Jump list, service rows with a sticky rolling counter, waiver section, provider cloud, consultation form |
| `/about-the-ceo` | Portrait hero, scrubbed bio, organisations marquee, drawn timeline, leadership + advocacy |
| `/mission-and-vision` | Mission / vision read-ins, full-bleed team photo, pinned **Faith · Integrity · Excellence** |
| `/book-a-free-consultation` | Call card, how-it-works steps, consultation form |

Routes match the current site so existing links keep working.

## Theme

Warm paper (`#F5F2EC`) with the client's indigo (`#1A0D4A`) as ink and as the flat dark
surface; teal (`#11B7C9`) only for small accents and the CTA on dark sections. Newsreader
for headings, Instrument Sans for everything else. Deliberately no gradients, glows, grid
backgrounds, glass cards or mock dashboard UI. Tokens live in `app/globals.css`.

## Content

All copy lives in `lib/content.ts` (taken from the current site, typos fixed). Lines marked
`NEW` are short connective lines written for the redesign — have the client review them, as
well as the "Jireh — the Lord will provide" card on Mission & Vision.

Images in `public/images` come from the current site (client uploads + the Unsplash photos
it already uses). `public/brand` holds the logo (trimmed, split into mark + wordmark), SWaM
and CBCS badges. The "Circles" book cover on the CEO page is a typographic placeholder —
swap in the real cover if the client has one.

## Consultation form

`app/actions/consultation.ts` sends requests through [Resend](https://resend.com) when these
are set:

```
RESEND_API_KEY=...
INQUIRY_TO=support@jirehhealthcarerevenuesolutions.com
INQUIRY_FROM=website@<a domain verified in Resend>
```

Until then the form validates and then offers the visitor a ready-made email (mailto / copy)
plus the phone number, so no request is lost.

## Not carried over

- Spanish / French versions (`/es`, `/fr`) — the current site machine-translates; add
  `next-intl` or similar if the client wants them.

## Motion notes

- Everything respects `prefers-reduced-motion` (static layouts, no pins, no loader).
- Pinned scenes (`revenue-cycle.tsx`, `values.tsx`) only pin on desktop + motion; mobile gets
  stacked layouts.
- `app/_components/motion/*` is shared with FernGrid; keep fixes in sync.
