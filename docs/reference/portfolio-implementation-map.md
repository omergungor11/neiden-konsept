# H04–H06 Portfolio uygulama haritası

7 Ekim 2026 · Astra planlama ayrıntısı. Bu teslim yalnız H04/H05/H06 keşif ve uygulama sözleşmesidir; bölüm implementasyonu veya QA geçişi değildir. K = kaynakta doğrulandı; G = tarayıcı checkpoint'i; U = önerilen uygulama; ? = açık ölçüm. JSON eş dosyasında **4 featured + 3 more-case + 9 video**, gerçek asset ID/yolları, 104 ilgili CSS kuralı, 20 metin preset kaydı, 9 canonical checkpoint ve kaynak ofsetleri bulunur.

## Kanıt ve koordinatlar

- **H:** `raw/modules/2uQbRrDtoxfE3UZHZ-2wgMSI-vEbDwSP3FN7xx0FUAc.DVuEzT9_.mjs`.
- **P:** `raw/modules/pz5VXzp1c.DojEgfLu.mjs`, `PortfolioItemVisual` — **H04 foreground** bileşeni; H05 küçük satır bileşeni değildir.
- **F:** `raw/runtime-evidence/framer.B48xgVro.mjs`, `Nl/Ul` marker interpolation. Kaynak ofsetleri Python Unicode karakter ofsetidir, byte değil; benzersiz çıpa esas alınır.
- `motion-audit.md`, `source-audit.md`, `asset-manifest.json`, `design-tokens.json`, `raw/index.html` ve canonical `screenshots/{desktop,mobile}/capture-index.json` birlikte kullanıldı. `mobile-resize` golden değildir.
- G desktop1440×1000/DPR1/content1425: Portfolio parent y4702.47, sonraki Strategy y14417.28. Canonical checkpoint'ler y4702/7578/10454.
- G temiz mobile390×844/DPR1/content375: Portfolio başlangıcı yaklaşık5694, Strategy15075; checkpoint y5694/7401/9108/10816/12523/14230. Bunlar uygulamanın sabit scroll keyframe değerleri değildir.
- `section-layout/{1440,390}/portfolio.json` artık mevcut: desktop666 ve phone573 node. Seçilmiş geometri JSON eş dosyasına aktarıldı. Sparse screenshot bütün crossfade sınırlarını veya hover state'lerini doğrulamaz.

## Bölünmeyen parent, ayrık bölüm sahipliği

Kaynakta H04/H05/H06 **tek** koyu `Portfolio/.framer-1eh6nam` parent altındadır. Parent arka planı #191919, position relative, overflow clip, z2. Son boşluk XXL220/desktop150/tablet130/phone120px. Bu boşluğu üç ayrı bileşene kopyalamak sayfa boyunu bozar.

U: Integratör `PortfolioSequence` kompozisyonunda tek parent/background/end reserve tutar. H04 yalnız heading + featured stage; H05 yalnız More works; H06 yalnız Highlights + showreel + awards + end tickers render eder. `App` veya ortak kapsayıcı integratörün dosyasıdır. H04/H05/H06 kendi klasörleri ve content dosyalarının tek yazıcısı olur. Parent'ın görsel semantiği üç sibling React bileşenle korunabilir; global sticky state paylaşmak gerekmez.

```text
PortfolioSequence (integratör: renk, clipping, final reserve)
├─ H04 heading + Case studies ticker
├─ H04 featuredStage (relative, sadece 4 markerın yüksekliği)
│  ├─ absolute backgroundHost → sticky100vh → crossfade layers
│  └─ normal-flow featured markers/cards (4×100vh; phone gap30)
├─ H05 moreWorks grid + facts annotation
├─ H06 Highlights heading
├─ H06 showreelStage (400vh)
│  ├─ absolute markerGroup (top250px,height250vh)
│  └─ stickyScene (top0; 3 video row toplam100vh)
├─ H06 awards
└─ H06 endTickers (parent sonuna anchor; reserve tek kez)
```

Sticky ancestor'ına `overflow:auto/hidden` ekleme; kaynak `clip` scroll container yaratmaz. Transform ve clip yalnız gerekli çocukta olsun. Featured background H05/H06 boyunca pinlenmez. End ticker'ın absolute parent koordinatı wrapper değişiminde bilinçli aktarılır. Bölüm builder ortak parent dosyasını değiştirmek yerine integratöre API/patch önerir.

## H04 — featured case akışı

K H `l_` @749948: featured alanı `kWRSjN_qX` true, limit4. HTML ile gerçek sıra/medya eşleşti:

| Sıra | Başlık ve rota | Asset ID |
|---|---|---|
| 1 | Identity Through Visual Contrast · `/projects/featured-1` | `50dddefad347f3ff` |
| 2 | Digital Products Through Interaction · `/projects/featured-2` | `93c60342e279bdfe` |
| 3 | Brand Systems for Modern Audiences · `/projects/featured-3` | `0297947ad35a9508` |
| 4 | Visual Languages for Growing Brands · `/projects/featured-4` | `23dd3bb5c8b4216d` |

Dördünde year2025/Client Clandesite ve görünür kaynak sayaç **01.**; sayacı otomatik1/2/3/4 yapma. Kategori dizileri JSON'da. Slug'dan başlık üretme. Aynı asset hem net foreground hem blurred background olur.

**Yerleşim K:** H `.framer-57ujmz` @1017099 başlık padding XXL200/0/100; desktop150/40/100; tablet100/40/50; phone100/20/70. Üç kolon başlık grid'i tablet iki kolon, phone column/gap20. “Case studies.” ticker gap10/speed50/hover50%/draggable false. H `.framer-1sphto1` @1020305 her featured marker height100vh; phone padding70px üst/alt ve parent gap30. Desktop40px, tablet40px, phone20px yan boşluk; XXL max1550.

P `.framer-xd5mhb` @33329 image viewport yüksekliği65vh, Mobile override @36968 **45vh**. Üst metadata grid3→tablet/phone2; title altta20px padding ve desktop3kolon. Phone kategoriler yok; tablet title/category order değişir. Kaynağın preset fontları DM Sans'tır; JSX `fonts:[Inter]` listesi actual CSS preset ailesini geçersiz kılmaz. Metadata12px/500/line1/−.02em; title14px/600/line1/−.04em; kategori12px/600. Case studies başlık XXL130/desktop100/tablet80/phone60px, weight600/line.8/−.08em. JSON preset kayıtları override detaylarını taşır.

**Background K:** H `Kf/Porfolio Background` @570652, transition `Pf` spring1s/bounce0. Variant sırası `s1FzgYRl0`, `UPfbcS8Ld`, `rj8UhDCOC`, `f5uWwVPmG`. H binding `.framer-lrkxhk-container` dört `featured-{1..4}-portfolio-item-scroll` markerını viewportThreshold.5 ile discrete state'e bağlar; once false. Her layer scale1.2; aktif blur sırası **10/7/7/10px**, black overlay **.3/.6/.6/.3**. Final layer base7 olsa da aktif variant blur10 yapar. Aktif grain duration.12/opacity.15/scale1; gerçek tile asset JSON'da.

U: İndeks tetiklerini güncel marker rect + viewport ortasıyla kur, aşağı/yukarı aynı state sınırını kullan. Crossfade opacity kendi tween'idir; scroll progress'e sürekli four-way opacity karıştırması değildir. Layer görsel transform, opacity, mask ve grain farklı düğümlerdedir. Görünmeyen layer linkleri focus/hit target olarak üstte kalmamalı; foreground linkleri tek erişilebilir hedef olabilir.

**Foreground motion K:** P `an` @20321 tween.8/ease[.71,−.01,.21,1.01]. Image slot appear y150→0, inner appear scale1.7→1, duration1.5/ease[0,.51,.38,1.02], threshold0. Hover wrapper scale1.1→1; logo opacity0/scale1.3→1/1. Default XXL hover black overlay.2; desktop1200 varyantına aynı overlay otomatik yayılmaz. Word reveal start.3/.4/.5, spring.4/delay.085/bounce0, repeat false; title ve metadata kendi targetlarına bağlanır.

P `strength:150` ayrı `Parallax.CLO65Qwx.mjs` kullanır: cover, top-bottom, image height100%+300/top−150, local element progress `start end`→`end start`, y−150→150. Bu Framer global speed80/105 mekanizması değildir. U: slot appear, hover scale, inner appear ve parallax dört disjoint wrapper; aynı transform için motor yarışı yok.

**Teslim:** `src/sections/home/H04-Portfolio/{Portfolio.tsx,Portfolio.module.css,...}`, `src/content/H04.ts`. Export isimleri integratörle uyuşmalı; data asset ID ile `asset(id)` üzerinden okunur. Önce H03 Q geçer; H04 Q geçmeden H05 entegrasyonu yapılmaz.

## H05 — More Cases

K H `h_` @751293: CMS offset6/limit3. Bu bir yeni carousel değildir; masaüstünde sol başlık/CTA, sağda2kolon genişlikte üç expandable satırdır.

| No | Rota | Başlık | Asset ID |
|---|---|---|---|
| 01 | `/projects/data-driven-ux-decisions` | Brands Built Through Consistency | `971e82e195a66983` |
| 02 | `/projects/strategic-thinking-and-brand-foundations-for-dribbble` | Exploring New Digital Interactions | `5081a3d1c8f20898` |
| 03 | `/projects/creating-a-scalable-system-for-growth` | Shaping Brands Through Design | `b138d993b4500882` |

Year2024/2024/2025; alt açıklamalar JSON'da. “All projects” hedefi `/projects`, button40px, source iconRotation−180. “LATEST WORK Q2 2026” facts annotation **absolute parent overlay/difference blend**, normal flow'a fazladan eklenmez; mobile checkpoint'te üstte görünmesi DOM order değiştirme gerekçesi değildir.

K `.framer-19mx43n` padding XXL200/0/0, desktop150/40/0, tablet150/40/0, phone120/20/0; gap100→tablet/phone50. İç grid3; sağ span2; tablet iki kolon ve heading row span2/gap50; phone column/gap40. Satır listesi gap20.

H `Cl/Case item` @301296: Variant1=`z00XcxPBj`, hover Variant2=`Na9EYo3q1`, Phone=`JewJrBVoe`. İç transition **.6 tween [ .44,0,.56,1 ]**; appear opacity0/y40→visible, delay.3/duration2/spring/bounce0/threshold.5. Row padding20/0/30, border bottom1 white.1. Default image320×200 absolute bottom−202, clipped; hover image relative yer alır, açıklama opacity1 ve relative olur, logo ortaya çıkar. Bu yalnız yüzen hover-preview değildir: satır yüksekliği değişir. Phone image relative/full available width ve iç grid1/gap20, hover handler yok. Phone açıklama görünürlüğü default opacity0 kuralını taşıyor; ölçmeden tüm açıklamaları açma.

U: Height transition ve scroll refresh birlikte ele alınır; before/after rect ölçümüyle source easing kalibre edilir. Klavye focus ile içeriğe erişim sağlanır, mouse leave kapanması scroll'u sıçratmaz. H05 kendisi ticker içermez: “Case studies.” ticker H04; iki Neiden end ticker H06. Sahiplik bu sınırla korunur.

**Teslim:** `src/sections/home/H05-MoreCases/`, `src/content/H05.ts`. Existing SectionLabel/ActionLink yeniden kullanılır; shared API değiştirme önerisi integratöre gider.

## H06 — Showreel, awards ve final tickers

K H Showreel @823270: **dış stage400vh** (`.framer-1k7jnfz` @1028341), **iç marker group250vh/top250px** (`.framer-16q8030` @1028641). Stage'i250vh yapmak yanlış scroll uzunluğu üretir. İç beş child sırası: showreel-1, showreel-2, isimsiz hold, showreel-3, showreel-4. Hold30% markerGroup; diğer dört flex eşit payı paylaşır. Geçerli CSS hesabıyla her flex17.5% group yüksekliği; bu oran aşağıdaki DOM rectlerinde doğrulandı.

Parent marker `showreel` scene track'e bağlanır, viewport threshold0; scene scale3→1, phone3→1.6. Title track threshold1: initial opacity0/scale1.2 → `showreel-2` opacity1/scale1 → `showreel-3` opacity0/scale.8. Play ve date/timing track threshold.5: initial opacity0/scale.4 → `showreel-4` opacity1/scale1; phone final play.6. Scene mask kendi **global onScroll opacity1→0** kaydıdır; local showreel progress diye yeniden yorumlanmaz.

U: F `Nl/Ul` semantiği: start=documentTop−1−offset−viewportThreshold×viewportHeight; marker height ve sonraki sınırlar interpolation'a girer. Her track güncel DOM markerlarından türetilir; source screenshot y10454'e “title görünür” keyframe sabitleme. Stickyposition, scene scale, title scale ve play scale farklı node'lardadır. Reduce motion'da okunabilir title ve çalışan play kontrolü korunur, scroll bağımlı görünmez içerik bırakılmaz.

**3×3 kolaj K:** Top33vh/Middle34vh/Bottom33vh, her row3 eşit video. Aşağıdaki sıra değişmez; dokuz URL/asset ID JSON'da tamdır. `srcType:Upload` için `srcFile` gerçek kaynaktır; tekrar eden `srcUrl` fallback'i dokuz video yerine kullanma.

| Konum | Özgün MP4 |
|---|---|
| üst1/2/3 | qhgTQUkR0fODY63Vgy7BsAVWw / s2MMSq00J46ljfxMxYzYSkJUF9s / 9uPeCVl83tLV2N1f1D7DnvXRic |
| orta1/2/3 | EKhFLCAxRa06YADI4msquvzwPTQ / DxPC0PMfkY1FHJEn3zhu2zeL0Y / UOh1vkxRXJNOKmlDAm9Jwn77W3Y |
| alt1/2/3 | C7u20SR5SoCFQeL0jtSUXpF8Hs / 9QvAOVASZyqPgWxcC9OAdl4NCo8 / PUitQ2XFD8ExulHnASL3hF8iDs |

Hepsi controls false, loop true, muted true, playing true, objectFit cover, startTime0, radius0. G checkpoint'lerde viewport dışı videolar pause durumunda olabilir; source playing=true dokuz decoder'ın sürekli aktif olması gerektiğini kanıtlamaz. Mevcut görünürlük/viewport video politikası varsa kullan; yeni bir global observer servisi bölüm içinde kurma. Referans frame'i deterministic değil; crop/frame maskesi ve ayrı playback QA gerekir.

Title “Showreel ©26”: DM Sans700, source text71.0093px, −.06em/line.8, scalable viewBox432×57. Görünen font boyutu sahne/title transformlarıyla değişir; screenshot fontunu doğrudan CSS71px sanma. Center play kontrolü80×80 önce kendi source icon/variant üzerinden eşlenir. Desktop timing2025-26 / 1:25 min. overview; tablet kısa1:25 min.; phone timing source hidden.

**Modal K:** H @827191 `blockDocumentScrolling`, `dismissWithEsc`; backdrop click hide. Portal template-overlay→overlay→body. Backdrop enter.3 tween[.5,0,.88,.77], exit.3[.12,.23,.5,1]. Content spring.4/bounce.2 opacity0↔1; inner scale.5↔1. YouTube **https://youtu.be/6aioEoCdBJw**, autoplay On/mute true/radius0; dokuz MP4'ten birini fullscreen yapmak yerine bu harici player kullanılır. Özgün yerel YouTube dosyası yok. U: useMotion.lockScroll('showreel-modal') acquisition/release, focus trap/return, Escape/backdrop, inner click koruması; close'da player unmount/stop. External playback halen browser QA gerektirir.

**Awards K:** H @837000 civarı Awards wrapper; üç kayıt sırası Red Dot5x/2021–2025/Brands & Communication Design, Awwwards2x/2023/24/25/Side of the day & Site of the month, IF Design/2019/User Experience (UX). Kaynak typo “Side” korunur. Desktop üç kolon wrapper186px/paddingTop50; tablet/phone stack ve min-content. Logo glyph/SVG mevcut arşivden ve shared-symbol dependency closure ile çözülür; yazıyla veya yeni ikonla değiştirilmez. Üç appear ayrı T_/E_/D_ konfiglerini H'den takip eder; farklı stagger süreleri ölçmeden tek0.3s fade atama.

**End ticker K:** H @841500, gap80/speed30, default+reverse, hover100%, draggable false. Kaynak CSS iki satırı **20px yüksekliğinde** tutuyor; ilk text blur1px/opacity.29, ikinci net. “Büyük Neiden satırı” ifadesinden yeni dev başlık yapılmaz. Kaynak DM Sans600/−.04em/line1.5; wrap yok. Parent altına absolute anchor ve bottom padding10. Bu endcap H19 değildir; Portfolio sonudur.

**Teslim:** `src/sections/home/H06-Showreel/`, `src/content/H06.ts`; Awards/ShowreelModal/EndTickers alt dosyaları aynı sahiplikte. External player yalnız açıldığında mount edilir. Root/body inline lock doğrudan değiştirilmez.

## Ortak API ve kapılar

Mevcut `asset(id)`/`assetUrl`, `useMotion` (reducedMotion,refresh,lockScroll,scrollTo), SectionLabel, ActionLink ve Marquee yeniden kullanılır. **Marquee API'de hover modifier yok**: H04'ün50% hover hızının faz bozulmadan uygulanması integratöre shared enhancement talebidir. Sırf duration CSS değiştirmek ticker fazını atlatabilir. H06 hover100% mevcut sabit hıza uygundur. Source grain wrapper'ı varsa aynı asset ve yaşam döngüsüyle reuse edilir.

| Kapı | H04 | H05 | H06 |
|---|---|---|---|
| D | dört marker before/at/after; image crop/font/link | default/hover/leave/phone state ve height | marker group rectleri, scene/title/play tracks, modal state |
| L | 4×100vh + mobile gaps, heading typography | grid/rows/absolute facts, mobile images | 400vh stage/250vh marker,3×3media,awards,end reserve |
| M | discrete spring crossfade + disjoint reveal/hover/parallax | .6 variant transition, layout refresh | independent tracks, player overlay, dual ticker |
| R | fractional breakpoint iki yanı, resize, reduce motion | touch-hover bağımsız erişim/keyboard | phone1.6 scene/.6 play, Esc/focus/lock cleanup |
| Q | canonical + ek marker screenshots; H03 sınırı | tam satır açılması sonrası next section ölçüsü | nextH07 sınırı, video mask/playback, modal close/resize |

Builder yalnız kendi alanını yazar; dört slot ve sırayla H04→H05→H06 gate geçişi korunur. Root QA kararı TASKS'a yalnız integratör tarafından işlenir. Tam görev teslimi screenshot çiftleri, kullanılan ID'ler, test sonucu ve unresolved listesi içerir. Build'in geçmesi görsel eşleşme değildir.

Açık kalanlar: marker boundary motion state kayıtları, bütün hoverların gerçek event davranışı, awards exact SVG instance ID'si, tam marker boundary kayıtları, modal playback/focus doğrulaması, tablet/XXL/physical touch. Bunlar yeni tasarım tercihiyle doldurulmaz. Kaynak ve checkpoint bu planı uygulanabilir kılar; “tüm etkileşimler gözlendi” iddiası taşımaz.


## Son DOM geometrisi — G, tek scroll durumunda

Kaynaklar: `section-layout/1440/portfolio.json` (scrollY4702) ve `section-layout/390/portfolio.json` (scrollY5694). Değerler document rect koordinatlarıdır; uygulama sabiti olarak kullanılmaz.

| Alan | Desktop y / height | Phone y / height |
|---|---:|---:|
| Portfolio parent | 4702.469 / 9714.813 | 5694.313 / 9380.219 |
| H04 heading | 4702.469 / 364 | 5694.313 / 348 |
| Featured flow | 5066.469 / 4000 | 6042.313 / 3466 |
| H05 More works | 9066.469 / 650.813 | 9508.313 / 1279.219 |
| H06 Highlights heading | 9717.281 / 364 | 10787.531 / 351 |
| Showreel stage | 10081.281 / 4000 | 11138.531 / 3376 |
| Anchors group | 10331.281 / 2500 | 11388.531 / 2110 |
| Awards | 14081.281 / 186 | 14514.531 / 440 |
| Final ticker wrapper | 14367.281 / 50 | 15024.531 / 50 |

Dört featured marker başlangıcı desktop5066.469/6066.469/7066.469/8066.469; phone6042.313/6916.313/7790.313/8664.313. Phone flow4×844+3×30=3466; source gap teyit edildi. Foreground image yüksekliği650 ve379.797px (65vh ve45vh). Desktop inner width1345/x40, phone335/x20.

Showreel anchor child yükseklikleri desktop437.5/437.5/750/437.5/437.5; phone369.25/369.25/633/369.25/369.25. Böylece isimsiz hold30% ve dört17.5% bölge doğrulandı. JSON exact marker top/height kayıtlarını içerir.

**Önemli:** `.framer-1skoswp` captured rect desktop4275×3000 ve phone1125×2531.953 iken computed transform scale3. Bu değerleri scene layout boyutu yapma; alttaki layout100vh/1×contentWidth. İlk featured image appear capture sırasında y≈7.5px, diğerleri başlangıç y150px; bu statik son durum QA screenshot'ı değildir. Geometry kaydı ve canonical screen capture farklı amaçlarla kullanılır. Font/appear kararlılığı kontrolünden sonra karşılaştırma alınır.
