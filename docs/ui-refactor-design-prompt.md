# Sonora UI Refactor — Design Tool Prompts

Reference for AI design tools (v0, Galileo, Figma AI, etc.). Attach screenshots of the current UI when generating.

---

## 1. Product framing and tone

| Dimension | Direction |
|-----------|-----------|
| **What Sonora is** | Interactive AI audiobook platform for children and families: branching stories, AI voice narration, choice-driven progression |
| **Primary user job** | Browse and revisit stories — discover a title, open it, listen, make choices, continue the narrative |
| **Secondary jobs** | Listen with synced/karaoke text; switch narration voice; (power users) manage ElevenLabs voices and API keys |
| **Audience** | Kids 6–12 with parents/caregivers co-using; must feel safe, warm, and magical — not corporate or “developer tool” |
| **Brand energy** | Playful and magical: expressive, storybook-like, premium enough to trust for family use |
| **Emotional targets** | Wonder, curiosity, comfort, delight on interaction (hover, choice, play state) |
| **Technical context** | Next.js web app; light/dark theme; mobile-first; i18n-ready; accessibility matters |

**Core flow to design for:**

```text
Story catalog (/) → Story player (/player/:id) → optional Voices settings (/voices)
```

---

## 2. Preserve vs refactor boundaries

### Preserve (refine, don’t discard)

- **Story card motif:** Physical book frame with AI/scene artwork inset on top (layered composition). Current idea is solid; polish proportions, shadows, alignment, and card chrome.
- **3D depth on catalog cards** (subtle tilt/parallax) — keep if it stays performant and not gimmicky.
- **Branching choice moment** in player — clear “Make a choice” state with tap targets large enough for kids.
- **Karaoke/synced narration text** — active word highlight while audio plays.
- **Voice selector** in player — Pre-recorded vs custom AI voices.
- **Audio availability signal** on cards (e.g. pre-recorded vs needs generation).

### Fully redesignable

- Global shell: logo bar, nav (Stories / Voices), theme toggle
- Catalog page layout: hero, grid density, filters/categories (not wired today but desired)
- Story card typography, metadata row (steps, duration), tooltips
- **Entire player layout** — currently flat cover + bordered text box; can become immersive “story theater”
- Play/pause, progress, chapter label, loading overlays
- Choice buttons styling, voice-control (speech-to-choice) affordance
- Voices/settings page — API keys, table, upload flows
- Color system, type scale, spacing, illustration style, motion language

### Avoid in generated concepts

- Dark sci-fi dashboards, neon cyberpunk, dense admin tables on kid-facing screens
- Tiny text, low contrast, cluttered control strips
- Generic SaaS sidebars on catalog/player
- Replacing the book+art card with plain rectangular posters only
- Over-animation that competes with reading/listening

---

## 3. Primary prompt (copy-paste)

```text
Design a complete UI refactor for "Sonora" — an interactive AI audiobook web app for children and families.

PRODUCT
- Users browse a catalog of branching stories (fantasy, adventure, educational), open one, and experience AI-narrated audio with synced on-screen text.
- At decision points, they pick a branch (tap or voice). Optional settings page lets parents configure ElevenLabs API keys and custom narration voices.
- Primary job: browse and revisit stories. Secondary: immersive listen-and-choose session.

AUDIENCE & TONE
- Kids ~6–12 and parents using together.
- Playful, magical, storybook premium — warm, safe, imaginative. Not corporate, not a dev dashboard.
- Feel like opening a treasured illustrated book that comes alive with sound.

ATTACHED IMAGES
- I'm attaching screenshots of the CURRENT UI. Use them as structural reference only — improve everything except the core idea below.

MUST PRESERVE (refine, not remove)
- Story catalog card: layered visual — physical book frame underneath, AI-generated scene/cover art inset on the book page. Fix rough alignment/spacing but keep this signature motif.
- Player must support: synced/karaoke narration text, branching choices, voice picker, play/pause, loading while speech generates.
- Signal whether a story has pre-recorded audio vs needs live AI generation.

FULL REDESIGN OK
- Global navigation, catalog page composition, player "theater" layout, voices/settings UI, design tokens, typography, color, motion.

SCREENS TO DESIGN (desktop + mobile each)
1) Story catalog — grid of story cards, optional category chips (Adventure, Fantasy, Educational), search or filter, welcoming hero ("Choose your story").
2) Story player — immersive listening: cover/illustration, title/author, large readable narration panel with word highlight, voice selector, play controls, choice state with 2–4 large friendly buttons, optional mic for voice choice.
3) Voices settings — parent-facing but still on-brand: API key section, voice list table, create/upload voice, preview audio.

COMPONENT CALLOUTS
- StoryCard: book frame + inset art, title, 2-line teaser, steps + duration, audio-ready badge.
- NarrationPanel: high readability, active word emphasis, loading overlay.
- ChoiceGroup: staggered reveal, selected state, disabled-while-transitioning.
- NavBar: logo, Stories, Voices, theme toggle.

VISUAL DIRECTION
- Soft rounded shapes, gentle shadows, paper/fabric textures subtle.
- Palette: warm creams, soft lavenders, golden accents, forest greens — high contrast for body text.
- Display font for headings (storybook personality); clean sans for UI chrome and narration.
- Micro-interactions: card hover lift, choice button sparkle/glow on select, play button pulse.

ACCESSIBILITY
- Large tap targets (min 44px), readable type (16px+ body on mobile), WCAG-friendly contrast.
- Clear focus states; don't rely on color alone for status.

OUTPUT FORMAT
- High-fidelity mockups for all 3 screens (desktop + mobile).
- Short design token block: colors, fonts, radii, shadows.
- 1 paragraph rationale tying choices to kids + parents.
- Annotate what changed vs the attached current UI.
```

---

## 4. Alternate prompt — minimal variant (A/B)

Same IA and constraints; slightly calmer visual system for comparison runs.

```text
Redesign Sonora, a family interactive audiobook web app (branching stories + AI narration + synced text + voice choices).

Tone: playful but calmer — modern storybook app (think premium kids reading app), less decoration, more clarity.

Keep: catalog cards with book frame under inset cover art (polished). Player: karaoke text, choices, voice select, play state.

Redesign everything else: nav, catalog layout, player as clean split view (illustration left, narration + controls right on desktop; stacked on mobile), simplified voices settings.

Screens: catalog grid, player, voices settings. Desktop + mobile.

Style: light-first, generous whitespace, 2 accent colors max, soft cards, minimal motion. Large type for narration. Kid-safe contrast.

Avoid: dark neon UI, dense tables on kid screens, losing book+art card motif.

Deliver: mockups + compact token list (colors, type, spacing).
```

---

## 5. Concept selection checklist

Score each generated concept **1–5** (5 = best). Pick the highest total; tie-break on **Readability** and **Book motif**.

| Criterion | Question |
|-----------|----------|
| **Story clarity** | Can a child instantly see what to tap to start a story? |
| **Book motif** | Is book-frame + inset art preserved and looking intentional (not misaligned clip-art)? |
| **Browse joy** | Does the catalog feel fun to scroll without visual noise? |
| **Listen focus** | Does the player keep attention on narration + choices, not chrome? |
| **Readability** | Narration text readable at arm's length on mobile? Active word obvious? |
| **Choice affordance** | Are branch buttons big, distinct, and exciting at the decision moment? |
| **Parent zone** | Is `/voices` clearly “grown-up settings” but still same brand family? |
| **Theme fit** | Works in light mode; dark mode doesn't crush warmth (if shown)? |
| **Motion discipline** | Animations support story magic, don't delay reading? |
| **Implementability** | Layout maps cleanly to React + Tailwind (no impossible 3D-only assets)? |

**Red flags (reject or iterate):**

- Catalog cards became generic Netflix tiles
- Player looks like a music player or chat app
- Body text below 14px mobile or gray-on-gray
- More than 3 competing accent colors
- Choices look like form inputs, not story doors

---

## 6. Implemented design tokens (code reference)

Tokens live in [`styles/sonora-tokens.css`](../styles/sonora-tokens.css), mapped to shadcn in [`styles/globals.css`](../styles/globals.css), extended in [`tailwind.config.ts`](../tailwind.config.ts).

| Token | Hex | Tailwind class |
|-------|-----|----------------|
| background / surface | `#fef9f2` | `bg-background`, `bg-surface` |
| on-background / on-surface | `#1d1c18` | `text-foreground`, `text-on-surface` |
| primary | `#154212` | `bg-primary`, `text-primary` |
| primary-container | `#2d5a27` | `bg-primary-container` |
| tertiary-fixed | `#ffe16d` | `bg-tertiary-fixed` |
| secondary-fixed | `#e4dff7` | `bg-secondary-fixed` |
| surface-container-low | `#f8f3ec` | `bg-surface-container-low` |
| outline-variant | `#c2c9bb` | `border-outline-variant` |

**Typography:** Playfair Display (`font-display`, `font-headline-*`, `text-display-lg`) + Quicksand (`font-body`, `text-body-md`, `text-narration-text`).

**Shared components:** [`components/sonora/`](../components/sonora/) — `PageContainer`, `SonoraChip`, `SonoraBadge`, `SonoraCard`.

**Utilities:** [`styles/globals.css`](../styles/globals.css) (bottom section) — `magical-glow`, `book-spine`, `paper-texture`, `karaoke-active`, `grain-overlay`, etc.

---

## 7. Suggested attachments for the design tool

1. Full-page screenshot of `/` (story grid)
2. Close-up of one `AudiobookCard` (book + art layers)
3. `/player/[id]` — listening state and choice state (two screenshots)
4. `/voices` page
5. Optional: `public/images/book_cover.png` alone so the model understands the frame asset
