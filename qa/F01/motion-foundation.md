# F01 — motion foundation teslimi

Durum: uygulandı; motion dosyalarının bağımsız typecheck'i geçti. Tam uygulama typecheck'i ve bağımsız browser QA bekleniyor. `passed` kararı verilmedi.

Yazılan dosyalar: `src/motion/MotionProvider.tsx`, `src/motion/scroll-config.ts`, `src/motion/index.ts`, `src/motion/README.md`; bu rapor.

Kanıt: `docs/reference/motion-audit.md` §2 (`K` gerçek Lenis instance seçenekleri, route reset ve `U` kök mimari), `docs/reference/design-tokens.json` Lenis config, `docs/reference/raw/script_main.mjs` `function ic(e)` / instance override'ları. Arşiv üretim girdisi olarak import edilmedi. Güncel API karşılaştırması: [Lenis resmi README](https://github.com/darkroomengineering/lenis), [GSAP ticker](https://gsap.com/docs/v3/GSAP/gsap.ticker/).

Uygulanan davranış: tek provider/tek Lenis/tek GSAP ticker; seconds→milliseconds; scroll→ScrollTrigger.update; reactive reduced-motion native fallback; aynı instance üzerinde breakpoint/path duration güncelleme; bağımsız idempotent lock token'ları; root/body inline lock stil restorasyonu; route/history/hash reset; 80ms/400ms kontrollü refresh; font/media/body/viewport ölçüm yenileme; effect cleanup'ta ticker/listener/observer/Lenis/timer temizliği. Scroll event state update'i yok.

Kaynak konfigürasyonuyla uygulama kararı ayrımı: süre/easing/wheel/syncTouch source K. GSAP tek ticker, reduced-motion'da Lenis'in hiç kurulmaması, nested token manager ve merkezi debounce yeni uygulama kararıdır. Bölüm dekoratif timeline'ları kendi reduced-motion context'inde son görünür state'e alınır.

Bekleyen kabul: StrictMode/HMR mount-cleanup döngüsünde ticker/instance artmaması; 1440→1620→390 resize seçenekleri; tercihin açıkken native wheel/keyboard/touch ve canlı preference change; nested menu/preloader/modal release; scroll sırasında refresh fırtınası olmaması; font/media/FAQ ölçümü; hash ve Back/Forward. Gerçek touch cihazı ve aynı wheel girdisiyle referans scroll/video kalibrasyonu bu dosyanın statik incelemesiyle doğrulanmış değildir.

6 Ekim 2026 doğrulama: `./node_modules/.bin/tsc --ignoreConfig --noEmit --strict --skipLibCheck --target ES2022 --lib ES2022,DOM,DOM.Iterable --module ESNext --moduleResolution Bundler --jsx react-jsx --types vite/client src/motion/MotionProvider.tsx src/motion/scroll-config.ts src/motion/index.ts` exit0. Kurulu sürümler Lenis1.3.26, GSAP3.15.0, React19.3.0; gerçek `ScrollToOptions`, callback ve duration API tipleriyle derlendi. `npm run typecheck` bu sırada yalnız `src/main.tsx` içindeki henüz yazılmamış integratör `src/app/App` import'u için TS2307 verdi; motion hatası yok. Bu sonuç browser lifecycle veya görsel eşleşme kanıtı değildir.

Referans/local screenshot: motion foundation tek başına görünür bölüm üretmez; root F01 smoke ve bölüm görsel QA tesliminde kayıt sağlanacaktır.
