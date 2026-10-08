# Neiden yeniden üretim çalışma kuralları

Kullanıcının güncel marka tercihi **naiben**. Uygulamanın görünen marka metinleri `src/content/brand.ts` üzerinden yönetilir; bu tercih kaynak Neiden yazısına göre önceliklidir. Referans arşivi ve `neiden-konsept` repo adı korunur. Kullanıcı Vercel deploy'unu ve GitHub repo bağlantısını ayrıca yetkilendirdi.

## Hedef ve mevcut durum

Referans: https://neiden.framer.media/. Kullanıcı, tüm görünür tasarım, özgün medya, geçiş, scroll ve animasyonların bölüm bölüm ajanlarla yeniden üretilmesini ve Lenis kullanılmasını istedi. Planlama lideri kullanıcı isteğiyle `gpt-6-astra` olarak çalıştırıldı. Vite/React/TypeScript, yerel asset/font adaptörü ve Lenis/GSAP temeli kuruldu. S00 shell, H01 Hero, H02 About ve H03 Services bağımsız QA'dan geçti. H04 Portfolio gerçek App'e entegre, QA sürüyor; H05 More Cases ilk kodu hazır ve H04Q bekliyor. Astra'nın hedefli uygulama haritaları docs/reference altında. Güncel doğrulama için TASKS.json ve qa/ kayıtlarını oku.

Önce `docs/IMPLEMENTATION_PLAN.md`, `docs/TASKS.json`, `docs/agents/README.md` ve ilgili referans kanıtlarını oku. Mevcut arşivi ve tamamlanmış keşfi yeniden indirme/başlatma; yeni eksik varsa hedefli tamamla. Bu dosya, sonraki uygulama görevlerinde aşağıdaki sınırlar içinde alt ajanlarla çalışmayı açıkça ister.

## Ajan yürütme

- Mevcut alt ajan araçlarını kullan. Ajanlar görev süresince açılır; kalıcı servis veya yeni kullanıcı sohbetleri oluşturma.
- Integratör dahil en fazla dört aktif ajan. Tipik dağılım: integratör, tek aktif bölüm builder'ı, referans/asset uzmanı, bağımsız QA veya motion uzmanı.
- Planın yeniden değerlendirilmesi için Astra seçimini koru. Uygulama, entegrasyon ve QA modelini yeni kullanıcı isteği yoksa oturumdan devral. Astra seçebilmek için bağlam devrini ve mevcut araç şemasını izle; model değiştiğini doğrulamadan iddia etme.
- Görev açarken `docs/agents/TASK_TEMPLATE.md` ve rol dosyası üzerinden gerçek ID, kanıt, bağımlılık, yazılabilir yollar ve kabul çıktıları ver.
- Aynı dosyada iki yazıcı bulunamaz. Integratör paket/lock/config, router, ortak stil, shared UI, görev kuyruğu ve entegrasyonu yönetir. Builder yalnız atanmış bölüm ve content dosyalarını yazar. Motion uzmanına dosya yazma devri açıkça yapılır. QA kendi rapor dizinini yazar.
- Bir bölümün D → L → M → R → Q kapıları geçmeden sonraki bölüm entegre edilmez. Sıradaki bölümün salt okunur keşfi paralel ilerleyebilir. Rutin QA ve düzeltme için ayrıca insan onayı bekleme.
- Kuyruk statüsünü kanıtla güncelle. `passed`, uygulama ve ilgili QA gerçekten bitmişse kullanılabilir. Yalnız plan yazılması, screenshot alınması veya build geçmesi görsel eşleşme kanıtı değildir.

## Referans sadakati

- Gerçek rotaları `docs/reference/routes.json`, medyayı `docs/reference/asset-manifest.json` belirler. Assetler `public/assets/{images,svg,fonts,videos}/` altında; kesin yolları manifestten çöz.
- Görsel/font/video yerine yaklaşık stok görsel, yeniden çizilmiş logo veya uydurma içerik koyma. Responsive kaynak varyantları ve kaynakta bulunan inline SVG'ler arşivde vardır.
- `docs/reference/site-observations.md`, DOM JSON'ları, screenshot kayıtları ve `motion-audit.md` kanıtlarını birlikte kullan. Kaynak parametresi, tarayıcı gözlemi ve yeni uygulama kararı farklı etiketlenir.
- Metin satırları, crop, grid, sticky mesafeler, mobile varyantlar ve gözlenen kaynak tutarsızlıkları korunur. Referansta olmayan motion ekleme.
- Ana sayfa preloader'ı kaynakta 4 s. İlk görüntü karşılaştırmasında preloader ve kararlı hero durumlarını ayrı ele al. Capture aracı 8 s bekler; ticker/karakter stagger nedeniyle yalnız süre, bütün hareketlerin bittiğini kanıtlamaz. Son durum için computed opacity/transform ve metin ölçülerinin kararlılığını kontrol et.
- Arşiv Framer çıktısını inceleme kanıtı olarak saklar. `docs/reference/raw/` executable uygulama girdisi veya doğrudan üretim bundle'ı olarak kullanılmaz.

## Scroll ve lifecycle

- Lenis tek instance, tek RAF kaynağı. Önerilen mimari GSAP ticker → `lenis.raf(seconds * 1000)`, `autoRaf: false`, `lenis.on('scroll', ScrollTrigger.update)`.
- Bölüm animasyonlarını yerel context içinde kur ve cleanup/revert yap. Global `ScrollTrigger.killAll()` veya ikinci scroll motoru ekleme.
- Font/media yüklemesi ve layout değiştiren FAQ/rota işlemlerinden sonra gerekli refresh'i merkezden sağla. Scroll başına refresh yapma.
- Reduced motion, touch, keyboard, menu/modal scroll lock, history ve hash davranışı korunur. Görünür içerik motion'a bağımlı kalmaz.

## Doğrulama ve teslim

- Referans ve yerel screenshot: aynı viewport, DPR, scroll, UI durumu, font yükleme durumu. Video frame farklarını açık maske ve ayrı playback testiyle ele al.
- Desktop başlangıç ölçümü 1440×1000/DPR1; mobile kayıt 390×844/DPR1 viewport simülasyonudur. Gerçek touch cihaz testi henüz yapılmadı.
- Her teslim değişen dosyalar, kullanılan kanıtlar, davranışlar, test sonucu, referans/yerel screenshot ve kalan farkları içerir. Görev teslimini ve bağımsız QA'yı integratör birleştirir.
- `node scripts/validate-plan.mjs` görev grafiği, kanıt dosyaları ve yerel asset hash'lerini doğrular. Bu komut çalışan sitenin görsel QA'sı değildir.
- Geliştirme sürerken kullanıcı Vercel yayını ve GitHub bağlantısını istedi. Gerçek form gönderimi bu aşamanın parçası değildir. İleride gerçek form backend'i kullanıcının istediği servis için ayrı yapılandırılır; referans sahibine test mesajı gönderilmez.
