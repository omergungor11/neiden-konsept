# naiben marka güncellemesi

Kullanıcı isteğiyle görünen marka yazısı `naiben` olarak değiştirildi. Header/menü, preloader, Hero ve glitch kopyaları, About şirket adı, footer, iç sayfa temel ekranı, erişilebilirlik etiketleri ve HTML title/description güncellendi. Ortak metinler `src/content/brand.ts` dosyasında tutulur.

Kaynak referans ve medya arşivi ile GitHub repo adı değişmedi. Kaynaktan arşivlenen iletişim adresi ayrı bir içerik alanıdır; yeni bir e-posta adresi verilmediği için bu görevde değiştirilmedi.

## Yerel doğrulama

`npm run build` tip kontrolü ve üretim build'i ile geçti. Önceden bulunan 500 kB chunk uyarısı devam ediyor. React bileşen incelemesinde yeni effect, event listener veya scroll döngüsü eklenmedi; mevcut motion ve cleanup sözleşmeleri korunuyor.

| Kontrol | Sonuç |
| --- | --- |
| Desktop 1440 × 1000, DPR 1 | İçerik ve belge genişliği 1425 px; yatay taşma yok. |
| Desktop Hero yazısı | Metin 1339.505 px / çerçeve 1345 px; taşma yok. |
| Desktop footer yazısı | Metin 866.597 px / çerçeve 869.766 px; taşma yok. |
| Mobile 390 × 844, DPR 1 | İçerik ve belge genişliği 375 px; yatay taşma yok. |
| Mobile Hero yazısı | Metin 333.615 px / çerçeve 335 px; taşma yok. |
| Mobile menü | `naiben®`, `aria-label="naiben home"`, açıldığında `aria-expanded="true"`. |
| Tarayıcı hata kaydı | Hata yok. |

Görseller: [desktop](hero-1440.png), [mobile](hero-390.png). Font yüklenmesi ve açılış animasyonu beklendikten sonra kaydedildi. Bu kontrol, marka değişikliğinin mevcut yerleşime etkisini kapsar; tüm sitenin son görsel kabulü değildir.
