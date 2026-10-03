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


## 2026-10-02 design pass: homepage carousel, evidence quality, and hierarchy

### 8. Homepage order and primary project presentation
- **“Three systems worth opening first.” must appear before “Built, validated and field-tested.”**
- CrashScope, EasyFlix and RevDev should be the first substantive project presentation after the identity hero.
- Their presentation should feel like a coherent primary product group, not three ordinary cards buried below flagship-history content.
- The older “Built, validated and field-tested.” section remains useful, but it should follow the primary product group.

### 9. Homepage featured-project carousel
- Replace the static single-project panel in the top hero with a **three-slide project carousel** featuring CrashScope, EasyFlix and RevDev.
- Each slide is a complete clickable project card that routes to that project's case study.
- The carousel must use a constrained viewing window and polished transitions.
- It must provide one pagination indicator per slide, manual previous/next controls, and automatic timed rotation.
- Auto-rotation should pause while hovered or focused, resume afterward, and respect `prefers-reduced-motion`.
- The carousel should present real screenshots where validated assets exist and designed evidence panels only where a real public screenshot is not yet approved.
- Do not invent product screenshots or release evidence.

### 10. EasyFlix screenshot quality
- Do not use the low-resolution WebP portfolio captures as the primary visual treatment when higher-resolution real source captures are available.
- The authoritative real source captures currently available in the EasyFlix repository are `docs/screenshots/home.jpg`, `docs/screenshots/library.jpg`, and `docs/screenshots/details.jpg`.
- The portfolio should use these real JPG captures at their native resolution and should not artificially upscale blurry WebP derivatives.
- Use more than one EasyFlix capture where it improves the homepage/case-study presentation without overwhelming the design.

### 11. RevDev icon boundary
- The exact canonical RevDev icon remains required.
- Canonical source: `src/RevDev.App/Assets/RevDev.ico` in the local RevDev application.
- The portfolio and DevRelay-Missions GitHub trees inspected during this pass do not contain the binary `.ico` itself.
- Do not substitute a generated, approximate, or unrelated icon.
- Once the exact binary is made accessible to the portfolio publication pipeline, add it to the same project-icon system used by the other projects.

### 12. Horizontal tagline
- **“Small, finished, intentional.” must be horizontally composed on desktop**, with the words reading as a deliberate single-line editorial statement rather than a vertical stack.
- Responsive layouts may collapse naturally on narrow screens.

### 13. Evidence-first screenshot policy
- Prefer the highest-resolution validated real capture available for each public project.
- Keep screenshots crisp at their rendered size and avoid stretching small source images into large hero surfaces.
- CrashScope and RevDev should only receive real screenshots once approved/validated publication assets are available.


## 2026-10-02 design pass: carousel system, project access, and exact RevDev branding

This pass is durable project direction, not chat-only context.

### Homepage identity
- “Small, finished, intentional.” must remain horizontally composed on normal desktop widths. Its separators are horizontal rules, not stacked vertical separators.
- The identity row may wrap only at genuinely narrow responsive widths.

### Featured project carousel
- The homepage featured carousel is a nine-project system, not a three-project-only showcase.
- Required order: CrashScope, EasyFlix, RevDev, Retro Game Vision & Resale System, VektorDeck, MinimalClock, ExactArtifact, GapTrace, ConfigTrace.
- The first projects are the most important/current work and therefore remain first.
- Every slide is a clickable project card linking to its case study.
- Every slide uses the same square visual stage dimensions so screenshots and designed evidence feel like one coherent carousel.
- The visual stage and the arrow/pagination control group must share the same centered horizontal axis. Controls must not drift left under the text column.
- Keep smooth transitions, timed autoplay, manual previous/next controls, one pagination indicator per slide, pause on hover/focus, visibility-aware pausing, and reduced-motion support.
- Use validated real product screenshots when approved assets exist. Prefer full-resolution source captures over derivatives. Do not invent screenshots for projects that do not have approved publication media.
- Projects without approved real screenshots use clearly designed evidence panels until validated media exists.

### RevDev branding
- Use the exact RevDev icon supplied for the portfolio, registered through the same project icon system as the other projects.
- Preserve the icon artwork. The portfolio may add the existing green aura/glow through CSS, but must not redraw or substitute the icon.
- Canonical source remains the RevDev application's src/RevDev.App/Assets/RevDev.ico / approved supplied icon asset.
- RevDev remains active development only. Do not imply a public release or invent a downloadable build.

### Project access and downloads
- Every public project case study should expose a clear Download or Access action near the top.
- When a published binary exists, link directly to the validated release asset rather than only to a release page.
- Current direct-release assets:
  - CrashScope 1.2.0: CrashScope-Setup-1.2.0.exe
  - EasyFlix 1.4.0: EasyFlix-Setup-1.4.0.exe
  - ExactArtifact 1.0.0: ExactArtifact-1.0.0-win-x64.zip
  - GapTrace 1.0.0: GapTrace-1.0.0-win-x64.zip
  - ConfigTrace 1.0.1: ConfigTrace-1.0.1-win-x64.zip
  - MinimalClock 1.0.0: MinimalClock_1.0.0.rmskin
- Source-only projects may expose a clearly labeled source/archive route when no packaged binary is published. Do not label a source ZIP as an application binary.
- RevDev has no public download while it is in active development. The case study should say so plainly instead of fabricating an access route.


## 2026-10-02 next pass: product-specific evidence treatment

### EasyFlix
- The primary EasyFlix card should feel like a product surface, not a generic screenshot container.
- Keep the full-resolution real capture as the visual source.
- Overlay restrained product-language metadata such as filesystem authority, watch state and playback without obscuring the actual UI.
- Keep the case-study gallery as the source of truth for the complete real screenshots.

### Next visual audit
- Review every featured-project case study for a clear, honest access action.
- Review every carousel visual for equal rendered stage dimensions and crisp source media.
- Do not replace missing approved screenshots with synthetic screenshots.
- If new validated screenshots become available for CrashScope or RevDev, promote them into the carousel and case studies rather than creating decorative substitutes.


## 2026-10-02 corrective visual audit: cascade ownership and screenshot fidelity

### Required implementation correction
- The desktop **Focused projects / “Small, finished, intentional.”** group must be four columns at normal desktop widths. A later stylesheet must not override this back to a single column.
- The homepage carousel's visual stage, arrows, pagination and timer must share one centered visual axis. The controls belong to the visual column, not the copy column.
- These rules must live in the final effective homepage cascade, not merely in an earlier stylesheet that can be overridden later.

### EasyFlix source-media finding
- The current public EasyFlix repository contains only three checked-in screenshot originals:
  - `docs/screenshots/home.jpg` = 1000×565
  - `docs/screenshots/library.jpg` = 1000×565
  - `docs/screenshots/details.jpg` = 900×509
- The portfolio copies are byte-identical to those current EasyFlix repository sources.
- Do not claim a larger source exists unless a larger validated capture is actually supplied or found.
- Do not crop these captures into a square merely to fill the carousel stage. Preserve the complete screenshot inside the fixed square stage.
- If higher-resolution originals are supplied later, replace the portfolio media with those originals and retain the same presentation system.

### Project access truth
- Public released projects should have direct binary download actions where a validated release asset exists.
- Source-only projects should expose a clearly labeled source/archive action, not a fake application binary.
- RevDev remains case-study-only while active development continues and must not gain a fabricated public download.


## 2026-10-02 carousel r5 polish pass: autoplay, hard layout boundaries, and media clarity

### 14. Carousel behavior is functional, not decorative
- Homepage featured carousel must automatically advance through all nine featured projects.
- Current rotation interval: **6.5 seconds per slide**.
- The progress bar must visibly track the same interval.
- Hovering or focusing the carousel pauses rotation and removes the progress countdown.
- Leaving hover/focus resumes rotation.
- Browser-tab visibility pauses rotation while hidden and resumes when visible.
- prefers-reduced-motion disables automatic rotation.
- Arrow buttons, pagination dots, and Left/Right keyboard navigation must remain functional.
- Only the active slide may be interactive. Hidden slide links/buttons must not capture focus or clicks.

### 15. Carousel slide composition
- Every slide must maintain a hard visual separation between the editorial copy and the square project visual.
- Project titles must never sit on top of screenshot/evidence imagery.
- Long project names must wrap cleanly rather than collide with the visual stage.
- The square visual stage remains the same rendered size across projects.
- Controls and timer must share the same centered horizontal axis as the square visual stage.
- Real screenshots should use object-fit contain inside the square stage when the source aspect ratio is not square, so the full capture remains readable rather than being aggressively cropped.

### 16. RevDev icon quality
- The RevDev project icon must remain the exact supplied/canonical artwork, not a new invented logo.
- Do not ship a visibly corrupted, rainbow-artifact, or blurry derivative.
- Remove any unintended outer black background from the supplied image treatment while preserving the icon's intended dark internal surface.
- Preserve the green aura/glow used by the other project icons through CSS rather than painting it into the source artwork.
- Prefer a high-resolution source asset and avoid enlarging a tiny derivative beyond its useful display size.

### 17. Visual QA before each subsequent carousel pass
- Verify the carousel actually advances after one full interval, not merely that a timer element exists.
- Verify the active title remains readable at desktop widths on both wide and constrained browser windows.
- Verify EasyFlix's native-resolution JPG captures are used rather than low-resolution derivatives.
- Verify every project's square stage is visually aligned with the controls beneath it.
- Verify the first three projects remain the primary ordering: CrashScope, EasyFlix, RevDev.
- Do not call a carousel pass complete based only on source-code inspection. Treat visible layout behavior as a required QA target.


## 2026-10-02 corrective visual pass r6: equal focused cards, larger carousel composition, and asset fidelity

### 18. Focused-project card equality is non-negotiable
- The four cards under **“Small, finished, intentional.”** are one visual group.
- At normal desktop widths they must have exactly the same grid column width and the same visual card footprint.
- No individual card may grow wider because of content, long words, intrinsic sizing, or a project-specific class.
- Use min-width:0, max-width:none, explicit equal grid tracks, and controlled text wrapping so ConfigTrace cannot become visibly wider than MinimalClock, ExactArtifact, or GapTrace.
- The four cards may collapse responsively below desktop breakpoints, but desktop must be a true four-column equal grid.

### 19. Carousel editorial balance
- The previous carousel composition gave the project copy too little horizontal room, producing ugly multi-line titles such as CrashScope breaking across four lines.
- The desktop carousel must give the editorial copy enough width for project names and descriptions to read as intentional typography.
- The square visual stage should be substantially larger than the old ~360-420px treatment where screen width allows.
- Copy and visual should remain separate columns, with the visual stage centered in its own column.
- Long project names should wrap only when necessary, and should not be forced into arbitrary character-level breaks.
- At narrower widths, the carousel may stack copy above the visual rather than compressing both into unreadable columns.

### 20. EasyFlix source-resolution boundary
- The checked-in EasyFlix source captures currently verified in the public repository are 1000×565 (home.jpg, library.jpg) and 900×509 (details.jpg).
- The portfolio must not claim those are larger than they are.
- They must be displayed at native quality without blurry derivatives, accidental upscaling beyond useful size, or awkward off-center containment.
- The carousel treatment should center the EasyFlix capture and make the visual stage feel intentional.
- A genuinely higher-resolution EasyFlix screenshot should replace the current source when one is supplied or otherwise validated. Until then, do not fabricate or AI-upscale product UI and present it as a real screenshot.

### 21. RevDev icon remediation
- The supplied RevDev artwork is 1254×1254 RGBA and was inspected directly.
- Its outer background is removable transparency territory; the artwork itself does not contain the rainbow artifact reported on the deployed 64px derivative.
- The publication asset must be derived from the supplied artwork, remove only the unintended outer black background, preserve the actual dark icon surface, and retain the green aura as CSS presentation rather than baking a second glow into the artwork.
- Do not use the old 64px derivative as the canonical publication asset.
- The final QA target is: no rainbow artifact, no unintended rectangular black backdrop, crisp icon at its rendered size.

### 22. Required visual QA for r6
- Compare all four focused cards side by side at desktop width and confirm equal outer widths.
- Confirm ConfigTrace cannot change its own column width.
- Confirm CrashScope, EasyFlix, RevDev, and the other carousel projects have readable title/description proportions.
- Confirm EasyFlix is centered in the square stage and uses the verified JPG source rather than a WebP derivative.
- Confirm the RevDev asset has no rainbow artifact and no unintended outer black rectangle.
- Do not mark the pass complete merely because the CSS contains the intended rules. Check the effective cascade and built output.

 
## 2026-10-03 corrective visual pass r7: user-supplied EasyFlix evidence and desktop readability

### 22. Supplied EasyFlix captures
- Two new user-supplied EasyFlix captures are authoritative visual evidence for the next media replacement:
  - All Library capture: 2047×1151
  - Home capture: 2047×1151
- The All Library capture is the intended carousel/library visual.
- The Home capture is the intended primary EasyFlix product-card visual.
- Preserve the full 16:9 composition. Do not crop either capture into a square.
- When transferring these captures into the repository publication assets, preserve their supplied resolution and visual content rather than substituting the older 1000×565 repository copies.

### 23. Carousel readability correction
- On wide desktop layouts, the featured carousel must allocate enough horizontal space to its editorial copy that normal project names such as CrashScope remain visually intentional rather than collapsing into multiple narrow lines.
- The square visual stage remains large, centered in its own column, and aligned with the controls/timer beneath it.
- Below the wide-desktop breakpoint, stacking the carousel is preferred to compressing copy into an unreadable narrow column.

### 24. Focused-project equality
- The four cards under “Small, finished, intentional.” are a true equal four-column desktop grid.
- Every card must use the same grid track, equal vertical footprint, and min-width:0.
- Project names must wrap naturally. Character-level breaking is not acceptable when normal typography can fit.

### 25. RevDev icon integrity
- The active RevDev visual must use the exact canonical/supplied artwork, not a hand-redrawn approximation.
- CSS may add the existing green aura, but must not alter the source artwork with cropping or a replacement mark.
- Any generated vector approximation is not a valid substitute and must not become the active RevDev asset.


## 2026-10-03 r8: safe visual fallback and remaining binary-asset gate

- EasyFlix carousel now preserves the entire 16:9 source capture in the foreground while a softened, same-image backdrop fills the square visual stage. This avoids both aggressive cropping and the empty letterbox look.
- The currently checked-in EasyFlix media remains the older 1000×565 repository capture. The two user-supplied 2047×1151 captures are available in the conversation workspace, but have **not** been transferred into the Git repository yet. Do not mark that replacement complete until the actual committed binary dimensions and image content are verified.
- Removed the non-canonical RevDev icon from active presentation points rather than continuing to display the hand-drawn SVG or the visibly corrupted low-resolution PNG. The RevDev carousel retains its truthful engineering-console evidence panel. Re-enable the icon only after the exact supplied/canonical artwork has been added as a repository binary and checked at rendered size.
- Remaining media task: transfer the two supplied EasyFlix screenshots and the exact RevDev artwork through a binary-capable local Git workflow, verify checksums/dimensions, and then restore the real assets to the carousel/card icon system. Do not create a synthetic or hand-redrawn replacement.
- No new CrashScope or RevDev product screenshots are approved; keep the existing designed evidence panels and do not import private captures.


## 2026-10-03 r9: supplied EasyFlix media verified, repository transfer still pending

- The user re-supplied the authoritative Home and All Library captures as 2047×1151 JPEGs.
- Verified source files for the current transfer workflow: Home 2047×1151 RGB JPEG; All Library 2047×1151 RGB JPEG.
- The homepage markup and EasyFlix case study now declare the supplied 2047×1151 intrinsic dimensions instead of the old 1000×565 dimensions.
- The actual binary files are still not committed to the GitHub branch through the current execution path. Do not call the media replacement complete until public/easyflix/home.jpg and public/easyflix/library.jpg have been replaced and their committed dimensions/content are verified.
- The carousel continues to use All Library as its EasyFlix visual, while the primary EasyFlix project card and case-study gallery use Home.
- Do not revert the intrinsic dimensions to 1000×565 after the supplied binaries are transferred.

- Current supplied-source SHA-256: Home `b66713a7214bc53efdc6f09e43a4528bd50e427eb253cb91f6a9677f3ea3229d`; All Library `c199de46e17b4ba483611c78a52c622302ff2563b895ea4e02bcbee6d41e5a36`.

## 2026-10-03 master overhaul plan: evidence, carousel consolidation, and screenshot completion

This is the durable execution plan for the remaining portfolio visual overhaul. Treat this file as the source of truth for future passes; do not rely on chat memory or repeatedly rediscover the same requirements.

### A. Completion definition
- Stable carousel geometry at every breakpoint; no slide changes the outer page height because of title length or visual content.
- Homepage carousel grouping: CrashScope, EasyFlix, RevDev, Retro Game Vision & Resale System, then one “Smaller but Useful” slide containing exactly MinimalClock, ExactArtifact, GapTrace and ConfigTrace.
- Every small-project tile is individually clickable and legible.
- Retro Game Vision has approved real screenshots in its case study and carousel.
- CrashScope and RevDev have approved real screenshots; no synthetic screenshots are presented as real evidence.
- VektorDeck screenshots are replaced/improved when better source captures are supplied, with centered intentional framing.
- MinimalClock visuals are improved when approved screenshots are supplied.
- RevDev uses the exact approved transparent icon asset with the same CSS green aura treatment as other project marks. Never substitute the hand-drawn SVG or corrupted low-resolution PNG.
- EasyFlix uses the two supplied 2047×1151 captures once actually transferred: Home for the main product visual and All Library for the carousel/library visual.
- Public truth remains intact: CrashScope 1.2.0 public; CrashScope 1.3 never exposed; EasyFlix 1.4.0 public; RevDev active development with no public download.

### B. Carousel architecture
- Current target: 5 slides: CrashScope, EasyFlix, RevDev, Retro Game Vision & Resale System, Smaller but Useful.
- The fifth slide contains four clickable cards: MinimalClock, ExactArtifact, GapTrace, ConfigTrace.
- VektorDeck is no longer an individual homepage carousel slide; it remains a separate case study/portfolio project and its media still needs improvement.
- Keep 6.5-second autoplay, arrows, pagination, keyboard Left/Right navigation, hover/focus pause, visibility pause, reduced-motion behavior, and hidden-slide tab suppression.
- Normal slides keep editorial copy and square visual stage in separate columns.
- The visual stage is square; real non-square screenshots remain fully visible with object-fit: contain and centered object-position, with a restrained same-image/background treatment where appropriate.
- The four small-project cards use repeat(4,minmax(0,1fr)) on desktop so content cannot make one card intrinsically wider. Responsive layouts may reduce the count.

### C. Evidence/media policy
- Real screenshots are evidence, not decoration. Never fabricate, AI-generate, or silently substitute a screenshot and present it as real product evidence.
- Before implementing a new screenshot treatment, research current guidance for the relevant layout/media/accessibility problem, then implement and verify the effective cascade/build.
- Prefer the highest-resolution validated real capture available. Do not upscale a low-resolution capture and call it higher-resolution evidence.
- Establish a deliberate capture ratio/resolution per project based on the actual UI and intended rendered size. For square carousel stages, preserve the full screenshot and use containment rather than destructive cropping.
- Case-study galleries may use a wider source ratio when that better represents the product; carousel framing remains consistent.

### D. User-screenshot acquisition protocol
When screenshots are needed, do all code/layout work that does not depend on them first. Then request no more than 2–3 screenshots in one pass and state the exact target resolution in BIG TEXT in the chat.
Current acquisition order:
1. CrashScope — clean representative public-release UI state.
2. RevDev — clean representative operator UI state.
3. Retro Game Vision & Resale System — representative field/vision workflow.
Next batch after those are integrated:
4. VektorDeck — replace current low-resolution/right-shifted captures with clean centered captures.
5. MinimalClock — capture the finished utility at a useful readable size.
Do not request another screenshot batch until the current batch has been integrated and visually checked.

### E. RevDev asset gate
- Required artwork is the exact transparent supplied/canonical icon, not a recreation.
- Canonical application source historically identified as src/RevDev.App/Assets/RevDev.ico; use the approved supplied artwork when available.
- Green aura is CSS presentation only.
- Do not activate public/brand/revdev.svg or the old corrupted public/brand/revdev.png as a substitute.
- If the exact binary cannot be transferred through the current GitHub connector, use a local Git-capable transfer path rather than falsely claiming the asset was published.

### F. EasyFlix binary gate
- Home: 2047×1151 RGB JPEG, SHA-256 b66713a7214bc53efdc6f09e43a4528bd50e427eb253cb91f6a9677f3ea3229d
- All Library: 2047×1151 RGB JPEG, SHA-256 c199de46e17b4ba483611c78a52c622302ff2563b895ea4e02bcbee6d41e5a36
- Repository copies remain older 1000×565 files until actual binary replacement is verified.
- Do not claim replacement is complete from HTML intrinsic dimensions alone.
- After transfer, verify repository blob dimensions/content and retain the source checksums in this file.

### G. Visual QA gate
Every homepage pass must verify:
- all carousel slides have identical outer dimensions;
- long Retro Game Vision title does not enlarge the slide;
- small-project slide has four equal, readable, clickable cards;
- controls and timer remain aligned with the visual axis;
- EasyFlix remains centered and uncropped;
- hidden slides cannot receive focus;
- autoplay advances after the full 6.5-second interval;
- hover/focus/reduced-motion/visibility behavior remains correct;
- desktop and mobile breakpoints remain coherent;
- no CrashScope 1.3 language or release artifact is exposed;
- build/CI passes before publication.

### H. Efficient pass order
Pass 1 — now: durable master plan + carousel consolidation + fixed geometry + four-project grouped slide + research-backed accessibility/media framing.
Pass 2: integrate first 2–3 approved screenshots (CrashScope, RevDev, Retro) and exact RevDev icon if supplied; repair their case-study media.
Pass 3: integrate VektorDeck and MinimalClock captures; improve centering, resolution and case-study presentation.
Pass 4: transfer and verify the two supplied EasyFlix binaries and exact RevDev binary through a local Git-capable path; verify checksums/dimensions.
Pass 5: full visual QA across desktop/mobile, case-study access/media audit, build, then final publication.
If a pass is blocked by user-supplied media, finish all non-blocked work first and stop only at the explicit media gate.

### I. Research references for implementation
- W3C WAI-ARIA carousel guidance: pause controls, keyboard operation, hidden-slide focus management, and predictable slide semantics.
- MDN CSS object-fit/object-position guidance: preserve image aspect ratio and deliberately align contained media.
- MDN CSS Grid/minmax guidance: equal flexible tracks should use minmax(0,1fr) so intrinsic content does not widen one column.

## 2026-10-03 r10: carousel accessibility and controller consolidation

- Removed the duplicate homepage carousel controller that was competing with the shared BaseLayout controller. There is now one authoritative carousel state machine.
- Added explicit carousel semantics: role="region" plus aria-roledescription="carousel" and an accessible label.
- Added a visible PAUSE/PLAY control. This follows current WAI carousel guidance that auto-rotating carousels should expose a user control to stop/restart rotation. Hover/focus pausing remains separate from explicit user pause.
- Kept the existing 6.5-second timing, arrows, slide dots, keyboard navigation, reduced-motion behavior and hidden-slide focus suppression.
- Research used for this pass: W3C WAI carousel pattern/tutorials; MDN object-fit/object-position, aspect-ratio, image dimensions/CLS, and CSS Grid/minmax guidance.
- No CrashScope, RevDev, Retro, VektorDeck or MinimalClock screenshots were available in the current conversation/library search during this pass, so no screenshot-dependent claims or fabricated media were added.
- Next blocking media batch remains CrashScope + RevDev + Retro Game Vision, maximum three screenshots. After integration and QA, proceed to VektorDeck + MinimalClock.


## 2026-10-03 r11: controller audit and semantic cleanup

- Re-inspected the live `main` source rather than trusting the previous handoff state.
- Found that `src/pages/index.astro` still contained the obsolete second carousel controller despite the earlier plan saying it had been removed. Removed that duplicate controller; `BaseLayout.astro` remains the sole carousel state machine.
- Changed the slide-picker container from `role="tablist"` / tab semantics to a plain button group. The pickers are controls, not tabs/panels; active-state styling remains class-based and the shared controller no longer writes stale `aria-selected` state onto them.
- Preserved the authoritative 6.5-second timer, PAUSE/PLAY control, hover/focus/visibility pause, reduced-motion handling, keyboard arrows, hidden-slide tab suppression and five-slide grouping.
- Screenshot and binary-media gates remain unchanged: no synthetic CrashScope/RevDev/Retro/VektorDeck/MinimalClock screenshots, no non-canonical RevDev artwork, and the supplied EasyFlix JPEGs are not considered transferred until their actual repository binaries are replaced and verified.


## 2026-10-03 r12: carousel picker state audit

- A second live-source audit found three remaining picker buttons still carrying obsolete tab semantics. Removed the remaining `role="tab" / aria-selected` attributes from all five slide pickers.
- Slide pickers now use button semantics with `aria-pressed` synchronized by the authoritative `BaseLayout.astro` controller.
- No visual carousel behavior was changed: five-slide grouping, 6.5-second rotation, explicit PAUSE/PLAY, focus/hover/visibility handling, reduced-motion behavior and hidden-slide focus suppression remain intact.
- No screenshot-dependent work was performed because the user will supply the screenshot batch after the non-media work is complete.


## 2026-10-03 screenshot batch update: supplied evidence triage

- CrashScope screenshot supplied by the user was inspected at 2048×1108 RGBA. It is **not publication-safe for the public portfolio** because the visible app state identifies **v1.3.0**; the public portfolio must continue to represent CrashScope 1.2.0. Do not crop, blur or relabel this capture as 1.2. It remains a reference only.
- RevDev screenshot supplied by the user was inspected at 2048×1108 RGBA and is a genuine operator-console capture. Source SHA-256: `3d3ffe10eea32d365a130443e2a3b7bf0f47fe2b88d0a070d941e86a637a5449`. It is eligible for publication after binary transfer/sanitization review; the current GitHub connector path still cannot upload local binary files.
- Retro Game Vision & Resale System: user confirms there is no known launchable GUI capture to provide. The portfolio must not fabricate one. The homepage carousel visual has therefore been changed from `SCREENSHOTS PENDING` to an explicitly labeled `NO GUI RELEASE` decision-pipeline visual. The case study should continue to describe the public synthetic/CLI demo rather than implying a desktop GUI exists.
- Small-project carousel card correction: reserve a fixed eyebrow line box so ConfigTrace's two-line `Configuration evidence` label no longer pushes its title lower than the other cards; reduce the focused-card project-name scale so MinimalClock fits cleanly inside its equal-width card without the final `k` protruding.
- Featured-carousel collision guard: featured copy is explicitly shrinkable, and the carousel stacks copy above the visual at <=1000px so a project title cannot intrude into the square visual stage on constrained desktop widths. This is a layout guard, not a content-specific workaround.
