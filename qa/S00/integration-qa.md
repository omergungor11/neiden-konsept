# S00 independent integration QA

Integrator browser checks at1440×1000 and390×844, DPR1, fontsloaded. Source pairs: `docs/reference/screenshots/menu-{desktop,mobile}-open.png`; local pairs: `menu-{desktop,mobile}-local.png`. Hero background was still the foundation canvas during these card checks; background video comparison belongs to H01.

- Initial desktop card: x422.5/y242/580×560. Initial mobile: x7.5/y70/360×560. Source geometry matched.
- Desktop header navigation after normal text kerning correction: x488.328,634.063,781.266,905.656,1020.188; source positions matched.
- Scrolled desktop card: x422.5/y220/580×560. Source measured by builder atscroll500. Mobile scrolled source variant is deliberately380px wide atx−2.5/y70; retain the source edge crop.
- Lenis1.3 default stopped overflow`clip` caused a7.5px centering shift after refresh. Root CSS overrides stopped mode to`hidden`, retaining the15px stable gutter. Recheck: body and overlay1425px wide; cardx422.5.
- Footer heights desktop395.234375/mobile340.015625 match source395.23/340.02. Footer visibility hides bottom blur.
- Menu opening stops Lenis and sets main.inert. Tab enters the card; Escape removes it, releases lock, restores inert and focuses trigger. Backdrop coordinate click closes without route change.
- Back-to-top visible atscroll250 following upward movement from300; clicking returns to0 and hides it. Sticky toggle appears after200px.
- Reduced motion: native provider, visible identity-transform menu, overflow locked, Escape closes.
- Build/typecheck passed; browser errors empty. Source duration/bounce curves use Motion spring generator sampled by GSAP; cubic tweens use CustomEase.

Gate: pass for shared shell integration. Whole-route navigation content and route transitions remain R00–R10. The source commercial purchase badge/license overlay is tracked under H19. Physical touch and high-refresh-rate hardware are not yet tested. Footer source captures contain a still-animating tagline; settled typography is validated separately from transient pixels.
