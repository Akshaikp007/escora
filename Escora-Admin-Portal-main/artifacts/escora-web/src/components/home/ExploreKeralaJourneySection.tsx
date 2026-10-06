import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import {
  KERALA_TRAVEL_CATEGORIES,
  computeJourneySchedule,
  getTrackXForProgress,
  getActiveIndexForProgress,
} from './journey-route/types';
import type { TravelCategory, JourneySchedule } from './journey-route/types';
import { ExploreSectionHeader } from './journey-route/ExploreSectionHeader';
import { ExploreRouteCanvas } from './journey-route/ExploreRouteCanvas';
import { JourneyCardModal } from './journey-route/JourneyCardModal';
import './ExploreKeralaJourneySection.css';

export const ExploreKeralaJourneySection: React.FC<{ id?: string }> = ({ id = "kerala-journey-route" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory | null>(null);
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [schedule, setSchedule] = useState<JourneySchedule>(() => computeJourneySchedule(1440));

  const categories = KERALA_TRAVEL_CATEGORIES;
  const totalCount = categories.length;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  const scheduleRef = useRef<JourneySchedule>(schedule);
  scheduleRef.current = schedule;

  const lenis = useLenis();

  /* 
   * Dynamic Responsive Measurement:
   * Uses ResizeObserver on the section container + window resize/orientationchange
   * to recalculate exact physical card centers, checkpoint targets, and arrival progress.
   */
  useEffect(() => {
    const updateLayout = () => {
      if (typeof window !== 'undefined') {
        const vw = window.innerWidth;
        setViewportWidth(vw);
        setSchedule(computeJourneySchedule(vw));
      }
    };

    updateLayout();

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr && cr.width > 0) {
          setViewportWidth(cr.width);
          setSchedule(computeJourneySchedule(cr.width));
        }
      }
    });

    if (trackRef.current) {
      ro.observe(trackRef.current);
    }

    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  /* 
   * Single Master Journey Progress:
   * Local normalized scroll progress (0.0 -> 1.0) of the pinned Explore Kerala section.
   */
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  /* 
   * Silk-smooth spring interpolation for tactile luxury response without lag or jitter
   * Calibrated with high stiffness (320) so fast reverse scrolling follows instantly without delay
   */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 32,
    restDelta: 0.0005,
  });

  /* 
   * Direction & Reverse Scrolling State:
   * When scrolling reverse, smoothly passes all checkpoints in ONE continuous transition
   * without stopping at any checkpoint. Forward scrolling retains all stops/dwells.
   */
  const [isReverseScrolling, setIsReverseScrolling] = useState(false);
  const isReverseScrollingRef = useRef(false);
  const lastProgressRef = useRef(0);

  /* 
   * Physical Card Movement:
   * cardTrackPosition = function(journeyProgress, isReversing)
   * Forward: pauses and dwells at checkpoints.
   * Reverse: smoothly glides across all checkpoints without stopping.
   */
  const trackX = useTransform(smoothProgress, (p) => {
    return getTrackXForProgress(p, scheduleRef.current, isReverseScrollingRef.current);
  });

  /* 
   * Physical Checkpoint Activation:
   * Updates current index as progress advances or reverses.
   */
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (p) => {
      const delta = p - lastProgressRef.current;
      lastProgressRef.current = p;

      // Track reverse scroll motion
      if (delta < -0.003) {
        if (!isReverseScrollingRef.current) {
          isReverseScrollingRef.current = true;
          setIsReverseScrolling(true);
        }
      } else if (delta > 0.003) {
        if (isReverseScrollingRef.current) {
          isReverseScrollingRef.current = false;
          setIsReverseScrolling(false);
        }
      }

      const nextIdx = getActiveIndexForProgress(p, scheduleRef.current.pArrive);
      if (nextIdx !== currentIndexRef.current) {
        currentIndexRef.current = nextIdx;
        setCurrentIndex(nextIdx);
      }
    });
    return () => unsubscribe();
  }, [smoothProgress]);

  /* 
   * Single-gesture ultra-fast reverse scroll:
   * When scrolling reverse inside the section, rapidly transitions (~0.3s) all the way
   * back to the beginning (checkpoint 01) in one smooth, continuous sweep without stopping.
   * Dramatically faster than forward scrolling, allowing instant rewind to previous sections.
   * Uses capture: true to ensure Lenis doesn't cancel the programmatic rewind.
   */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!trackRef.current) return;
      const trackEl = trackRef.current;
      const rect = trackEl.getBoundingClientRect();

      // Section is active in viewport (pinned or traversing)
      const inSection = rect.top <= 80 && rect.bottom >= 80;
      if (!inSection) return;

      const goingUp = e.deltaY < 0;
      const goingDown = e.deltaY > 0;

      if (goingDown) {
        if (isReverseScrollingRef.current) {
          isReverseScrollingRef.current = false;
          setIsReverseScrolling(false);
        }
        return;
      }

      if (goingUp) {
        const curProgress = scrollYProgress.get();
        // If beyond checkpoint 01 / start of track
        if (curProgress > 0.01 || currentIndexRef.current > 0) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          if (isReverseScrollingRef.current) return;

          isReverseScrollingRef.current = true;
          setIsReverseScrolling(true);

          const trackTop = window.scrollY + rect.top;

          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(trackTop, {
              duration: 0.3, // Ultra-fast reverse scroll sweep
              easing: (t: number) => 1 - Math.pow(1 - t, 2.8),
              lock: true,
              onComplete: () => {
                isReverseScrollingRef.current = false;
                setIsReverseScrolling(false);
              },
            });
          } else {
            window.scrollTo({
              top: trackTop,
              behavior: 'smooth',
            });
          }

          // Safety timeout to ensure reverse state resets cleanly
          setTimeout(() => {
            isReverseScrollingRef.current = false;
            setIsReverseScrolling(false);
          }, 350);
        }
        // If already at checkpoint 01 / progress <= 0.01, allow wheel event to scroll up naturally to previous section
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', handleWheel, { capture: true });
  }, [lenis, scrollYProgress]);

  /* 
   * Scroll window / Lenis to exact physical checkpoint arrival position
   */
  const scrollToDestination = useCallback((targetIdx: number) => {
    if (!trackRef.current) return;
    const trackEl = trackRef.current;
    const rect = trackEl.getBoundingClientRect();
    const trackTop = window.scrollY + rect.top;
    const totalScrollable = trackEl.offsetHeight - window.innerHeight;
    if (totalScrollable <= 0) return;

    // Use exact checkpoint arrival progress from the master journey schedule
    const targetFrac = scheduleRef.current.pArrive[targetIdx] ?? 0;
    const targetScrollY = trackTop + targetFrac * totalScrollable;

    const isReversingToStart = targetIdx === 0 && currentIndexRef.current > 0;
    const duration = isReversingToStart ? 0.3 : 1.1;

    if (lenis && typeof lenis.scrollTo === 'function') {
      lenis.scrollTo(targetScrollY, {
        duration,
        lock: isReversingToStart,
        easing: isReversingToStart ? (t: number) => 1 - Math.pow(1 - t, 2.8) : undefined,
      });
    } else {
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });
    }
  }, [lenis]);

  /* Controls handlers */
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      scrollToDestination(currentIndex - 1);
    }
  }, [currentIndex, scrollToDestination]);

  const handleNext = useCallback(() => {
    if (currentIndex < totalCount - 1) {
      scrollToDestination(currentIndex + 1);
    }
  }, [currentIndex, totalCount, scrollToDestination]);

  const handleSelectIndex = useCallback((idx: number) => {
    scrollToDestination(idx);
  }, [scrollToDestination]);

  /* Touch swipe handling for mobile devices */
  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const diffY = touchStartY - e.changedTouches[0].clientY;

        // If swipe was predominantly horizontal and intentional
        if (Math.abs(diffX) > 48 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
          if (diffX > 0 && currentIndexRef.current < totalCount - 1) {
            // Forward: advance to next checkpoint
            scrollToDestination(currentIndexRef.current + 1);
          } else if (diffX < 0 && currentIndexRef.current > 0) {
            // Fast Reverse: rapid transition covering all checkpoints back to start
            isReverseScrollingRef.current = true;
            setIsReverseScrolling(true);
            scrollToDestination(0);
            setTimeout(() => {
              isReverseScrollingRef.current = false;
              setIsReverseScrolling(false);
            }, 350);
          }
        }
      }
    };

    trackEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    trackEl.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      trackEl.removeEventListener('touchstart', handleTouchStart);
      trackEl.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollToDestination, totalCount]);

  return (
    <>
      <section
        id={id}
        className="explore-kerala-journey-outer relative w-full bg-[#FAF7F2] select-none"
      >
        {/* 480vh Scroll Track: drives vertical-to-horizontal journey progression */}
        <div ref={trackRef} className="explore-kerala-journey-sticky-track">
          
          {/* Sticky Stage: remains pinned to top while user scrolls through all 8 destinations */}
          <div className="explore-kerala-journey-viewport border-t border-[#0F231C]/10">

            {/* Background Visual Layer 1: Soft Parchment Paper Texture & Contour Lines */}
            <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#C9A26D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

            {/* Background Visual Layer 2: Faint Kerala Topographic Contour Map */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.06] stroke-[#0F231C] pointer-events-none"
              viewBox="0 0 1440 800"
              fill="none"
              aria-hidden="true"
            >
              <path d="M-100,200 C300,100 600,400 900,200 C1200,0 1500,300 1800,150" strokeWidth="1" strokeDasharray="6 6" />
              <path d="M-100,350 C250,250 550,550 850,350 C1150,150 1450,450 1750,300" strokeWidth="1" strokeDasharray="4 8" />
              <path d="M-100,500 C200,400 500,700 800,500 C1100,300 1400,600 1700,450" strokeWidth="0.8" strokeDasharray="3 6" />
            </svg>

            {/* Background Visual Layer 3: Top Right Framing Palm Leaves */}
            <svg
              className="absolute right-0 top-0 w-80 sm:w-96 h-auto opacity-[0.11] text-[#0F231C] pointer-events-none translate-x-8 -translate-y-4"
              viewBox="0 0 240 240"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M240,0 C180,40 140,90 110,150 C100,170 90,200 85,240 C100,200 120,165 150,135 C185,100 220,60 240,0 Z" />
              <path d="M240,0 C160,20 100,60 50,120 C30,144 10,180 0,220 C20,180 50,140 90,105 C140,65 190,30 240,0 Z" />
            </svg>

            {/* Background Visual Layer 4: Left Side Framing Palm Leaves */}
            <svg
              className="absolute left-0 top-1/3 w-72 sm:w-84 h-auto opacity-[0.09] text-[#0F231C] pointer-events-none -translate-x-10"
              viewBox="0 0 240 240"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M0,120 C60,80 100,40 140,0 C120,40 90,80 50,110 C20,132 0,140 0,120 Z" />
              <path d="M0,120 C80,110 130,80 180,30 C150,70 110,110 60,135 C30,150 0,155 0,120 Z" />
            </svg>

            {/* Background Visual Layer 5: Distant Birds Silhouette */}
            <svg
              className="absolute right-1/4 top-16 w-32 h-16 opacity-[0.15] text-[#0F231C] pointer-events-none"
              viewBox="0 0 120 60"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10,20 Q20,10 30,20 Q40,10 50,20 Q35,14 25,23 Q15,14 10,20 Z" />
              <path d="M60,35 Q68,27 76,35 Q84,27 92,35 Q79,30 71,37 Q63,30 60,35 Z" />
              <path d="M90,15 Q95,9 100,15 Q105,9 110,15 Q101,11 96,17 Q91,11 90,15 Z" />
            </svg>

            {/* Background Heritage Art Layer: Kathakali Classical Mudra Transparent PNG on Left Flank */}
            <div
              className="absolute left-1 sm:left-6 bottom-6 w-44 sm:w-60 lg:w-72 opacity-[0.22] pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <img
                src="/images/art/kathakali.png"
                alt=""
                className="w-full h-auto filter contrast-[1.05]"
                loading="lazy"
              />
            </div>

            {/* Background Heritage Art Layer: Fort Kochi Chinese Fishing Nets Transparent PNG on Right Flank */}
            <div
              className="absolute right-1 sm:right-8 bottom-6 w-56 sm:w-76 lg:w-92 opacity-[0.22] pointer-events-none select-none z-0"
              aria-hidden="true"
            >
              <img
                src="/images/art/cheenavala.png"
                alt=""
                className="w-full h-auto filter contrast-[1.05]"
                loading="lazy"
              />
            </div>

            {/* Background Visual Layer 6: Misty Western Ghats & Backwater Reflection Horizon */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#C9A26D]/08 via-[#0F231C]/03 to-transparent pointer-events-none flex items-end justify-between px-6">
              {/* Houseboat Motif outline on bottom left */}
              <svg className="w-40 h-16 opacity-[0.10] text-[#0F231C] pointer-events-none" viewBox="0 0 200 80" fill="currentColor" aria-hidden="true">
                <path d="M10,60 C30,55 160,55 190,60 C180,72 20,72 10,60 Z" />
                <path d="M30,55 C40,35 150,35 165,55 Z" />
                <path d="M60,35 C70,20 120,20 135,35 Z" />
              </svg>

              {/* Dappled Warm Sunlight Glow on bottom right */}
              <div className="w-96 h-28 bg-gradient-radial from-[#C9A26D]/15 via-[#C9A26D]/04 to-transparent blur-3xl rounded-full" />
            </div>

            {/* Editorial Content Container */}
            <div className="relative w-full max-w-[1520px] mx-auto px-4 sm:px-8 flex flex-col justify-between h-full z-10 py-1">
              
              {/* Section Header */}
              <div className="flex-shrink-0">
                <ExploreSectionHeader
                  categories={categories}
                  activeIndex={currentIndex}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onSelectIndex={handleSelectIndex}
                />
              </div>

              {/* Primary Route Canvas */}
              <div className="w-full flex-1 flex items-center justify-center my-auto z-10 overflow-hidden min-h-0">
                <ExploreRouteCanvas
                  categories={categories}
                  scrollProgress={smoothProgress}
                  trackX={trackX}
                  activeIndex={currentIndex}
                  schedule={schedule}
                  viewportWidth={viewportWidth}
                  isReversing={isReverseScrolling}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* Editorial Footer Caption */}
              <div className="flex-shrink-0 flex items-center justify-between text-[10px] font-sans-luxury text-[#0F231C]/60 pt-2.5 pb-1 border-t border-[#0F231C]/15 z-10">
                <span className="uppercase tracking-[0.25em] font-bold text-[#B88E56] font-sans-luxury flex items-center gap-2">
                  <span className="w-4 h-px bg-[#C9A26D]" />
                  KERALA EDITORIAL JOURNEY
                </span>

                <span className="hidden sm:inline italic font-serif-luxury text-[#0F231C]/75">
                  Scroll or use controls to advance journey along the horizontal route
                </span>

                <span className="font-mono text-[#0F231C]/70 font-semibold tracking-widest">
                  {String(currentIndex + 1).padStart(2, '0')}{' '}
                  /{' '}
                  {String(totalCount).padStart(2, '0')}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Detail Modal */}
      <JourneyCardModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
};

export default ExploreKeralaJourneySection;
