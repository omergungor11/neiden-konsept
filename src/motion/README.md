# F01 motion sözleşmesi

`MotionProvider` uygulama kökünde bir kez bulunur. Router'a bağlı değildir; integratör router kullanırken `pathname`, `navigationKey` ve `hash` değerlerini location'dan geçirir. Yalnız ana sayfa için `<MotionProvider>{children}</MotionProvider>` yeterlidir.

```tsx
import { MotionProvider, useMotion } from './motion';

<MotionProvider
  pathname={location.pathname}
  navigationKey={location.key}
  hash={location.hash}
>
  {children}
</MotionProvider>
```

`useMotion()` şu değerleri sağlar:

- `lenis: Lenis | null`: başlangıçta ve reduced motion'da null. Instance scroll event'i React state'ine yazılmaz.
- `reducedMotion: boolean`: canlı media-query tercihi. Bölüm kendi gsap context'ini temizlemeli, metin/medyayı doğrudan son görünür durumda göstermelidir. Provider bölüm efektlerini kendiliğinden gizlemez veya öldürmez.
- `lockScroll(key): () => void`: menü, preloader veya modal kendi acquisition'ını alır; dönen idempotent release callback'i effect cleanup'ında çağrılır. Aynı key ile iki acquisition da birbirinden bağımsızdır. Son token bırakılmadan Lenis/native scroll açılmaz.
- `refresh(): void`: 80ms debounce, 400ms azami bekleme ile Lenis resize ve ScrollTrigger refresh. Layout değiştiren accordion/switch sonrası çağır. Font, medya, body geometry ve viewport değişimlerini kök ayrıca izler. Scroll başına çağırma.
- `scrollTo(number | string | HTMLElement, options?)`: Lenis seçenekleri; `onStart`/`onComplete` callback'leri native modda null alır. Reduced motion doğrudan native/instant scroll yapar. Kilit sırasında ancak `force: true` geçerse çalışır. CSS selector ve `top/start/bottom/end` desteklenir.

```tsx
const { lockScroll, refresh, reducedMotion } = useMotion();
useEffect(() => {
  if (!open) return;
  return lockScroll('navigation');
}, [open, lockScroll]);
```

Menü/modal kendi focus trap, Escape, focus return ve ARIA davranışını yönetir. Modalın kaydırılabilen iç alanında `data-lenis-prevent` ve uygun `overflow:auto` kullan. Root `html { scrollbar-gutter: stable; }` kuralı kilitte scrollbar genişliğini korur.

Tek GSAP ticker Lenis'e `seconds * 1000` gönderir; `autoRaf:false`, `syncTouch:false`. Bölüm ajanı yeni Lenis/RAF döngüsü veya `ScrollTrigger.killAll()` kuramaz. Yerel `gsap.context(...).revert()` / `gsap.matchMedia(...).revert()` cleanup'ı zorunludur.

Rota key/path değişimi önce konumu sıfırlar, ardından varsa hash'i güncel DOM'dan çözer. Aynı sayfanın hash hedefi değiştiğinde scroll0 reset yapılmaz; Lenis mevcut konumdan hedefe gider. Native popstate üste sıfırlama ve hashchange de desteklenir. `history.scrollRestoration` provider boyunca manual'dir; cleanup önceki değeri geri verir. Kaynak sayfa navigasyonlarında üste döndüğü için burada eski rota scroll konumu geri yüklenmez. Hash hedefi henüz yoksa bekleyen refresh daha sonraki mount/font/media değişiminde yeniden dener.

Kaynak değerler: `docs/reference/motion-audit.md` §2 K; `docs/reference/design-tokens.json` motion/Lenis; `raw/script_main.mjs` `function ic(e)` ve etkin instance override'ları. Home XXL 3s, inner XXL 3.5s, <1620px 4s; easing `min(1,1.001-2**(-10*t))`, wheel1.1. Bunlar kaynak parametreleridir; scroll hissi/video eşleşmesi ayrıca kalibre edilir. Reduced-motion native modu, token kilit ve merkezi debounce uygulama kararlarıdır.
