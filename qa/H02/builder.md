# H02 — About / Who we are builder teslimi

Durum: uygulama ve builder doğrulaması tamamlandı; Q kararı integratöre aittir. H01 bağımlılığı integratör tarafından geçti olarak bildirildi ve H02 mevcut ana App içinde ölçüldü. Yeni preview veya scroll motoru kurulmadı.

## Değişen dosyalar

- `src/content/H02.ts`: kaynak metinleri, breakpoint'e özgü boşluk/newline dizileri ve gerçek asset ID'leri.
- `src/sections/home/H02-About/About.tsx`: semantik bölüm, tek görünür headline varyantı, özgün wave/mark/photo SVG ve medya.
- `src/sections/home/H02-About/About.module.css`: kaynak grid, blend zinciri, crop, tipografi ve dört responsive varyant.
- `src/sections/home/H02-About/useAboutMotion.ts`: bölüm kapsamlı karakter scroll reveal, appear spring ve görsel parallax; context cleanup.
- `src/sections/home/H02-About/index.ts`: varsayılan bölüm export'u.
- Bu rapor ve `qa/H02/builder/` ölçüm/screenshot kanıtları.

App, ortak CSS/font/motion/UI, paketler, görev kuyruğu ve S00 dosyaları değiştirilmedi.

## Kaynak kanıtı

- `docs/reference/section-layout/1440/hello.json` ve `390/hello.json`: canonical fresh-mount DOM, computed stil, karakter ve medya geometrisi. Filtrelenmiş kopyası `builder/source-layout.json`.
- `docs/reference/screenshots/desktop/02-hello-0.png`, `mobile/02-hello-0.png` ve capture-index.
- `docs/reference/motion-audit.md` Hello kayıtları.
- `docs/reference/raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`, label için `shared-lib.D4E_c5XX.mjs`, AlphaWave için `TZ79h6XcC.CmndaxN2.mjs`: yalnız inceleme kanıtı, executable uygulama girdisi olarak kullanılmadı.
- Asset manifest/catalog: fotoğraflar `2814a54984c4eb3f`, `4fdbd31f538b2fdd`; portre `746cc03f6b4e5375`; StackedLab `b1ab17a97d022978`; AlphaWave `067fdb66afa66bbf`; köşe vektörü `ad1fdb3ab2ccf842`; beş wave vektörü content dosyasında listeli.

## Geometri sonucu

Tüm koordinatlar document koordinatıdır. Viewport DPR1; fontlar loaded, preloader sonrası; source/local için aynı scroll. Görünür küçük appear öğeleri ayrıca opacity/transform ile kontrol edildi.

| Ölçü | Kaynak | Yerel |
|---|---:|---:|
| Desktop viewport / content width | 1440×1000 / 1425 | 1440×1000 / 1425 |
| Desktop section y / h | 1000 / 850.375 | 1000 / 850.375 |
| Desktop headline x / y / w / h | 179.703125 / 1214 / 1065.59375 / 231 | aynı |
| Desktop etiket x / y / w / h | 488.328125 / 1150 / 270.890625 / 14 | aynı settled düzen |
| Desktop description x / y / w / h | 488.328125 / 1495 / 448.328125 / 95.1875 | aynı settled düzen |
| Desktop sol foto x / y / w / h | 40 / 1235.1875 / 280 / 315 | aynı |
| Desktop sağ foto x / y / w / h | 1070 / 1186.1875 / 315 / 364 | aynı |
| Phone viewport / content width | 390×844 / 375 | 390×844 / 375 |
| Phone section y / h | 844 / 780.78125 | 844 / 780.78125 |
| Phone headline x / y / w / h | 20 / 1038 / 335 / 204.5625 | aynı |
| Phone etiket x / y / w / h | 52.046875 / 994 / 270.890625 / 14 | aynı settled düzen |
| Phone description x / y / w / h | 40 / 1272.5625 / 295 / 112.03125 | aynı settled düzen |
| Phone author x / y / w / h | 89.875 / 1414.59375 / 195.234375 / 60.1875 | aynı settled düzen |

Desktop headline üç satır; phone altı satırdır. Kaynaktaki `internation` / `al` ve `uniqu` / `e` kırılmaları aynen korunur. Author/description satır yüksekliğinde `1.4em`, label'da kaynak `DM Sans Placeholder` fallback'i ve U+2012 tire kullanımı küçük ölçü farklarını kapattı. Fotoğraf crop'u sol `59.1% 88.1%`, sağ `50% 50%`.

## Motion ve erişilebilirlik

- Karakter reveal alanı `top 80% → bottom 50%`, scrub; source string'indeki newline indeksleri zamanlamada korunur. Blend: wrapper multiply, quote/headline difference, karakter white alpha `.1 → 1`.
- **Kaynak tarayıcı gözlemi:** CSS `var()` string çifti, karakter başlangıcında ayrık renk değiştiriyor. Desktop scroll594'te ilgili karakter `.1`, 595'te `1`; sürekli alpha geçişi gözlenmedi. Bu davranış step-at-start ease ile uygulandı. `source-motion-600.json` ve `local-motion-600.json` bütünüyle eşit: 95 karakter, 33 white / 62 white-alpha-.1, reveal rect ve scroll600. Screenshot çiftleri de bu ara durumu kaydeder.
- Label y10, description/author y40; appear spring duration1 / delay.2 / bounce0. Ortak `springEase(1)` kaynak Motion duration modelini GSAP ticker üzerinde örnekler. Trigger öğenin yarısının görünmesine göre kurulur; once.
- Sol/sağ parallax global scroll katsayıları −.1 / −.3; desktop scroll1000'de −100 / −300, scroll600'de −60 / −180. Phone görselleri kaynak gibi gizli.
- Kök `useMotion` ve refresh kullanılır. Yerel gsap context revert, resize listener ve fonts-ready cancellation vardır; ikinci RAF/Lenis/global killAll yoktur.
- Reduced motion: bütün karakterler white1, appear opacity1/transform none; içerik animasyona bağlı kalmaz. Headline bir canonical aria-label ile okunur, karakter spanları decorative; özgün görseller decorative, portrede kişi adı alt metni bulunur.

## Doğrulama ve screenshot çiftleri

- `npm run typecheck`: geçti.
- `npm run build`: geçti. Vite ana chunk için mevcut >500 kB uyarısını verdi; bölüm derleme hatası yok.
- `builder/browser-errors.txt`: boş.
- `builder/reduced-motion.json`: phone scroll450, tüm renkler white1; üç appear opacity1 / transform none; h780.78125.
- `builder/resize.json`: reduced modda 1440→390→1024→1720→390. Varyant/font 70/31/50/90px, document scrollWidth her adımda clientWidth'e eşit; phone son yüksekliği tekrar780.78125.
- `builder/resize-motion.json`: normal modda 1440→390→1440, 3→6→3 satır ve 95→102→95 karakter; yüksekliğin ve görünür son durumun doğru geri dönmesi, taşmasız düzen.
- Desktop kaynak/yerel: `builder/source-desktop.png` / `builder/local-desktop.png`, viewport1440×1000 scroll1000.
- Phone kaynak/yerel: `builder/source-mobile.png` / `builder/local-mobile.png`, viewport390×844 scroll844.
- Kısmi reveal kaynak/yerel: `builder/source-motion-desktop.png` / `builder/local-motion-desktop.png`, viewport1440×1000 scroll600.
- Ölçü JSON'ları: `builder/local-desktop-layout.json`, `builder/local-mobile-layout.json`, `builder/source-layout.json`.

Integratör bağımsız ölçü/görsel kontrolünü `qa/H02/about-{1440,390}-local.{png,json}` ve `qa/H02/independent-motion.json` dosyalarında ayrıca kaydetti. Integratör mesajında source/local rect, scroll600 renk/parallax, reduced motion, 810 breakpoint, rota unmount cleanup ve boş browser errors doğrulandı; bu rapor kapı statüsünü değiştirmez.

## Kalan fark ve sınırlar

- Kaynak responsive CDN fotoğraf türevlerini kullanıyor; yerel aynı gerçek asset'in arşivlenmiş tam çözünürlüklü sürümünü kullanıyor. Crop/geometri eşit, özellikle 60px portrede resampling keskinliği piksel düzeyinde farklı kalabilir.
- Kaynak appear spring sonlandırmasında bazı label/author ölçümleri yaklaşık0.06–0.25px artık translate taşıyor; yerel settled transform tam0. Kaynak kalıntısını taklit eden sabit offset eklenmedi.
- Phone screenshot altındaki EST.2019 kaynakta global bottom-blur altında. H02'nin hemen ardından geçici mevcut Footer bulunduğundan yerelde global blur görünürlüğü farklı; H03 ve diğer bölümler entegre edilince tüm sayfa screenshot'ı tekrar karşılaştırılmalı. Bu fark H02 ölçü/crop değişikliğiyle kapatılmadı.
- Tablet ve XXL kaynak CSS varyantları uygulandı, resize/overflow smoke yapıldı; bu iki boyutta tam source/local görsel eşitlik iddiası yok. Gerçek touch cihaz testi yapılmadı.

Sonraki adım: integratör bağımsız QA ile H02 Q kararını kaydeder. Bölüm ve content sahipliği bu teslimden sonra integratöre geri verilir.
