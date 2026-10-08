# Neiden kaynak ve özgün varlık denetimi

Referans: [neiden.framer.media](https://neiden.framer.media/). İnceleme ve arşiv tarihi 6 Ekim 2026. Bu belge herkese açık HTML, site haritası, tasarım/CMS modülleri ve medya dosyalarının kaynak kanıtlarını kaydeder. Görünür tarayıcı davranışının ve ekran ölçülerinin denetimi ayrıca yapılmalıdır; aşağıdaki hareket değerleri kaynak ayarlarıdır.

## Arşivin kapsamı ve doğrulama

| Kayıt | Sonuç |
|---|---:|
| Gerçek sayfa rotası | 26 |
| Arşivlenen HTML gövdesi | 26 |
| Hareket JSON kanıtı | 26 |
| Tasarım/CMS kaynak modülü | 73 |
| Özgün medya/inline SVG dosyası | 399 |
| Görsel | 136 |
| Font dosyası | 81 |
| MP4 video | 15 |
| SVG | 167 |
| Medya toplamı | 78.331.890 bayt |
| Medya indirme başarısızlığı | 0 |
| Dosya/manifest SHA-256 uyuşmazlığı | 0 |

399 kayıt 399 farklı yerel dosyaya karşılık gelir. SVG toplamının 166'sı HTML içindeki özgün SVG parçaları, 1'i doğrudan bağlantılı SVG dosyasıdır; bu sayı 167 farklı tasarım anlamına gelmez. Duyarlı çıktılarda değişen SVG kimlikleri ve sembol tanımları özgün halleriyle korunmuştur. 65 inline SVG'nin `svg_dependencies` alanı aynı HTML içindeki başka sembollere bağımlılığını belirtir; bunların tek başına görüntülenmesi için bağımlı sembol tanımları gerekir.

`asset-manifest.json` her dosya için kaynak URL, yerel yol, SHA-256, bayt, MIME, erişim durumu, bilinen rota/bağlam, alt metin, duyarlı varyant ilişkisi ve ölçüleri içerir. Raster görsellerin ölçüleri dosyadan, videoların çözünürlük/süre bilgisi `ffprobe` ile okunmuştur. Font ailesi/ağırlığı/stili CSS ve tasarım modülü metadata'sından alınmıştır. WOFF2 ikili ad tablosu denemesi bu ortamda Brotli Python modülü bulunmadığı için tamamlanamamıştır; bu durum indirmeyi veya dosya bütünlüğü doğrulamasını engellemez.

377 gözlenen medya URL'si, Framer görsellerindeki çıktı dönüşüm parametreleri kaldırılarak 233 özgün URL dosyasına gruplanmıştır. `scale-down-to`, `width` ve `height` sorguları manifestte `responsive-transform` ilişkisiyle korunur. Sorgusuz CDN adresinin erişilebilir özgün dosyası indirilmiştir; yerine görsel üretilmemiştir. Google DM Sans v16/v17 ve Framer favicon `assets`/`images` adreslerinde aynı dosya adına sahip farklı içerikler bulunduğu için bu 5 çiftin yerel yollarına URL kimliği eklenmiştir.

## Kaynak gözlemleri

- `robots.txt`: HTTP 200, `User-agent: *`, `Allow: /`; aynı köken site haritası adresini bildirir.
- `sitemap.xml`: HTTP 200; 10 sabit sayfa, 9 proje detayı ve 7 makale detayı listeler. Arşivlenen HTML bağlantılarında site haritası dışında başka iç rota bulunmamıştır.
- `/404` gerçek bir site haritası rotasıdır. Özel hata sayfası HTML'si HTTP 404 yanıtıyla sunulur ve arşivlenmiştir. Diğer 25 sayfa HTTP 200'dür.
- Ana HTML başlığı `Neiden® — Design Studio & Explorations`, dil `en`, generator `Framer e19f2fb`. HTML yorumunda `Published Sep 4, 2026, 9:48 AM UTC` bulunur.
- Ana kaynağın bilinen gezinme hedefleri `/about-us`, `/projects`, `/blog`, `/career`, `/contacts`; footer hedefleri ayrıca `/404`, `/terms-of-services`, `/privacy` içerir.
- Ana HTML'de 25 `section` etiketi vardır; 16'sı adlandırılmıştır. Kaynak sırası: `Hero Section`, `Hello`, `Services`, `Portfolio`, `Strategy *full with `, `Reviews`, `Features`, `Pricing`, `Timeline`, `Facts`, `Our Team`, `Quote`, `FAQ`, `Blog posts`, `Subscribe`, `Contact form`. `Portfolio` içindeki alt içerikler ve isimsiz section'lar için tarayıcı bölümleriyle ayrıca eşleme gerekir.
- Sayfa başlıkları ve görünür kart metinleri URL slug'larından farklı olabilir. Örneğin `/blog/choosing-tech-stack-web-app` başlığı `How Better UX Design Can Turn More Visitors Into Loyal Customers`, `/projects/corporate-website-for-an-it-company` başlığı `Building Better Digital Experiences` olur. Slug'dan başlık uydurulmamalıdır.
- Proje ve blog detay başlıklarında `- My Framer Site` eki kaynakta bulunur. Proje gezinme sayaçlarında `35`/`15` gibi metinler, ana sayfada `May` rezervasyon metni ve arşivde 9 proje kaydı birlikte görünür. Bunlar kaynak içeriğindeki tutarsızlıklardır; görünmeyen 35 proje varmış gibi yeni rota üretilmemelidir.

## Doğrulanan gerçek rotalar

| Tür | Rotalar |
|---|---|
| Sabit sayfalar | `/`, `/thank-you`, `/terms-of-services`, `/blog`, `/projects`, `/contacts`, `/about-us`, `/career`, `/404`, `/privacy` |
| Öne çıkan projeler | `/projects/featured-1`, `/projects/featured-2`, `/projects/featured-3`, `/projects/featured-4` |
| Diğer projeler | `/projects/landing-page-for-an-online-course-copy`, `/projects/corporate-website-for-an-it-company`, `/projects/data-driven-ux-decisions`, `/projects/strategic-thinking-and-brand-foundations-for-dribbble`, `/projects/creating-a-scalable-system-for-growth` |
| Blog detayları | `/blog/web-accessibility-why-it-s-non-negotiable-copy`, `/blog/headless-cms-explained-pros-cons-use-cases-copy`, `/blog/responsive-design-importance-2025`, `/blog/choosing-tech-stack-web-app`, `/blog/website-performance-optimization-tools`, `/blog/web-accessibility-best-practices`, `/blog/headless-cms-explained` |

Gerçek route→page-module eşlemesi `raw/modules/script_main.CY4E0CFi.mjs` içindeki `hu` nesnesindedir. Dinamik desenler `/blog/:rsDiQF9sM` ve `/projects/:M__jskO48`; CMS koleksiyon kimlikleri sırasıyla `gwvrfgSDs` ve `Eyh84k89N`. Koleksiyon kanıtları `si-gJh1EjYMEnjzQZmttPOIoRQtMhG2FyiL2D0u3JIg.CpdifIXe.mjs` ve `wY7Z13ZUBYqmxH1p4DMIUi80Gbgc4RWGcIBHe1KXQDs.BgvkwkG0.mjs` dosyalarıdır. Bunlar yeniden kurulum uygulamasının çalıştırılacak kaynağı değil, içerik ve ayar kanıtıdır.

## Özgün fontlar ve videolar

Font metadata'sında 44 Inter, 17 DM Sans, 14 Inter Display, 4 Cal Sans ve 2 Patung Regular dosyası bulunur. Bu sayılar tipografi ailesi sayısı değil; ağırlık, stil, Unicode alt kümesi ve sürüm dosyalarıdır. `font_metadata` alanındaki `unicode-range` korunmuştur.

Patung için SSR HTML `wANxq4ncIu35guzFWKF73Wj29k.woff2`, hydration kaynağı ise `3pW97ue1dT221JRbcaAMrINDM.woff2` URL'sini içerir; her ikisi de arşivlenmiştir. Görünür el yazısı türünün fontu tarayıcıda doğrulanmalıdır.

Ana sayfa hero videosu `public/assets/videos/ugAzn7fEqsPmmKRMmi19TDmUs.mp4`: 1920×1080, 21,041667 saniye, 14.409.520 bayt. Kaynak wrapper `playing: true`, `muted: true`, `loop: true`, `objectFit: cover` kullanır. SSR `video` etiketinde `preload="none"`, `muted`, `loop`, `playsinline` bulunur; `autoplay` davranışı hydration ayarıyla değerlendirilmelidir.

Ana sayfada ayrıca 9 farklı proje/çalışma videosu vardır: `qhgTQUkR0fODY63Vgy7BsAVWw`, `s2MMSq00J46ljfxMxYzYSkJUF9s`, `9uPeCVl83tLV2N1f1D7DnvXRic`, `EKhFLCAxRa06YADI4msquvzwPTQ`, `DxPC0PMfkY1FHJEn3zhu2zeL0Y`, `UOh1vkxRXJNOKmlDAm9Jwn77W3Y`, `C7u20SR5SoCFQeL0jtSUXpF8Hs`, `9QvAOVASZyqPgWxcC9OAdl4NCo8`, `PUitQ2XFD8ExulHnASL3hF8iDs`; hepsi `.mp4` olarak yerelde saklanır. Diğer rota/modül bağlamlarından bulunan 5 video ile toplam 15 video korunmuştur.

## Hareket ayarlarının kaynak kanıtı

Ana sayfa tasarım modülü `raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs` dosyasıdır. Başlangıç görünme ayarları `raw/index.motion.json` içinde gerçek `appear_id`, HTML class, Framer öğe adı/bağlamı ve breakpoint'leriyle eşleşir. Diğer 25 rota için aynı yapıda `.motion.json` dosyaları HTML'nin yanındadır.

| Kaynak ayarı | Kanıtlanan değer |
|---|---|
| Layout eşikleri | `<810`, `810–1199.98`, `1200–1619.98`, `≥1620` px |
| Hero logo başlangıcı (`ilu1k2`) | scale `1.4→1`; spring bounce 0, delay 3,7 s, duration 1,5 s |
| Hero hizmet satırları | opacity `0.001→1`, y `20→0`; delay 4,3/4,4/4,5 s; spring duration 0,8 s |
| Hero açıklama / CTA / clients | y `60→0`; gecikmeler 4,0/4,1/4,2 s; spring duration 0,8 s |
| Hero karakter yazı efekti | blur 10 px, opacity 0.001, scale 2; onMount, startDelay 3,9 s; karakter delay 0,07 s, spring duration 0,8 s, bounce 0 |
| Genel sözcük görünmesi | blur 10 px, opacity 0.001, y 10; onInView threshold 0; spring damping 40, mass 1, stiffness 97, sözcük delay 0,06 |
| Hero logo hover glitch | hover tetik; shake amplitudeX/Y 10, velocity 5; slice count 4, hueRotate true, min/max height 20/35, velocity 25; duration 1 s, ease-out, infinite |
| Parallax wrapper değerleri | hero video speed 80; hizmet satırlarında 105, sonraki metinde 110 ve başka öğelerde 115/130 bulunur |
| Portfolio variant tetikleri | 4 featured öğe referansı, threshold 0,5; `animateOnce: false` |

Framer `speed` ve `threshold` değerleri doğrudan piksel/saniye ya da görünür yüzde diye yorumlanmamıştır. Semantiği çözmek üzere yalnızca `raw/runtime-evidence/framer.B48xgVro.mjs` ve `motion.CMrxPru4.mjs` indirilmiştir; iki dosyanın URL/SHA/amacı aynı klasörün manifestindedir. Bunlar 73 tasarım modülünden ayrı, dar kapsamlı kaynak kanıtıdır. Public uygulama varlıkları arasında Framer/React/Motion runtime dosyası yoktur.

Mobil override'ların bazı metin/hareket efektlerini kaldırdığı kaynakta görülür. Bu nedenle masaüstü parametrelerinin bütün breakpoint'lerde aynen uygulanması doğru kabul edilmemelidir. Gerçek görünür gecikme, scroll hissi, sticky bölgeler, yeniden tetiklenme ve reduced-motion davranışları tarayıcı hareket denetimiyle tamamlanmalıdır.

## Açıkça doğrulanmamış veya arşivlenmeyen öğeler

- Ana showreel kaynağı [YouTube 6aioEoCdBJw](https://youtu.be/6aioEoCdBJw) hedefini içerir. Bu bir özgün dosya URL'si olmadığı için videonun indirilmesi veya yeni bir dosyayla değiştirilmesi yapılmamıştır. `external_media_references` kaydı bunun durumunu bildirir.
- İletişim ve abonelik alanlarının kaynak DOM'u/ayarları vardır; gerçek form gönderimi, e-posta teslimi ve backend sonucu denenmemiştir. Framer form submit endpoint'i kaynakta görülebilir; hiçbir POST veya test mesajı gönderilmemiştir.
- Polar checkout embed script'i ana HTML'de bulunur. Satın alma/ödeme sonucu denenmemiştir; script varlığı kendi başına aktif ödeme akışının doğrulaması değildir.
- Korumalı tasarım editörüne, kaynak proje dosyasına veya yayımlanmamış CMS kayıtlarına erişim denenmemiştir. İnceleme yalnızca herkese açık yayımlanmış yüzeylerle sınırlıdır.

## Dosya rehberi

- `routes.json`: 26 rota, başlıklar, HTTP durumları, HTML/text/motion kanıt yolları, gerçek iç bağlantılar ve Framer öğe adları.
- `asset-manifest.json`: özgün medya dosyaları ve duyarlı varyant eşlemeleri; modül bağlamları gerçek rota olarak gösterilmez.
- `raw/index.html`, `raw/pages/**.html`: özgün yayımlanmış HTML.
- `raw/*.motion.json`, `raw/pages/**.motion.json`: başlangıç hareket JSON'u ve DOM hedefleri.
- `raw/**.text.txt`: sayfa metni; duyarlı gizli kopyalar da kaynakta olduğu için tekrarlar içerebilir.
- `raw/modules/`, `raw/module-manifest.json`: yalnızca tasarım/CMS kaynak kanıtı.
- `raw/runtime-evidence/`: parallax/eşik yorumuna yönelik iki kaynak modülü.
- `public/assets/{images,fonts,videos,svg}/`: özgün dosyalar.
- `scripts/archive-reference-assets.py`: aynı public kaynakları ve sitemap rotalarını arşivleyen, doğrulanmış dosyaları yeniden kullanan script.
