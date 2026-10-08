import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis, { type ScrollToOptions } from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';
import { SCROLL_OPTIONS, scrollDuration } from './scroll-config';

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const REFRESH_DELAY_MS = 80;
const REFRESH_MAX_DELAY_MS = 400;

type ScrollTarget = number | string | HTMLElement;

export type MotionScrollOptions = Omit<
  ScrollToOptions,
  'onStart' | 'onComplete'
> & {
  /** Native/reduced-motion scrolling has no Lenis instance. */
  onStart?: (lenis: Lenis | null) => void;
  onComplete?: (lenis: Lenis | null) => void;
};

export interface MotionApi {
  lenis: Lenis | null;
  reducedMotion: boolean;
  /** Every acquisition must release its own token, including duplicate keys. */
  lockScroll: (key: string) => () => void;
  /** Debounced layout measurement. Never call this on every scroll event. */
  refresh: () => void;
  scrollTo: (target: ScrollTarget, options?: MotionScrollOptions) => void;
}

export interface MotionProviderProps {
  children: ReactNode;
  pathname?: string;
  /** Pass the router location key to reset even on same-path Back/Forward. */
  navigationKey?: string;
  /** Pass location.hash with a router; native hashchange is also supported. */
  hash?: string;
}

const MotionContext = createContext<MotionApi | null>(null);
let activeProvider: symbol | null = null;

type SavedStyle = {
  element: HTMLElement;
  property: string;
  value: string;
  priority: string;
};

function hashElement(hash: string): HTMLElement | null {
  if (!hash || hash === '#') return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

function resolveTarget(target: ScrollTarget): HTMLElement | number | null {
  if (typeof target !== 'string') return target;
  if (['top', 'left', 'start', '#'].includes(target)) return 0;
  if (['bottom', 'right', 'end'].includes(target)) {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }
  if (target.startsWith('#')) {
    const element = hashElement(target);
    if (element) return element;
    if (target === '#top') return 0;
  }
  try {
    return document.querySelector<HTMLElement>(target);
  } catch {
    return null;
  }
}

/** One root provider. Section animation lifetimes remain in local gsap contexts. */
export function MotionProvider({
  children,
  pathname = '/',
  navigationKey,
  hash,
}: MotionProviderProps) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === 'undefined'
      ? true
      : window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const instanceRef = useRef<Lenis | null>(null);
  const mountedRef = useRef(false);
  const ownerRef = useRef(Symbol('MotionProvider'));
  const locksRef = useRef(new Map<symbol, string>());
  const stylesRef = useRef<SavedStyle[]>([]);
  const timerRef = useRef<number | null>(null);
  const firstRefreshRef = useRef<number | null>(null);
  const pendingHashRef = useRef<{ hash: string; immediate: boolean } | null>(null);
  const previousNavigationRef = useRef<{ pathname: string; hash: string } | null>(null);
  const popstateResetRef = useRef(false);
  const routeRef = useRef({ pathname, hash });
  routeRef.current = { pathname, hash };

  const scrollTo = useCallback(
    (target: ScrollTarget, options: MotionScrollOptions = {}) => {
      if (locksRef.current.size > 0 && !options.force) return;
      const resolved = resolveTarget(target);
      if (resolved === null) return;
      const instance = instanceRef.current;
      if (instance) {
        instance.scrollTo(resolved, options);
        return;
      }
      const top =
        typeof resolved === 'number'
          ? resolved
          : resolved.getBoundingClientRect().top +
            window.scrollY -
            (Number.parseFloat(getComputedStyle(resolved).scrollMarginTop) || 0) -
            (Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0);
      options.onStart?.(null);
      window.scrollTo({ top: top + (options.offset ?? 0), behavior: 'instant' });
      ScrollTrigger.update();
      options.onComplete?.(null);
    },
    [],
  );

  const refresh = useCallback(() => {
    if (!mountedRef.current) return;
    const now = performance.now();
    firstRefreshRef.current ??= now;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    const delay = Math.max(
      0,
      Math.min(REFRESH_DELAY_MS, REFRESH_MAX_DELAY_MS - (now - firstRefreshRef.current)),
    );
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      firstRefreshRef.current = null;
      if (!mountedRef.current) return;
      instanceRef.current?.resize();
      ScrollTrigger.refresh();
      // A deep link can wait for newly mounted content or font/media geometry.
      const pending = pendingHashRef.current;
      const element = pending ? hashElement(pending.hash) : null;
      if (element) {
        pendingHashRef.current = null;
        scrollTo(element, { immediate: pending?.immediate, force: true });
      }
      popstateResetRef.current = false;
    }, delay);
  }, [scrollTo]);

  const unlockDocument = useCallback(() => {
    for (const { element, property, value, priority } of stylesRef.current) {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    }
    stylesRef.current = [];
  }, []);

  const lockDocument = useCallback(() => {
    if (stylesRef.current.length > 0) return;
    for (const element of [document.documentElement, document.body]) {
      for (const [property, value] of [
        ['overflow', 'hidden'],
        ['overscroll-behavior', 'none'],
      ]) {
        stylesRef.current.push({
          element,
          property,
          value: element.style.getPropertyValue(property),
          priority: element.style.getPropertyPriority(property),
        });
        element.style.setProperty(property, value);
      }
    }
  }, []);

  const lockScroll = useCallback(
    (key: string) => {
      const token = Symbol(key);
      locksRef.current.set(token, key);
      lockDocument();
      instanceRef.current?.stop();
      return () => {
        if (!locksRef.current.delete(token) || locksRef.current.size > 0) return;
        unlockDocument();
        instanceRef.current?.start();
        refresh();
      };
    },
    [lockDocument, refresh, unlockDocument],
  );

  useLayoutEffect(() => {
    const owner = ownerRef.current;
    if (activeProvider !== null && activeProvider !== owner) {
      throw new Error('Mount only one MotionProvider at the application root.');
    }
    activeProvider = owner;
    mountedRef.current = true;
    const restoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    if (locksRef.current.size > 0) lockDocument();
    return () => {
      mountedRef.current = false;
      activeProvider = null;
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      firstRefreshRef.current = null;
      window.history.scrollRestoration = restoration;
      unlockDocument();
    };
  }, [lockDocument, unlockDocument]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousMode = root.getAttribute('data-motion');
    root.setAttribute('data-motion', reducedMotion ? 'reduced' : 'smooth');
    if (reducedMotion) {
      setLenis(null);
      refresh();
      return () => {
        if (previousMode === null) root.removeAttribute('data-motion');
        else root.setAttribute('data-motion', previousMode);
      };
    }

    const instance = new Lenis({
      ...SCROLL_OPTIONS,
      duration: scrollDuration(routeRef.current.pathname, window.innerWidth),
      anchors: true,
    });
    instanceRef.current = instance;
    setLenis(instance);
    if (locksRef.current.size > 0) instance.stop();
    const update = () => ScrollTrigger.update();
    const tick = (seconds: number) => instance.raf(seconds * 1000);
    const unsubscribe = instance.on('scroll', update);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    refresh();

    return () => {
      gsap.ticker.remove(tick);
      unsubscribe();
      instance.destroy();
      instanceRef.current = null;
      if (previousMode === null) root.removeAttribute('data-motion');
      else root.setAttribute('data-motion', previousMode);
    };
  }, [reducedMotion, refresh]);

  useLayoutEffect(() => {
    const instance = instanceRef.current;
    if (instance) instance.options.duration = scrollDuration(pathname, window.innerWidth);
    const nextHash = hash ?? window.location.hash;
    const previous = previousNavigationRef.current;
    const hashOnly =
      previous?.pathname === pathname &&
      previous.hash !== nextHash &&
      Boolean(nextHash) &&
      !popstateResetRef.current;
    previousNavigationRef.current = { pathname, hash: nextHash };
    // Page navigation and Back/Forward reset to top; same-page anchors do not.
    if (!hashOnly) scrollTo(0, { immediate: true, force: true });
    pendingHashRef.current = nextHash
      ? { hash: nextHash, immediate: !hashOnly }
      : null;
    popstateResetRef.current = false;
    refresh();
  }, [navigationKey, pathname, hash, refresh, scrollTo]);

  useEffect(() => {
    const preference = window.matchMedia(REDUCED_MOTION_QUERY);
    const onPreference = () => setReducedMotion(preference.matches);
    const onResize = () => {
      const instance = instanceRef.current;
      if (instance) {
        instance.options.duration = scrollDuration(routeRef.current.pathname, window.innerWidth);
      }
      refresh();
    };
    const onHash = () => {
      const nextHash = window.location.hash;
      if (pendingHashRef.current?.hash !== nextHash) {
        pendingHashRef.current = nextHash
          ? { hash: nextHash, immediate: popstateResetRef.current }
          : null;
      }
      refresh();
    };
    const onPopState = () => {
      popstateResetRef.current = true;
      scrollTo(0, { immediate: true, force: true });
      pendingHashRef.current = window.location.hash
        ? { hash: window.location.hash, immediate: true }
        : null;
      refresh();
    };
    const onMedia = (event: Event) => {
      if (event.target instanceof HTMLImageElement || event.target instanceof HTMLVideoElement) {
        refresh();
      }
    };
    let lastWidth = -1;
    let lastHeight = -1;
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;
      refresh();
    });
    resizeObserver.observe(document.body);
    let disposed = false;
    void document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    onPreference();
    preference.addEventListener('change', onPreference);
    window.addEventListener('resize', onResize);
    window.addEventListener('hashchange', onHash);
    window.addEventListener('popstate', onPopState);
    document.addEventListener('load', onMedia, true);
    document.addEventListener('error', onMedia, true);
    document.addEventListener('loadedmetadata', onMedia, true);
    document.fonts.addEventListener('loadingdone', refresh);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      preference.removeEventListener('change', onPreference);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('load', onMedia, true);
      document.removeEventListener('error', onMedia, true);
      document.removeEventListener('loadedmetadata', onMedia, true);
      document.fonts.removeEventListener('loadingdone', refresh);
    };
  }, [refresh, scrollTo]);

  const value = useMemo<MotionApi>(
    () => ({ lenis, reducedMotion, lockScroll, refresh, scrollTo }),
    [lenis, reducedMotion, lockScroll, refresh, scrollTo],
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion(): MotionApi {
  const context = useContext(MotionContext);
  if (!context) throw new Error('useMotion must be used within MotionProvider.');
  return context;
}
