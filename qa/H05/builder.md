# H05 More Cases — builder evidence

Status: implementation prepared for root integration; independent Q pending. Ownership is limited to `src/sections/home/H05-MoreCases/**`, `src/content/H05.ts`, and this builder evidence area. H04 featured items, H06 showreel, the PortfolioSequence background/grid/end reserve, shared APIs, packages and App remain root-owned.

## Source evidence and behavior

The existing Astra `docs/reference/portfolio-implementation-map.md/.json`, canonical Portfolio screenshots, `section-layout/{1440,390}/portfolio.json`, asset manifest and raw home module were reused. Only missing default/hover/leave/810/1620 details were researched in isolated CLI browser session `h05-reference`.

The source CMS returns three records at offset 6 / limit 3. Titles, years, descriptions and links are copied exactly into `src/content/H05.ts`; the three archived image IDs are `971e82e195a66983`, `5081a3d1c8f20898`, `b138d993b4500882`. Logo paths are the original Goodwell `c295c3cd460b9450`, Lightstudio `0ac60417fed6baf1`, and third wordmark `50ebd006fbf80cc7`, all consumed through the existing resolved SVG adapter. The five label wave shapes reuse existing IDs and source accent #f02b42. Generic SectionLabel was not used because its plus glyph differs from this source artwork. ActionLink/TextSwap are reused.

A source ambiguity was resolved by the raw binding: `f_=(e,t)=>e?Na9EYo3q1:z00XcxPBj`, called with `d_(u,1)`, explicitly starts the first row expanded. A clean source mount with the mouse outside the rows confirms it. Enter then leave collapses that row, and it stays collapsed. Each row manages its own state. Merely hovering another row does not force the first closed until its own leave event occurs. Phone overrides all rows to source Variant 3: image relative and visible, description absolute with opacity 0, no hover handler.

| Viewport / state | H05 height | Row heights | Source document y |
|---|---:|---|---:|
| 1440×1000 initial / first hover | 650.8125 | 272 / 94.40625 / 94.40625 | 9066.46875 |
| 1440×1000 first leave / all closed | 473.21875 | 94.40625 each | 9066.46875 |
| 1440×1000 second hover after first leave | 650.8125 | 94.40625 / 272 / 94.40625 | 9066.46875 |
| 390×844 phone | 1279.21875 | 314.40625 each | 9508.3125 |
| 810×1000 initial | 786.8125 | 272 / 94.40625 / 94.40625 | 8949 |
| 1620×1000 initial | 706.40625 | 272 / 97.203125 / 97.203125 | 9759.671875 |

All captures use DPR1 / content widths viewport−15. Source y is evidence, not a CSS constant. 1440 grid x40 / width1345 / first column448.328125; 390 x20 / width335; 810 x40 / width715 with heading row86 + grid gap50; 1620 max1550 / x27.5. Label/introduction appear as a group: y40, delay.2, duration2, spring bounce0, threshold.5; phone group appear is removed. Rows: y40, delay.3, duration2, spring bounce0, threshold.5. Source Cl transition `.6` tween `[.44,0,.56,1]` changes real row height, image position and description/logo opacity.

The All projects component reserves40px but its actual anchor is60px and offset−10 vertically. Its40px outer viewport clips the anchor. Width330 desktop/XXL, half heading width tablet, full width phone. Source default #212121, hover #f02b42, pressed #8c232f, icon rotation−180. The LATEST WORK Q2 2026 annotation is absolute top30/center with source difference blends, so it adds no flow height.

Early first-image capture had computed `object-fit:fill` before image hydration; settled source is cover/center in all four measured viewports. Final crops use cover. Original logos are79×22, contain, difference blend.

## Implementation and lifecycle

`MoreCases.tsx` renders semantic headings and three real project links. `MoreCases.module.css` preserves source grid/row/phone geometry and fractional breakpoints809.98/1199.98/1619.98. Scope is `[data-section="H05"]` and CSS module classes.

Appear tweens use existing `springEase` and scoped GSAP ScrollTriggers. Expand/collapse uses real normal-flow row height plus disjoint image/copy FLIP translation, `.6` source cubic easing, description/logo opacity. Keyboard focus opens a desktop/tablet row; mouse leave respects active focus. Touch does not gain a hover-only dependency. Reduced motion keeps visible content and changes expanded state immediately. Timelines/events/triggers revert on cleanup. Root `refresh()` runs after completed height changes and font/media readiness. No new Lenis, RAF, global trigger kill, scroll-time refresh, external forms or deployment.

## Responsive media supplement

`builder/responsive-evidence/responses.json` contains five exact negotiated AVIF responses with URL, headers, dimensions, bytes and SHA256. First image512 is selected in all measured widths. The other two are512 on phone,1024 in measured810/1440/1620 states. Source `currentSrc` is sensitive to prior image selection/cache; raw `sizes` and `srcset` are preserved in `source-1620-image-state.json`. These are original endpoint variants, not generated images. Public asset/catalog import is root-owned; JSX already uses `responsiveAssetUrl` and falls back to the canonical archived asset until root imports them.

## Validation and remaining work

- `npm run typecheck`: passed for prepared source.
- `npm run build`: completed; log `builder/build-initial.log`. This confirms compilation, not visual matching.
- Source default/hover/leave/phone/810/1620 DOM JSON and screenshots are saved under `builder/`.
- Main App mount, source/local geometry and screenshot pairs, hover interpolation, keyboard, reduced motion, resize, unmount cleanup and console checks remain to be run after H04 Q. No temporary preview files were created.
- Source screenshots include adjacent H04/H06 content and source fixed badges/header; those are outside H05 ownership.

No independent gate is declared passed by this builder.
