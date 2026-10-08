# Yeniden kullanılabilir ajan sistemi

Bu dosyalar görev şablonlarıdır. Yalnız aktif oturumda çağrılan alt ajanlar çalışır; dosyalar kendi kendine iş başlatmaz. En fazla dört eşzamanlı slot: integratör + builder + keşif/asset + QA. Kullanıcının Astra tercihi planlama liderine uygulanır; diğer roller açık model seçimi yoksa mevcut modeli devralır.

## Başlatma protokolü

1. Integratör kök `AGENTS.md`, plan, görev kuyruğu ve en güncel kanıtı okur.
2. Bağımlılıkları ve önceki bölümün Q kapısını kontrol eder. Kaynağı/asset'i eksik işin önce keşfini açar.
3. `TASK_TEMPLATE.md` alanlarını gerçek ID, bölüm, yollar ve kabul kanıtlarıyla doldurur. Başlangıç dosya durumu kaydedilir; var olmayan commit/hash uydurulmaz.
4. İlgili rol dosyasını görevle birlikte ajana verir. Sahiplik tablosuna göre yalnız bir yazıcı atanır. Görevler mevcut alt ajan araçlarıyla çağrılır; yeni kullanıcı sohbeti açılmaz.
5. Ajan yapılandırılmış teslim döndürür. QA salt okunur inceleme yapar, kendi raporunu yazar. Integratör ortak dosyaları değiştirir ve kapı kararını kaydeder.
6. Başarısız kapı aynı bölüm için düzeltme işi oluşturur. Sıradaki bölümün entegrasyonu kapı geçene kadar bekler. Rutin ölçüm/QA için insan onayı beklemek zorunlu değildir.

Durumlar: `planned → ready → running → review → passed`; eksik kanıt `needs_evidence`, başarısız kalite `rework`. `passed` yalnız kabul çıktıları varsa atanır. Bağımlılıklar görev ID'leridir. Yeniden başlatmada disk ve task kaydı kontrol edilir; önceki iş körlemesine tekrar edilmez.

## Dosya sahipliği

| Alan | Yazıcı |
|---|---|
| `src/app/`, `src/styles/`, paket/lock/config, ortak UI | Integratör |
| `src/motion/` | Motion uzmanı; göreve açık atama yoksa integratör |
| Aktif `src/sections/home/<ID>-*/`, bölüm content | O bölüm builder'ı |
| `docs/reference/`, `public/assets/`, `public/assets/fonts/` | Keşif/asset ajanı; alt dizin göreve sabitlenir |
| `qa/<task-id>/` | QA ajanı |
| Plan, TASKS ve entegrasyon kayıtları | Integratör / Astra planlama lideri |

İki ajan aynı dosyaya yazamaz. Başkasının değişikliklerini sıfırlama/silme. Ortak ihtiyaç varsa dosya, gerekçe, önerilen sözleşme ile integratöre mesaj gönder; kendi görev alanında ilerleyebildiğin işi sürdür. Motion yazımı bölüm içinde gerekiyorsa builder'dan motion uzmanına açık sahiplik devri yapılır.

## Teslim biçimi

Her teslim: görev ID, değişen dosyalar, kullanılan kanıt ID'leri, uygulanan davranışlar, test komutları/sonuçları, referans-yerel screenshot yolları, kalan belirsizlikler, bir sonraki gerekli adım. “Tamam” tek başına teslim değildir. Görülmeyen davranışa “birebir” deme. Ajan raporları arası çelişki varsa kaynak/viewport/state ile çöz.
