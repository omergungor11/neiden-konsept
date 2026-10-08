# H01 independent integration QA

Gate: pass for Hero, scoped to implemented section and shared shell.

Reference: `docs/reference/screenshots/home-desktop-initial.png`, `home-mobile-initial.png`, F00 Hero/Shell map and original motion audit. Local: `hero-desktop-local.png`, `hero-mobile-local.png`, measured afterfont readiness and8.5s entrance settling at1440×1000/390×844 DPR1.

- Hero heights1000/844; mobile content375px with15px gutter; no horizontal overflow. Desktop/mobile wordmark, services, copy, CTA, avatar/review group and bottom socials align with reference. Original video/grain and11logo masks used.
- Original video duration21.041667s, readyState4, muted/loop/autoplay/playsinline. Playback time advances. Differing video/grain/ticker phases are excluded from a static pixel-equality claim; placement and playback are checked separately.
- Four-second preloader is removed, Hero inert cleared and Lenis restarted. Builder reports tested mid-intro preference changes and simultaneous token locks; mounting clock remains4s and independent locks survive intro removal.
- Source delay, spring/cubic settings and independent transform wrappers reviewed. Builder runtime checks confirm scroll factors−.05/−.15/−.1 and video+.2. Full-page wrapper−150px uses actual document progress; its final pace is rechecked as later sections establish complete page height.
- CTA hover/press, original plus mask and glitch reset checked in builder evidence. Route unmount removes Hero trigger, clears intro/lock and resets top; route return creates a new preloader.
- Local810px tablet and1620px XXL resize smoke: no horizontal overflow; readyState4 and fontsloaded. Source-only remaining breakpoint curve nuances stay in final whole-site QA.
- Browser errors empty, no Vite overlay, build/typecheck passed.

Open whole-site work: commercial template purchase badge/license overlay is H19; later sections/routes are not implemented by this gate. Physical touch and120Hz motion are unverified. Source and local settled layouts match visually; this report does not claim identical random glitch/video frames.
