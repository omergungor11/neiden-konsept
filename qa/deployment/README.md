# Vercel production doğrulaması

Tarih: 2026-10-08. Kapsam: GitHub reposunun Vercel'e bağlanması ve mevcut `naiben` uygulamasının production ortamında çalışması.

## Bağlantı ve build

- Proje: `pitonworks-projects/neiden-konsept`.
- GitHub: `omergungor11/neiden-konsept`, production dalı `main`.
- İlk otomatik deploy commit'i: `e0997cbc455c88b81f36d940ba8902ca271b1593`.
- Deploy: `dpl_9Q3p7AB6QjSoMzBnawec6k1wGV8D`, durum `READY`, hedef `production`.
- Canlı alias: [neiden-konsept.vercel.app](https://neiden-konsept.vercel.app/).
- Node.js `22.x`, framework `vite`, kurulum `npm ci`, build `npm run build`, çıktı `dist`.
- Yerel tip kontrolü ve build geçti; GitHub Vercel commit durumu `success`.
- SPA rewrite `vercel.json` içinde; yerel `.vercel/` Git tarafından ignore ediliyor.

## Canlı kontroller

| Kontrol | Sonuç |
| --- | --- |
| Ana sayfa | HTTP 200; HTML title/description `naiben®`. |
| Doğrudan `/about-us` | HTTP 200; React temel ekranında `naiben` başlığı. |
| Doğrudan `/projects/data-driven-ux-decisions` | HTTP 200; SPA giriş HTML'i sunuluyor. |
| JS ve CSS | HTTP 200; doğru JavaScript/CSS içerik tipleri. |
| Font dosyası | HTTP 200, `font/woff2`; tarayıcıda Cal Sans yüklenmiş. |
| Hero videosu | Range isteği HTTP 206, `video/mp4`; tarayıcıda `readyState: 4`, oynatma aktif. |
| Desktop 1440 × 1000 / DPR 1 | H01–H04 mount edilmiş; header/Hero `naiben`; belge ve içerik genişliği 1425 px. |
| Desktop görseller | Yüklenmiş görsellerde kırık kaynak yok. |
| Menü | `aria-expanded: true`, `naiben home` etiketi ve scroll lock aktif; Escape ile kapanıyor. |
| Menü sonrası scroll | Kilit açıldı; 900 px kaydırma gerçekleşti. |
| Mobile 390 × 844 / DPR 1 | Preloader `naiben®`, Hero `naiben`; belge ve içerik genişliği 375 px. |
| Tarayıcı hata kaydı | Hata yok. |

Bu kayıt deploy ve marka değişikliği için smoke doğrulamasıdır. Planlanan iç sayfa içeriklerinin veya tüm bölüm animasyonlarının son kabulü değildir; bölüm durumları `docs/TASKS.json` içinde izlenir.
