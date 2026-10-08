# F01 integration verification

- `npm run build`: passed, TypeScript and Vite production bundle.
- `node scripts/validate-plan.mjs`: passed; 399 original hashes, 26 routes, 59 baseline screenshots.
- Browser: Chromium through agent-browser0.27.0, local Vite5173. Foundation-only screenshot `foundation-desktop.png`; this is not S00/H01 visual evidence.
- Render: nonempty page, local Cal Sans loaded, no Vite overlay, browser errors empty.
- StrictMode: provider mounts successfully; one `.lenis` root. Code review confirms ticker/event subscription removed on each effect cleanup and a singleton-provider guard.
- Nested lock acquisitions with the same name: first release leaves Lenis stopped; second release restarts it and restores overflow.
- Anchor: immediate target scroll puts target at viewport top, measured target0px and scrollY2333.
- Resize: Home duration4 at default width,3 at1700px, matching source breakpoint.
- Reduced-motion media change: provider reports `reducedMotion:true`, `lenis:null`, HTML mode`reduced`. Return to normal media and reload creates one Lenis instance and reports mode`smooth`.

Pending integration checks: actual navigation/history/hash with final route tree, menu and preloader simultaneous locks, physical touch device, source scroll feel calibration. These belong to S00/H01/route QA. An attempted native-scroll test had a test-script variable redeclaration before execution; it is not counted as a pass.
