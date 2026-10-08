# Referans tarayıcı gözlemleri

İnceleme tarihi: 6 Ekim 2026. Kaynak: https://neiden.framer.media/. Bu dosya tarayıcıda gözlenenleri kaydeder; koddan çıkarılan hareket değerleri `motion-audit.md` içindedir.

## Ortam ve durum

Chromium / agent-browser 0.27.0, zoom varsayılan, DPR 1. Desktop viewport 1440×1000, içerik 1425 px (15 px scrollbar). Mobile viewport simülasyonu 390×844, içerik 375 px. Bu mobile kayıt fiziksel telefon veya touch girdisi testi değildir.

Ana sayfa kapalı menü, varsayılan Monthly, FAQ01 açık halinde desktop scrollHeight 29425 px. Mobile son durum yüksekliği DOM JSON'undan alınır. Eşikler kaynak CSS'de 810/1200/1620 px; tarayıcıda eşiklerin iki yanı henüz ayrı kaydedilmedi.

Temiz mobile ilk açılış toplamı38367px. `screenshots/mobile/` içindeki36checkpoint, viewport URL yüklenmeden önce ayarlanarak kaydedildi ve manual DOM geometrisiyle eşleşti. `screenshots/mobile-resize/` önce desktop genişliğinde mount edip daraltan eski karşılaştırma kaydıdır:37958px toplam, Hello/Quote her biri yaklaşık205px kısa kaldı. Bu lifecycle farkı sonraki resize QA'sında incelenir; golden kaynak olarak temiz mobile seti kullanılır.

## OBS-HERO

Desktop `screenshots/home-desktop-initial.png`, mobile `screenshots/home-mobile-initial.png`. Hero desktop1000/mobile844 px, header44 px. Koyu grain/ışın video zemini, beyaz çok büyük ñ eiden logo, kırmızı el yazısı tagline, grid ve hizmet etiketleri, CTA, avatar/review şeridi, client logo akışı. Mobile header sadeleşiyor: logo ve hamburger; büyük ekranın yatay menüsü/badge görünmüyor. Body copy ve CTA alt alta, client/review alanı mobile yeniden düzenleniyor.

`screenshots/home-mobile-loading.png` ilk 600 ms civarı yakalanan intro durumudur: siyah tam ekran, ortada beyaz el yazısı, altta marka. Bu screenshot kararlı hero değildir. Kaynakta preloader4s ve gecikmeli hero reveal bulundu. Aynı URL yeniden açıldığında önceki scroll25556 korunmuştu; kararlı mobile ölçümü tekrar scroll0'a alınarak yapıldı. Kullanım sırasında history/route restore davranışı ayrıca ölçülmeli.

## OBS-MENU

`screenshots/menu-desktop-open.png`: üst yatay header görünür kalırken koyu blur arka plan üzerinde ortalanmış yaklaşık580×560 px siyah kart. Marka, navigasyon, telefon/e-posta, sosyal ikonlar, geniş CTA, alt legal/telif satırları. Header sağdaki control dairesel close görünümüne geçiyor. Menü linkleri /about-us, /projects, /blog, /contacts, /career, /404, /terms-of-services ve /privacy. `body` computed overflow visible gözlendi; bu ölçüm scroll lock'un yokluğunu kanıtlamaz, Lenis stop ayrı olabilir.

`screenshots/menu-mobile-open.png`: viewport390×844, içerik375; siyah kart yaklaşık8px yatay dış boşlukla genişler, navigasyon/contacts iki kolon olarak kalır. Adres satırları daralır, legal/telif ve Built in Framer satırları alt alta uyarlanır. Header44px ve close control görünür kalır.

## OBS-SCROLL

Ana sayfanın bölüm başlangıçları ve yüklü fontları `home-desktop-dom.json` / `home-mobile-dom.json`; tüm ilk desktop screenshot seti `screenshots/desktop/capture-index.json`. Uzun semantic Portfolio section'ı kendi içinde Case Studies, More Cases, Showreel ve Awards bloklarını barındırıyor; tek section yüksekliği9715px. Planın alt bölüm ID'leri bu semantic DOM gruplamasıyla birebir aynı şey değildir.

- Services sol başlık sticky top100px; dört hizmet sağ tarafta.
- Portfolio medya wrapper sticky top0, height1000px. Scroll içinde kart medyası ve metadata değişiyor; 33% capture görsel/crop ve renk arka planını gösterir.
- Showreel sahnesi sticky top0; ilk DOM state scale3. 66% portfolio capture'da sahne ve büyük başlık görünür. Tam scroll start/end için kaynak marker'ları ve motion kaydı gerekir.
- Process sticky top0, desktop900px container. Başlık/alıntı sol, 2×2 süreç kartları sağ. Görsel sıra 01/02 üst, 04/03 alt; süreç kavramsal sıra01→02→03→04.
- Timeline media sticky top150px.
- FAQ sol başlık sticky top100px.
- Scroll boyunca altta sabit120px progressive blur bandı gözleniyor. Sabit sağ üst40×40 menü control'u, özel outlined pointer cursor ve kontrasta göre görünen renk değişimleri var.

## OBS-PRICING

`screenshots/pricing-monthly.png` ve `pricing-annual.png`. Monthly2500/5500/8500; Annual tıklanınca3500/6500/9500. PER MONTH etiketi her iki durumda kalıyor; 24%SAVE badge var. Bu gerçek görünüm korunacak, badge'den matematik türetilerek içerik değiştirilmeyecek. Fiyatlar kayan rakam kolonlarıyla gösteriliyor; `pricing-*.txt` DOM'daki tüm rakam stack'ini içerir ve görünen fiyatı tek başına vermez.

## OBS-FAQ

`screenshots/faq-default.png` ve `faq-second-open.png`. Başlangıç01 açık;02 açıldığında01 açık kalıyor. Bu çoklu açık accordion davranışıdır. Desktop toplam scrollHeight29425→29876 oldu. Açık/kapalı içerik yüksekliği downstream section konumunu değiştirir; capture koşulları ve ScrollTrigger refresh buna göre ayarlanır. Kaynakta görülen öğelerde aria-expanded bulunmadı; yerel semantik button ve aria-expanded görsel davranışı koruyarak eklenebilir.

## OBS-FACTS / FEATURES

Facts ayrı kırmızı bant:150+,92%,12,800,000+. Desktop üç kolon, sayaç animasyonları kaynak motion denetiminde incelenir. Features başlık/grid, telefon ve el görseli, üstüne yerleştirilmiş KPI baloncukları, kırmızı deneyim kartı ve aşağıda ek bento hücreleri içeriyor. Bu bileşik görsellerin gerçek media/mask/overlay ayrımı manifest ve raw source'tan yapılmalı; tek screenshot'ın tamamı siteye resim olarak konulmamalı.

## OBS-FORMS

Newsletter type=email required. Contact Name, tel, email ve textarea native required=false; custom validation henüz test edilmedi. Hidden honeypot alanları DOM'da mevcut ve görünür form alanı değildir. Gerçek submit yapılmadı; loading/success/error/network/back-end behavior tarayıcıda gözlenmedi. /thank-you rotası kaynak envanterinde erişilebilir; varlığı her formun oraya yönlendiğini tek başına kanıtlamaz.

## Eksik ölçümler ve tekrar

Tüm26 rotanın HTML/media arşivi var; her rota desktop/mobile tüm UI durumlarıyla tarayıcıda gezilmedi. Süre/easing'ler kaynakta bulunduğu yerde source-only; frame-by-frame gerçek cihaz motion eşleşmesi tamamlanmadı. Cursor, hover, tooltip, 3D review logosu, marquee ve YouTube modal durumları görev keşif kapılarında tamamlanacak. Site tamamlandı veya tüm animasyonlar doğrulandı iddiası yok.

`node scripts/capture-reference.mjs` aynı desktop referans koşullarında yeni screenshot seti alır. URL/output/viewport argümanlarıyla mobile veya yerel site için kullanılabilir. İlk desktop seti kısa settle, ilk temiz mobile seti5.5s sonrası alındı. Güncel araç8s başlangıç beklemesi kullanır; süre tek başına tüm ticker/karakter animasyonlarının son durumunu doğrulamaz. Araç scroll jump+settle ile statik checkpoint üretir; wheel/touch motion replay veya frame zamanlama testi değildir. Caption/state kayıtları capture-index.json içinde tutulur; son section capture'ları sayfanın maksimum scroll sınırında clamp olabilir.
