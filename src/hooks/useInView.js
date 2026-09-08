import { useEffect, useRef, useState } from 'react';

/**
 * useInView — fires once when the element scrolls into the viewport.
 * @param {number} threshold  0-1, fraction of element visible to trigger (default 0.15)
 * @param {string} rootMargin CSS margin around viewport (default '0px')
 */
export const useInView = (threshold = 0.15, rootMargin = '0px') => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once only
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
};
