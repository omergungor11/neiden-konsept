# H01 Hero — builder delivery

H01 is implemented and integrated by the root agent. This builder report supplies D/L/M/R evidence; the independent Q decision is recorded separately in [integration-qa.md](./integration-qa.md). H01 ownership is returned to the root agent after this delivery. No temporary preview files remain.

## Files and source evidence

- `src/sections/home/H01-Hero/{index.ts,Hero.tsx,Hero.module.css,useHeroMotion.ts}` and `src/content/H01.ts` implement this section only.
- [F00 asset/layout map](../F00/hero-shell-map.md) and its [JSON](../F00/hero-shell-map.json) contain original URLs, manifest IDs, font metadata, source CSS, settled desktop/phone DOM, eleven ticker logos, four avatars, preloader SVG artwork and exact appear parameters.
- Original Home module: `docs/reference/raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`. Noise and glitch behavior: `Noise.BrrF4Orx.mjs` and `J4_VSMCVU.BSnwa78u.mjs`. Button/icon source: `jH37M3q97.DpHzVeDz.mjs` and `shared-lib.D4E_c5XX.mjs`.
- Raw modules remain inspection evidence; none are imported or executed by the application.

## Implemented behavior

The section uses the original 1920×1080 video, native 256px grain tile, four avatar images, eleven client logos and four social icons through the shared asset adapter. The wordmark is actual Cal Sans text inside the original SVG viewBox/foreignObject geometry; Patung Regular renders the handwritten tagline, and original DM Sans weights render interface/body text. Grain repeats at its native image size with source opacity .15, scale1.2, overlay blend and .12s mirrored motion. The CTA uses original Plus mask asset `9d550f944aa94749` at20×20px; hover rotates−180° with .6s source spring and pressed color is rgb(140,35,47).

Every Home mount owns a4s preloader and one independent scroll-lock token. Its two black panels, tagline character blur/stagger, original SVG artwork and bottom brand follow the source sequence. The timer is independent of motion-preference changes. Entrance timelines resume the current mount clock when reduced motion changes; they do not hide settled content for another4s.

Appear timing uses shared `springEase`/`cubicEase`. Primary scale starts at3.7s; logo opacity at3.9s; tagline characters at3.9s with .07s stagger; description at4s; CTA/reviews at4.1/4.2s; services at4.3/4.4/4.5s; ticker at4.3s. The primary group owns scale1.4→1. Services start at y20; body/CTA/reviews outer layers start at y60. The logo itself starts at scale1. Inner review presence has its separate .3s/1s opacity/scale tween.

Scroll factors are source video+.20, services/body−.05, tagline−.10 and logo−.15. Wrapper translation is−150×total-document progress. One local ScrollTrigger is created and cleaned up per mounted Hero. Hover glitch has four slices, six shake frames and26 slice frames in the source0–25% activity window. All section timelines, triggers and listeners clean up through their local context/lifecycle. No new Lenis instance, RAF loop or global kill operation was added.

Reduced motion renders visible content, pauses video, disables grain/glitch/appear/parallax motion and removes the Hero trigger. CTA remains a native router link with keyboard focus behavior. Preloader removal clears `inert` on the section.

## Layout and verification

Measurements used DPR1, scroll0 and loaded fonts. Desktop viewport1440×1000 has1425px content; phone390×844 has375px content, matching the reference scrollbar gutter. [Geometry comparison](./builder/geometry-comparison.json) compares nine principal groups to the saved source DOM. Largest difference is0.00438px against source values rounded to two decimal places. Two computed-state samples200ms apart confirm settled opacity/transform/filter and text geometry.

| Group | Desktop x,y,w,h | Phone x,y,w,h |
|---|---|---|
| Hero wrapper | 0,44,1425,956 | 0,44,375,800 |
| Services | 40,198.421875,1345,72 | 20,164,335,66 |
| Logo frame | 40,270.421875,1345,377.546875 | 20,230,335,114.03125 |
| Description | 40,647.96875,1345,107.59375 | 20,344.03125,335,97.21875 |
| CTA | 488.328125,755.5625,448.328125,60 | 20,481.25,335,60 |
| Reviews cell | 936.65625,761.5625,448.34375,48 | 20,587.25,335,48 |
| Ticker wrapper | 0,951,1425,25 | −7.5,681.25,390,25 |
| Social | 40,936,205.234375,24 | 84.8828125,800,205.234375,24 |

Desktop retains the explicit body break before “and move…”. Tablet retains that break, left-aligned body text, two grid columns and tagline in the second column. Phone uses the source shorter service labels, no body break, one content column, 40px group gaps and fixed390px ticker wrapper. Desktop avatar frames are34px and phone30px; image circles remain44px. Source XXL uses1550px content and439px logo frame. Breakpoint captures at810/1200/1620 also have stable settled states; these widths were checked against source CSS, not claimed as fresh remote visual comparisons.

Reference/local screenshot pairs:

- Desktop: [source](../../docs/reference/screenshots/home-desktop-initial.png) · [integrated local](./builder/1440-app-local.png) · [DOM](./builder/1440-app-dom.json).
- Phone: [source](../../docs/reference/screenshots/home-mobile-initial.png) · [integrated local](./builder/390-app-local.png) · [DOM](./builder/390-app-dom.json).
- Local breakpoint evidence: [810](./builder/810-app-local.png), [1200](./builder/1200-app-local.png), [1620](./builder/1620-app-local.png), with adjacent `*-app-dom.json` files.

[Interaction evidence](./builder/interactions-app.json) records CTA focus background rgb(240,43,66), radius0, original mask URL and−180° rotation; active four-slice glitch followed by opacity0 reset; video time advancing19.384269→19.916306; and exact parallax transforms at scroll100. [Route exit](./builder/route-unmount.json) removes Hero and reduces total triggers3→2; [route return](./builder/route-remount.json) restores3 without accumulation. CLI navigation returned after the short loader interval, so remount timing itself is established by the dedicated instrumented-preview tests below.

[Reduced mid-intro](./builder/reduced-mid-intro.json) and [normal resumed mid-intro](./builder/resume-mid-intro.json) were captured with a temporary section-owned harness, then the harness was removed. Observed DOM loader lifetimes were approximately4s (mutation-callback/frame granularity), with a fixed4000ms timer. Hero token release preserved a second open lock; releasing that token restored overflow. Reduced mode showed all inspected content at opacity1, video paused and0 Hero triggers; normal mode restored video playback and1 Hero trigger.

`npm run typecheck` and `npm run build` succeeded. Vite reports the shared production chunk above500kB (520.67kB in this build); bundling remains root-owned. React skill checklist was applied: static content is hoisted, transient animation state uses refs, independent lifecycles are separated, DOM targets are section-scoped, event listeners clean up and native link/focus semantics remain available.

## Remaining differences and limits

- Video, grain, ticker and availability phases differ between captures. The wrapper rectangles in `geometry-comparison.json` explicitly identify the dynamic comparison region, including difference-blended wordmark/body pixels. No raw pixel score is claimed.
- The review group is0.39px narrower than the saved source inner group; its containing cell and alignment are correct. Desktop years text is0.18px wider. These are small remaining font/text-run measurement differences.
- The source GET NEIDEN® FROM $99 template badge is assigned to H19 by the root agent and does not block H01. Shell bottom blur/badge composition can obscure the phone social row; H01 social DOM geometry matches the source.
- Phone evidence is390×844 viewport simulation, not a physical touch-device test.810/1200/1620 evidence is local/source-CSS validation. Full-page wrapper progress changes naturally while later sections are still being integrated.
