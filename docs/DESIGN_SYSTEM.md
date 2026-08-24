# TripTogether Design System

*A living reference for TripTogether's visual language — colors, typography, spacing, components, and iconography — audited directly from the production codebase (`src/styles.js`, `src/data.js`, and the screen/component files that consume them).*

---

## Table of Contents

1. [Overview](#1-overview)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Elevation](#5-elevation)
6. [Component Patterns](#6-component-patterns)
7. [Iconography & Illustration](#7-iconography--illustration)
8. [Audit Findings](#8-audit-findings)

---

## 1. Overview

TripTogether is a collaborative trip-planning app. Its own token file states the design intent directly:

> *"Emotional design goals: collaborative, safe, joyful. Every token exists to serve one of those three feelings."* — `src/styles.js:1-2`

In practice that translates to three consistent choices across every screen:

- **Warm, not sterile.** Every background is a soft, warm off-white (`#F7F4F0`–`#FBF7F2`) rather than pure white or cool grey — the app is meant to feel like a paper travel journal, not admin software.
- **One confident accent, used sparingly.** Teal is the *structural* brand color (headers, gradients, card accents); terracotta is reserved *exclusively* for the one primary action per screen. Nothing else competes for attention.
- **Real travel photography over generic icons.** Category headers, empty states, and trip cards lean on real, curated photos (hotlinked from Pexels) rather than stock illustration wherever a photo can carry the mood better than an icon can.

The palette and type scale are small and disciplined by design — six brand colors, eight type tiers, nine spacing values — which is what makes the *inconsistencies* flagged in [Section 8](#8-audit-findings) worth fixing: the system is small enough that every deviation is visible.

---

## 2. Color Palette

### Backgrounds

Three near-identical warm off-whites, intentionally differentiated by context rather than sharing one value — *"paper journal vs. shared noticeboard"* (`styles.js:4`).

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Used for</th></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#F7F4F0;"></div></td><td><code>COLORS.bg</code></td><td><code>#F7F4F0</code></td><td>Default screen background</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#FBF7F2;"></div></td><td><code>COLORS.bgMyIdeas</code></td><td><code>#FBF7F2</code></td><td>My Ideas ("paper journal") background</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#F4F8F7;"></div></td><td><code>COLORS.bgGroupSpace</code></td><td><code>#F4F8F7</code></td><td>Group Space ("shared noticeboard") background</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#FFFFFF;"></div></td><td><code>COLORS.cardBg</code></td><td><code>#FFFFFF</code></td><td>Cards sitting on top of any of the above</td></tr>
</table>

### Brand

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Used for</th></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#1E5F5F;"></div></td><td><code>COLORS.teal</code></td><td><code>#1E5F5F</code></td><td>Structural brand color — headers, gradients, card accents, active nav state</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#2D7A7A;"></div></td><td><code>COLORS.tealLight</code></td><td><code>#2D7A7A</code></td><td>Lighter teal for gradient end-stops</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#E4F0EF;"></div></td><td><code>COLORS.tealTint</code></td><td><code>#E4F0EF</code></td><td>Tinted backgrounds for teal-toned badges/pills</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#F0E8DC;"></div></td><td><code>COLORS.sand</code></td><td><code>#F0E8DC</code></td><td>Warm neutral tint — countdown pills, icon badge backgrounds</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#AA5B3B;"></div></td><td><code>COLORS.terracotta</code> / <code>COLORS.action</code></td><td><code>#AA5B3B</code></td><td><strong>Reserved exclusively</strong> for the one primary action per screen</td></tr>
</table>

> **Accessibility callout.** `terracotta`/`action` was darkened from an earlier `#D4724A`. At full brightness, white button text on `#D4724A` measured **3.33:1** — below the 4.5:1 WCAG AA minimum for normal text. The current `#AA5B3B` holds **~4.9:1** both as a button fill (white text) and as a foreground text color on the app's light backgrounds. (`styles.js:15-21`)

### Semantic

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Used for</th></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#3A7D5A;"></div></td><td><code>COLORS.milestone</code></td><td><code>#3A7D5A</code></td><td><strong>Only</strong> progress/completion moments — a decided category, a fully-decided trip, an imminent countdown. Never decorative.</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#F3F7F5;"></div></td><td><code>COLORS.milestoneTint</code></td><td><code>#F3F7F5</code></td><td>Tint for milestone-colored text/badges (tuned to hold ~4.5:1 contrast)</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#D94040;"></div></td><td><code>COLORS.danger</code></td><td><code>#D94040</code></td><td>Destructive actions (delete)</td></tr>
</table>

### Text

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Used for</th></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#1A1A1A;"></div></td><td><code>COLORS.charcoal</code></td><td><code>#1A1A1A</code></td><td>Headings, primary body text (never pure black)</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;background:#5A5048;"></div></td><td><code>COLORS.warmGrey</code></td><td><code>#5A5048</code></td><td>Secondary/muted text — subtitles, captions, timestamps</td></tr>
</table>

### Structure

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Used for</th></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#E5DDD4;"></div></td><td><code>COLORS.border</code></td><td><code>#E5DDD4</code></td><td>Header dividers, input borders</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#EFE8DE;"></div></td><td><code>COLORS.borderLight</code></td><td><code>#EFE8DE</code></td><td>Subtler dividers (card footers, list separators)</td></tr>
<tr><td><div style="width:48px;height:24px;border-radius:4px;border:1px solid #ddd;background:#96897C;"></div></td><td><code>COLORS.subtleIcon</code></td><td><code>#96897C</code></td><td>Functional-but-quiet icon marks (chevrons, unfilled checkboxes) — tuned to clear the 3:1 UI-component contrast minimum</td></tr>
</table>

### Category colors

Each category carries a **tint** (backgrounds/badges) and a deeper **shade** of the same hue (icon strokes, text on the tint) — never one flat color reused at two opacities. (`data.js:6-13`)

<table>
<tr><th>Category</th><th>Color</th><th>Shade</th></tr>
<tr><td>Inspiration</td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#E8B84A;vertical-align:middle;"></div> <code>#E8B84A</code></td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#C4922A;vertical-align:middle;"></div> <code>#C4922A</code></td></tr>
<tr><td>Destination</td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#5B8DBE;vertical-align:middle;"></div> <code>#5B8DBE</code></td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#3D6B98;vertical-align:middle;"></div> <code>#3D6B98</code></td></tr>
<tr><td>Accommodation</td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#6BAE8A;vertical-align:middle;"></div> <code>#6BAE8A</code></td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#4A8A68;vertical-align:middle;"></div> <code>#4A8A68</code></td></tr>
<tr><td>Activities</td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#D9805A;vertical-align:middle;"></div> <code>#D9805A</code></td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#B85F3A;vertical-align:middle;"></div> <code>#B85F3A</code></td></tr>
<tr><td>Transport</td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#9B8AC4;vertical-align:middle;"></div> <code>#9B8AC4</code></td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#7563A0;vertical-align:middle;"></div> <code>#7563A0</code></td></tr>
<tr><td>Food</td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#C2678D;vertical-align:middle;"></div> <code>#C2678D</code></td><td><div style="display:inline-block;width:20px;height:20px;border-radius:4px;background:#9C4468;vertical-align:middle;"></div> <code>#9C4468</code></td></tr>
</table>

### Member avatar palette

A fixed 6-color rotation (`data.js:105`), darkened from an earlier, brighter set after the brightest yellow measured as low as **1.84:1** as white-on-fill text — these hold **~4.6–4.9:1**.

<p>
<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#1E5F5F;margin-right:6px;"></span>
<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#AA5B3B;margin-right:6px;"></span>
<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#4B7A61;margin-right:6px;"></span>
<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#4D78A1;margin-right:6px;"></span>
<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#7C6E9D;margin-right:6px;"></span>
<span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#8B6E2C;margin-right:6px;"></span>
</p>

`#1E5F5F` `#AA5B3B` `#4B7A61` `#4D78A1` `#7C6E9D` `#8B6E2C`

The first two colors intentionally duplicate `teal` and `action` — the trip creator (assigned `MEMBER_COLORS[0]`) always reads as "the brand," while every subsequent member gets the next unused color in the array (see [Avatars](#avatars)).

### ⚠️ One-off colors not in the palette

These are real hex values found in the codebase that don't trace back to any token above — see [Section 8](#8-audit-findings) for the full list with file references. In short: a handful of gradient end-stops, a few components re-declaring a token's value as a fresh literal instead of importing it, and one legacy trip-color picker that still offers the pre-accessibility-fix orange.

---

## 3. Typography

The app's typeface is **Plus Jakarta Sans**, loaded from Google Fonts (`src/index.css:1`) and applied globally via `body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }` (`src/index.css:16`). Five weights are imported — 400, 500, 600, 700, 800 — plus a 400 italic, which is why every tier in the scale below can render as true bold/regular/italic rather than a browser-faked slant.

Eight tiers, defined once in `TEXT` (`styles.js:66-81`) and applied everywhere by reference — no screen hand-rolls its own font sizes for these roles.

<table>
<tr><th>Tier</th><th>Size / Weight</th><th>Letter-spacing</th><th>Line-height</th><th>Color</th><th>Example</th></tr>
<tr><td><code>appName</code></td><td>30px / 800</td><td>-0.6</td><td>1.05</td><td>teal</td><td><span style="font-size:30px;font-weight:800;letter-spacing:-0.6px;line-height:1.05;color:#1E5F5F;">TripTogether</span></td></tr>
<tr><td><code>screenTitle</code></td><td>24px / 800</td><td>-0.4</td><td>1.15</td><td>charcoal</td><td><span style="font-size:24px;font-weight:800;letter-spacing:-0.4px;line-height:1.15;color:#1A1A1A;">My Trips</span></td></tr>
<tr><td><code>sectionHeading</code></td><td>13px / 700, UPPERCASE</td><td>1.1</td><td>1.35</td><td>warmGrey</td><td><span style="font-size:13px;font-weight:700;letter-spacing:1.1px;line-height:1.35;color:#5A5048;text-transform:uppercase;">Who Has Contributed</span></td></tr>
<tr><td><code>cardTitle</code></td><td>16px / 600</td><td>-0.2</td><td>1.35</td><td>charcoal</td><td><span style="font-size:16px;font-weight:600;letter-spacing:-0.2px;line-height:1.35;color:#1A1A1A;">Positano cliffside villa</span></td></tr>
<tr><td><code>body</code></td><td>15px / 400</td><td>—</td><td>1.5</td><td>charcoal</td><td><span style="font-size:15px;font-weight:400;line-height:1.5;color:#1A1A1A;">Plan better trips, together.</span></td></tr>
<tr><td><code>subtext</code></td><td>13px / 400</td><td>—</td><td>1.4</td><td>warmGrey</td><td><span style="font-size:13px;font-weight:400;line-height:1.4;color:#5A5048;">Trips you're planning with your crew</span></td></tr>
<tr><td><code>buttonText</code></td><td>15px / 600</td><td>—</td><td>—</td><td>(context-set)</td><td><span style="font-size:15px;font-weight:600;">Create a Group Trip</span></td></tr>
<tr><td><code>timestamp</code></td><td>13px / 400</td><td>—</td><td>1.4</td><td>warmGrey</td><td><span style="font-size:13px;font-weight:400;line-height:1.4;color:#5A5048;">2 min ago</span></td></tr>
</table>

**Supplementary tokens** (outside the core 8-tier scale, for specific call sites — `styles.js:76-80`): `greeting` (14/400 warmGrey), `categoryRowName` (15/600 charcoal, -0.1 tracking), `categoryRowSubtext` (14/400 warmGrey).

> **Accessibility note in the code itself**: the uppercase micro-label tier (`sectionHeading`) was previously 11px — flagged during an accessibility pass as *"the single biggest source of the app reading as too small/delicate,"* since it's reused for every group header ("SOURCE," "TAG IT," "WHO HAS CONTRIBUTED"). Raised to 13px and its tracking eased down slightly so it doesn't over-open at the larger size. (`styles.js:59-65`)

---

## 4. Spacing System

Nine values, defined once in `SPACING` (`styles.js:84-100`). `.screen-scroll` itself carries **no** padding in CSS (`index.css:105-110`) — every screen supplies its own via these tokens, which is exactly why gaps drift when a screen hardcodes a literal instead of referencing one (see [Section 8](#8-audit-findings)).

<table>
<tr><th>Token</th><th>Value</th><th>Applies to</th></tr>
<tr><td><code>screenX</code></td><td>20px</td><td>Left/right page edge padding, on every screen</td></tr>
<tr><td><code>headingGap</code></td><td>10px</td><td>Gap between a page title and its subtitle</td></tr>
<tr><td><code>cardGap</code></td><td>12px</td><td>Gap between stacked cards in a tighter list (e.g. Discuss threads)</td></tr>
<tr><td><code>cardPad</code></td><td>16px</td><td>Default internal card padding</td></tr>
<tr><td><code>sectionGap</code></td><td>28px</td><td>Gap between a header and a centered empty-state card (stacks on top of the 16px scroll padding below, for 44px total — see callout)</td></tr>
<tr><td><code>scrollBottomPad</code></td><td>116px</td><td>Bottom clearance in scrollable content, so the last card never sits under the floating "+" button</td></tr>
<tr><td><code>tabBarHeight</code></td><td>64px</td><td>Bottom navigation bar height</td></tr>
<tr><td><code>buttonMinHeight</code></td><td>52px</td><td>Primary button minimum height</td></tr>
<tr><td><code>inputMinHeight</code></td><td>48px</td><td>Text input minimum height</td></tr>
</table>

**The standard header→content gap is 16px**, applied as `.screen-scroll`'s top padding — confirmed identical across My Trips, Group Home, Group Space, Ask the AI, and Trip Summary's populated states. Empty states additionally stack `sectionGap` (28px) as a `marginTop` on the centered card itself, for **44px** total between header and card — this is a deliberate, different treatment for a centered empty-state illustration, not a second value for the same thing.

> **`scrollBottomPad`'s value has its own documented history**: it was raised from an earlier 88px after the floating "+" button's own footprint (52px button + 4px gap + label pill ≈ 76px) was found sitting right at that boundary — *"any shadow bleed or rounding was enough to make card content look like it touched the button when scrolled to the end."* (`styles.js:90-96`)

---

## 5. Elevation

Two-layer "contact + ambient" shadows — a tight, barely-there shadow right against the edge plus a softer, wider shadow underneath — read as real elevation the way one flat blur doesn't. Both use a **warm charcoal** (`rgba(26,18,12,…)`) rather than pure black, so shadows pick up the same warm cast as the rest of the palette instead of a cold grey. (`styles.js:102-110`)

<table>
<tr><th>Token</th><th>Value</th><th>Used for</th></tr>
<tr><td><code>SHADOW_SOFT</code></td><td><code>0 1px 2px rgba(26,18,12,0.04), 0 4px 12px rgba(26,18,12,0.06)</code></td><td>Lighter list rows (My Trips trip card)</td></tr>
<tr><td><code>SHADOW_CARD</code></td><td><code>0 1px 2px rgba(26,18,12,0.05), 0 10px 24px rgba(26,18,12,0.09)</code></td><td>Default card elevation — the most common tier</td></tr>
<tr><td><code>SHADOW_ELEVATED</code></td><td><code>0 2px 4px rgba(26,18,12,0.06), 0 16px 40px rgba(26,18,12,0.16)</code></td><td>Surfaces that must read as clearly above everything else — modals, the trip hero card</td></tr>
</table>

No border-radius equivalent exists as a shared constant — radii are set as ad-hoc numeric literals at each call site (see [Cards](#cards) below for the values actually in use).

---

## 6. Component Patterns

### Cards

<table>
<tr><th>Context</th><th>Radius</th><th>Shadow</th><th>Padding</th></tr>
<tr><td>List row / tile (Discuss thread, Group Home tile)</td><td>14px</td><td><code>SHADOW_CARD</code></td><td>14–16px</td></tr>
<tr><td>Compact card (My Ideas item)</td><td>16px</td><td><code>SHADOW_CARD</code></td><td>16px</td></tr>
<tr><td>Hero / summary card (My Trips row, Home "Current Trip")</td><td>20px</td><td><code>SHADOW_SOFT</code></td><td>16–18px</td></tr>
</table>

Card backgrounds are usually a near-flat top-to-bottom gradient rather than a solid fill — e.g. ItemCard's undecided state is `linear-gradient(180deg, #FFFFFF 0%, #FCFAF8 100%)`, and its decided state swaps in `milestoneTint → #EDF5F0`.

### Buttons

<table>
<tr><th>Variant</th><th>Background</th><th>Text</th><th>Radius</th><th>Height</th></tr>
<tr><td>Primary</td><td>solid <code>#AA5B3B</code></td><td>white, 15px/600</td><td>12–14px</td><td>44–52px</td></tr>
<tr><td>Secondary / outline</td><td>white + 1.5px <code>border</code></td><td>charcoal, 15px/600</td><td>14px</td><td>52px</td></tr>
<tr><td>Text / plain</td><td>none</td><td>warmGrey, 14px/600</td><td>—</td><td>44–48px</td></tr>
<tr><td>Destructive</td><td>solid <code>danger</code></td><td>white, 14px/600</td><td>10px</td><td>44px</td></tr>
<tr><td>Disabled</td><td><code>COLORS.border</code></td><td>warmGrey</td><td>(same as active)</td><td>(same as active)</td></tr>
</table>

The floating "+" action button is the app's one deliberate exception to flat, token-driven color: `linear-gradient(160deg, #BD6B4A 0%, ${COLORS.action} 55%, #954C31 100%)` with a colored glow shadow (`0 6px 16px ${COLORS.action}55`) — reserved for the single most-repeated action in the app (add an idea / add to group).

### Badges & Pills

- **Shape**: stadium radius, almost always **20px**, or **999px** for progress-style pills.
- **Category tag**: background = category color at ~12% alpha (`${categoryColor}1F`), text in `charcoal`, icon in the category's `shade`.
- **Status pills** use one of two fixed semantic pairs — never a third color:
  - **Teal pair** (`tealTint` bg / `teal` text) — "In progress," "Already shared."
  - **Milestone pair** (`milestoneTint` bg / `milestone` text, or solid `milestone` on photo backgrounds) — "Decided," an imminent countdown.
- Countdown pills swap between the milestone pair (≤7 days out) and a neutral `sand`/`terracotta` pair (further out) — urgency is communicated by color, not just text.

### Avatars

Circular, member-colored, white initial letter, no name label. Sizes range from **18px** (compact thread avatars) to **44px** (share-confirmation screen), with a consistent 2px (or 1.5px at the smallest size) white border to separate overlapping circles.

Color assignment (`data.js:107-137`):
- **`nextMemberColor(usedColors)`** — picks the first palette color not already taken by the trip's current members; the trip creator always gets `MEMBER_COLORS[0]` (teal). Falls back to cycling once membership exceeds six people.
- **`colorForName(name)`** — a simple hash-based lookup for one-off displays where collision doesn't matter.

### Illustrated Empty-State Pattern

The same structure, used identically on My Trips, Ask the AI, and Group Discussions:

```
┌─────────────────────────────┐
│                             │
│        [illustration]      │  ← 132–168px, screen-dependent
│                             │
│      No trips yet           │  ← 18px / 800, charcoal
│  Start planning your next   │  ← 14px / 400, warmGrey,
│    adventure with crew      │     max-width 240–260px, centered
│                             │
└─────────────────────────────┘
   white card · 16px radius
```

Card shadow (`0 2px 12px rgba(0,0,0,0.06)`) is a one-off value here, not one of the three named `SHADOW_*` tokens — flagged in [Section 8](#8-audit-findings).

---

## 7. Iconography & Illustration

### Category icons

Hand-drawn line icons (`CategoryIcons.jsx`), one per category, `viewBox 0 0 24 24`, **stroke-width 2** with `round` caps/joins, plus a small filled accent per icon (a dot, a sparkle) — a mixed stroke+fill "duotone" style rather than pure outline. Rendered at 18px inline, or inside a 42px circular badge with a soft gradient tint background.

### Tab bar icons

Same four-icon set (House, Suitcase, Chat, Sparkle), with one consistent state rule: **filled when active, stroked outline when inactive** — never a third visual state.

### Illustration style

Empty-state illustrations are real, licensed Storyset assets (not hand-authored characters), each modified the same three ways before use:

1. **Decluttered** — background layers (gear icons, phone mockups, secondary props) stripped out, leaving only the subject.
2. **Recolored** — every clothing/prop color remapped to the app's own palette (`teal`, `terracotta`, `sand`); skin tones are the one category left untouched.
3. **Re-centered** — viewBox tightened so the artwork sits visually centered in its frame (several source assets ship with asymmetric padding).

The three currently in use: `my-trips-group.svg` (a group of friends + suitcase + plane), `ai-robot.svg` (a chat-bot mascot), `discuss-friends-talking.svg` (three friends + suitcase + plane). All three share one flat, minimal-detail, teal/terracotta/sand register — no illustration in the app uses a color outside that trio.

---

## 8. Audit Findings

Concrete deviations from the guidelines above, found by reading the current implementation. Organized by page.

### Group Discussions — ✅ resolved in this pass

- **Populated-state header→card gap was 0px**, not the standard 16px (`DiscussScreen.jsx:185` had `padding: '0 ...'` where every comparable screen uses `'16px ...'`). Fixed as part of this same change.

### Individual Home (`IndividualHomeScreen.jsx`)

- Header→content gap is **4px** (`:64`), vs. the 16px standard used everywhere else. The header here also has no background/border-bottom, so it visually blends into the page rather than reading as a distinct block — worth confirming whether the tighter gap is intentional for that reason, or drift.

### Ask the AI (`AIScreen.jsx`)

- `.screen-scroll` padding is a hardcoded literal, `'16px 20px 16px'` (`:150`), instead of referencing `SPACING.screenX` — the *value* happens to match today, but it will silently drift if `screenX` is ever changed elsewhere.
- The input bar's horizontal padding is **16px** (`:275-276`), not the 20px used for the header and every message bubble above it on the same screen — the input/send button sit slightly closer to the screen edge than everything else.

### My Ideas / Inspiration category (`MyIdeasCategoryScreen.jsx`)

- The header has **no `border-bottom` divider** (`:44-49`) — it relies on whitespace alone, unlike every other screen header in the app, which pairs a white header background with a `1px solid COLORS.border` bottom edge.
- Bottom scroll padding is hardcoded to **32px** (`:67`) instead of `SPACING.scrollBottomPad` (116px) — on a screen with the floating "+" button present, this is worth double-checking against the exact clearance issue `scrollBottomPad` was raised to fix (see [Section 4](#4-spacing-system)).
- Line 17 restates `COLORS.teal`'s value as a raw literal — `color: '#1E5F5F'` — in a fallback category object, instead of referencing the token.

### Color drift (cross-cutting)

One-off hex values found with no corresponding token:

| File | Value(s) | Context |
|---|---|---|
| `ItemCard.jsx:341-342` | `#EDF5F0`, `#FCFAF8` | Card background gradient end-stops (closest tokens: `milestoneTint`, `cardBg`, but not exact matches) |
| `MyIdeasCategoryScreen.jsx:17` | `#1E5F5F` | Restates `COLORS.teal` as a literal in a fallback object |
| `TabIcons.jsx:1-2` | `#1E5F5F`, `#5A5048` | Redeclares `teal`/`warmGrey` as local module constants instead of importing them |
| `App.jsx` (`CUSTOM_COLORS`/`CUSTOM_SHADES`) | incl. `#D4724A` | Trip-color picker still offers the *pre-accessibility-fix* terracotta as a selectable option |
| `App.jsx:427` | `#BD6B4A`, `#954C31` | Floating-button gradient's flanking stops — no token equivalent |
| `ItemImage.jsx` | 8 gradient pairs | Per-item-type placeholder gradients, entirely outside the palette |
| `GridTile.jsx`, `BackButton.jsx`, `MemberDot.jsx` | assorted | Smaller one-off literals duplicating or approximating existing tokens |

### Typography

- ~~No `font-family` token is defined anywhere~~ — **correction**: the app does use a real, deliberate typeface (Plus Jakarta Sans, see [Section 3](#3-typography)). The one genuine gap is narrower than originally stated: the family is set once, globally, in `index.css` rather than being tokenized per-tier alongside size/weight/color the way the rest of `TEXT` is — so a screen-level override could theoretically drift from it silently, even though nothing currently does.

### Legacy / possibly-orphaned screens

Files such as `HomeScreen.jsx`, `MyBagScreen.jsx`, `GroupBagScreen.jsx`, `CategoryDetailScreen.jsx`, `OnboardingScreen.jsx`, and a few others use an **entirely different, non-token color palette** (`#1C1410`, `#B5A898`, `#E8705A`, `#82C09A`, and more — none of which overlap with anything in [Section 2](#2-color-palette)). These read like earlier versions of screens later rebuilt under the current system (`IndividualHomeScreen.jsx`, `MyIdeasCategoryScreen.jsx`, `GroupSpaceScreen.jsx`, etc.). Whether they're dead code or still reachable via some route isn't something a style audit can resolve on its own — worth a quick pass to confirm before deciding whether to delete or migrate them.
