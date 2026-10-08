# Neiden

[Referans](https://neiden.framer.media/) için bölüm bazında yeniden üretim. Plan Astra ile hazırlandı; kaynak inceleme, orijinal medya arşivi ve tarayıcı kanıtları ayrı ajan görevleriyle toplandı. Geliştirme Vite, React ve TypeScript ile sürüyor.

## Yerel geliştirme

```bash
npm ci
npm run dev
```

Adres: http://127.0.0.1:5173/. `npm run build` TypeScript kontrolü ve üretim build'i yapar. `npm run assets:prepare`, arşivdeki özgün dosyaları değiştirmeden yerel font CSS'i, asset kataloğu ve bağımlılıkları tamamlanmış SVG türevlerini üretir.

Tek Lenis instance'ı GSAP ticker üzerinden çalışır. Kaynak duration/bounce spring'leri Motion'un yalnız generator API'siyle GSAP easing fonksiyonuna örneklenir; ikinci animasyon/scroll döngüsü kurulmaz. Reduced motion, scroll kilitleri ve layout refresh ortak provider içindedir.

## Başlangıç noktaları

- [Kapsamlı uygulama planı](docs/IMPLEMENTATION_PLAN.md): tüm bölüm ve rotalar, Lenis/GSAP, motion ve responsive kabul koşulları.
- [Ajan sistemi](docs/agents/README.md): roller, dört slot, dosya sahipliği, görev açma ve bağımsız QA protokolü.
- [Görev kuyruğu](docs/TASKS.json): 36 görev; bölüm entegrasyonu D → L → M → R → Q kapılarıyla sırayla yapılır.
- [Proje çalışma kuralları](AGENTS.md): sonraki oturumlarda uygulanacak proje ve delegasyon sözleşmesi.
- [Tarayıcı gözlemleri](docs/reference/site-observations.md), [motion denetimi](docs/reference/motion-audit.md), [tasarım değerleri](docs/reference/design-tokens.json).
- [Rota envanteri](docs/reference/routes.json): 26 rota. [Asset manifesti](docs/reference/asset-manifest.json): kaynak URL, kullanım yeri, yerel yol, hash, ölçü ve indirme durumu.

## Orijinal medya

`public/assets/`: 136 görsel, 167 SVG, 81 font dosyası ve 15 video; toplam 399 dosya, 78.331.890 bayt. Responsive URL varyantları manifestte ilişkilendirildi. SVG'ler dış URL ve kaynak HTML'deki inline vector içeriğini kapsar. Font dosyalarının tamamı ilk yüklemede kullanılacak anlamına gelmez. 65 inline SVG'nin sembol bağımlılıkları manifesttedir; uygulamada ilgili tanımlarla birlikte kullanılmalıdır.

Showreel modalı kaynakta [YouTube videosuna](https://youtu.be/6aioEoCdBJw) bağlanır. Bu medya yerel indirme setine dahil değildir; referans embed ayarı korunacak. Kaynak HTML/CMS/tasarım çıktıları `docs/reference/raw/` içinde inceleme kanıtıdır.

## Tekrar kullanılabilir araçlar

```bash
# Görev grafiği, yerel dosya ve SHA256 doğrulaması
node scripts/validate-plan.mjs

# Referans desktop checkpoint'lerini yeniden kaydet
node scripts/capture-reference.mjs

# Mobile viewport checkpoint'leri
node scripts/capture-reference.mjs https://neiden.framer.media/ docs/reference/screenshots/mobile 390 844

# Yerel bölümün data-section hedefiyle aynı viewport karşılaştırması
node scripts/capture-local-section.mjs H02 1440 1000 about
```

Capture aracı Node ve npx kullanır, agent-browser 0.27.0 sürümünü çağırır ve kendi izole browser oturumunu kapatır. Statik scroll checkpoint'leri üretir; gerçek touch veya frame-by-frame motion testi yapmaz.

## Uygulama durumu

F00 arşiv, F01 uygulama temeli, S00 header/menu/katmanlar, H01 Hero, H02 About ve H03 Services doğrulandı. H04 Portfolio ana sayfaya entegre edildi; geometri, motion ve responsive QA sürüyor. H05 More Cases ilk uygulaması hazır; H04 QA sonrası entegre edilecek. Portfolio/Showreel [Astra uygulama haritası](docs/reference/portfolio-implementation-map.md) ile ilerliyor. Her bölümün ölçüm, yerleşim, hareket, responsive ve QA kapıları tamamlanınca sıradaki bölüm entegre edilir. Güncel durum `docs/TASKS.json` ve `qa/` altında kaydedilir.

Bu çalışma yerel geliştirmedir; tüm sitenin piksel/animasyon eşleşmesi henüz tamamlanmadı. Ajan dosyaları görev sırasında kullanılır; sürekli çalışan arka plan servisi oluşturmaz.
