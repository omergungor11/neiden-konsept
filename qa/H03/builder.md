# H03 — Services builder

Durum: builder uygulaması ve yerel kontroller tamamlandı; bağımsız Q hükmü integratöre aittir. Responsive medya root adapter üzerinden bağlandı.

Sahiplik: `src/sections/home/H03-Services/**`, `src/content/H03.ts` ve bu builder kanıtları. App, shared UI, global stil, motion provider ve paketler değiştirilmedi. Geçici preview oluşturulmadı.

## Kanıt ve kaynak ayrımı

- D: `docs/reference/section-layout/1440/services.json` (308 düğüm, y1850.375, h2852.09375) ve `390/services.json` (257 düğüm, y1624.78125, h4069.53125).
- Arşiv screenshotları: desktop `03-services-0.png`, `04-services-33.png`, `05-services-66.png`; phone `03-services-0.png`, `04-services-50.png`, `05-services-100.png`. Scroll değerleri capture-index kayıtlarından 1850/2461/3072 ve 1625/3238/4851.
- Kaynak parametreleri: `docs/reference/raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`, özgün HTML CSS, motion-audit ve asset-manifest.
- Hedefli çıkarımlar: [reference-map.json](builder/reference-map.json), [source-layout-rules.json](builder/source-layout-rules.json), kaynak kart ve section metin alıntı dosyaları.
- D JSON'da offscreen kart başlıklarının +50px ve görsellerin +30px initial motion dönüşümleri bulunuyor. Bunlar normal akış geometrisine eklenmedi.

## Uygulanan davranışlar

Dört özgün disiplin, sekiz arşiv PNG, kaynak gri köşe SVG path'i, beş arşiv dalga SVG'si, kart numaraları/Japonca alt başlıklar, fiyatlar ve viewport'a özgü etiketler kullanıldı. Phone “Positioning/Packaging”, “Strategy/Community/SMM”, “Keyword” farkları; desktop “Branding/Packaging design”, “Content Strategy/Networking/Social Media”, “Keywords”; XXL uzun etiketleri korunuyor.

Desktop başlığı top100 sticky; 6 kolonun 2'sinde başlık, 4'ünde kartlar. Phone akış başlığı, yığılmış iki 200px görsel, etiketlerden sonra açıklama/fiyat ve 1px services wrapper iç boşluğu korunuyor. Tablet ayrı iki kolon başlık/alt CTA kullanıyor. Body DM Sans400, 16px/1.4/−.05em (tablet/phone15); kart başlığı DM Sans600, 60/50/40/35px; ana başlık XXL90, desktop70, tablet/phone60px/0.9/−.06em.

Kaynak appear: ana başlık line y20/.001, startDelay.3, spring.6, line stagger.2; kart başlığı word y50/.001, startDelay.3, spring.4, stagger.085; görseller y30/0 spring1, ilk.1/ikinci.4 (phone ikisi.1), threshold.5 ve once. Label/introduction phone appear kaldırılır. CTA source .6 spring, + ikon −180°, hover #f02b42/press#8c232f. Yerel GSAP context cleanup ve shared refresh kullanılır; yeni Lenis/RAF/global kill yok. Reduced motion'da içerik görünür ve tüm bölüm reveal'ları atlanır.

## Doğrulama

- `npm run typecheck`: geçti. `npm run build`: geçti; mevcut ortak JS chunk534.87kB minified uyarısı kaydedildi.
- Desktop ve phone, ana App'te H01/H02 sonrasında ölçüldü. DPR1, scrollbar gutter15, font statusloaded; başlangıç screenshotlarında preloader tamamlandı. Görünür motion ayrıca computed state ile doğrulandı.
- [geometry-comparison.json](builder/geometry-comparison.json):1440/390/1620 için61 grup karşılaştırması; normal akışta source initial reveal translateY çıkarıldı. En büyük fark .015625px, yalnız küçük facts metninin intrinsic yuvarlaması. Kart/media/body/tag büyük rect'leri ve toplam yükseklikler exact.

| Viewport | Source section y / h | Local section y / h | Sonuç |
| --- | --- | --- | --- |
|1440×1000|1850.375 /2852.09375|1850.375 /2852.09375|61 grup max.015625px|
|390×844|1624.78125 /4069.53125|1624.78125 /4069.53125|61 grup max.015625px|
|810×1000|1681 /3020|1668.8125 /3020|H03 relative layout max.015625px; H02 birikimi−12.1875px|
|1620×1000|2096.796875 /3224.875|2096.796875 /3224.875|61 grup max.015625px|

Tablet semantik h2 tüm kolonu kapsar; kaynaktaki görünmez rich-text wrapper intrinsic278.84375px, yerel357.5px. [810-glyph-comparison.json](builder/810-glyph-comparison.json), görünür11 karakterin x/y/w/h ölçülerinde maxdelta0 olduğunu doğrular. Görünmez wrapper'a yapay ölçü uygulanmadı. Kaynak810/1620 için yalnız eksik breakpoint geometri araştırması yapıldı; tam arşiv veya mevcut keşif tekrarlanmadı.

- [sticky-33](builder/sticky-33.json) ve [sticky-66](builder/sticky-66.json): scroll2461/3072 sırasında sticky top100.
- [full-reveal-state](builder/full-reveal-state.json): bölüm boyunca gezildikten sonra tüm reveal hedefleri opacity1, transform final ve200ms stable; source initial offscreen state ile final state ayrı tutuldu.
- [cta-focus](builder/cta-focus.json): klavye focus active, /contacts gerçek link, source kırmızı rgb240,43,66, radius0 ve plus−180°.
- [route-unmount](builder/route-unmount.json): CTA navigasyonu H03'ü kaldırır, trigger sayısı2(shell) kalır. [route-remount](builder/route-remount.json): yeniden H03 mount; eski event/timeline/trigger kalıntısı görülmedi.
- [reduced-motion](builder/reduced-motion.json): tüm bölüm hedefleri opacity1, transformsnone, bölüm yüksekliği değişmez; tüm motion provider reduced mode'unda trigger0.
- [final-local-console-errors](builder/final-local-console-errors.txt): yalnız yerel uygulamayla açılmış temiz session,0byte. Önceki source+local karma session CLI boş hata girdileri final console kanıtı olarak kullanılmadı.
- [media-check](builder/media-check.json):13 img (8kart+5dalga) complete/naturalWidth>0; resource status>=400 kaydı yok. Gerçek touch cihaz testi yapılmadı.

## Screenshot çiftleri

Aynı viewport/DPR/font/scroll için kaynak ve yerel kayıtlar:

| Viewport/scroll | Kaynak | Yerel |
| --- | --- | --- |
|1440 /1850|[03-services-0](../../docs/reference/screenshots/desktop/03-services-0.png)|[1440-local-0](builder/1440-local-0.png)|
|1440 /2461|[04-services-33](../../docs/reference/screenshots/desktop/04-services-33.png)|[1440-local-33](builder/1440-local-33.png)|
|1440 /3072|[05-services-66](../../docs/reference/screenshots/desktop/05-services-66.png)|[1440-local-66](builder/1440-local-66.png)|
|390 /1625|[03-services-0](../../docs/reference/screenshots/mobile/03-services-0.png)|[390-local-0](builder/390-local-0.png)|
|390 /3238|[04-services-50](../../docs/reference/screenshots/mobile/04-services-50.png)|[390-local-50](builder/390-local-50.png)|
|390 /4851|[05-services-100](../../docs/reference/screenshots/mobile/05-services-100.png)|[390-local-100](builder/390-local-100.png)|
|810 /section start|[810-reference](builder/810-reference-0.png)|[810-local](builder/810-local-0.png)|
|1620 /2097|[1620-reference](builder/1620-reference-0.png)|[1620-local](builder/1620-local-0.png)|

Header/menu, sabit GET NEIDEN® FROM $99 badge ve scrollbar bu bölümün sahipliğinde değildir. Phone screenshotta kaynak black menu / local scroll header varyantı ile badge farkı shell/H19 kapsamında değerlendirilir.

## Responsive bitmap kanıtı

Sekiz görselin DOM crop'ı cover/center; kaynakta scale motion yok (scale1). Canonical tam boy PNG'ler, Framer'ın Chrome'a sunduğu responsive AVIF/WebP'lerden daha keskin ve grain içeriyor. Bu fark için crop/scale uydurulmadı. Eksik responsive bitmap byte'ları hedefli tamamlandı: [responses.json](builder/responsive-evidence/responses.json),17 gerçek currentSrc URL'si, content type, viewport seti, boyut, yerel evidence path veSHA256 (toplam743984 byte). İlk phone512 yanıtı image/avif,8704byte. Yalnız QA evidence alanına yazıldı. Root17 dosyayı public/assets/responsive altında SHA256 ile doğrulayarak adapter'a aldı; H03 görselleri `responsiveAssetUrl(id, variant)` ile phone/tablet/desktop/xxl exact bitmap seçer. Final1440/390 DOM ve üçer screenshot,810/1620 DOM/screenshot bu aktarım sonrasında yenilendi; keskinlik farkı giderildi. Public asset/manifest/catalog değişiklikleri root tarafından yapıldı.


## Açık farklar

1. Responsive bitmap farkı kapandı:17 exact AVIF/WebP root adapter'a aktarıldı ve H03 bağlandı. Canonical PNG fallback yalnız ölçülmemiş varyant yoksa devreye girer; dört ölçülen varyantın sekiz görseli kapsanır.
2. 810px önceki H02'den gelen−12.1875px section başlangıç farkı root'a bildirildi; H03 relative geometri ve glyph'ler eşleşiyor.
3. Canonical desktop h2851.75 ile hedefli D h2852.09375 arasında .34375px kaynak ölçüm farkı var; güncel D exact eşleşti.
4. Bağımsız Q, global shell/badge ve gerçek touch testi integratörün teslim değerlendirmesinde ayrıdır.

React kalite kontrolü: semantik section/article/h2/h3/list/link; statik içerik content dosyasında; motion/root refs effect dependency'leri ve GSAP context/event cleanup doğrulandı. Kaynakta gözlenmeyen card hover/scroll efekti eklenmedi.


Son teslim: `src/content/H03.ts`; `src/sections/home/H03-Services/{index.ts,Services.tsx,Services.module.css,useServicesMotion.ts}`; `qa/H03/builder.md` ve `builder/**`. H03 kod sahipliği root'a devredilmeye hazır. `h03-builder` ve `h03-final` bağımsız CLI browser sessionları kapatıldı; geçici preview yok.
