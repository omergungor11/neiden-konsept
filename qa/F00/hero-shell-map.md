# F00 — Hero / shell reference map

Reference: https://neiden.framer.media/. JSON companion: `qa/F00/hero-shell-map.json`.

This is reference evidence, not local implementation QA. The map contains original asset URLs and hashes, current resolved URLs, 277 selected CSS rules, settled Hero/header groups, open-menu measurements, font faces, original preloader artwork/CSS, and 49 footer CSS rules. Existing archive and screenshots were reused; no downloads or original asset edits.

## Evidence and capture conditions

Inputs: root AGENTS, plan/task/role files, `site-observations.md`, `motion-audit.md`, `design-tokens.json`, `raw/index.html`, original Home module, saved desktop/mobile DOM, and `asset-manifest.json`. Source values and browser observations remain separately labelled.

Targeted browser: agent-browser 0.27.0, independent session `f00-hero-reference`, now closed. Viewports mounted before navigation: desktop 1440×1000/DPR1/content1425; mobile 390×844/DPR1/content375. Scroll0, fonts.ready, 8s wait, two RAFs; settled transforms and opacity recorded. Ticker/video/grain phases are not synchronized.

## Original media

| Role | Manifest ID | Local path |
|---|---|---|
| Grain | `c55875619c77133f` | `public/assets/images/JEXWGoePoUiV1n4YylT8Fc37Us.jpg` |
| Avatar | `bd3c4f75085070d4` | `public/assets/images/KhsMEuf8YeOVTfeZIX7N0GRtjts.png` |
| Avatar | `1756fb240f302fc1` | `public/assets/images/N97fVKZ6SNy7gEfd3xX0AtEWXWs.png` |
| Avatar | `747d876f26a32747` | `public/assets/images/UuFHF4dLLkC2LUYsvEwMry76BYk.png` |
| Avatar | `5dbf9bbdfa0a2823` | `public/assets/images/cQRkOw61thT0YL73tWmNOYblF0.png` |
| Video | `c573376cd49df849` | `public/assets/videos/ugAzn7fEqsPmmKRMmi19TDmUs.mp4` |

Video: 1920×1080, 21.041667s, muted, loop, autoplay, no controls, cover center. Grain: 256×256 JPEG; source tile200%, inset−50%, opacity.15, scale1.2, x0/−10/10/0%, y0/10/−10/0%, .12s linear infinite mirror.

Avatar order: `bd3c4f75085070d4`, `1756fb240f302fc1`, `5dbf9bbdfa0a2823`, `747d876f26a32747`. Cover/center; radius25px; outer group radius27px and padding2px8px; desktop186×48/mobile166×48. Original frames40×44, phone30×44. Then “80+”, “4.9/5”, and “BASED ON 361 REVIEWS”. Frame source rules are in `avatarLayout`.

## Hero client ticker

Original source order. Each item84px wide, gap100px, source speed50, opacity100%. Ten originals were CSS-mask SVG strings; the integrator's resolved adapter now decodes them. Use `assetUrl(manifestId)` from catalog or `resolvedUrl` from JSON.

| Order | Source class | Manifest ID | ViewBox |
|---|---|---|---|
| 1 | `framer-UvMy3` | `a178caf4b608461b` | `0 0 84 25` |
| 2 | `framer-NEQNw` | `94399ca97dc21933` | `0 0 82 17` |
| 3 | `framer-jDWCS` | `a840ada26a58c595` | `0 0 70 18` |
| 4 | `framer-VQTSE` | `80c66b9df3c202ff` | `0 0 90 17` |
| 5 | `framer-I5Z2P` | `857a0d54abfae37c` | `0 0 93 16` |
| 6 | `framer-fOCNH` | `59b479edb25ccf20` | `0 0 90 20` |
| 7 | `framer-UR1Wh` | `77ed120544f3babe` | `0 0 74 19` |
| 8 | `framer-plDQZ` | `5debdbf5dcf4683f` | `0 0 103 15` |
| 9 | `framer-abnqf` | `271270490f8647e5` | `0 0 94 16` |
| 10 | `framer-3uwBP` | `6570720ba9a49398` | `0 0 87 20` |
| 11 | `framer-SmJup` | `8073d1ea3fc3e6a3` | `0 0 92 21` |

## Typography

Large Hero wordmark is actual **ñeiden** in Cal Sans400. Native SVG viewBox: `0 0 854.9700598802395 240`; foreignObject paragraph font299.4011976047904px, line.8em, tracking−.05em. SVG scales to100% of its335/1345px group. Do not treat native299px as the visible screen font size. Five identical original layers support hover glitch; their settled geometry is identical.

Header/menu small **ñeiden®** label instead uses DM Sans600/24px, line1em, tracking−.06em.

| Text | Phone | Tablet | Desktop | XXL |
|---|---|---|---|---|
| Tagline, Patung Regular400, line.9em | 40px | 48px | 100px | 120px |
| Body, DM Sans500, line1.4em, tracking−.04em | 16px | 18px | 17px | 18px |

Tagline red: #f02b42. UI labels:12px, line12px, tracking−.02em, uppercase.

HTML Cal Sans Latin face `fdN99sWUv3gWqXxqqRBctFs.woff2` includes ñ; full module font `fdN99sWUv3gWqXxqqSBevloE4LZx.woff2` is also archived. HTML Patung face is `wANxq4ncIu35guzFWKF73Wj29k.woff2`; runtime custom module also declares `3pW97ue1dT221JRbcaAMrINDM.woff2`. Preserve these distinct evidence sources. `fonts` contains exact URL/local metadata for three Cal Sans subsets and DM Sans400/500/600/700.

## Settled Hero geometry

Coordinates are x,y,width,height at scroll0. The reference uses a15px native scrollbar.

| Group | Desktop | Mobile |
|---|---|---|
| Wrapper | 0, 44, 1425, 956 | 0, 44, 375, 800 |
| Services | 40, 198.42, 1345, 72 | 20, 164, 335, 66 |
| Logo frame | 40, 270.42, 1345, 377.55 | 20, 230, 335, 114.03 |
| Description | 40, 647.97, 1345, 107.59 | 20, 344.03, 335, 97.22 |
| CTA | 488.33, 755.56, 448.33, 60 | 20, 481.25, 335, 60 |
| Review group | 936.66, 761.56, 448.34, 48 | 20, 587.25, 335, 48 |
| Bottom ticker wrapper | 0, 951, 1425, 25 | -7.5, 681.25, 390, 25 |
| Social | 40, 936, 205.23, 24 | 84.88, 800, 205.23, 24 |

Hero100vh, height1000/844, padding-top44; inner wrapper956/800. Desktop body startsx488.33,y677.97,w896.67,h47.59 with explicit line break before “and move…”. Mobile bodyx20,y374.03,w335,h67.22 without explicit break.

Mobile wrapper: padding-top120, gap40. Services retain3columns, labels two lines. Mobile source ticker wrapper is fixed390px, centered within375px content, so x−7.5; preserve observed overflow. Social: desktop left40/bottom40; phone centered/bottom20. Main grid: desktop3columns/tablet2/phone1. Source rules retain different group/grid contracts.

Breakpoints: phone≤809.98, tablet810–1199.98, desktop1200–1619.98, XXL≥1620. Text-preset CSS uses integer max809/1199/1619. Tablet/XXL values are source-only; targeted runtime measurements were390/1440.

## Shell and footer

Header44px. Main header hamburger26×22px (phone x329,y11); separate after-scroll fixed toggler wrapper40×40px. Header black emblem asset `59bc6ecd4c72944e` references symbol `svg-1032377158_781`; white menu emblem asset `db63dd750eb3f9e0` references `svg-274963941_787`. Both have viewBox45.981×21. Resolved catalog paths are ready.

Menu desktop580×560, x422.5/y242 at1440×1000, padding40. It centers in the region below44px header. Phone360×560, x7.5/y70 at390×844/content375, padding25. Source fixed360px variant gives7.5px side gutters. Mask below header: rgba(0,0,0,.3), backdrop blur8px. Navigation/contacts remain two columns; legal/copyright/Framer rows stack on phone. Full measured descendants: `captures.menuDesktop/menuMobile`.

| Icon | Symbol ID | Manifest asset ID |
|---|---|---|
| X | `1688045918` | `a3be02ce20d5ef65` |
| Instagram | `942143898` | `6dfcbc4c624166a8` |
| Dribbble | `284710571` | `37a75d6c3b4bb1d9` |
| Behance | `121344626` | `0e334306872dcd42` |
| Framer | `svg-2040349573_369` | `ddcbdd6c606bc43c` |

Menu socials: X, Instagram, Dribbble. Hero adds Behance fourth. Exact target URLs are in JSON.

`footerSourceOnly` is a targeted extension requested by S00 builder: four original variant node blueprints,49footer CSS rules, saved outer desktop height395.23/mobile340.02. Internal layout is source-only; large-footer reveal belongs to H19 and final S00 integration. Footer large wordmark: Cal Sans350.1891021151422 nativepx, line.8em, tracking−.05em. Preserve “built around clarity”, copyright2016–26, EST2019, and LAST UPDATE Q2 2026.

## Preloader and motion

Original preloader mounts on every Home mount for4s; no sessionStorage flag found. Fixed100vw×100dvh,z99999, instant opacity0 removal. Variants: Fz7bedPAT→300ms→n717XTsCJ→3000ms→pRpGSfHY_→200ms→h3E6viGm6. Variant transition:.6s tween, ease[.77,0,.54,.99]. Centered handwritten tagline starts after1s, blur10, scale3, opacity.001, character stagger.07, duration.8spring/bounce0. Black panels split50%width. Original CSS blueprints and SVG artwork are in JSON. Existing `docs/reference/screenshots/home-mobile-loading.png` shows intro at~600ms, not settled Hero.

Hero primary group (`framer-ilu1k2`) scale1.4→1, delay3.7, duration1.5spring; parent wrapper and background do not receive this appear scale. Services delays4.3/4.4/4.5,.8spring; logo delay3.9,1s tween ease[.74,.03,.44,.95]; tagline starts3.9, blur10,scale2,stagger.07,.8spring; description4.0/.8; CTA4.1/.8; reviews4.2/.8; ticker4.3/1.5,x150/opacity.001→0/1. Source-only timing details remain in motion-audit. Logo glitch is hover-only, not continuous idle glitch.

Scroll layer speeds: video80→+.20×scrollY; services/body105→−.05×scrollY; tagline110→−.10×scrollY; logo115→−.15×scrollY. Parent wrapper0→−150 uses total-page progress, not first-viewport progress. Compose independent appear/scroll/parallax wrappers.

## Validation and remaining work

44 original mapped assets passed SHA256 checks against manifest;44catalog resolved URLs exist. JSON parses;11ticker records and4avatar IDs are distinct. Browser session closed. No source/assets/packages/App edits in F00. Existing reference screenshots remain unchanged. Local visual comparison is not part of this report.

Remaining: H01/S00 local visual QA, exact font-request tracing if needed,810/1200/1620 live-breakpoint verification, media/motion phase comparison, and real-touch testing. This report does not mark implementation gates passed.


H01 implementation targeted corrections: desktop avatar outer frames are34px (five×34+16px padding=186), phone30px. Native grain image tiles at256px with default background-size, overlay blend, scale1.2; the200% source values are layer dimensions, not background-size. Original CTA Plus asset `9d550f944aa94749` is a20px mask frame at top20/right20, hover−180° and pressed0°, .6s spring/bounce0. Source appear details including services y20, body y60 and CTA/reviews y60 are recorded in `heroAppearSourceCorrections`.
