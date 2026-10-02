# Portfolio Project Goals

This file is the durable source of truth for the current visual-overhaul goals. Future implementation chats should read this file before making portfolio design changes.

## Current priority: project hierarchy and visual evidence

### 1. Compact-project layout
- The homepage section titled **“Small, finished, intentional.”** must group its focused projects horizontally on desktop instead of stacking them as a single vertical column.
- The purpose is to reduce unnecessary page height while keeping the focused projects easy to scan.
- Responsive behavior may collapse to fewer columns on smaller screens, but desktop should remain a grouped horizontal layout.

### 2. Strong-project hierarchy
Give substantially more visual emphasis to the three strongest portfolio projects:
- **CrashScope 1.2**
- **EasyFlix 1.4**
- **RevDev**

They should read as a coherent primary project group rather than three ordinary cards among the rest of the work. Preserve their exact current release/state truth:
- CrashScope 1.2 is publicly released.
- EasyFlix 1.4 is publicly released.
- RevDev is active development only and is **not** a public release.

Do not manufacture release claims, metrics, screenshots, validation results, or publication states.

### 3. Real project screenshots
Use real product screenshots on the website where validated assets exist.
- EasyFlix already has real screenshots in `public/easyflix/` and these should be used prominently.
- CrashScope should use a real product capture when an approved/validated screenshot asset is available. Do not substitute a mockup and call it a screenshot.
- RevDev should use real accepted product captures once the final screenshot/publication boundary permits them. The current RevDev case study explicitly says its public screenshot set is pending final acceptance, so do not invent or publish a fake screenshot.

Screenshots should appear both where useful on the homepage and in the corresponding case-study pages, without overwhelming the page.

### 4. RevDev icon
Use the existing canonical RevDev application icon rather than creating a new unrelated mark.
- Canonical source: `src/RevDev.App/Assets/RevDev.ico`
- The portfolio currently does not contain a copy of this binary asset.
- When the asset is made available to the portfolio publication pipeline, use it on the RevDev project card/window treatment and anywhere else a project icon is appropriate.
- Do not replace the canonical icon with an invented placeholder.

### 5. EasyFlix visual treatment
EasyFlix currently lacks the bespoke sleek project-card visual language already used by other projects.
Create a project-specific visual treatment that reflects EasyFlix's actual identity:
- polished local Windows media application
- streaming-style browsing
- real library artwork/screenshots
- calm, product-like presentation
- local-first / filesystem-authoritative character

Use real EasyFlix screenshots as the visual anchor where possible.

### 6. RevDev visual treatment
RevDev currently lacks the bespoke sleek project-card visual language used by other projects.
Create a project-specific visual treatment that reflects RevDev's actual identity:
- native Windows operator/control surface
- durable project state and continuity
- guarded Dev Relay execution
- queue/progress/liveness signals
- local-first / HOSTED_DENY boundary
- dark engineering-console aesthetic

The visual treatment must remain presentation-only and must not imply that RevDev is publicly released.

### 7. Overall design constraint
Keep the existing MARCELO/LAB visual language:
- dark, restrained, editorial
- technical but human
- strong hierarchy without decorative noise
- real evidence over invented visuals
- cohesive with the current homepage and case-study design system
- mobile and reduced-motion behavior must remain intentional

These goals are persistent project requirements. Do not rely on conversation memory alone when continuing the portfolio overhaul.
