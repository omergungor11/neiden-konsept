# Neiden — Astra uygulama planı

Hazırlanma: 6 Ekim 2026. Referans: https://neiden.framer.media/. Amaç, referansın görünen içeriğini, özgün medyasını, tipografisini, yerleşimini ve etkileşim davranışını bölüm bölüm yeniden üretmek. Bu dosya uygulama planıdır; çalışan site, tamamlanmış piksel eşleşmesi veya ölçülmüş animasyon süreleri iddiası değildir.

## 1. Kanıt disiplini ve kapsam

- **Gözlendi — kaynak:** herkese açık HTML içinde varlığı doğrulandı; ekranda nasıl göründüğünü tek başına kanıtlamaz.
- **Gözlendi — tarayıcı:** `docs/reference/site-observations.md` içindeki URL, viewport, scroll ve durum kaydıyla doğrulandı.
- **Çıkarım / tasarım kararı:** yeniden üretimin mimarisine ait seçim; referansın iç uygulaması hakkında iddia değildir.
- **Doğrulanacak:** ölçüm veya davranış kaydı yok; ajan değer uyduramaz.

Kanıt kayıtları: `docs/reference/site-observations.md`, `docs/reference/asset-manifest.json` ve kaynak ajanın rota envanteri. Bu planın bölüm listesi başlangıç HTML sırasını gösterir. Framer'ın farklı breakpoint/variant için aynı metni çoğaltması ayrı görünür bölüm sayılmaz. DOM sırası ile görünür/sticky sıra ayrışırsa tarayıcı kaydı esas alınır ve sıra gerekçesi belgelenir.

Öncelik P0 ana sayfanın tamamı ve ortak kabuk. P1 gözlenen iç bağlantı hedefleri ve tekrar kullanılan detay şablonları. Rota envanterine düşmeyen sayfa uydurulmaz. Menüdeki sayı, gerçek CMS kayıt sayısının kanıtı değildir. Bağlantı hedefi incelenmeden bir menü öğesinin anchor veya ayrı sayfa olduğu varsayılmaz. Navigasyon ve detay rotaları bitmeden “tüm site tamamlandı” denmez.

Orijinal metinler, tarih/sayı tutarsızlıkları ve görsel kırpımları sadakat kapsamında korunur; editoryal düzeltme yapılmaz. Formların görsel ve doğrulama durumları yeniden üretilir; gerçek e-posta gönderimi, üyelik, ödeme veya üretim servisine veri iletimi ayrı iş kapsamıdır. Plan ve yerel geliştirme herhangi bir deploy içermez.

## 2. İlk teknik karar

**Vite + React + TypeScript, CSS Modules, Lenis ve GSAP/ScrollTrigger.** Bu, hızlı ölçüm/kalibrasyon ve açık dosya sahipliği için önerilen yeniden üretim mimarisidir. Referansın Framer olmasını Framer çalışma zamanını kopyalama zorunluluğu saymayız. Yeni framework, component kit veya görsel yeniden tasarım hedefi yoktur. Statik içerik yerel tipli veri dosyalarında tutulur. İç rotalar kanıtlandığında tek yönlendirici ve ortak layout kullanılır; sayfa geçiş efekti yalnız gözlenirse eklenir. Paket sürümleri kurulurken resmi dokümantasyonla doğrulanıp lockfile'a sabitlenir.

Önerilen uygulama ağacı (henüz uygulanmış dosyalar değildir):

```text
src/
  app/                 # App, router, route lifecycle; integratör sahipliği
  components/shell/    # Header, Navigation, Footer
  components/ui/       # Kanıtlanan ortak küçük bileşenler
  sections/home/       # H01–H19 ve H12b, her bölüm ayrı klasör
  pages/               # Kanıtlanan diğer rotaların kompozisyonu
  content/             # Metin, kartlar ve asset ID referansları
  styles/              # tokens.css, globals.css, fonts.css
  motion/              # MotionProvider, scroll runtime, preset kayıtları
  assets/              # Yerel manifest adaptörü
public/assets/
  images/               # Özgün raster medya
  svg/                  # Özgün SVG dosyaları
  fonts/                # Özgün fontlar
  videos/               # İndirilebilen özgün videolar
qa/                     # Yerel/golden karşılaştırmaları ve raporlar
```

`tokens.css`: ölçülmüş renkler, font aileleri/ağırlıkları, satır yükseklikleri, dış boşluklar, grid, border, radius, z-index. Uygun olmayan hazır spacing skalası referansa dayatılmaz. Breakpoint'ler kaynak CSS ve daraltma testinden çıkarılır; telefon/tablet/desktop test viewport'ları breakpoint kanıtı değildir. Logo font metni, SVG veya görsel olmasına göre gerçek asset kullanılır.

## 3. Ana sayfa üretim sırası

Aşağıdaki adlar kaynakta gözlendi. Kesin yükseklik, grid, animasyon türü, tetik eşiği ve süre her bölümün keşif kapısında ölçülür. Her satır **tek bağımsız teslim/gözden geçirme birimidir**; sıradaki bölüm öncekinin görsel kapısı geçince entegre edilir.

| ID | Kaynaktaki bölüm | Uygulama dosya sahipliği | Bölüme özel keşif / kontrol |
|---|---|---|---|
| S00 | Ortak header, navigation, footer | `components/shell/` | Kapalı/açık menü, hover, focus, scroll lock, logo, bağlantı hedefleri; footer son aşamada tekrar kontrol |
| H01 | Hero; hizmet etiketleri, CTA, sosyal kanıt | `sections/home/H01-Hero/` | İlk yüklenme sırası, büyük logo, görüntü/video, metin satırları, header ilişkisi |
| H02 | Who We Are | `sections/home/H02-About/` | Büyük metin, görseller, alıntı ve imza; metin reveal var mı? |
| H03 | Services / What We Build | `sections/home/H03-Services/` | Dört disiplin, kartlar, fiyat ve etiketler; kartların hover/sticky davranışı |
| H04 | Portfolio / Case studies | `sections/home/H04-Portfolio/` | Dört kaynak kayıt, medya crop'u, link/hover, scroll boyunca kart yerleşimi |
| H05 | More Cases | `sections/home/H05-MoreCases/` | Üç kaynak satır, hover önizlemesi var mı, tüm projeler bağlantısı |
| H06 | Showreel / Highlights ve ödüller | `sections/home/H06-Showreel/` | Poster/video, play/pause/mute/fullscreen/modal var mı; ödüllerin görünür sırası |
| H07 | Steps / From brief to launch | `sections/home/H07-Process/` | Discovery, Strategy, Creating, Growth sırası tarayıcıda teyit; sticky/pin var mı |
| H08 | Selected Review / True Stories | `sections/home/H08-SelectedReview/` | Testimonial değişimi, yüzdeler, sayı animasyonunun başlangıç/son durumu |
| H09 | Reviews / More Reviews | `sections/home/H09-Reviews/` | Kart adedi, yatay hareket/carousel/drag var mı, mobil taşma |
| H10 | Features / How We Work | `sections/home/H10-Features/` | Kart içi grafikleri gerçek asset/CSS olarak ayır; sayı ve ikon hareketi |
| H11 | Pricing / Packages | `sections/home/H11-Pricing/` | Monthly/Annual iki durum, fiyat geçişi, dahil özellik açıklamaları, CTA |
| H12 | Timeline / The Journey | `sections/home/H12-Timeline/` | 2019–20, 2021–22, 2023–24, 2025–Present; çizgi, sıralama, sayılar |
| H12b | Facts — kırmızı sayaç bandı | `sections/home/H12b-Facts/` | Sayı son değerleri, sayı animasyonu ve tetik/replay; Timeline ile Team arasındaki bant |
| H13 | The Team / Behind Neiden | `sections/home/H13-Team/` | Portre, unvan, alıntı; hover/reveal ve mobil eşdeğeri |
| H14 | What We Believe | `sections/home/H14-Belief/` | Büyük metin ve medya kompozisyonu, scroll etkisi |
| H15 | FAQ / Quick answers | `sections/home/H15-FAQ/` | Beş soru, ilk durum, tek/çok açık davranışı, height animasyonu, klavye |
| H16 | Blog Posts / Articles | `sections/home/H16-Articles/` | Kaynak kayıtların görünür seçimi, kart oranı, başlık/tarih, detay bağlantıları |
| H17 | Stay Updated / Subscribe | `sections/home/H17-Subscribe/` | E-posta boş/geçersiz/geçerli/loading/sonuç durumlarından gözlenebilenler |
| H18 | Contacts / Let's Talk | `sections/home/H18-Contact/` | Alanlar, etiket, saat, sosyal link, form validation; gerçek gönderim yapmadan |
| H19 | Alt marka/footer ve son geçiş | `sections/home/H19-Endcap/` + S00 | Son büyük tipografi, telif, footer açığa çıkma/sticky ilişkisi |

H06/H19 gibi birlikte görünen kaynak blokları ilk tarayıcı ölçümünde gerekirse alt parçalara bölünür; ID değişiklikleri görev kayıtlarında açıkça izlenir. H01–H19 ve H12b toplamı “20 ölçülmüş ekran” anlamına gelmez.

## 4. Her bölüm için kapılar

1. **D — keşif:** bölüm sınırları, önceki/sonraki komşu, viewport, DPR, browser, scroll koordinatı; başlangıç, orta, son durum; her görünür kontrolün state matrisi; font ve asset eşleşmesi; belirsizlik listesi.
2. **L — statik yerleşim:** aynı viewport/scroll'da önce metin, ölçü, renk, grid, görsel crop; animasyon durdurularak/son duruma alınarak karşılaştır. Eksik görseli benzer stok görselle gizleme.
3. **M — hareket:** yalnız kanıtlanan davranış için timeline; başlangıç/bitiş scroll, direction, duration/easing, stagger, opacity/transform, pin mesafesi, replay davranışı kayıtlı olur. Kaynakta olmayan parallax/magnetic efekt ekleme.
4. **R — responsive ve erişim:** dar/geniş, pointer/keyboard, reduced motion, native touch; komşu bölüm taşması ve focus kontrolü.
5. **Q — bağımsız QA:** bulgular severity, dosya, kanıt çifti ve tekrar adımıyla döner. Başarısızlık ilgili ajana geri gider. Integratör kapıyı kanıtla geçirir; rutin kapılar insan onayını zorunlu kılmaz.

Bir bölümü sırf derlendiği için bitmiş sayma. Sonraki bölüm ajanı keşif veya asset eşleme yapabilir, fakat öncekinin kapısını atlayarak sayfaya entegrasyon yapamaz.

## 5. Scroll ve hareket sözleşmesi

Lenis kullanımı kullanıcı talebidir. Kaynak motion denetiminde Lenis kodu `raw/script_main.mjs` içindeki `ic` fonksiyonunda da bulundu; etkin seçenekler ve kullanıcıya görünen scroll hissi motion kaydıyla doğrulanır. Tek kök MotionProvider uygulama yaşam döngüsü boyunca **bir Lenis instance** kurar. `autoRaf: false`; GSAP ticker saniyesini `lenis.raf(time * 1000)` ile ms'ye çevirir. Ayrı `requestAnimationFrame` döngüsü, ikinci ReactLenis kökü veya ScrollSmoother eklenmez. `lenis.on('scroll', ScrollTrigger.update)` bağlantısı tek kez kurulur. Resmi Lenis entegrasyonu `gsap.ticker.lagSmoothing(0)` önerir; bu global ayarın sahipliği kökte tutulur. [Lenis resmi kaynak](https://github.com/darkroomengineering/lenis)

Bölüm ajanı kendi `gsap.context`/`gsap.matchMedia` kapsamını oluşturur; unmount/breakpoint değişiminde revert yapar. Kök cleanup aynı callback referansı ile ticker'ı kaldırır, Lenis listener ve instance'ını temizler. React StrictMode mount/unmount tekrarında instance, listener veya pin spacer birikmez. Bölümler global `ScrollTrigger.killAll()` kullanamaz; başka bölümlerin animasyonunu bozar.

Fontlar yüklendikten, görseller decode olduktan, rota geçişi tamamlandıktan ve accordion gibi layout değişikliklerinden sonra toplu/debounce refresh yapılır. `ScrollTrigger.update()` ile geometriyi yeniden hesaplayan `refresh()` aynı iş değildir. Kaydırma başına refresh yapılmaz. Düz document scroll seçilirse gereksiz scrollerProxy kurulmaz; özel container ancak ölçüm gerektirirse değerlendirilir. [ScrollTrigger resmi dokümantasyon](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)

Reduced-motion açıkken smooth scrolling ve dekoratif scrub/parallax durur; metin/medya görünür son durumda kalır, navigasyon ve accordion çalışır. Menü/modal açılınca scroll lock tek yöneticiden sağlanır; kapanma, Escape ve rota değişimi scroll'u geri açar. İç scroll alanları/touch native davranışı gerçek cihazda doğrulanır. Anchor, hash deep-link, browser geri/ileri ve rota scroll restoration birlikte test edilir. Kaynak Lenis wrapper'ı manual scroll restoration, pushState/popstate sonrası yeni içerik geldiğinde scroll0 reset kullanır; bu davranış rota çiftleriyle doğrulanıp korunur. Aynı URL yeniden açma gözlemi, rota geçişiyle aynı olay sayılmaz.

Tek CSS property aynı anda iki animasyon motoru tarafından sürülmez. Bölüm kökleri `data-section-id`, animasyon hedefleri stabil data attribute kullanır. Her animasyon `docs/reference/motion-register.json` içine (uygulama aşamasında) kanıt ID'si ve kalibrasyon değerleriyle işlenir.

## 6. Asset, veri ve rota yönetimi

Kaynak ajan her medya için orijinal URL, yerel yol, MIME, boyut, hash, doğal ölçüler, kullanım yeri ve doğrulama durumunu kaydeder. Aynı görselin responsive varyantları ID altında toplanır; rastgele ilk URL seçilmez. AVIF/WebP/PNG/SVG, poster/video ve font ayrı değerlendirilir. CSS mask/background içindeki görseller de kapsamda. Manifestte bilinmeyen medya `unresolved` kalır.

Hero kritik medya/font kontrollü preload; alttaki görseller lazy load; boyut/aspect-ratio önceden ayrılır. Video autoplay/muted/loop/playsInline ve poster davranışı gözleme göre. Hareketli medyada aynı frame elde edilemiyorsa görsel QA maskesi kaydedilir ve video davranışı ayrıca test edilir; tüm görseli sessizce karşılaştırma dışına çıkarma.

İç rotalar için R00 envanter görevi önce gerçek `href`, canonical, HTTP sonucu, sayfa başlığı, şablon türü ve erişim durumunu çıkarır. Ana sayfadan gözlenen About/Projects/Articles/Career/Contact/404/Terms/Privacy ve proje/yazı bağlantıları başlangıç keşif hedefidir; URL'leri manifest belirler. Sonra her özgün şablona R01… ID verilir; her CMS kaydı aynı şablon veri doğrulamasından geçer. Sayfa geçişi, yükleme, scroll restoration ve 404 davranışı bütünleşik test edilir.

## 7. Dört slotlu ajan yürütme sistemi

Bu klasördeki dosyalar yeniden kullanılabilir görev sözleşmeleridir; kalıcı arka plan ajanı veya yeni Codex sohbeti oluşturmaz. Çalışma gerektiğinde alt ajan çağrılır; tamamlanınca sonucu integratöre döner. Planlama lideri kullanıcı tercihiyle **Astra**. Uygulama/QA ajanları model talebi ayrıca gelmedikçe mevcut oturum modelini devralır.

| Slot | Rol | Aynı anda izin verilen iş |
|---|---|---|
| 0 | Integratör / Astra planlama | Kuyruk, ortak dosyalar, entegrasyon, kapı kararı |
| 1 | Bölüm builder | Yalnız aktif bölüm klasörü ve o bölümün content dosyası |
| 2 | Referans/asset keşif | Sıradaki bölümün ölçümü veya rota/asset eksikleri |
| 3 | QA / hareket inceleme | Önceki teslimin salt okunur incelemesi, kendi QA raporu |

Dört slot üst sınırdır; integratör dahil. Aynı dosyada iki yazıcı yok. Foundation bitmeden bölüm builder'ları başlatılmaz. Ortak token/motion/router değişiklik talepleri integratöre patch önerisi olarak gider. Motion uzmanı builder ile aynı klasöre eşzamanlı yazmaz; açık sahiplik devri gerekir. Git kurulursa commit bazlı devir kullanılabilir; mevcut boş klasörün Git olduğu varsayılmaz.

Örnek akış: F00 kanıt → F01 temel → S00/H01 D-L-M-R-Q → H02…H19 sıralı kapılar → R00 rota envanteri ve şablonlar → Q90 tüm sayfa/rotalar → Q99 nihai kabul. R00 salt okunur keşif sırasında paralel ilerleyebilir. Ayrıntılı görev protokolü: `docs/agents/README.md`; makine okunur başlangıç kuyruğu: `docs/TASKS.json`.

## 8. Kalite hedefleri ve test matrisi

Aşağıdaki toleranslar **kabul hedefidir; referanstan ölçülen gerçekler değildir**. Ölçüm araçlarının font rasterizasyon farkları raporda belirtilir.

- Referans/yerel screenshot aynı CSS viewport, DPR, zoom, browser, scrollY, hover/focus, menü/accordion/pricing durumu ve font-load noktasında alınır. Dosyaya URL ve state metadata eşlik eder.
- Başlangıç hedefi: temel landmark konumu ve kart/gutter ölçülerinde ≤2 CSS px, büyük bölüm sınırlarında ≤4 CSS px; metin satır kırılımı aynı. Birikimli kayma her bölüm sonunda kontrol edilir.
- Maskelenmemiş kararlı görüntü alanında başlangıç pixel-diff hedefi ≤%1; renk fark eşiği ve maske listesi raporlanır. Sayı tek başına kabul değildir; kritik logo, crop ve metin uyumsuzluğu düzeltilir.
- Ölçüm varsa hareket başlangıç/bitiş sapması ≤50 ms, scroll tetik sapması ≤8 CSS px hedeflenir. Frame-by-frame karşılaştırma, aynı scroll girdisi ve easing eğrisi kontrolü kullanılır. Ölçülmemiş süreye “tam eşleşti” etiketi verilmez.
- Test viewport başlangıç matrisi: 1440×900, 1280×800, 768×1024, 390×844, 360×800; bunlar örnek test ölçüleridir. Referans tarayıcı kaydındaki gerçek boyut ayrıca birebir kullanılır. Kaynak breakpoint'lerinin hemen iki yanı test edilir.
- Mouse wheel, trackpad, touch, Tab/Shift+Tab, Enter/Space, Escape; menü, FAQ, fiyat toggle, medya, kartlar, linkler, form hata/başarı UI, history/back/forward ve hash adresleri.
- `prefers-reduced-motion`, klavye focus, erişilebilir isim, menüde focus yönetimi, `aria-expanded` ve gerçek button/link semantiği; motion kapalıyken içerik kaybolmaz.
- Build/typecheck ve console/network hataları; kırık asset/route; resize sonrası pin drift; 5 rota giriş/çıkışta listener/trigger sayısının artmaması. Performans hedefi test cihazı kaydıyla değerlendirilir; smooth-scroll 60 fps hedefi ölçümsüz garanti verilmez.

Nihai rapor her bölüm/rota için “geçti / farkı var / doğrulanamadı”, kaynak/yerel kanıt çiftleri, bilinen sapmalar ve test ortamını içerir. Eksik video, erişilemeyen sayfa veya gönderim backend'i açıkça yazılır. Bütün sayfa taraması olmadan yalnız hero üzerinden tamamlandı denmez.

## 9. İlk sıradaki belirsizlikler

Kaynak font/weight ve medya eşlemeleri manifestte hazır; gerçek element-font eşlemesi bölüm keşfinde kontrol edilir. İlk desktop/mobile hero, menü, sticky geometri, fiyat toggle ve FAQ davranışı aşağıdaki kanıtlarda kaydedildi. Kalan belirsizlikler: tüm rota/breakpoint durumları, hover video/tooltip, 3D logo etkileşimi, motion süre/easing/stagger'ın gerçek frame eşleşmesi, form sonuçları ve fiziksel touch cihaz davranışı. Bunlar yeni tasarım kararıyla doldurulmaz; ilgili D kapısında ölçülür.


## 10. Keşiften gelen ilk somut güncelleme

Kaynak ajanının sitemap bulgusu **26 rota**: `/`, `/thank-you`, `/terms-of-services`, `/blog`, `/projects`, `/contacts`, `/about-us`, `/career`, `/404`, `/privacy`, dokuz proje detayı ve yedi yazı detayı. Tam slug ve inceleme durumlarının otoritesi `docs/reference/routes.json`; sitemap varlığı tarayıcıda doğrulanmış sayfa anlamına gelmez. P1 sırası: ortak shell → `/about-us` → `/projects` + proje detay şablonu/9 kayıt → `/blog` + yazı detay şablonu/7 kayıt → `/career` → `/contacts` → `/thank-you` → hukuki sayfalar → `/404`/bilinmeyen yol. Thank-you rotası form göndererek değil doğrudan incelenir.

İlk desktop tarayıcı ölçümü **1440×1000, DPR 1**, scrollbar sonrası content genişliği **1425 px**, toplam scrollHeight **29425 px**. Bu değerler bu kayıt içindir; tüm cihazlara sabit yükseklik olarak uygulanmaz. İlk hero screenshot: `docs/reference/screenshots/home-desktop-initial.png`. Koyu animasyonlu ışın/video zemini, büyük beyaz marka yazısı, kırmızı el yazısı overlay ve üç kolonlu düzen gözlendi. Header 44 px, hero 1000 px. Yüklü fontlarda Cal Sans, DM Sans, Patung Regular ve Inter 700 görüldü; hangi öğenin hangi fontu kullandığı element bazında eşlenecek.

| Tarayıcı DOM grubu | Başlangıç–bitiş scroll px | Plan eşlemesi |
|---|---|---|
| Hero | 0–1000 | H01 |
| Hello | 1000–1850 | H02 |
| Services | 1850–4702 | H03 |
| Portfolio (iç içe bloklar dahil) | 4702–14417 | H04–H06; iç sınırlar ayrıca ölçülecek |
| Strategy | 14417–17217 | H07; alt blok eşlemesi teyit |
| Reviews | 17217–18982 | H08–H09 |
| Features | 18982–20334 | H10 |
| Pricing | 20334–21833 | H11 |
| Timeline | 21833–23268 | H12 |
| Facts | 23268–23611 | H12b, RGB(240,43,66) |
| Our Team | 23611–24686 | H13 |
| Quote | 24686–25556 | H14 |
| FAQ | 25556–26745 | H15 |
| Blog posts | 26745–27748 | H16 |
| Subscribe | 27748–28158 | H17 |
| Contact form | 28158–29030 | H18 |
| Footer | 29030–29425 | H19/S00 |

İlk computed-style bulguları: Services başlık sticky top100; Portfolio medya container sticky top0/height1000; Showreel sticky top0 ve kayıtta scale3; Strategy sticky top0/height900; Timeline medya sticky top150; FAQ başlık sticky top100. **Scale3 tek durum gözlemidir, hareketin başlangıç/bitiş aralığı değildir.** Sticky mesafeler başka viewport için ölçülmeden genellenmez. DOM kaynağı `docs/reference/home-desktop-dom.json`; devam screenshot dizisi `docs/reference/screenshots/desktop/` ve capture-index kaydı.

Newsletter e-posta alanında native required gözlendi. Contact Name/tel/Email/textarea alanlarında bu ilk DOM kaydında required flag görülmedi; bu custom validation yok demek değildir. Honeypot alanları görünür UI değildir. Formlara gerçek gönderim yapılmadı. Süre/easing, tüm hover durumları, fiyat durumları ve mobil ölçümler hâlâ bölüm keşif kapılarına aittir.


### İlk etkileşim kanıtları

- Desktop menü açılınca güçlü blur/koyulaştırma üzerinde ortalanmış siyah kart gözlendi; header 44 px görünür kalıyor. Dairesel close kontrolü ve arka planlara göre değişen sabit 40×40 menü ikonu var. `menu-desktop-open.png` kaydı referanstır.
- Pricing Monthly durumu $2500/$5500/$8500; Annual tıklamasından sonra $3500/$6500/$9500 gözlendi. PER MONTH etiketi değişmiyor. Bu referans tutarsızlığı korunur; %24 indirim matematiği varsayımıyla rakamlar düzeltilmez. `pricing-monthly.png` ve `pricing-annual.png` kayıtları kullanılır.
- FAQ başlangıçta 01 açık. 02 açıldığında 01 açık kalıyor: çoklu açık accordion. Bu etkileşimde toplam yükseklik 29425→29876 oldu; refresh ve aşağıdaki bölüm konumu QA'sına dahil edilir. `faq-default.png` / `faq-second-open.png` kayıtları.
- Scroll boyunca sabit 120 px alt blur bandı ve outlined özel cursor gözlendi. Cursor yalnız uygun pointer modunda, native cursor/klavye erişimiyle çakışmadan yeniden üretilir; mobilde davranışı ölçülür.

Görsellerin kesin alt dizinleri ve state metadata'sı `site-observations.md` ile capture-index kayıtlarından çözülür. Kaynak manifesti şu anda 399 asset kaydı ve rota manifesti 26 rota içeriyor; sayı, tüm varlıkların indirilip görsel olarak doğrulandığı anlamına gelmez.

### Kaynak modülünden ek bulgular

Kaynak ajanı ana sayfa modülünde **810, 1200, 1620 px** responsive eşiklerini bildirdi. Bunlar kaynak bulgusudur; CSS uygulamasında sınırın inclusive/exclusive davranışı ve görünür düzen ilgili eşiğin hemen iki yanında doğrulanacak. Ana modül: `docs/reference/raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`; rota/CMS eşlemesi: `docs/reference/raw/modules/script_main.CY4E0CFi.mjs`.

Kaynak parametre örnekleri: hero character blur10/scale2/startDelay3.9s, spring bounce0 ve character delay0.07/duration0.8; word reveal blur10/opacity0.001/y10, viewport threshold0, damping40/mass1/stiffness97/delay0.06. Hero logo hover glitch, shake amplitude10/10/velocity5, dört slice hueRotate, slice maxHeight35/min20/velocity25, timing1s ease-out infinite değerleri bulundu. Video parallax speed80 ve bazı metinlerde105/110 değerleri var. **Bu Framer/source parametreleri doğrudan GSAP duration veya piksel dönüşümüne eşit kabul edilmez.** Önce kaynak efektin anlamı çözülür, sonra tarayıcı hareketiyle kalibre edilir; ekranda teyit edilene kadar motion register durumu `source_only` kalır.

Asset ajanının son envanter dağılımı: 136 image + 81 font + 15 video + 167 SVG = 399 özgün dosya; yaklaşık78.33 MB. Paket boyutu frontend'in ilk yükte tümünü indirmesi gerektiği anlamına gelmez. Manifestin indirme/doğrulama durumları esas alınır.


Motion denetiminin kesin breakpoint aralıkları: phone ≤809.98; tablet 810–1199.98; desktop 1200–1619.98; XXL ≥1620 CSS px. `docs/reference/motion-audit.md` ve `docs/reference/design-tokens.json` ayrıntıların otoritesidir. Alt blur bandı kaynakta height120/maxBlur20/fadeRange70%/topToBottom/saturation120/noise false. Cursor kaynakta outer40/core12/linkCore32, white difference blend, ring0.2s/core0.1s linear ve highlight hedef kutusuna+5px; hedef seçicileri ve pointer cihaz koşulları görünür kanıtla eşlenecek.

Hukuki sayfalarda geniş desktop eşiği farklıdır: `/privacy` ve `/terms-of-services` için XXL1800px, desktop üst sınır1799.98px. Ana sayfanın1620px eşiği bu iki rota için körlemesine uygulanmaz.


### Scroll, giriş ve etkileşim kalibrasyon güncellemesi

Motion denetiminin kaynak kayıtları uygulanırken `motion-audit.md` / `design-tokens.json` değerleri kullanılacak:

- Gerçek Lenis instance: ana sayfa XXL duration3; phone/tablet/desktop duration4. İç şablonlar XXL3.5, diğerleri4. wheelMultiplier1.1, syncTouch false. Genel kütüphane default'u referans değeri sayılmaz; seçeneklerin etkisi kontrollü wheel/trackpad kaydıyla eşleştirilir.
- Ana sayfa preloader her mount'ta4s; session-once davranışı eklenmez. Siyah intro üzerinde beyaz el yazısı ve altta logo. Df state beklemeleri0.3→3→0.2s; tween0.6/cubic[0.77,0,0.54,0.99]. Hizmet satırları4.5+0.8s, ticker4.3+1.5s ve karakter stagger daha uzun sürebilir. İlk capture setinde5.5s bekleme kullanıldı; tek bekleme bütün Hero hareketlerinin bittiğini garanti etmez. Güncel araç8s bekler ve nihai QA computed opacity/transform/filter ile metin ölçüsü kararlılığını kontrol eder. Girişin ayrıca ilk/orta/son kareleri yakalanır.
- Global rota enter opacity0/scale1.1,0.5s tween ease[0.62,0.01,0.54,1]; exit opacity0/scale1,0.2s aynı ease. Blog-detail→Home özel enter0.2s/opacity0/scale1/ease[0.27,0,0.51,1]. Bu kaynak geçişleri rota QA'sında doğrulanır; tek genel fade ile değiştirilmez.
- Showreel kaynak refmarker'larıyla scale3→1; phone final1.6. Play final phone0.6/desktop1. YouTube lightbox hedefi https://youtu.be/6aioEoCdBJw. Özgün yerel video bulunmadığından bu gösterim harici embed olarak korunur ve bağımlılık raporlanır; yerel dosya varmış gibi davranılmaz.
- Reviews3D logo silindiri autoSpeed0.12deg/frame, hoverpause, drag delta×0.25, blur8/opacity0.2. Frame tabanlı kaynak hızını yenileme oranından bağımsız uygulamak gerekiyorsa referans cihazın frame hızını ölçerek zaman tabanına dönüştür; otomatik60fps varsayımını kanıt diye sunma.
- Hello metninin white→white0.1 renk geçişi difference blend ile görünen siyah sonucu üretir; doğrudan siyah opacity tween'iyle aynı görünüm varsayılmaz.
- Pricing rolling digits1.5s/ease[0,0,0.2,1]/threshold0.2; switch knob hover scale1.12/spring0.4/bounce0.2. Monthly/Annual sayı tutarsızlığı korunur.

Asset teslimindeki gerçek yollar `public/assets/{images,svg,fonts,videos}/`; implementasyon bu yapıyı ve manifest ID'lerini kullanır. Yeni `public/media` kopyası oluşturulmaz.

65 arşivlenmiş inline SVG başka symbol tanımlarına bağımlıdır. F01 asset adaptörü `svg_dependencies` alanını kullanarak ilgili tanımları bir sprite/bağımlılık closure içinde korur. Eksik sembollü SVG'yi standalone img ile kullanıp boş logo/ikon üretmek kabul edilmez.

### Mobil tarayıcı kanıtı ve tekrar koşulları

390×844/DPR1 viewport simülasyonunda içerik genişliği375px, header44px ve hero844px. Header logo+hamburger biçimine sadeleşir; body/CTA/review/client alanları alt alta yeniden yerleşir. Menü kartı mobile yaklaşık8px dış boşlukla iki kolonlu kalır; `menu-mobile-open.png` ve kararlı `home-mobile-initial.png` kayıtları esas alınır. Bu test gerçek touch cihaz testi değildir.

İlk manual mobile DOM toplam38367px kaydetti. Sayfa açıldıktan sonra viewport değiştirilen otomatik kayıtta Hello ve Quote metin ölçüleri farklı kaldı; bu resize/mount ölçüm farkı `screenshots/mobile-resize/` içinde ayrı tutuldu. Karşılaştırma aracı artık sayfa mount edilmeden viewport'u kurar, fontları ve preloader/reveal sonunu bekler, scroll0'a alır. Temiz kayıtların ölçüleri `screenshots/mobile/initial-dom.json` ve checkpoint state'leri `capture-index.json` içindedir. Resize sonrası split-text yeniden ölçümü F01/H02/H14 QA'sına eklenir; geçici farklılığa göre sayfa yüksekliği hardcode edilmez.
