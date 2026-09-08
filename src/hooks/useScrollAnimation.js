import { useEffect, useRef, useState } from 'react';

/**
 * useScrollAnimation
 * Returns [ref, isVisible] — attach ref to the element you want to animate.
 *
 * @param {number} threshold  - 0–1, how much of the element must be visible
 * @param {string} rootMargin - CSS margin around the root (e.g. "0px 0px -80px 0px")
 * @param {boolean} once      - If true (default), stays visible once revealed. If false, toggles on enter/exit.
 */
export const useScrollAnimation = (threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, isVisible];
};
