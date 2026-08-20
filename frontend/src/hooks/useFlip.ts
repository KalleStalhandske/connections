import { useLayoutEffect, useRef, type RefObject } from 'react';

/** How long a FLIP slide takes; exported so callers can time state commits to match. */
export const FLIP_DURATION_MS = 350;

/**
 * FLIP-animates the direct `[data-flip-key]` descendants of `containerRef`
 * whenever `layoutSignal` changes: instead of letting the browser snap
 * straight to the new layout (e.g. after a CSS grid reorder), each item
 * slides from its previous screen position to its new one.
 *
 * `layoutSignal` should be a string that changes exactly when the set/order
 * of flip-keyed items changes (e.g. the joined list of item keys in render
 * order).
 */
export function useFlip(containerRef: RefObject<HTMLElement | null>, layoutSignal: string) {
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const container = containerRef.current;
    const prev = prevRects.current;
    const next = new Map<string, DOMRect>();

    if (container) {
      container.querySelectorAll<HTMLElement>('[data-flip-key]').forEach((el) => {
        const key = el.dataset.flipKey;
        if (!key) return;
        const rect = el.getBoundingClientRect();
        next.set(key, rect);

        const prevRect = prev.get(key);
        if (!prevRect) return; // newly mounted item: appear in place, no slide

        const dx = prevRect.left - rect.left;
        const dy = prevRect.top - rect.top;
        if (dx === 0 && dy === 0) return;

        el.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
          { duration: FLIP_DURATION_MS, easing: 'cubic-bezier(0.2, 0, 0.2, 1)' },
        );
      });
    }

    prevRects.current = next;
  }, [containerRef, layoutSignal]);
}
