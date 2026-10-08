# H02 independent integration QA

Gate: passed for the About section. Reference and local viewports are 1440×1000 and 390×844, DPR1, fonts loaded, entrance settled, scrollY1000/844.

- Reference: `builder/source-desktop.png`, `builder/source-mobile.png`, `docs/reference/section-layout/{1440,390}/hello.json` and canonical Hello checkpoints. Independent local: `about-{1440,390}-local.{png,json}`. Section heights850.375/780.78125 and content widths1425/375 match; no horizontal overflow.
- Desktop headline x179.703125/y1214/1065.59375×231; phone x20/y1038/335×204.5625. Authored line breaks, source mobile word splitting, typography, label, description and author align. Desktop side photos x40/y1235.1875/280×315 and x1070/y1186.1875/315×364 match. Original image/logo assets and source crop settings are used.
- `independent-motion.json`: at scroll600 the95 characters split33 opaque/62 alpha.1, matching source evidence. Global side-photo transforms−60/−180 match. Source passes unresolved CSS colors and visibly switches each character at its start; the local reveal preserves that discrete result.
- Reduced motion removes Lenis and all section triggers, leaves every character and appear target visible, and clears image transforms. Tablet810px uses50px headline and795px document width. Restoring motion recreates one Lenis and8 page triggers.
- Route navigation unmounts Hero/About, resets scroll0, releases locks and leaves only2 footer triggers. Browser errors empty. Builder additionally verified normal1440→390→1440 resize, tablet/XXL reduced layouts, typecheck and production build.
- React review: effects and timeline cleanup are scoped; no scroll-driven React state, global trigger kill, extra RAF or duplicate scroll engine. Decorative media is hidden from assistive technology and the split headline has a complete accessible label.

Limits: footer appears immediately after About until H03 is integrated, so that area is excluded from the section screenshot comparison. Hero's whole-document parallax pace is rechecked after all sections establish the final page height. Commercial badge/license overlay remains H19. Physical touch hardware is unverified.

Tablet follow-up: targeted810×1000 source measurement found a1px spacer in the label row and18px description. Correcting these restored exact681px section height; independent `about-810-local.{png,json}` confirms the downstream Services start at1681px. Desktop and phone rules were not changed.
