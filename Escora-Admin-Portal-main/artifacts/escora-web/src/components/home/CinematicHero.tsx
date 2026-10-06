import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link } from "wouter";
import "./CinematicHero.css";

// High-resolution local Kerala imagery provided for hero & curated escape cards
import munnarHero from "@assets/escora/hero/munnar-hero.jpg";
import munnarThumb from "@assets/escora/hero/munnar-thumb.jpg";
import thekkadyHero from "@assets/escora/hero/thekkady-hero.jpg";
import alappuzhaHero from "@assets/escora/hero/alappuzha-hero.jpg";
import kovalamHero from "@assets/escora/hero/kovalam-hero.jpg";

export interface HeroSlide {
  id: string;
  slideNumber: string;
  eyebrow: string;
  title: string;
  description: string;
  tag: string;
  bgImage: string;
  cardImage: string;
  cardSub: string;
  destinationSlug: string;
  exploreRoute: string;
  planRoute: string;
}

export const ESCORA_HERO_SLIDES: HeroSlide[] = [
  {
    id: "munnar",
    slideNumber: "01",
    eyebrow: "KERALA HIGHLANDS · 10° 05' N",
    title: "MUNNAR",
    description:
      "Rolling emerald tea plantations veiled in early morning mist. An altitude sanctuary of cool colonial stillness, cascading streams, and untamed mountain serenity.",
    tag: "ALTITUDE SANCTUARY · 1,600M",
    bgImage: munnarHero,
    cardImage: munnarHero,
    cardSub: "01 · HIGHLANDS",
    destinationSlug: "munnar",
    exploreRoute: "/destinations/munnar",
    planRoute: "/plan?destination=munnar",
  },
  {
    id: "thekkady",
    slideNumber: "02",
    eyebrow: "PERIYAR HIGHLANDS · 09° 36' N",
    title: "THEKKADY",
    description:
      "Ancient evergreen canopies, wild elephant corridors, and spice-scented trails bordering Periyar's silent highland lake under dense morning fog.",
    tag: "TIGER RESERVE & SPICE TRAILS",
    bgImage: thekkadyHero,
    cardImage: thekkadyHero,
    cardSub: "02 · PERIYAR",
    destinationSlug: "thekkady",
    exploreRoute: "/destinations/thekkady",
    planRoute: "/plan?destination=thekkady",
  },
  {
    id: "alappuzha",
    slideNumber: "03",
    eyebrow: "KERALA BACKWATERS · 09° 29' N",
    title: "ALAPPUZHA",
    description:
      "Handcrafted wooden houseboats drifting through labyrinthine palm-fringed lagoons, lotus-filled canals, and timeless tranquil waterways.",
    tag: "KETTUVALLAM HERITAGE · LAGOONS",
    bgImage: alappuzhaHero,
    cardImage: alappuzhaHero,
    cardSub: "03 · BACKWATERS",
    destinationSlug: "alleppey",
    exploreRoute: "/destinations/alleppey",
    planRoute: "/plan?destination=alleppey",
  },
  {
    id: "kovalam",
    slideNumber: "04",
    eyebrow: "ARABIAN COAST · 08° 23' N",
    title: "KOVALAM",
    description:
      "Crescent golden shores beneath the historic striped lighthouse, clifftop Ayurvedic sanctuaries, and balmy Arabian Sea sunsets.",
    tag: "AYURVEDA & COASTAL CLIFFS",
    bgImage: kovalamHero,
    cardImage: kovalamHero,
    cardSub: "04 · COASTAL",
    destinationSlug: "kovalam",
    exploreRoute: "/destinations/kovalam",
    planRoute: "/plan?destination=kovalam",
  },
];

interface CinematicHeroProps {
  slides?: HeroSlide[];
  autoplayDuration?: number;
}

export default function CinematicHero({
  slides = ESCORA_HERO_SLIDES,
  autoplayDuration = 4000,
}: CinematicHeroProps) {
  // Track index tracks the first visible card (Slot 1) in the carousel track.
  // When Hero is Munnar (slides[0]), Slot 1 is Thekkady (Set 1, index 5).
  // The carousel shows: [Slot 1: Thekkady] [Slot 2: Alappuzha] [Slot 3: Kovalam] [Slot 4: Munnar (partial)].
  const [trackIndex, setTrackIndex] = useState<number>(5);
  const [displayedSlideIdx, setDisplayedSlideIdx] = useState<number>(0);
  const [textPhase, setTextPhase] = useState<"idle" | "exiting" | "entering">("idle");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [cycleKey, setCycleKey] = useState<number>(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const trackIndexRef = useRef<number>(5);
  const displayedSlideIdxRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);

  // Single controlled 4000ms countdown timer
  const autoplayTimerRef = useRef<number | null>(null);
  const settleTimeoutRef = useRef<number | null>(null);

  const totalSlides = slides.length;
  const currentSlide = slides[displayedSlideIdx];

  // Preload all destination hero images immediately on mount so zoom is instantaneous
  useEffect(() => {
    slides.forEach((slide) => {
      const img1 = new Image();
      img1.src = slide.bgImage;
      const img2 = new Image();
      img2.src = slide.cardImage;
    });
  }, [slides]);

  // 20 cards in track: 5 complete sets [0..3, 0..3, 0..3, 0..3, 0..3]
  // Stable keys using set index + destination id
  const trackCards = useMemo(() => {
    return [
      ...slides.map((s, idx) => ({ ...s, slideIdx: idx, trackKey: `set0-${s.id}` })),
      ...slides.map((s, idx) => ({ ...s, slideIdx: idx, trackKey: `set1-${s.id}` })),
      ...slides.map((s, idx) => ({ ...s, slideIdx: idx, trackKey: `set2-${s.id}` })),
      ...slides.map((s, idx) => ({ ...s, slideIdx: idx, trackKey: `set3-${s.id}` })),
      ...slides.map((s, idx) => ({ ...s, slideIdx: idx, trackKey: `set4-${s.id}` })),
    ];
  }, [slides]);

  const clearAllTimeouts = useCallback(() => {
    if (settleTimeoutRef.current !== null) {
      window.clearTimeout(settleTimeoutRef.current);
      settleTimeoutRef.current = null;
    }
    if (autoplayTimerRef.current !== null) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  // Measure exact pixel distance between adjacent cards in the track
  const getStepX = useCallback((): number => {
    const trackEl = trackRef.current;
    if (trackEl) {
      const cards = trackEl.querySelectorAll<HTMLElement>(".cinematic-hero__card");
      if (cards.length >= 2) {
        const r0 = cards[0].getBoundingClientRect();
        const r1 = cards[1].getBoundingClientRect();
        const diff = r1.left - r0.left;
        if (diff > 50) return diff;
      }
      const heroStyle = getComputedStyle(trackEl);
      const cardW = parseFloat(heroStyle.getPropertyValue("--card-w")) || 168;
      const gap = parseFloat(heroStyle.getPropertyValue("--card-gap")) || 20;
      return cardW + gap;
    }
    return 188;
  }, []);

  // Set initial track transform to index 4 on mount and on window resize
  useEffect(() => {
    const trackEl = trackRef.current;
    if (trackEl) {
      const stepX = getStepX();
      trackEl.style.transform = `translate3d(${-trackIndexRef.current * stepX}px, 0, 0)`;
    }

    const handleResize = () => {
      const trackEl = trackRef.current;
      if (trackEl && !isTransitioningRef.current) {
        const stepX = getStepX();
        trackEl.style.transform = `translate3d(${-trackIndexRef.current * stepX}px, 0, 0)`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getStepX]);

  // Infinite Carousel Transition Engine: simultaneous hero zoom + track translation
  const transitionTo = useCallback(
    (targetTrackIndex: number, targetSlideIdx: number, clickedCardEl?: HTMLElement | null) => {
      if (isTransitioningRef.current || targetTrackIndex === trackIndexRef.current) return;
      isTransitioningRef.current = true;
      setIsTransitioning(true);

      // Stop autoplay timer
      if (autoplayTimerRef.current !== null) {
        window.clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }

      const heroEl = heroRef.current;
      const trackEl = trackRef.current;
      if (!heroEl || !trackEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      const stepX = getStepX();

      const currentIdx = trackIndexRef.current;
      const targetSlide = slides[targetSlideIdx];
      if (!targetSlide) return;

      // Locate target card element in viewport to expand into the hero
      // When triggered by autoplay or next, target destination was at Slot 1 (currentIdx)
      const cardEl =
        clickedCardEl ||
        (trackEl.querySelector(
          `.cinematic-hero__card[data-track-index="${currentIdx}"]`
        ) as HTMLElement) ||
        (trackEl.querySelector(
          `.cinematic-hero__card[data-slide-index="${targetSlideIdx}"]`
        ) as HTMLElement);

      const cardImgEl =
        (cardEl?.querySelector(".cinematic-hero__card-img") as HTMLElement) || cardEl;
      let cardRect = cardImgEl?.getBoundingClientRect();

      if (!cardRect || cardRect.width <= 0 || cardRect.height <= 0) {
        cardRect = {
          left: heroRect.right - 648,
          top: heroRect.bottom - 320,
          width: 168,
          height: 248,
          right: heroRect.right - 480,
          bottom: heroRect.bottom - 72,
        } as DOMRect;
      }

      // 1. Editorial text soft upward dissolution
      setTextPhase("exiting");

      // 2. Fullscreen transition layer (aspect-ratio preserved uniform zoom)
      const startLeft = cardRect.left - heroRect.left;
      const startTop = cardRect.top - heroRect.top;
      const startWidth = cardRect.width;
      const startHeight = cardRect.height;

      const clipTop = startTop;
      const clipLeft = startLeft;
      const clipRight = heroRect.width - (startLeft + startWidth);
      const clipBottom = heroRect.height - (startTop + startHeight);

      const rImg = 1024 / 571;
      const rHero = heroRect.width / heroRect.height;

      let imgHeroW: number;
      let imgHeroH: number;
      if (rHero >= rImg) {
        imgHeroW = heroRect.width;
        imgHeroH = heroRect.width / rImg;
      } else {
        imgHeroH = heroRect.height;
        imgHeroW = heroRect.height * rImg;
      }

      const imgCardH = startHeight;
      const imgCardW = startHeight * rImg;
      const initialScale = imgCardW / imgHeroW; // strictly uniform scaleX === scaleY

      const cardCenterX = startLeft + startWidth / 2;
      const cardCenterY = startTop + startHeight / 2;
      const heroCenterX = heroRect.width / 2;
      const heroCenterY = heroRect.height / 2;
      const imgDeltaX = cardCenterX - heroCenterX;
      const imgDeltaY = cardCenterY - heroCenterY;

      // Dedicated transition layer at z-index: 5 (behind stage so cards in the stage are never covered!)
      const layer = document.createElement("div");
      layer.className = "cinematic-hero__transition-layer";
      layer.style.clipPath = `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px round 14px)`;

      const img = document.createElement("img");
      img.src = targetSlide.bgImage;
      img.alt = targetSlide.title;
      img.className = "cinematic-hero__transition-img";
      img.style.transform = `translate3d(${imgDeltaX}px, ${imgDeltaY}px, 0) scale(${initialScale})`;

      const atmos = document.createElement("div");
      atmos.className = "cinematic-hero__transition-atmos";
      atmos.style.opacity = "0";

      layer.appendChild(img);
      layer.appendChild(atmos);
      heroEl.appendChild(layer);

      const animDuration = 800;
      const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

      layer.animate(
        [
          { clipPath: `inset(${clipTop}px ${clipRight}px ${clipBottom}px ${clipLeft}px round 14px)` },
          { clipPath: "inset(0px 0px 0px 0px round 0px)" },
        ],
        { duration: animDuration, easing, fill: "forwards" }
      );

      img.animate(
        [
          { transform: `translate3d(${imgDeltaX}px, ${imgDeltaY}px, 0) scale(${initialScale})` },
          { transform: "translate3d(0, 0, 0) scale(1)" },
        ],
        { duration: animDuration, easing, fill: "forwards" }
      );

      atmos.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: animDuration,
        easing,
        fill: "forwards",
      });

      // 3. Physical Track Translation via GPU WAAPI
      const fromX = -currentIdx * stepX;
      const toX = -targetTrackIndex * stepX;

      const trackAnim = trackEl.animate(
        [
          { transform: `translate3d(${fromX}px, 0, 0)` },
          { transform: `translate3d(${toX}px, 0, 0)` },
        ],
        { duration: animDuration, easing, fill: "forwards" }
      );

      // 4. At 800ms: settle and perform invisible duplicate boundary reset
      trackAnim.onfinish = () => {
        // Direct DOM activation of target background slide so handoff has 0ms gap
        const allBgSlides = heroEl.querySelectorAll<HTMLElement>(".cinematic-hero__bg-slide");
        allBgSlides.forEach((slideEl, idx) => {
          if (idx === targetSlideIdx) {
            slideEl.classList.add("is-active");
            slideEl.style.opacity = "1";
            slideEl.style.zIndex = "2";
          } else {
            slideEl.classList.remove("is-active");
            slideEl.style.opacity = "0";
            slideEl.style.zIndex = "1";
          }
        });

        layer.remove();

        // Boundary normalization: keep trackIndex within [5..8]
        let normalizedIdx = targetTrackIndex;
        if (normalizedIdx >= 9) {
          normalizedIdx = ((normalizedIdx - 5) % 4) + 5;
        } else if (normalizedIdx < 5) {
          normalizedIdx = ((((normalizedIdx - 5) % 4) + 4) % 4) + 5;
        }

        trackIndexRef.current = normalizedIdx;
        displayedSlideIdxRef.current = targetSlideIdx;
        setTrackIndex(normalizedIdx);
        setDisplayedSlideIdx(targetSlideIdx);

        // Reset track inline transform to normalizedIdx without any visible jump
        trackAnim.cancel();
        trackEl.style.transform = `translate3d(${-normalizedIdx * stepX}px, 0, 0)`;

        // Clean up direct DOM styles on next frame
        requestAnimationFrame(() => {
          allBgSlides.forEach((slideEl) => {
            slideEl.style.opacity = "";
            slideEl.style.zIndex = "";
          });
        });

        // Trigger staggered editorial text reveal for the new destination
        setTextPhase("entering");

        // Settle interaction lockout once text animation is complete
        settleTimeoutRef.current = window.setTimeout(() => {
          setTextPhase("idle");
          setIsTransitioning(false);
          isTransitioningRef.current = false;
          setCycleKey((k) => k + 1);
        }, 500);
      };
    },
    [slides, totalSlides, getStepX]
  );

  const handleNext = useCallback(() => {
    if (isTransitioningRef.current) return;
    const targetTrackIdx = trackIndexRef.current + 1;
    const targetSlideIdx = (displayedSlideIdxRef.current + 1) % totalSlides;
    const cardEl = trackRef.current?.querySelector(
      `.cinematic-hero__card[data-track-index="${trackIndexRef.current}"]`
    ) as HTMLElement;
    transitionTo(targetTrackIdx, targetSlideIdx, cardEl);
  }, [transitionTo, totalSlides]);

  const handlePrev = useCallback(() => {
    if (isTransitioningRef.current) return;
    const targetTrackIdx = trackIndexRef.current - 1;
    const targetSlideIdx = (displayedSlideIdxRef.current - 1 + totalSlides) % totalSlides;
    const cardEl = trackRef.current?.querySelector(
      `.cinematic-hero__card[data-track-index="${targetTrackIdx}"]`
    ) as HTMLElement;
    transitionTo(targetTrackIdx, targetSlideIdx, cardEl);
  }, [transitionTo, totalSlides]);

  const handleCardClick = (
    clickedTrackIdx: number,
    clickedSlideIdx: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isTransitioningRef.current) return;
    // When clicked destination becomes hero, it leaves the carousel!
    // The new Slot 1 will be clickedTrackIdx + 1:
    const targetTrackIdx = clickedTrackIdx + 1;
    const targetSlideIdx = clickedSlideIdx;
    transitionTo(targetTrackIdx, targetSlideIdx, e.currentTarget);
  };

  // Autoplay countdown timer (exactly 4 seconds between destination changes, never pauses on hover)
  useEffect(() => {
    if (isTransitioning) return;

    if (autoplayTimerRef.current !== null) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    autoplayTimerRef.current = window.setTimeout(() => {
      autoplayTimerRef.current = null;
      if (!isTransitioningRef.current) {
        handleNext();
      }
    }, autoplayDuration);

    return () => {
      if (autoplayTimerRef.current !== null) {
        window.clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [displayedSlideIdx, isTransitioning, autoplayDuration, handleNext, cycleKey]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, [clearAllTimeouts]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mobile swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section
      ref={heroRef}
      className={`cinematic-hero ${isTransitioning ? "is-animating" : ""}`}
      aria-label="Escora Quiet Luxury Destination Hero"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Background Layer ── */}
      <div className="cinematic-hero__bg-layer" aria-hidden="true">
        {slides.map((slide, idx) => {
          const isTargetOrActive = idx === displayedSlideIdx;
          return (
            <div
              key={slide.id}
              className={`cinematic-hero__bg-slide ${isTargetOrActive ? "is-active" : ""}`}
            >
              <img
                src={slide.bgImage}
                alt={slide.title}
                className="cinematic-hero__bg-img"
                loading="eager"
              />
            </div>
          );
        })}
      </div>

      {/* ── Atmospheric Overlays ── */}
      <div className="cinematic-hero__overlay-radial" aria-hidden="true" />
      <div className="cinematic-hero__overlay-left" aria-hidden="true" />
      <div className="cinematic-hero__overlay-bottom" aria-hidden="true" />
      <div className="cinematic-hero__overlay-top" aria-hidden="true" />

      {/* ── Integrated Luxury Top Navigation ── */}
      <header className="cinematic-hero__navbar">
        {/* Brand */}
        <Link href="/" className="cinematic-hero__brand">
          <div className="cinematic-hero__brand-badge">E</div>
          <div className="cinematic-hero__brand-text">
            <span className="cinematic-hero__brand-name">E S C O R A</span>
            <span className="cinematic-hero__brand-sub">H O L I D A Y S · K E R A L A</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="cinematic-hero__nav-links" aria-label="Main Navigation">
          <Link href="/destinations" className="cinematic-hero__nav-link is-active">
            Destinations
          </Link>
          <Link href="/journeys" className="cinematic-hero__nav-link">
            Bespoke Journeys
          </Link>
          <Link href="/collections/health-wellness" className="cinematic-hero__nav-link">
            Sanctuaries
          </Link>
          <Link href="/journal" className="cinematic-hero__nav-link">
            Editorial Journal
          </Link>
          <Link href="/plan" className="cinematic-hero__nav-link">
            <span className="cinematic-hero__dot" />
            <span>Private Departures</span>
          </Link>
        </nav>

        {/* Right Action */}
        <Link href="/plan" className="cinematic-hero__btn-curate">
          Curate Journey
        </Link>
      </header>

      {/* ── Main Hero Stage: Left Content + Right Escapes Rail ── */}
      <div className="cinematic-hero__stage">
        {/* Left Editorial Info */}
        <div className={`cinematic-hero__editorial is-${textPhase}`}>
          <div className="cinematic-hero__eyebrow">
            <span className="cinematic-hero__eyebrow-dash" />
            <span>{currentSlide.eyebrow}</span>
          </div>

          <h1 className="cinematic-hero__title">{currentSlide.title}</h1>

          <p className="cinematic-hero__description">{currentSlide.description}</p>

          <div className="cinematic-hero__action-row">
            <Link
              href={currentSlide.exploreRoute}
              className="cinematic-hero__btn-explore"
            >
              <span>Explore Destination</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <span className="cinematic-hero__altitude-tag">
              <span className="cinematic-hero__dot" />
              <span>{currentSlide.tag}</span>
            </span>
          </div>
        </div>

        {/* Right Curated Escapes Rail — Continuous Physical Conveyor Track */}
        <div className="cinematic-hero__escapes-wrapper">
          <div className="cinematic-hero__escapes-header">
            <span>Curated Escapes</span>
            <span>Select to Preview</span>
          </div>

          <div className="cinematic-hero__carousel-viewport cinematic-hero__cards-rail">
            <div
              ref={trackRef}
              className="cinematic-hero__carousel-track"
            >
              {trackCards.map((slide, tIdx) => {
                return (
                  <button
                    key={slide.trackKey}
                    type="button"
                    data-track-index={tIdx}
                    data-slide-index={slide.slideIdx}
                    className="cinematic-hero__card"
                    onClick={(e) => handleCardClick(tIdx, slide.slideIdx, e)}
                    disabled={isTransitioning}
                    aria-label={`Select destination ${slide.title}`}
                  >
                    <img
                      src={slide.cardImage}
                      alt={slide.title}
                      className="cinematic-hero__card-img"
                      loading="eager"
                    />
                    <div className="cinematic-hero__card-dot" />
                    <div className="cinematic-hero__card-overlay">
                      <span className="cinematic-hero__card-sub">{slide.cardSub}</span>
                      <span className="cinematic-hero__card-title">{slide.title}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Bar ── */}
      <footer className="cinematic-hero__footer">
        <div className="cinematic-hero__footer-tag">
          <span>Quiet Luxury Travel</span>
          <span className="cinematic-hero__footer-tag-dot" />
          <span>Private Expeditions</span>
        </div>

        <div className="cinematic-hero__footer-center">
          <div className="cinematic-hero__controls">
            <button
              type="button"
              className="cinematic-hero__btn-arrow"
              onClick={handlePrev}
              disabled={isTransitioning}
              aria-label="Previous destination"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="cinematic-hero__btn-arrow"
              onClick={handleNext}
              disabled={isTransitioning}
              aria-label="Next destination"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Continuous Straight 4-second Progress Line */}
          <div
            className="cinematic-hero__progress-track"
            role="progressbar"
            aria-label="Autoplay destination progress"
          >
            <div
              key={`progress-${displayedSlideIdx}-${cycleKey}`}
              className={`cinematic-hero__progress-bar ${
                !isTransitioning ? "is-filling" : ""
              }`}
            />
          </div>
        </div>

        <div className="cinematic-hero__counter">
          <div className="cinematic-hero__counter-roller">
            <span className={`cinematic-hero__counter-num is-${textPhase}`}>
              {slides[displayedSlideIdx].slideNumber}
            </span>
          </div>
          <span className="cinematic-hero__counter-total">/ 0{totalSlides}</span>
        </div>
      </footer>
    </section>
  );
}
