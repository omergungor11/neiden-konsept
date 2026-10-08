# S00 builder teslimi

Tarih: 2026-10-07. Builder kapsamı tamamlandı; D/L/M/R/Q kapı kararını integratör verir. Integratör son bağımsız entegrasyon QA'sının geçtiğini bildirdi ve S00 kod sahipliğini geri aldı.

## Değişen dosyalar

- `src/components/shell/ShellParts.tsx`: özgün marka/SVG'ler, menü navigasyonu, sosyal bağlantılar, yasal bağlantılar, Framer kredisi ve hamburger parçaları.
- `src/components/shell/SiteHeader.tsx`: 44 px header, başlangıç ve kaydırılmış menü varyantları, modal yaşam döngüsü, odak yönetimi ve scroll lock.
- `src/components/shell/GlobalEffects.tsx`: özgün iki parçalı imleç, sağ sabit menü düğmesiyle ilişkili global davranış, yukarı kaydırmada back-to-top ve sekiz katmanlı alt blur.
- `src/components/shell/SiteFooter.tsx`: özgün büyük SVG/Cal Sans yazısı, Patung tagline, navigasyon, tarih/kredi/yasal bağlantılar ve reveal animasyonları.
- `src/components/shell/shell.css`, `index.ts`: kapsamlı responsive stiller ve üç public export.

App, global stil, paketler, asset kataloğu ve ortak UI bu builder tarafından değiştirilmedi. Root'un son `html.lenis:not(.lenis-autoToggle).lenis-stopped { overflow: hidden; }` düzeltmesi, Lenis'in `overflow: clip` halinde kaybolan sabit scrollbar gutter'ını korur.

## Kaynak kanıtı ve sadakat

`qa/F00/hero-shell-map.json` içindeki `captures`, `shell`, `svgDefinitions`, `sourceCssRules` ve `footerSourceOnly`; `docs/reference/motion-audit.md`; başlangıç/menü ekran görüntüleri; `desktop/23-desktop-0.png`, `mobile/36-phone-0.png`; arşiv HTML ve Home modülü salt okunur kanıt olarak kullanıldı. Eksik kaydırılmış menü ölçüleri canlı kaynakta hedefli tarayıcı gözlemiyle tamamlandı.

Markalar ve sosyal ikonlar katalogdaki orijinal inline SVG dosyalarıdır. Küçük marka DM Sans 600/24 px, büyük footer Cal Sans, tagline Patung kullanır. Telefon metnindeki `555-2468` ASCII tire kaynak DOM'dan doğrulandı. Menü adres/sosyal aralıkları, yasal bağlantı tracking'i, Framer kredisi ve footer'ın desktop/phone farklı copyright metinleri korundu.

## Ölçüm karşılaştırması

Viewport/DPR: desktop 1440×1000/1, phone 390×844/1. Scrollbar sonrası içerik genişliği sırasıyla 1425/375 px.

| Durum | Kaynak x/y/w/h | Yerel x/y/w/h |
| --- | --- | --- |
| Desktop başlangıç menüsü | 422.5 / 242 / 580 / 560 | 422.5 / 242 / 580 / 560 |
| Phone başlangıç menüsü | 7.5 / 70 / 360 / 560 | 7.5 / 70 / 360 / 560 |
| Desktop kaydırılmış menü | 422.5 / 220 / 580 / 560 | 422.5 / 220 / 580 / 560 |
| Phone kaydırılmış menü | −2.5 / 70 / 380 / 560 | −2.5 / 70 / 380 / 560 |
| Desktop footer yüksekliği | 395.23 | 395.234375 |
| Phone footer yüksekliği | 340.02 | 340.015625 |

Kaynak kaydırılmış ölçüleri scrollY500'de alındı. Yerel geçici kısa içerikte scrollY395/340'a clamp olur; iki değer de aynı >200 sabit düğme varyantını açar. Menü settled opacity1/identity transform durumunda ölçüldü. Normal motion desktop tekrar ölçümü 1.2 s sonra da aynı koordinatları verdi. Kaydırılmış phone kart kaynak gibi 5 px geniş taşar; document scrollWidth375 kalır.

Desktop menü telefon y395.406/h45, email y440.406/h30, adres y500.406/h21, sosyal y551.406/h21 ölçüleri kaynakla yaklaşık .02 px içinde eşleşti. Phone karşılıkları y201/h30, y231/h21, y272/h42, sosyal y344.

## Davranış ve doğrulama

- `npm run typecheck` ve `npm run build` son kodla başarılı.
- Menü açılırken merkezde tek Lenis instance durur; main inert olur. Escape, backdrop, rota ve bağlantı kapatır. Kapanış animasyonu boyunca lock tutulur; sonra önceki odak ve scroll durumu geri gelir.
- Tab/Shift+Tab modal bağlantıları ve aktif kapatma düğmesi arasında döner. Escape sonrası dialog yok, main.inert false, odak Open menu düğmesinde ve Lenis yeniden çalışır.
- Reduced motion modunda içerik hemen görünür; menu identity/opacity1, footer görünür. Kaynak reveal görünürlük için zorunlu tutulmadı.
- Back-to-top aşağı kaydırmada gizli, >200 px'de yukarı kaydırmada görünür; 280 px'den tıklamada scrollY0'a ulaşır ve iki sabit düğme gizlenir.
- Footer görünürken alt blur hidden=true. İmleç touch pointer'da gizlenir, mouse ile çalışır ve mevcut GSAP ticker'ını paylaşır.
- Menü .6 s, bounce0, .3 s açılış gecikmesi; footer wordmark 2 s, tagline .8 s/.07 stagger kaynak parametreleriyle root `springEase` üzerinden uygulanır. Yeni RAF/Lenis oluşturulmaz, context cleanup kullanılır.

## Ekran görüntüleri

Arşiv referansları: `docs/reference/screenshots/menu-desktop-open.png`, `menu-mobile-open.png`, desktop/23 ve mobile/36 footer kayıtları.

Builder'ın son yerel kayıtları: `/tmp/s00-builder-menu-desktop-final.png`, `/tmp/s00-builder-menu-mobile.png`, `/tmp/s00-builder-menu-desktop-scrolled-final.png`, `/tmp/s00-builder-menu-mobile-scrolled.png`, `/tmp/s00-builder-footer-desktop-final.png`, `/tmp/s00-builder-footer-mobile-final.png`.

Hedefli canlı kaynak kayıtları: `/tmp/s00-source-menu-desktop-scrolled.png`, `/tmp/s00-source-menu-mobile-scrolled.png`. Integratörün kalıcı bağımsız QA kayıtları `qa/S00/` altındadır.

## Kalan sınırlar

Footer son animasyon durumu opacity/transform ile doğrulandı; arşiv footer görüntülerinde bazı son tagline karakterleri hâlâ reveal sırasında olduğundan bütün kare için piksel eşleşmesi iddia edilmiyor. Gerçek touch cihaz testi yapılmadı. S00 karşılaştırmalarında arka plan geçici App içeriğidir; hero eşleşmesi H01 kapsamındadır. Satın alma rozeti ve lisans overlay'i root/H19 kapsamına devredildi.

## H19 için ek kaynak gözlemi

`Get Neiden® from $99` rozeti href taşımayan bir DIV'dir; gerçek tıklamada lisans modalı açılır. Desktop sabit rect x1187.109375/y960/w192.890625/h40; phone x117.109375/y804/aynı boyut. Metin DM Sans 700, 12 px/12 px, tracking −.24 px, beyaz; iç katmanlarda blur5 px ve siyah arka plan vardır.

Varsayılan Standard license $99 CTA tarayıcıda doğrulandı: `https://buy.polar.sh/polar_cl_sN92Fjdyeof2fIplFYydo5HC8d5b73lTjQVtq4Z0EF1`. Extended Pro $159 bağlantısı kaynak modülden: `https://buy.polar.sh/polar_cl_mnYi3Ug2ROg416rb1rUrcHA4sMbuDJB44vGSw3QT5Sf`. Ödeme bağlantılarına tıklanmadı.
