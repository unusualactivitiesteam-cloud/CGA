import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useMode } from '../contexts/ModeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function MobilePullDownGesture() {
  const { isLite, toggleMode } = useMode();
  const { refreshAuth } = useAuth();
  const navigate = useNavigate();

  // Reveal height in px (tracks finger during downward drag from top of screen)
  const [revealHeight, setRevealHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isThresholdReached, setIsThresholdReached] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const touchStartY = useRef<number | null>(null);
  const isAtTopRef = useRef<boolean>(false);
  const hasVibratedRef = useRef<boolean>(false);

  // Trigger threshold constants
  const REFRESH_TRIGGER = 40;

  useEffect(() => {
    // Only register on mobile viewports (< 768px)
    const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
    if (!isMobile()) return;

    const rootEl = document.getElementById('root');

    const updatePageTransform = (yOffset: number, dragging: boolean) => {
      if (!rootEl) return;
      if (yOffset > 0) {
        rootEl.style.transform = `translate3d(0, ${yOffset}px, 0)`;
        rootEl.style.transition = dragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        rootEl.style.transform = '';
        rootEl.style.transition = dragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      // Only initiate if scroll position is at the very top of the page
      if (window.scrollY <= 2) {
        isAtTopRef.current = true;
        touchStartY.current = e.touches[0].clientY;
        setIsDragging(false);
        hasVibratedRef.current = false;
      } else {
        isAtTopRef.current = false;
        touchStartY.current = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isAtTopRef.current || touchStartY.current === null || isRefreshing) return;

      // Cancel if user scrolled down into content
      if (window.scrollY > 2) {
        isAtTopRef.current = false;
        setIsDragging(false);
        setRevealHeight(0);
        setIsThresholdReached(false);
        updatePageTransform(0, false);
        return;
      }

      const currentY = e.touches[0].clientY;
      const rawDelta = currentY - touchStartY.current;

      // Only handle downward drag from top of page
      if (rawDelta <= 0) {
        setIsDragging(false);
        setRevealHeight(0);
        setIsThresholdReached(false);
        updatePageTransform(0, false);
        return;
      }

      setIsDragging(true);

      // Target maximum expansion: approximately 25% of current mobile viewport height (25vh)
      const target25vh = Math.round(window.innerHeight * 0.25);

      // Gentle resistance curve following the user's finger movement
      const normalized = Math.min(1.1, Math.pow(rawDelta / 155, 0.84));
      const currentH = Math.min(target25vh * 1.05, normalized * target25vh);

      setRevealHeight(currentH);
      // Physically move the actual application page content downward with the user's finger
      updatePageTransform(currentH, true);

      // Check if mode-switch threshold is reached (~85% of target25vh)
      const reached = currentH >= target25vh * 0.85;
      setIsThresholdReached(reached);

      // Subtle tactile tick upon reaching the mode-switch threshold
      if (reached && !hasVibratedRef.current) {
        hasVibratedRef.current = true;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          try {
            navigator.vibrate(10);
          } catch (e) {}
        }
      } else if (!reached) {
        hasVibratedRef.current = false;
      }
    };

    const handleTouchEnd = () => {
      if (!isAtTopRef.current || touchStartY.current === null) {
        touchStartY.current = null;
        isAtTopRef.current = false;
        setIsDragging(false);
        setRevealHeight(0);
        setIsThresholdReached(false);
        updatePageTransform(0, false);
        return;
      }

      const target25vh = Math.round(window.innerHeight * 0.25);
      const reached = isThresholdReached || revealHeight >= target25vh * 0.85;

      setIsDragging(false);

      if (reached) {
        // Mode switch threshold reached: smoothly return page and trigger existing mode switch
        updatePageTransform(0, false);
        toggleMode(() => {
          navigate('/home');
        });

        setTimeout(() => {
          setRevealHeight(0);
          setIsThresholdReached(false);
        }, 120);
      } else if (revealHeight >= REFRESH_TRIGGER && revealHeight < target25vh * 0.72) {
        // Small pull range: perform clean refresh
        setIsRefreshing(true);
        setRevealHeight(36);
        updatePageTransform(36, false);

        Promise.resolve(refreshAuth?.()).finally(() => {
          setTimeout(() => {
            setIsRefreshing(false);
            setRevealHeight(0);
            setIsThresholdReached(false);
            updatePageTransform(0, false);
          }, 450);
        });
      } else {
        // Did not reach threshold: smoothly return everything to normal position
        setRevealHeight(0);
        setIsThresholdReached(false);
        updatePageTransform(0, false);
      }

      touchStartY.current = null;
      isAtTopRef.current = false;
      hasVibratedRef.current = false;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
      if (rootEl) {
        rootEl.style.transform = '';
        rootEl.style.transition = '';
      }
    };
  }, [revealHeight, isThresholdReached, isRefreshing, toggleMode, navigate, refreshAuth]);

  if (typeof document === 'undefined') return null;

  const target25vh = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.25) : 180;
  const thresholdDist = target25vh * 0.85;
  const pullProgress = Math.min(1, Math.max(0, (revealHeight - 24) / Math.max(1, thresholdDist - 24)));
  const translateY = (1 - pullProgress) * -3;
  const scale = isThresholdReached ? 1.02 : 0.96 + pullProgress * 0.04;

  return createPortal(
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[9999] pointer-events-none select-none md:hidden",
        isDragging
          ? "transition-none"
          : "transition-[height,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      )}
      style={{
        height: `${revealHeight}px`,
        opacity: revealHeight > 0 || isRefreshing ? 1 : 0,
      }}
      aria-hidden="true"
    >
      {/* 1. Main upper sheet of the CGA primary-color reveal */}
      <div
        className="w-full h-full"
        style={{ backgroundColor: 'var(--color-primary, #009e42)' }}
      />

      {/* 2. Large Smooth Half-Circle / Curved Arc Bottom Edge */}
      <div className="relative w-full -mt-px overflow-visible pointer-events-none">
        <svg
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-12 pointer-events-none"
          style={{
            fill: 'var(--color-primary, #009e42)',
            filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.22))',
          }}
        >
          <path d="M 0,0 L 0,2 C 25,24 75,24 100,2 L 100,0 Z" />
        </svg>

        {/* 3. Destination Mode Text (NO Logo, NO Spinner, NO Icons) */}
        {revealHeight > 20 && !isRefreshing && (
          <div
            className="absolute inset-x-0 bottom-2.5 sm:bottom-3 flex items-center justify-center pointer-events-none"
            style={{
              opacity: Math.min(1, pullProgress * 1.25),
              transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
              transition: isDragging
                ? 'none'
                : 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className={cn(
                "px-3.5 py-1 rounded-full backdrop-blur-md transition-colors duration-200 shadow-sm",
                isThresholdReached
                  ? "bg-black/35 border border-white/30 text-white"
                  : "bg-black/20 border border-white/15 text-white/90"
              )}
            >
              <span className="text-[11px] sm:text-xs font-semibold tracking-wide leading-none whitespace-nowrap select-none">
                {isLite ? 'Switch to Beta' : 'Switch to Lite'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
