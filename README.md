# Marcelo Ellwanger · Engineering Portfolio

**MARCELO/LAB** is a product-focused engineering portfolio and case-study site covering practical software, systems engineering, QA automation, local AI, Windows diagnostics, computer vision and evidence-driven tooling.

**Portfolio:** https://marcelosofficial-ctrl.github.io/portfolio/  
**日本語:** https://marcelosofficial-ctrl.github.io/portfolio/ja/  
**Software / QA résumé:** https://marcelosofficial-ctrl.github.io/portfolio/resume/software/  
**About:** https://marcelosofficial-ctrl.github.io/portfolio/about/  
**Contact:** https://marcelosofficial-ctrl.github.io/portfolio/contact/  
**LinkedIn:** https://www.linkedin.com/in/marcelo-ellwanger-10657a435/

## Current engineering work

| Project | State | What it demonstrates |
| --- | --- | --- |
| **CrashScope** | 1.3 development · 1.2.0 public | Windows diagnostics, evidence correlation, WPF/WebView2, automated validation |
| **EasyFlix** | 1.4.0 public | Local-first media UX, multi-drive discovery, deterministic media intake, release engineering |
| **RevDev** | Active development | Durable AI-assisted engineering state, guarded execution, liveness and recovery design |
| **VektorDeck** | 1.0.0 source available | Local AI workstation control, GGUF intelligence, runtime ownership and evidence-aware benchmarking |
| **Retro Game Vision & Resale System** | Field tested | Computer vision, physical-store evidence, provenance and uncertainty-aware decisions |
| **MinimalClock** | 1.0.0 public | Focused desktop UI and lightweight packaging |
| **ExactArtifact** | 1.0.0 public | SHA-256 integrity and deterministic artifact manifests |
| **GapTrace** | 1.0.0 public | DNS/TCP/HTTP diagnostics and micro-outage evidence |
| **ConfigTrace** | 1.0.1 public | Deterministic configuration snapshots and semantic diffs |

## Selected case studies

### VektorDeck 1.0
Local-first Windows AI workstation manager for GGUF model intelligence, runtime safety, hardware telemetry, evidence-aware benchmarking and explainable launch recommendations.

[Source](https://github.com/marcelosofficial-ctrl/VektorDeck) · [Case study](https://marcelosofficial-ctrl.github.io/portfolio/projects/vektordeck/)

### CrashScope 1.2.0 public release
Local-first Windows crash diagnostics for games, hardware testing and GPU-heavy workloads. The public release includes a native WPF/WebView2 desktop shell, ConfigTrace integration and **266/266 automated .NET tests**.

[Source](https://github.com/marcelosofficial-ctrl/CrashScope) · [v1.2.0 release](https://github.com/marcelosofficial-ctrl/CrashScope/releases/tag/v1.2.0) · [Case study](https://marcelosofficial-ctrl.github.io/portfolio/projects/crashscope/)

### EasyFlix 1.4.0 public release
MIT-licensed Windows WPF/.NET 10 local-media application with read-only multi-drive indexing, removable-drive resilience, playback state, Favorites and deterministic Add Media automation. The public release passed **219 automated tests with zero build warnings**.

[Source](https://github.com/marcelosofficial-ctrl/EasyFlix) · [v1.4.0 release](https://github.com/marcelosofficial-ctrl/EasyFlix/releases/tag/v1.4.0) · [Case study](https://marcelosofficial-ctrl.github.io/portfolio/projects/easyflix/)

### RevDev · active development
Native .NET 8/WPF developer infrastructure for durable multi-project AI-assisted development via Dev Relay, with guarded execution, deterministic project state, a five-provider tool hub, failure learning, progress/liveness state and local-first validation.

**No public download is claimed.** Release acceptance remains an explicit gate.

[Case study](https://marcelosofficial-ctrl.github.io/portfolio/projects/revdev/)

## Portfolio engineering

The site is built as a static-first Astro application and deployed through GitHub Pages.

- Astro 7
- TypeScript
- CSS
- GitHub Actions
- Responsive, mobile-first presentation
- Japanese and English route parity
- Reduced-motion and reduced-transparency support
- Keyboard-accessible featured carousel with explicit PAUSE/PLAY
- Evidence-first media policy with exact source-dimension verification
- No synthetic screenshots presented as real product evidence

### Media quality gate

Every **real portfolio screenshot must be exactly 2660×1440**. Smaller historical captures are not silently upscaled or presented as final evidence. The repository verifier checks any project screenshot binaries placed in the publication media roots for the exact required dimensions.

The current QA branch intentionally keeps screenshot-gated surfaces honest until the correct supplied binaries are transferred and verified. VektorDeck remains the final user-supplied capture gate.

## Local development

```bash
npm ci
npm run dev
```

## Production verification

```bash
npm run build:verify
```

The public site is kept separate from QA work. The overhaul branch is not merged or deployed until the final media, bilingual QA and Pages verification gates are complete.
