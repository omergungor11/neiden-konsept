# H04 — Portfolio builder

Durum: ilk uygulama ve kaynak D ekleri hazır. H03 Q geçişi ve integratörün App entegrasyonu sonrası yerel görsel/motion QA yapılacak; kapı geçişi iddia edilmez.

## Sahiplik ve dosyalar

Yalnız `src/sections/home/H04-Portfolio/{Portfolio.tsx,Portfolio.module.css,usePortfolioMotion.ts,index.ts}`, `src/content/H04.ts`, bu rapor ve `qa/H04/builder/` yazıldı. H04 yalnız heading ve dört featured marker/stage üretir. `PortfolioSequence` koyu parent, ortak lined-grid ve final reserve integratöre aittir; H05/H06 alanı render edilmez.

## Kanıt girdileri

`docs/reference/portfolio-implementation-map.{md,json}`; `section-layout/{1440,390}/portfolio.json`; canonical `screenshots/{desktop,mobile}/06-portfolio-0.png` ve capture-index; `motion-audit.md`; Home `2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`; foreground `pz5VXzp1c.DojEgfLu.mjs`; `Parallax.CLO65Qwx.mjs`; `Noise.BrrF4Orx.mjs`; runtime `framer.B48xgVro.mjs` Nl/Ml/qT. Raw dosyalar executable uygulama girdisi değildir.

Gerçek CMS sırayla Identity Through Visual Contrast, Digital Products Through Interaction, Brand Systems for Modern Audiences, Visual Languages for Growing Brands. Hedefler `/projects/featured-{1..4}`. Dördünde source counter `01.`, year2025/clientClandesite; kategori dizileri kaynak haritasından. Fotoğraf assetleri `50dddefad347f3ff`, `93c60342e279bdfe`, `0297947ad35a9508`, `23dd3bb5c8b4216d`. İlk iki logo `3a580605ce6dd3a8` / `29324c6f390b43ba`; son ikisinin kaynak logo düğümleri boştur. Pink wave ve gerçek grain ID'leri content dosyasında. `builder/assets.json` tüm ID ve dosya varlığını doğrular.

## Kaynak ek ölçümler

| Viewport/DPR1 | Heading h | Featured h | Kart x / w | Dört kart h |
|---|---:|---:|---:|---|
| 1440×1000, content1425 | 364 | 4000 | 40 / 1345 | 768,751,751,768 |
| 390×844, content375 | 348 | 3466 | 20 / 335 | tümü465.796875 |
| 1024×1000, content1009 | 248 | 4000 | 40 / 929 | 768,751,751,768 |
| 1720×1000, content1705 | 438 | 4000 | 77.5 / 1550 | 768,751,751,768 |

Desktop başlık documenty4702.46875, stagey5066.46875. Phone başlık5694.3125, stage6042.3125; dört844px marker + üç30px gap. Image viewport desktop650px, phone379.796875px. Başlıkfont130/100/80/60px; metadata12px/500, title14px/600, uppercase. Kaynak text preset ve DM Sans Placeholder zinciri korunur.

Kayıtlar: `builder/source-desktop-stable.json`, `source-phone-stable.json`, `source-tablet.json`, `source-xxl.json`. First image appear yerleşince ölçüldü; sonraki viewport dışı image düğümleri kaynakta hâlây150/scale1.7 taşıyor, static card layout ile transform rect karıştırılmadı.

## Uygulanan motion

- Background absolute host içinde sticky100vh. Dört görüntü scale1.2, blur10/7/7/10 ve black alpha.3/.6/.6/.3; foreground ile aynı gerçek assetler. Discrete state opacity spring1/bounce0; scroll progress ile four-way sürekli mix yapılmaz. Invisible backgroundlar link/focus hedefi değildir.
- **Exact kaynak sınırı:** runtime Ml integer `offsetTop` toplamı kullanır; Nl bundan1px ve viewportHeight×.5 çıkarır. Desktop ikinci marker recty6066.46875 fakat offsetTop sum6066; scroll5564→V1 /5565→V2. Yukarı aynı5565→V2/5564→V1. Phone sum6916, scroll6492→V1/6493→V2, ters yönde aynı. `source-{desktop,phone}-boundary-exact.json` kanıtları. Kod rect tabanlı1.46875px geç seçim yerine aynı integer hesabını kullanır.
- Slot appear y150→0 ve ayrı inner scale1.7→1, duration1.5, cubic[0,.51,.38,1.02]. Ayrı hover scale1.1→1, duration.8 cubic[.71,−.01,.21,1.01]. Logo opacity0/scale1.3→1/1. Kaynak desktop hover overlay0; .2 yalnız XXL. `source-desktop-hover.json/png`.
- Ayrı parallax IMG: height100%+300/top−150; untransformed local layout progress `start end → end start`, y−150→150. Word spring.4 / stagger.085; metadata start.3/.4/.5, title/category start.3. Title hover giriş/çıkışında kaynak varyantın yeni word reveal'i tekrar edilir.
- Subheading desktop/tablet/XXL opacity0/y40, spring2/delay.2/threshold.5; phone kaynak appear kaldırılmış. Grain gerçek tile ile duration.12 mirror loop/opacity.15/scale1, üçüncü aktif backgroundda kaynak gibi grain görünmez.
- Bütün tween/ScrollTrigger yerel GSAP context kapsamındadır; pointer/focus listener cleanup ve fonts-ready refresh cancellation var. `useMotion` tek kök scroll hizmetidir. Touch'ta hover çalışmaz; desktop keyboard focus hover içeriğini açar.

## Builder kontrolleri

İlk `npm run typecheck` ve `npm run build` geçti; Vite ana chunk için mevcut500kB uyarısı var. Bu derleme görsel QA yerine sayılmaz. Yerel App mount sonrası source/local crop, settled rect, boundary/hover, resize/reduced ve unmount kanıtı eklenecek.

Kaynak screenshotları `builder/source-desktop-heading.png`, `source-desktop-card.png`, `source-desktop-hover.png`, `source-phone-heading.png`, `source-phone-card.png`. Hepsi aynı fresh viewport, DPR1, fonts loaded ve4s preloader sonrası; scroll4702/5150/5694/6200. Ticker ve grain fazı devam eden hareketlerdir.

## Açık kalanlar

- H03 Q ve App mount sonrası gerçek source/local karşılaştırması.
- Background crossfade ara zaman örneklemesi, tüm kartların hover/leave ve phone touch bağımsız davranışı.
- Tam source/local resize/reduced-motion, route unmount ve browser errors.
- Source CDN resize ve yerel tam çözünürlüklü original rasterlar arasında resampling farkı; ticker/grain fazı screenshot değerlendirmesinde ayrı ele alınmalı.
- Gerçek fiziksel touch cihaz testi yok.

Sonraki adım: integratör H03 Q ardından mevcut App'e H04'ü bağlar; builder yerel kalibrasyonu bitirir, bağımsız Q kararını integratör verir.
