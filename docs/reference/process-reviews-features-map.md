# Process / Reviews / Features — hedefli uygulama haritası

7 Ekim 2026 · Astra planlama teslimi. Yalnız bu Markdown ve eş JSON yazıldı; implementasyon/QA geçişi iddiası yoktur. **Kesin TASKS eşlemesi: H07 Process; H08 SelectedReview (heading + selected review + stats); H09 Reviews (More Reviews + cylinder); H10 Features.** ID değişikliği ve renumber yoktur. Bu teslim TASKS dosyasına yazmaz.

K: kaynak ayarı; G: canonical screenshot/DOM gözlemi; U: uygulama önerisi; ?: henüz doğrulanmayan durum. Eş JSON 418 CSS kuralını, 14 canonical checkpoint'i, gerçek metinleri, 31 raster asset eşlemesini ve SHA-256 değerlerini içerir. Tüm raster hash'leri yerel dosyalarla doğrulandı. Inline SVG/mask bileşenleri bu31 sayısına dahil değildir ve arşiv symbol bağımlılıklarıyla çözülmelidir.

## Kaynak adresleri ve geçerli ölçüm

H = `raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`; R = `raw/modules/dKxooQaLG.DqFUPdSN.mjs` FeaturedReview; ayrıca `motion-audit.md`, `design-tokens.json`, `raw/index.html`, `asset-manifest.json`. JSON'daki ofsetler Unicode karakter ofsetidir; byte değil. Çıpa+component adıyla doğrula.

**Strategy'nin gerçek data-framer-name değeri `Strategy *full with ` — son boşluk dahil.** Yalnız `Strategy` adına göre üretilmiş iki discovery JSON kanıt sayılmaz. Bu harita bunları kullanmadı. Canonical desktop1440×1000/content1425 ve temiz phone390×844/content375 setleri kullanılır; `mobile-resize` baseline değildir.

G desktop Strategy y14417.28/h2800; Reviews y17217.28/h1764.81; Features y18982.09/h1352. Canonical phone başlangıçları yaklaşık15075/17230/20312. Bunlar ölçüm checkpoint'leri; animasyon için sabit global scroll koordinatı yapılmaz. JSON canonicalGeometry/CanonicalCaptures gerçek kayıtlara bağlanır. Başlangıç screenshot'ları bütün reveal'lerin son durumunu garanti etmez.

## H07 — Process / Strategy

K H `Nu` @363699, displayName Features @416083 — bu component adı sayfadaki ayrı Features bento bölümüyle karıştırılmamalı. Gerçek instance Strategy section @843665 civarında. Sol “From brief / to launch”, açıklama, alıntı ve Henrik Olsen/Head of Content/Neiden®; portre asset `37018134833dbfc1`. Kaynak alt metni portredeki kişiyi yanlış betimleyebilir; fotoğraf değiştirmek gerekmez.

G desktop üç ana kolonda sol metin, sağ iki kolonda **2×2 kart**. Görsel sıra üst01 Discovery/02 Strategy; alt04 Growth/03 Creating. Numeric DOM sort ile01/02/03/04 row-major yapma. Scroll aktivasyon sırası marker1→2→3→4; state kodları bu sırayı izler. JSON gerçek uzun açıklamaları responsive tekrarlarıyla korur; builder tek görünür varyanta indirger.

| Kart | Başlık | İçerik özeti |
|---|---|---|
| 01 Discovery | Understanding / the real challenge | Dinleme ve gerçek problemi anlama |
| 02 Strategy | Defining / a clear direction | Insight → focus, alignment |
| 03 Creating | Building / the right solution | Systems/interfaces/products/brands |
| 04 Growth | Launching / and growing | Feedback, evolution; desktop/tablet giriş cümlesi kısalıyor |

K root `.framer-igkuh9`: height2800px, overflow visible, background black.05; XXL padding100/0/200, desktop100/0/150. `.framer-yk5cfr` sticky top0, paddingTop100, max1550; desktop40px yan boşluk. Sağ card container `.framer-1jnu8jq-container`80vh (1000px viewport'ta800), sol/sağ flex1:2, gap1. Source CSS'nin2800px tasarım yüksekliği uygulanabilir; canonical global y14417px uygulanmaz.

K dört absolute marker `.framer-1qisn8p`, `j997zb`, `k5n8qq`, `p82se8`: height200; XXL/desktop top200/600/1000/1400. Tablet top600/1000/1400/1800; phone700/1050/1400/1750. Desktop threshold0 ve variants `Uz9xtcYUl/JenkkOQBP/rqLE46DJG/DbBqe2VxI`; phone threshold.5 ve `QJicUlYpl/t6BHvOB4n/rrJ24mJ0E/h89BphgOC`. Bu threshold görünür alan yüzdesi değil viewport offset'i; motion-audit Nl/Ul semantiğini kullan.

K tablet outer sticky container relative,column,gap100,padding50/40; card container sticky top80,height700. Phone root min-content,padding50/0/100; container column,gap80,padding50/20, card height auto. Desktop sticky çözümünü phone'a olduğu gibi taşımak metni ve son kartları örter. Aktif kart koyu zemin, açık metin, kırmızı number pill; inactive yüzey/açıklama düzeni kaynak state tablosundan taşınır. Card padding XXL50/desktop40/tablet30; phone Nu variant CSS otoritedir.

U wrapper: ProcessSection(relative markers) → layout/sticky wrapper → left content + ProcessCards grid. Her marker/state scope bölüm içinde; active index wheel event sayısı değil marker geometri hesabıdır. Metin appear, kart renk state'i ve sticky positioning ayrı katmanlar. Reduced-motion'da tüm açıklamalar görünür; dekoratif transition durur. Observer/context cleanup ve font/resize refresh merkezi useMotion ile.

**D kontrolü:** doğru exact name ile bölüm rectleri, dört marker top/height ve card aktif renklerini başlangıç/öncesi/sonrası kaydet. G eldeki33% screenshot'ta01 hâlâ aktif göründüğünden kaynak state geçişlerinin bütün eşikleri yalnız checkpoint ile doğrulanmış sayılmaz. **L:**2×2 sıra,80vh/700/auto, portrait/copy. **M:**4 state ileri/geri. **R:**tablet sticky owner değişimi,phone wrap. **Q:**H06 bitişi ve Reviews başlangıcı drift testi.

## H08 SelectedReview + H09 Reviews — tek kaynak parent

Integratör tek `ReviewsSequence` parent sahibidir. H08 builder heading/selected review/statistic row kardeş parçasını, H09 builder More Reviews/cylinder kardeş parçasını üretir. Ortak section height/padding/background/grid çoğaltılmaz. H08 ve H09 kendi klasör/content dosyalarının tek yazıcısıdır; section layout integratörde kalır. Hiçbir carousel navigasyonu veya müşteri route'u uydurulmaz; HTML'deki gerçek linkler JSON actualLinks'te.

G/K selected: “True Stories.”, RETURN RATE82%, Elin Sørensen/Head of Product/Fjordwave®; quote “We finally had a brand system…” ile başlar. Desktop1200 varyantı “built to scale with confidence.” kullanır; diğer varyantların bazıları “built to scale.” Phone kaynak varyantında CEO/ACME® metni de var: tek global metin seçip responsive farkları silme. R modülündeki variant mapping + canonical phone screenshot ile eşleştir. Portre `d9129ba4a59f2db9`; quote logo görünümü portrait boyutuyla veya şirket metniyle tahmin edilmez. Desktop screenshot'ta üç kolonun solunda portre ve sağ2kolonda quote; portrait köşesi kesik ve quote mark overlay var.

Stats: sosyal kanıt80+/4.9/5/361 reviews; Higher conversion rate +6% MoM ve rolling3x; Increase in qualified leads +12% MoM ve rolling+68%. HTML'deki0…9 dizileri ayrı rakamlar değildir. `Ll` rolling digit davranışı1.5s/smooth, mask ve digit-height ile; source from/to/typography gerçek instance'tan alınır.

More review H `xd` @485898 / displayName More review @499520. Maja Løkke/Product Manager/Nextwave®: yeni sitenin navigation/manage/scale etkisi; portre `fa70aa24ad8c650c`. Erik Dahl/Marketing Lead/Arcticon®: visibility/traffic/positioning; portre `12fc0c101a195ee1`. XXL card470, diğer kırılımlar400px instance yüksekliği. Source full quote JSON'da; yapay kısa lorem metin yok. More review caption/quote/SVG ve author ayrı animasyon scope'ları.

### Logo silindiri — gerçek 3D, yatay ticker değil

K H `function Fp(e)` @633008 ve actual instance @875615 civarı. Default component autoSpeed.18 kullanmıyor; gerçek instance **.12 derece/frame**. Default/desktop15 logo, phone8 logo; kesin sıra+manifestID JSON cylinderImageLists alanında. Phone yalnız ilk8'i kesmez: ayrı seçilmiş dizi kullanır.

Radius=`containerWidth/2 × .9`; tablet radiusScale.95. Perspective1700px; tilt0; item100×50, phone105×50; gerçek genişlik min(itemWidth,containerWidth×.8). Her logo angle=index×360/count. Parent rotateY spring stiffness300/damping100/mass1. Child transform translate(−50%,−50%) rotateY(angle) translateZ(radius); preserve3d, backface visible. Ön açı0'da blur0/opacity1, arka180'de blur8/opacity.2; intermediate interpolate.

Hover pause true; dragStart auto dönüşü durdurur, dragEnd geri açar; drag deltaX×.25 derece; dragMomentum false/elastic0. Kaynak rotation event'te state'e yazılıp render fırtınası yaratacak React setState değildir; motion value kullanır. Kaynak RAF sayısına bağlı olduğundan120Hz'de hız farklılaşabilir. U existing GSAP ticker callback'i kullan, ikinci RAF/Lenis kurma; source .12/frame eşlemesini ölçmeden saniyeye normalize etme. ResizeObserver radius'u günceller. Cleanup observer.disconnect + ticker.remove + pointer listeners/capture + spring cleanup; reduced-motion değişiminde de temizle.

**D:**selected responsive copy/state,stats final digits,More review grid,15/8logo sırası. **L:**foto crop/kesik köşe/quote typography ve border grid. **M:**word reveal ile statcounter ayrı; cylinder drag/hover pause/direction. **R:**physical touch henüz yok; drag engellenmiş sayfa scroll davranışı test edilir. **Q:**3D rotation,pause,resume/resize/unmount art arda; kayıp logo veya leak yok. Accessibile isimler mevcut, dekoratif clone link değildir.

## H10 — Features bento

K H `.framer-897cy` / “Features”; title desktop/phone “How We Work”, tablet **“Features”**. İç `.framer-1591u5w` grid3×2,tablet2×3,phone column. Desktop/XXL card500px, tablet420px,phone450px; wrapper max1550/desktop40px/phone20px. Bu altı eşdeğer ikon kutusu değildir: her hücrenin özgün görsel ve animasyonu vardır.

| Kaynak sıra | Component/ofset | İçerik ve uygulama |
|---|---|---|
| 1 | Ud @505809 | Turning complexity into quality; dört avatar,3check satırı, açıklama/tooltip; default q6cz1WjWp,tablet/phone era6mq3QM |
| 2 | Qs @187806 | El içinde telefon; conversion+68–72%,responseUnder2hours,retention95%; floating/glass kartlar; XXL FqnV7YQ__,diğer YN987fIsg |
| 3 | il @286896 | Kırmızı EXPERTISE13+/YearsIndustryExperience; default LSJVdWcqo,tablet/phone mo4lvOOYE |
| 4 | up @584066 | Simplicity,Less friction/More focus,özgün soyut medya; default ZaBUgU1Sz,tablet/phone LB8IJzGVY |
| 5 | ru @327889 | Koyu Client Growth;+12%MoM;0→68%rolling; default vDguYKjwq,tablet/phone QiHs96MMH |
| 6 | ed @423667 | Faster Execution,Launch Time2–4Weeks,özgün medya; default qMbGG5Klb,tablet/phone acrY7X1aB |

Assetler: dört avatar `e5c9a6f737ebc94b/e1295fab8e2382e7/bf74cdc2140adcc2/b9d706e4ab6faff2`; phone/hand `e40530f17cd48b36`; abstract image `f1296e36409ee2b6`; growth `2444e89c28b0dcb8`; faster execution `3538edf4ac74375f`. JSON kaynak URL/yerel yol/sha içerir; kaynakta yaşayan icon maskeler raster asset yerine yeniden çizilmez.

K Feature1 line reveal spring.6/delay.2; section appear delay.6/duration1. Source Feature2 green indicator As size6,colorrgb(38,235,70),duration1; support ticker gap15/velocity50/hover50% (motion-audit); own appear springs delay.4/.5/.6 duration2. Feature3 farklı alt hedeflerde delay.8/.9/1 duration1. Feature5 Ll from0→instance68,suffix%,duration1.5,smooth,layerInView; source DM Sans font70/line.8 ve small variant override ayrıca izlenir. Feature6 appear delay.5/duration2 ve .6/.7 duration1 hedefleri vardır. Bunlar bütün karta tek opacity fade olarak birleştirilmez.

G desktop başlangıç screenshot'ında kart1 text, telefon glass overlay, kırmızı13+ hücresi görünür; alt sıranın reveal son durumları bu karede görünmez. **13+ kaynak metnidir; tüm sayıları count-up yapma.** +68–72% ve95%source text; doğrulanmış rolling sayaç68%'dir. Feature1 tooltip/hover, floating kartların tam yaşam döngüsü ve small variants ayrıntıları component kaynağı+ek state capture ile kapanır. Eksik durumda yeni sürekli bounce/parallax icat edilmez.

U wrappers: FeaturesSection → header + grid; her card border/layout → ownmedia → ownappear → tooltip/counter katmanları. Width/height resize ölçümü parent'ta; floating card transforms kendi çocuklarında. Metadata text ve reduced-motion son değer görünür. Feature5 counter tekrar görünmede reset edilmez; gerçek trigger once/prop-change kuralları Ll'dan alınır. Opacity0 tooltip screen reader focus'a istemeden katılmaz.

## Dispatch ve kabul sözleşmesi

Root App/package/motion/sharedUI sahibi integratördür. Builder hedef bölüm/content dosyalarına yazar; önceki map veya TASKS'a yazmaz. H07 için H06Q; H08 için H07Q; H09 için H08Q; H10 için H09Q bağımlılığı. Keşif paralel olabilir, entegrasyon sıralı gate ile. `useMotion` reducedMotion/refresh ve root GSAP ticker; asset adapter gerçekID ile; fonts/shared labels tekrar tanımlanmaz.

Her görev `TASK_TEMPLATE` ile kesin TASKS ID’si, yazılabilir yollar, kanıt, state ve kabul hedefini alır. Sonuç: changedfiles,sourceanchors,referans/yerel screenshot çiftleri,build/typecheck,cleanup sonucu ve açık farklar. Rutin gate için insan onayı zorunlu değildir; passed kararını integratör verir.

Açık işler: doğru-name Strategy hedefli marker/state ölçümü; Reviews responsive copy mapping; tüm tooltip/hover/animation phase kayıtları; SVG dependency closure; tablet/XXL/physicaltouch/reduced-motion; cylinder60/120Hz. Hiçbiri bu planın tamamlanmasıyla test passed sayılmaz.


## H08/H09 kesin source sınırı ve sahiplik

H source `Reviews/.framer-acqz3s` @861443 tek ReviewsSequence parent'ına karşılık gelir. Ofsetler source className başlangıçlarıdır.

| Sahip | Kaynak alt blok | H ofset |
|---|---|---:|
| H08 | Title `.framer-166izqz` ve iç RETURN RATE facts annotation `.framer-w1i7dm` | 861537 / 863599 |
| H08 | Featured review `.framer-bobbne` | 864237 |
| H08 | Extra facts/statistics `.framer-pwasqz` | 865672 |
| H09 | Reviews block `.framer-1bbkko8`; responsive More Reviews heading varyantları burada | 866897 |
| H09 | Reviews content `.framer-1eb3j4y`; iki review kartı | 870814 |
| H09 | Logos carousel `.framer-1p8gh4w` | 874589 |
| Integratör | Ortak Lined grid `.framer-1q9o1hl` | 877248 |

H08'in sonu H09 Reviews block başlangıcıdır; H09'un sonu ortak grid overlay öncesidir. Grid normal flow'a eklenmez. Canonical Reviews toplam1764.81px yüksekliği iki parçanın **birleşik** ölçümüdür; hiçbir child'a tek başına atanmaz. H08/H09 kendi kaynak internal boşluklarını korur; outer parent boşlukları tek yerde kalır. H09 cylinder kaynak250px/diğer kırılımlar200px yüksekliğini H08 stats yüksekliğine ek olarak kendi akışında üretir.

Builder yolları: H08 `src/sections/home/H08-SelectedReview/` + `src/content/H08.ts`; H09 `src/sections/home/H09-Reviews/` + `src/content/H09.ts`; H10 `src/sections/home/H10-Features/` + `src/content/H10.ts`. H08 rootQA geçince H09 monte edilir; H09 rootQA geçince H10. Ortak Reviews kanıt envanteri JSON'da tek kaldı; içerik/media dosyalarını iki builder'ın bütünüyle tekrar render etmesi istenmiyor.
