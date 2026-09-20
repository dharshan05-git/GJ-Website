import React, { useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';

/**
 * FlyToCart — Always mounted in App.jsx.
 * The fly div is ALWAYS in the DOM (just invisible) so the ref
 * is always populated and the animation fires correctly.
 */
export const FlyToCart = () => {
  const { flyItem, clearFlyItem } = useShop();
  const elRef  = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !flyItem) return;

    // Cancel any in-progress animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const { image, fromRect, toRect } = flyItem;

    // Start: centre of the product card image
    const startX = fromRect.left + fromRect.width  / 2;
    const startY = fromRect.top  + fromRect.height / 2;

    // End: centre of the cart icon in the navbar
    const endX = toRect.left + toRect.width  / 2;
    const endY = toRect.top  + toRect.height / 2;

    // Bezier control point arcs UP above both points
    const cpX = (startX + endX) / 2;
    const cpY = Math.min(startY, endY) - 160;

    const DURATION = 720;
    let startTime = null;

    const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    // Show the element immediately at start position
    el.style.backgroundImage = 'url(' + image + ')';
    el.style.left    = startX + 'px';
    el.style.top     = startY + 'px';
    el.style.transform = 'translate(-50%,-50%) scale(1)';
    el.style.opacity = '1';
    el.style.display = 'block';

    const tick = (now) => {
      if (!startTime) startTime = now;
      const raw = Math.min((now - startTime) / DURATION, 1);
      const t   = easeInOut(raw);
      const mt  = 1 - t;

      // Quadratic Bezier position
      const x = mt*mt*startX + 2*mt*t*cpX + t*t*endX;
      const y = mt*mt*startY + 2*mt*t*cpY + t*t*endY;

      // Shrink to 0.1 and fade out in last 20%
      const scale   = 1 - t * 0.9;
      const opacity = raw < 0.75 ? 1 : 1 - (raw - 0.75) / 0.25;

      el.style.left      = x + 'px';
      el.style.top       = y + 'px';
      el.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
      el.style.opacity   = opacity;

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.style.display = 'none';
        el.style.opacity = '0';
        clearFlyItem();
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [flyItem]); // eslint-disable-line

  // Always rendered — div stays in DOM so ref is always valid
  return (
    <div
      ref={elRef}
      style={{
        position: 'fixed',
        display: 'none',
        width: 68,
        height: 68,
        borderRadius: 10,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0 8px 28px rgba(0,0,0,0.28)',
        border: '2.5px solid rgba(255,255,255,0.85)',
        zIndex: 99999,
        pointerEvents: 'none',
        top: 0,
        left: 0,
        willChange: 'transform, opacity, left, top',
      }}
    />
  );
};
