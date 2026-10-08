# Neiden hareket ve tasarım kanıt denetimi

Bu belge 6 Ekim 2026 tarihli kaynak arşivi ve masaüstü/mobil viewport tarayıcı ölçümleriyle hazırlanmıştır. `K` kaynakta açıkça tanımlanan konfigürasyonu, `G` tarayıcıda gözlenen sonucu, `U` uygulama tarifini belirtir. Kaynak değeri, hareketin tarayıcıda bütün koşullarda doğrulandığı anlamına gelmez. Statik ekran görüntüsünden süre veya easing çıkarılmamıştır. Mobil kayıt fiziksel telefon/dokunma testi değildir.

**Kaynak kısaltmaları:** `H` = `raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs` (Home); `T` = `raw/script_main.mjs` (template, Lenis, router); `F` = `raw/runtime-evidence/framer.B48xgVro.mjs` (yalnızca semantik kanıt). Bu minify edilmiş dosyalarda satır yerine benzersiz arama çıpası ve yaklaşık **karakter ofseti** verilmiştir. Ofsetler Python `read_text()` sonucu içindir; byte ofseti değildir. Dosya isimleri `raw/module-manifest.json` üzerinden özgün URL’ye bağlanır.

Makinece okunabilir renk, font, 97 ayrı metin preset konfigürasyonu, 83 seçili yerleşim kuralı, responsive override ve gerçek masaüstü bölüm geometrisi [design-tokens.json](./design-tokens.json) içindedir. Tekil SSR görünme animasyonları/DOM bağlamları `raw/index.motion.json` ve diğer rotaların `.motion.json` dosyalarındadır. Bu belge, sürekli scroll, hover, modal, variant ve özel bileşen davranışlarını o envantere ekler.

## 1. Kırılımlar, fontlar ve koordinat sistemi

| Değer | Kanıt | Uygulama sonucu |
|---|---|---|
| Phone `≤809.98`; Tablet `810–1199.98`; Desktop `1200–1619.98`; XXL `≥1620` | K: H `wg`, `V_`; T `du`; `raw/index.html` `data-framer-breakpoint-css` | 390/810/1200/1620 tasarım tuvalleri breakpoint örnekleridir. Çalışan sayfaya sabit 1200px genişlik verilmez. |
| Privacy ve Terms sayfalarında XXL `≥1800`, Desktop üst sınırı `1799.98` | K: `30Sy8OQP...mjs`, `5HTBdfz...mjs` `breakpoints` | Ana sayfanın XXL eşiğini hukuki sayfalara otomatik yayma. |
| Boxed max `1550px`; Desktop/Tablet yan boşluk `40px`; Phone `20px` | K: H `.framer-ilu1k2`, media override; G: heading x40 | XXL’de 1550px iç alan ortalanır; daha dar kırılımlarda yan boşluğu kullan. |
| Ana hizalama genellikle üç kolon; tablet çoğunlukla iki; phone akışları özel | K: H `.framer-19kx6y0`, `.framer-1s13if6`, `.framer-din45i` | Hero phone alt grid dört kolon; subscribe phone override farklıdır. Her bölüme tek global grid dayatma. |
| Cal Sans 400 wordmark; DM Sans 400/500/600/700 UI; Patung Regular 400 el yazısı | K: font tanımları; G: `home-desktop-dom.json.fonts` | Font dosyalarını varlık manifestindeki kaynaklarla eşleştir. Inter bazı zengin metin/kalın fallback kayıtlarında bulunur. |
| Accent `#f02b42`; koyu bölümler `#191919`; yüzey `#f2f2f2`; black05 `rgba(0,0,0,.05)` | K: H CSS, HTML body tokens; G: section backgrounds | Koyu renkleri tek bir #000 değerine indirgeme. |
| Büyük section H2 100px / 80px / tracking −8px; H3 70px / 63px / −4.2px; küçük H4 20px / 22px / −1.4px | G: 1440×1000 ölçümü; preset CSS K | Bunlar Desktop gözlemidir; responsive değerler JSON’daki medya kayıtlarından alınır. |

**G:** Ekran 1440×1000 / DPR1; gerçek içerik genişliği **1425px**. Dikey scrollbar 15px pay aldığı için 1440px ekran görüntüsünü 1440px içerik kabul etmek kolonların x konumunu kaydırır. İlk statik DOM örneğinde footer sonu yaklaşık 29425px’dir. Mutlak bölüm y değerleri doğrulama ölçümüdür; responsive yerleşim veya animasyon hesaplarının sabit girdisi yapılmaz.

**G:** Temiz mobil kayıt `screenshots/mobile/initial-dom.json`: viewport390×844, içerik375px, header44px, Hero844px, toplam38367px. Viewport sayfa mount edilmeden kurulunca Hello780.78px ve Quote812.97px ölçüldü. Desktop mount sonrasında daraltılan eski `screenshots/mobile-resize/` setinde toplam37958px ve bu iki metin yaklaşık205px daha kısa kaldı. Split-text ölçüm/rehydration yaşam döngüsü resize QA’sına dahildir; bu farkı global yükseklik sabitlemesiyle kapatma. Temiz390×844 kaydındaki `internation/al`, `uniqu/e` bölünmeleri referans wrap davranışıdır; ideal dilsel satır bölünmesi varsayımıyla değiştirilmez.

## 2. Lenis ve route geçişleri

### Gerçek Lenis örneği

**K:** T `function ic(e)` (~301300), `ic.defaultProps`, `children:_(ic,{` örnekleri. Defaults süre1.2/wheel1 olmasına rağmen **sitedeki instance bu defaults’u kullanmaz**:

| Ortam | Süre | Diğer gerçek ayarlar |
|---|---:|---|
| Home XXL | 3s | vertical orientation/gesture, wheelMultiplier1.1, touchMultiplier1, smoothWheel true, syncTouch false, infinite false, autoResize true |
| İç template XXL | 3.5s | Aynı ayarlar |
| Phone / Tablet / Desktop, tüm bu template’ler | 4s | Breakpoint override |

Easing `min(1, 1.001 - 2 ** (-10*t))`; her `requestAnimationFrame` içinde `lenis.raf(timestamp)` çağrılır. Native scroll değerleri değişir; sayfayı transform eden ayrı sahte scroller değildir. Dokunmada `syncTouch:false` olduğu için tekerlek yumuşatmasıyla aynı dokunma ataletini varsayma.

**K:** Wrapper `history.scrollRestoration='manual'` yapar; `pushState` öncesi scroll konumunu alıp Lenis’i durdurur. Yeni içerik MutationObserver ile gelince native ve Lenis scroll0’a sıfırlanır; 40ms sonra resize/start; 100/200/400/800ms ek resize. `popstate` aynı sıfırlama yolunu çağırır. Cleanup RAF, observer, listener ve history patch’i geri alır.

**G:** Aynı URL tarayıcıda yeniden açıldığında 25556px önceki scroll konumunun kaldığı bir örnek görüldü; açık `scrollTo(0,0)` sonrasında doğru başlangıç yakalandı. Bu tek gözlem route değişimindeki kaynak sıfırlamasını çürütmez; capture prosedürü route navigasyonundan ayrı kesin scroll reset uygulamalıdır.

**U:** Uygulamada tek Lenis instance sahibi kullan; sayfa/layout değişiminde çift RAF oluşturma. Modal scroll kilidi, FAQ açılması, fiyat değişimi, font ve medya yüklenmesi sonrasında ölçümleri yenile. Anchora giderken güncel DOM top değerini kullan. Browser Back/Forward, deep-link/hash ve modal aç/kapat için ayrı test yazılmalıdır; kaynağın her navigasyonda üst konuma dönme davranışı bilinçli korunmalıdır.

### Sayfa geçişleri

**K:** T `function fu`, `value:{global:{enter:` (~343000): enter opacity0, scale1.1 → görünür scale1; **0.5s tween**, ease `[.62,.01,.54,1]`; exit opacity0, scale1; **0.2s tween**, aynı easing. `x:0`, `y:0`; exit `y:'0%'`. `damping:30, mass:1, stiffness:400` objede bulunur fakat type tween olduğu için spring gibi yorumlanmaz.

Blog detay route kimliği `y99KKWosI` → Home `P5avYm6ru` özel enter override: opacity0, scale1; **0.2s tween**, ease `[.27,0,.51,1]`. Bu tek istisnayı bütün route çiftlerine yayma. Header menü açılması sayfa route geçişi değildir.

**U:** Old/new route görünürlüğü, scroll reset ve ölçüm yenilemesini geçiş yöneticisiyle bağla. Ölçüm screenshot’ında geçişin bitmesi beklenmelidir. Bu zamanlamaların bütün route çiftleri videoyla ölçüldüğü iddia edilmez.

## 3. Başlangıç preloader ve Hero

**K:** H `function Lp(e)` (~636370) Home’da `duration:4` (~757104) ile bağlanan `Preloader max`/`Df` frame’i gösterir. `position:fixed`, 100vw×100dvh, z99999, mount’ta görünür; dört saniye sonunda opacity0 exit **duration0** ile kaldırılır. SessionStorage/once kontrolü yoktur: yeni Home mount’u yeniden başlatır.

`Df` iç state dizisi: `Fz7bedPAT` → **300ms** → `n717XTsCJ` → **3000ms** → `pRpGSfHY_` → **200ms** → `h3E6viGm6`. Variant transition **0.6s tween**, ease `[.77,0,.54,.99]`. `yf` el yazısı karakter görünmesi: blur10px, opacity.001, scale3 başlangıç; startDelay1; karakterler arası delay.07; duration.8 spring/bounce0. Siyah paneller `.framer-13nc3i2`, `.framer-ffupx2` viewport yüzdesi üzerinden açılır.

**G:** Phone390×844’de 600ms sonra tam siyah intro, ortada beyaz el yazısı “less noise. more direction.” ve altta Neiden logosu yakalandı (`screenshots/home-mobile-loading.png`). Bu görüntü yüklenmeyen Hero olarak değerlendirilmemelidir.

Hero wrapper ilk scale1.4 →1: `Ag` delay3.7 / duration1.5 spring. Diğer başlıca başlangıç reveal’leri: hizmet etiketleri delay4.3/4.4/4.5 duration.8 spring; glitch logo delay3.9 duration1 tween `[.74,.03,.44,.95]`; tagline karakterleri startDelay3.9, blur10px, scale2, delay.07 duration.8; açıklama delay4.0 duration.8; CTA delay4.1 duration.8; müşteri satırı delay4.2 duration.8; logo ticker delay4.3 duration1.5, x150/opacity.001 →0/1. Çıpalar H `Ag`, `Mg`, `Pg`, `Fg`, `Ig`, `Rg`, `zg`, `Vg`, `Ug`, `Wg` (~747000).

Hero background video `ugAzn7fEqsPmmKRMmi19TDmUs.mp4`: oynayan, muted, loop, controls false, cover. **G:** tarayıcıda 21.041667s duration, autoplay true, muted true, loop true. Kaynakta ikinci `srcUrl` fallback bulunur; `srcType:Upload` için gerçek asset `srcFile`’dır.

Hero grain: `Noise.BrrF4Orx.mjs` instance duration.12, opacity.15, scale1.2; 200% tile yüzeyi/inset−50%; x `[0%,-10%,10%,0%]`, y `[0%,10%,-10%,0%]`, linear repeat∞ mirror. Logo hover glitch: `J4_VSMCVU...mjs` + H `playMode:'hover'`; shake ampX/Y10, velocity5; slice count4, velocity25, minHeight20/max35, hueRotate true; timing duration1s, ease-out, infinite true; timeSpan0–25%. Bu logo için sürekli otomatik glitch yazılmamalıdır.

## 4. Scroll hareketlerinin gerçek semantiği

**K:** F `function El`/`function Dl` (~89300): `factor=speed/100−1`; bütün Home örneklerinde `adjustPosition:false`, `offset:0`, dolayısıyla **transformY = −scrollY × factor**. Speed değerleri piksel mesafesi değildir:

| Katman | Kaynak speed | Ekleme transformY |
|---|---:|---:|
| Hero video | 80 | +0.20×scrollY |
| Hero üç hizmet etiketi ve açıklama | 105 | −0.05×scrollY |
| Hero tagline | 110 | −0.10×scrollY |
| Hero glitch logo | 115 | −0.15×scrollY |
| Hello sol / sağ görsel | 110 / 130 | −0.10 / −0.30×scrollY |

H `Hero wrapper` ayrıca onScroll transform y0→−150 taşır. F `Ul` onScroll’ü **sayfanın genel scroll progress** değeriyle 0–1 arasında interpolate eder; bu −150’yi Hero’nun ilk viewport’unda tamamlanan hareket gibi yeniden yorumlama. Aynı node üzerindeki appear/parallax/scroll y değerleri toplam, opacity/scale değerleri çarpım olarak compose edilir (F `sE` value composition).

**K:** `onScrollTarget`, global scrollY ile markerların document offsetTop ve height aralıklarını kullanır. F `Nl`: marker başlangıcı `documentTop−1−offset−viewportThreshold×viewportHeight`; bitiş marker yüksekliğine ve sonraki marker sınırına bağlanır. `Ul` sürekli değer interpolate eder. Variant hedefleri aynı marker geometrisini kullanıp **ayrık state** değiştirir. `threshold:.5` burada “elementin %50 alanı görünür” ifadesiyle karıştırılmamalıdır; **viewport yarısı offset**’idir. Normal appear threshold ise F `tc/rc` görünür yükseklik / min(elementHeight,viewportHeight) oranıdır.

**U:** Continuous transform, discrete variant ve once-appear trigger’larını ayrı kayıtlar olarak uygula. Her `resize`, viewport yüksekliği değişimi ve metin/font akışı sonrası marker aralıkları tekrar hesaplanmalıdır. Scroll’u bağımsız saniye tabanlı timeline’a bağlama.

## 5. Bölüm bölüm hareket sözleşmesi

| Bölüm / Desktop G başlangıç ve yükseklik | K kaynak ve hareket | U yeniden kurma tarifi |
|---|---|---|
| Hero / 0–1000 | H `Hero Section` ~757584; yukarıdaki preloader/reveal/parallax/grain/glitch; section100vh | Video arka planı, difference içerik, ilk mount reveal ve scroll katmanlarını ayrı wrapperlarda tut. |
| Hello / y1000 h850.38 | H `Hello` ~776829; `function zp` ~637300 karakter renk reveal; offsets `start .8` → `end .5`; base white.1 → white1; `.framer-1ldnz2x` ve quote difference blend. Sol/sağ görsel parallax110/130, phone görseller gizli. | Beyaz source metin difference sayesinde beyaz zeminde siyah görünür; doğrudan siyah renk atamak görsellerin üstündeki invert davranışını kaybettirir. Intro cümlesi font XXL90 / Desktop70 / Tablet50 / Phone31, weight600, tracking−.06em, line1.1. |
| Services / y1850.38 h2852.09 | H `Services` ~788027; `.framer-56lvco` sticky top100px; sağda `Service Item`/`Np` Big/Medium/Small medya yerleşimleri ve reveal; başlık/counter/text appear | Sol başlığı yalnızca sağ uzun içerik süresince pin et; ancestor overflow nedeniyle sticky bozulmamalı. Varlıkların sırasını ve kırılım varyantını koru. |
| Portfolio featured / y4702.47 | H `Portfolio` ~807568; `.framer-lrkxhk-container` sticky top0 height100vh; `Porfolio Background`/Kf dört CMS image; `.5` marker `featured-1…4`; Kf spring1s/bounce0 crossfade; aynı alan grain | 4 foreground bölüm gerçek anchor yüksekliğini üretir. Background layer tek sticky100vh; index güncel marker tarafından seçilir. İlk dört featured kartı grid katalogla değiştirme. |
| Portfolio küçük projeler | `pz5VXzp1c...mjs` `PortfolioItemVisual` Default/1200/Tablet/Mobile; tween.8 `[.71,-.01,.21,1.01]`; word reveal start.3/delay.085/duration.4; title/arrow/photo hover variant | Kartları ayrı media, overlay, başlık, arrow katmanlarıyla kur. Hover foto ve metin değerleri modüldeki PiYe7gvu4/yl45S3Qv0/Faxi8dlfN durumlarına bağlanır. |
| Showreel, Portfolio alt sahne | H `Showreel` ~823270: absolute anchors250vh/top250px; sticky `.framer-1skoswp` top0. Sahne scale3→1, phone3→1.6. Başlık opacity0/scale1.2 →1/1 →0/.8; play0/.4→1/1 (phone final.6); detay satırı0→1 | Markerlar `showreel`, `showreel-1`, `showreel-2`, `showreel-3`, `showreel-4`. Title viewportThreshold1, play/timing.5, scene0. Sahne ve play farklı ilerlemeleri kullanır. 3×3 muted loop video kolajı ayrı arka plan. |
| Portfolio son büyük Neiden satırları | H `.framer-q4pcnr`, `.framer-3ikny6` ~841500: gap80, velocity30, normal/reverse, hover100 | İki ters yönlü kesintisiz tekrar. Kaynak kelimenin ölçeği ve yatay kesilmesi korunur. |
| Strategy / y14417.28 h2800 | H `Strategy *full with` ~843665; sticky `.framer-yk5cfr` top0 / padding100; dört marker `neiden-features-1…4`; `Nu` variants Uz9xtcYUl/JenkkOQBP/rqLE46DJG/DbBqe2VxI, threshold0. Phone QJicUlYpl/t6BHvOB4n/rrJ24mJ0E/h89BphgOC, threshold.5 | Aktif kart koyu zemine ve kırmızı number pill’e geçer; geçiş state’lerini markerlarla değiştirmek gerekir. State index’i wheel event sayısına bağlama. |
| Reviews / y17217.28 h1764.81 | H `Reviews` ~861430; `dKxooQaLG...mjs` `FeaturedReview`; büyük review içinde word/opacity reveal; More review xd; Fp3B silindir ~875615 | Review başlığı ve foto reveal, alttaki More Reviews ve 3B logo sahnesi birbirinden ayrı. Silindirin davranışı aşağıda. |
| Features / y18982.09 h1352 | H `Features` ~877622; değişik Feature component animasyonları, glass/backdrop, destek ticker’ı/green blink vb. | Statik altı ikon kartı yaklaşımı yeterli değildir. Feature 1…6 konfigürasyonları H tanımlarından taşınır; özel iç sayaç/ticker/blur korunur. |
| Pricing / y20334.09 h1498.81 | H `Pricing` ~888585; Pricing Table Full `Os`; switch click fiyat state’lerini değiştirir; rolling digit1.5s; knob spring.4/bounce.2 ve hover1.12 | Monthly/Annual fiyat state’leri, tooltip ve farklı popüler kart görselini kur. Fiyatları “24% SAVE” etiketinden hesaplama. |
| Timeline / y21832.91 h1434.91 | H `Timeline` ~897810; n7T0uSRim... `Timeline`; foto `.framer-gp1en6-container` sticky top150; dört marker `timeline-date-1…4`, threshold.5; Big1…5 / Small1…5; spring.6 | Yıl seçimi, sağ metin aktive etme, kırmızı pin/line ve sticky foto birlikte güncellenir. Phone Small state’leri ayrı kaynak mapping’dir. |
| Facts / y23267.81 h343 | H `Facts` ~914845; gu/Rolling Dn sayacı1.5s smooth, layerInView.2; kırmızı yüzey; farklı counter from/to/prefix/suffix | Rolling digits, masked viewport ve tabi sayı fontuyla kur. JS ile tek textContent artışı aynı görüntüyü vermez. |
| Our Team / y23610.81 h1075.61 | H ~918233; n7T0uSRim... `Team member`, tween.6 ease[.74,.01,.5,1.01]; primary photo hover blur4/scale1.2; ikinci portrait opacity0/blur8/scale1.3→1/0/1; quote ve social reveal | Görsel değişimi ile bilgi kartını ayrı hover layer olarak tut. Kart portrait enter scale1.7→1, tween1.5 `[0,.51,.38,1.02]`; title marquee ayrı. |
| Quote / y24686.42 h869.78 | H `Quote` ~928023; zp character reveal start.8→end.5, white.1→white; `[img]` yerleri gerçek inline image; img scale.85→1, opacity.2→1 | Metin içi görsellerin width/baseline/wrap değerleri ve source typo korunur. Koyu zemin üstünde beyaz reveal; Hello ile aynı karakter mekanizması. |
| FAQ / y25556.20 h1188.63 | H ~946198; `.framer-1fy38fm` sticky top100; `J2n5L90bP...mjs` Active/Inactive/Mobile/Mobile Inactive; item spring damping60/stiffness400/mass1, button damping100/stiffness400 | Gerçek answer yükseklikleri açılır/kapanır; .4 tween `[.65,-.02,.3,.99]` ikon/yerel geçişi ayrıca bulunur. Layout Jump Preventer kaynak referansı parent yüksekliğini RAF’da takip eder; uygulamada measured height/ResizeObserver ile aynı sonuç alınabilir. |
| Blog / y26744.83 h1003.41 | H ~963162; `lidwk2txR...mjs` Blog post hover variants; title/photo/image overlay | İki/üç kart kırılımı ve hover photo/text state’leri modülden eşleştirilir. Linkler gerçek CMS detail route’una gider. |
| Subscribe / y27748.23 h410 | H ~970891; `J4_VSMCVU...mjs` Subscribe Button; hover glitch + form state | Input border/placeholder, button glitch, success/error/pending görünümleri ayrı state. Kaynak form request’i göndererek deneme yapılmadı. |
| Contact / y28158.23 h871.72 | H ~979028; `UgROJz0ib...mjs` Contact form wrapper/button; default/hover/pressed/success/error/pending variant; tween.2 `[.44,0,.56,1]`, karakter swap | Form state görünümü ve submit validasyonunu kur; kaynakta provider gizli honeypot alanları bulunur. E-posta teslimatı istenmediği için gerçek gönderim yapılmadı. |
| Footer / y29029.95 h395.23 | T `Footer`/Fs; Js Observer footer görünürken alt blur’u devre dışı bırakır; footer type/character reveal | Footer viewport’a dokunduğu anda alt blur gizlenir; CTA/copyright/social/nav bağlantıları ayrıca hover varyantlıdır. Desktop23-footer capture’da alt blur görünmez. |

## 6. Ortak hover, cursor, ticker, sayaç ve modal

### Metin swap ve butonlar

`jH37M3q97.DpHzVeDz.mjs` `Button`: ana katman spring **.6s/bounce0**; text’in iki kopyası overflow gizli kutuda görünür/gizli. Bir kopya y+15, diğeri y−15, character onMount tween **.1s**, stagger **.03**, ease `[0,.52,.29,.99]`. Hover text color ve background değişir; icon rotation `iconRotation` prop’tan gelir. Bu değeri bütün butonlarda varsayılan90° diye sabitleme. Pressed ayrıca farklı background ve icon rotate0’dır. T Small button, Buy Button, footer/menu item modülleri bu aileye benzer fakat kendi konfigürasyonları vardır.

### Cursor ve sticky kontroller

**K:** `GxPE6dg5x.DYxnSyWw.mjs` ProjectCursor: beyaz difference ring40/core12; a hover’da core32. `.cursor-highlight-element` varsa kutu ölçüsü +5px ring hedefidir; dıştaki en üst highlight parent seçilir. Ring .2s linear, core .1s linear; z9999, fixed, pointer-events none. RAF hesaplamasında ring pozisyon step1.1, core step.3; CSS native cursor gizlemesi ayrıca kontrol edilmelidir. Wrapper `data-framer-cursor` kayıtları component’ın nerede bağlı olduğunu belirler; Phone’da yokluğu sırf cihaz tahminiyle varsayılmamalıdır.

**K:** T `Ls` back-to-top: yalnız `scrollY>200` **ve yukarı scroll** halinde opacity1/translateY0/pointerEvents auto; diğer haller0/+50/none. CSS opacity+transform **.4s ease**. Click `window.scrollTo({top:0,behavior:'smooth'})`. Menü toggler `Us`: scrollY>200 olduğunda0/−50→1/0, .4s ease; shared isOpen durumuyla wide/tablet/mobile-open/close variant seçilir. `Hs` JS medya eşikleri809/1199, CSS fractional sınırlarından ayrı yazılmıştır. Ana ilk header ile scroll sonrası fixed header iki ayrı örnektir.

### Marquee/ticker

| Instance | Gap | Velocity | Hover modifier | Direction |
|---|---:|---:|---:|---|
| Hero müşteri logoları `.framer-k6p45e` | 100px | 50 | 100% | default |
| Portfolio “Case studies.” `.framer-1l0x2p` | 10px | 50 | 50% | default |
| Portfolio iki büyük Neiden `.framer-q4pcnr` / `.framer-3ikny6` | 80px | 30 | 100% | default / reverse |
| Team heading `.framer-1hgelcp` | 15px | 50 | 50% | default |
| Feature iç support ticker `.framer-1kxkmq` | 15px | 50 | 50% | default |

F `sA` hover değerini100’e böler; reverse işareti−1’dir. Vh/ticker frame hesapları velocity’yi zamana bağlar; döngü genişliği gerçek item width+gap ölçümünden çıkmalıdır. Kayıtlarda draggable false; Reviews Fp sürükleme ayrı bileşendir. Sonsuz clone düzeninin sonunda görünür sıçrama, duplicate gap veya yön terslenmesi olmamalıdır.

### Rolling digits ve pricing

`MVsHQR_EN.BO0_G_by.mjs` ve H `Ll` sayacın her basamağı için from→to digit dizisi üretir. Görünür satır height `fontSize×1.2`, width `fontSize×.62`; tabular-nums. Hareket `y=−(sequenceLength−1)×digitHeight`. Mask transparent0 / black18 / black82 / transparent100. LayerInView tetiklemesi IntersectionObserver **threshold.2**, bir kez disconnect. Değer değişince started reset ve RAF restart; fiyat switch’inde bu yol kullanılmalıdır.

Home pricing gerçek rakamları:

| Plan | Monthly | Annual |
|---|---:|---:|
| Launch | 2500 | 3500 |
| Growth | 5500 | 6500 |
| Signature | 8500 | 9500 |

**K/G:** Kaynak instance ve `pricing-monthly.txt`/`pricing-annual.txt` + ekran görüntüleri bu yönü destekler. Görsel “24% SAVE” yazmasına rağmen Annual daha yüksektir; birebir yeniden üretimde bu uyuşmazlık otomatik düzeltilmez. Metin extraction her basamağın tüm animasyon dizisini içerdiğinden `[0,1,2,…]` değerlerini ayrı fiyatlar sanma. Pricing/Facts digit animation1.5s, smooth cubic `[0,0,.2,1]`.

### Reviews 3B logo silindiri

H `function Fp` ~633000, gerçek instance ~875615: autoSpeed **.12 derece/RAF frame**, perspective1700px, radius `containerWidth/2×.9`; tablet radiusScale.95; item100×50, phone itemWidth105; damping100, stiffness300, tilt0. Her logo açısı360/imageCount. TranslateZ yarıçap; arka açı180’de blur8px, opacity.2; ön açı0’da blur0/opacity1. Hover pause true, horizontal drag delta×.25 derece, dragElastic0/dragMomentum false. AutoSpeed zamana normalize edilmediği için orijinal hız60/120Hz’de farklılaşabilir; eşleme testini sabit referans FPS’de yap. Bu sahneye CSS düz yatay ticker koymak aynı sonucu üretmez.

### Showreel lightbox

H `blockDocumentScrolling:true,dismissWithEsc:true` (~827191), backdrop overlay `.framer-1mafuat`: enter .3s tween `[.5,0,.88,.77]`, exit .3s `[.12,.23,.5,1]`, opacity0↔1; backdrop click hide. Content container opacity0↔1 .4s spring/bounce.2; içeride scale.5↔1. `YouTube`/Bi url **https://youtu.be/6aioEoCdBJw**, play On, shouldMute true, thumbnail Medium Quality, radius0. Bu harici YouTube player, kolajdaki MP4’lerin birinin fullscreen gösterimi değildir. Portal `#template-overlay` → `#overlay` → document.body fallback sıralı.

**U:** Focus management, Esc, backdrop, inner click, scroll kilidi ve video kapanınca stop/pause davranışını kontrol et. Kaynak kontrollerinin tamamı tarayıcıda henüz tıklanıp gözlenmedi; yalnız config’e dayanarak “YouTube playback test passed” yazılmaz.

### Sabit alt gradient blur

T `function zt` + actual instance `blurMax:20,maxBlurAt:70,direction:'topToBottom',saturation:120,enableNoise:false,backgroundOpacity:0`; 120px fixed bottom, pointer-events none. Web çalışma yolu **sekiz backdrop-filter katmanı**: katman i=1…8 için blur `(i/8)^2×20px`; maske transparent0 → transparent `((i−1)/8)×70%` → black `(i/8)×70%` → black100. `translateZ(0)`, hem standart hem WebKit mask/backdrop kullanılır. Js IntersectionObserver threshold0 ile footer görülürse display/visibility important gizler.

**U:** Tek 20px backdrop blur veya blur uygulanmış görsel kopyası bu gradyanı üretmez. Footer görünme eşiği, safari mask ve viewport alt boşluğu ayrı doğrulanmalıdır.

**G:** Desktop FAQ ilk durumda01 açık;02 açılınca01 açık kaldı. Bu ikinci açılışta toplam sayfa yüksekliği29425→29876px ölçüldü (`site-observations.md`, OBS-FAQ). Desktop davranışı çoklu açık item’a izin verir; tablet/phone ayrı doğrulanmalıdır.

## 7. Kapsam, ölçüm protokolü ve kalan doğrulama

Kaynakta Home için 6 `styleTransformEffectEnabled`, 9 `parallaxTransformEnabled`, 5 marker-target kayıt grubu ve 78 `threshold` kaydı bulunur; bunlar override/tekrarlar içerdiği için “78 farklı efekt” sayılmaz. Kod defaults, gerçek instance, breakpoint override ve DOM observation ayrı kayıt olarak okunmalıdır. Renk/typografi/yerleşim değerlerinin exact override’ları JSON’da, route içeriği/varlık listeleri ayrı manifestlerde, SSR appear instance’ları `.motion.json` içindedir.

Capture prosedürü: viewport’u **mount öncesi** kur → route aç → fontlar/medya ölçümü hazır → Home4s intro ve bütün Hero reveal’leri bitene kadar bekle → açık native+Lenis immediate scroll0 → 2RAF/layout ölçümü → snapshot. 5.5s tek başına bütün reveal’lerin tamamlandığını garanti etmez: ticker delay4.3+duration1.5 ve karakter stagger’ı daha geç bitebilir. Son computed opacity/transform ve metin ölçümünün kararlılığı kontrol edilir. Scroll sahnelerinde hedefe varıp Lenis hareketi durulana kadar bekle; aynı viewport/content width/DPR ve marker progress kaydını kullan. Hareket videosunda wheel input/delta, timestamp, scrollY, aktif state, rect, computed transform/opacity/filter/mask ve media currentTime kaydedilmelidir. Aynı screenshot zamanı ticker/grain/video karelerini eşitlemez; sabit yakalama modu ancak hareket ayrı test edildikten sonra kullanılmalıdır.

**Henüz yalnız kaynak konfigürasyonuyla bilinenler:** tüm hoverların desktop/tablet/phone gerçek event davranışı; bütün route çiftlerinin geçiş videosu; FAQ tablet/phone ilk-open/multiple-open ve collapse davranışı; YouTube açılma/oynama/kapanma; pricing tooltip hit alanları; pointer cursor bağlantılarının phone davranışı; breakpoint sınırlarının 809/810/1199/1200/1619/1620 kenar testleri; legal1800 exception; resize sırasında sticky/marker ölçümü; reduced-motion ve120Hz sonucu. Bunlar son QA kabul matrisi için açık işlerdir, görsel dosyalardan başarılı sayılmaz.

`Parallax.CLO65Qwx.mjs` ayrı reusable image bileşeni Home’un Framer speed mekanizmasıyla karıştırılmaz. About Us’ta gerçek strength150, direction top-bottom, cover; kendi element progress’i `start end` → `end start`, image yüksekliği100%+300px/top−150 ve y−150→150; load opacity.15s. `Text_reveal_1.OGoxEvqO.mjs` de Home zp’den ayrıdır: kelime opacity, spring stiffness100/damping20 defaults; inner pages gerçek instance çoğunlukla startOffset.8/endOffset.6. Kullanıldığı rotada instance değerleri kontrol edilir.

Uygulama tamamlanmış kabul edilmeden: her rota ve kırılım görsel eşleştirmesi, tüm varlık/url mapping’i, bütün önemli scroll marker durumları, hover/pressed/focus/default, menü open/closed, modal open/closed/Esc, pricing iki state, FAQ expanded/collapsed ve form yerel validation/pending/success/error state’leri denetlenmelidir. E-posta/harici checkout gönderimi ayrı yetkilendirilmiş işlevsel görevdir; plan kapsamındaki görsel denetim bunları doğruladığını söylemez.
