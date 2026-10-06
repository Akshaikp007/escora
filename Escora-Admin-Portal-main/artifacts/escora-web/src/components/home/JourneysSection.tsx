import React, { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import { Link } from "wouter";
import { motion, useMotionValue, animate } from "framer-motion";
import "./JourneysSection.css";

interface JourneyCardData {
  id: string;
  number: string;
  title: string;
  desc: string;
  locations: string;
  image: string;
  link: string;
  icon: "highlands" | "backwaters" | "coast" | "heritage";
}

const JOURNEY_CARDS: JourneyCardData[] = [
  {
    id: "highlands",
    number: "01",
    title: "The\nHighlands",
    desc: "Tea gardens, misty hills and cool mountain air.",
    locations: "Munnar · Thekkady · Wayanad",
    image: "/journeys/card-01-highlands.jpg",
    link: "/destinations/munnar",
    icon: "highlands",
  },
  {
    id: "backwaters",
    number: "02",
    title: "The\nBackwaters",
    desc: "Slow mornings, still waters and timeless village life.",
    locations: "Alappuzha · Kumarakom · Kollam",
    image: "/journeys/card-02-backwaters.jpg",
    link: "/destinations/alleppey",
    icon: "backwaters",
  },
  {
    id: "coast",
    number: "03",
    title: "The\nCoast",
    desc: "Golden shores, gentle waves and the Arabian Sea.",
    locations: "Kovalam · Varkala · Bekal",
    image: "/journeys/card-03-coast.jpg",
    link: "/destinations/kovalam",
    icon: "coast",
  },
  {
    id: "heritage",
    number: "04",
    title: "The\nHeritage",
    desc: "Old streets, spice routes and living history.",
    locations: "Fort Kochi · Thrissur · Muziris",
    image: "/journeys/card-04-heritage.jpg",
    link: "/destinations/fort-kochi",
    icon: "heritage",
  },
];

const TOTAL_CARDS = JOURNEY_CARDS.length; // 4

// Elegant minimal line icons
function CardLineIcon({ type }: { type: JourneyCardData["icon"] }) {
  if (type === "highlands") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        <path d="M4.14 15.08 7 11l4.5 9" />
      </svg>
    );
  }
  if (type === "backwaters") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 19c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
        <path d="M2 22c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
        <path d="M4 16c3-1 6-1 8 0l8-5-4 5H4z" />
        <path d="M12 11V5l4 3-4 1" />
      </svg>
    );
  }
  if (type === "coast") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="10" r="4" />
        <path d="M12 2v2" />
        <path d="m4.93 4.93 1.41 1.41" />
        <path d="M2 10h2" />
        <path d="m19.07 4.93-1.41 1.41" />
        <path d="M20 10h2" />
        <path d="M3 18c3-1.5 6-1.5 9 0s6 1.5 9 0" />
        <path d="M3 21c3-1.5 6-1.5 9 0s6 1.5 9 0" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 21h18" />
      <path d="M5 21V11l7-6 7 6v10" />
      <path d="M9 21v-6h6v6" />
      <path d="M2 11l10-8 10 8" />
      <path d="M12 2v3" />
    </svg>
  );
}

interface JourneysSectionProps {
  id?: string;
}

const JourneysSection = forwardRef<HTMLElement, JourneysSectionProps>(
  ({ id = "categories" }, forwardedRef) => {
    const internalRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const firstCardRef = useRef<HTMLAnchorElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [journeysCompleted, setJourneysCompleted] = useState(false);

    const currentIndexRef = useRef(0);
    const isTransitioningRef = useRef(false);
    const journeysCompletedRef = useRef(false);
    const wheelAccumulatorRef = useRef(0);

    const trackX = useMotionValue(0);

    // Sync refs with state
    useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
    useEffect(() => { journeysCompletedRef.current = journeysCompleted; }, [journeysCompleted]);

    // Merge forwarded ref and internal ref
    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      if (typeof forwardedRef === "function") {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [forwardedRef]);

    /* ── Measure card width + gap dynamically ── */
    const getStepDistance = useCallback(() => {
      if (!firstCardRef.current) return 320;
      const cardWidth = firstCardRef.current.getBoundingClientRect().width;
      let gap = 20;
      if (trackRef.current) {
        const style = window.getComputedStyle(trackRef.current);
        const parsedGap = parseFloat(style.columnGap || style.gap);
        if (!isNaN(parsedGap) && parsedGap > 0) gap = parsedGap;
      }
      return cardWidth + gap;
    }, []);

    /* ── Central Navigation Function: goToCard(targetIndex) ── */
    const goToCard = useCallback(
      (targetIndex: number) => {
        const clamped = Math.max(0, Math.min(TOTAL_CARDS - 1, targetIndex));

        // Check transition lock
        if (isTransitioningRef.current) return;
        if (clamped === currentIndexRef.current && trackX.get() === -getStepDistance() * clamped) return;

        // Set transition lock
        isTransitioningRef.current = true;
        setCurrentIndex(clamped);
        currentIndexRef.current = clamped;

        // Reset completion if navigating backwards
        if (clamped < TOTAL_CARDS - 1) {
          journeysCompletedRef.current = false;
          setJourneysCompleted(false);
        }

        const step = getStepDistance();
        const targetX = -step * clamped;

        // Animate horizontal track with Framer Motion
        animate(trackX, targetX, {
          duration: 0.65,
          ease: [0.16, 1, 0.3, 1],
          onComplete: () => {
            isTransitioningRef.current = false;
            // Mark Journeys as completed only after Card 04 finishes settling
            if (clamped === TOTAL_CARDS - 1) {
              journeysCompletedRef.current = true;
              setJourneysCompleted(true);
            }
          },
        });
      },
      [getStepDistance, trackX]
    );

    /* ── Recalculate track position on window resize ── */
    useEffect(() => {
      const handleResize = () => {
        const step = getStepDistance();
        trackX.set(-step * currentIndexRef.current);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [getStepDistance, trackX]);

    /* ── Scroll Lock & Wheel Interception ── */
    useEffect(() => {
      const handleWheel = (e: WheelEvent) => {
        const section = internalRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        // Active when Journeys section top reaches near viewport top and is in view
        const inSection = rect.top <= 80 && rect.bottom >= window.innerHeight * 0.35;
        if (!inSection) return;

        const goingDown = e.deltaY > 0;
        const goingUp = e.deltaY < 0;

        /* ── DOWNWARD SCROLL ── */
        if (goingDown) {
          const cur = currentIndexRef.current;

          // If Journeys is NOT completed yet: intercept wheel and advance cards
          if (!journeysCompletedRef.current) {
            e.preventDefault();

            if (isTransitioningRef.current) return;

            wheelAccumulatorRef.current += e.deltaY;

            if (wheelAccumulatorRef.current >= 50) {
              wheelAccumulatorRef.current = 0;
              if (cur < TOTAL_CARDS - 1) {
                goToCard(cur + 1);
              }
            }
            return;
          }

          // If journeysCompleted is true (Card 04 animation has fully settled):
          // DO NOT preventDefault! Allow normal page scroll to continue to next section!
        }

        /* ── UPWARD SCROLL ── */
        if (goingUp) {
          const cur = currentIndexRef.current;

          // If on card > 0: intercept wheel and move to previous card
          if (cur > 0) {
            e.preventDefault();

            if (isTransitioningRef.current) return;

            wheelAccumulatorRef.current += e.deltaY;

            if (wheelAccumulatorRef.current <= -50) {
              wheelAccumulatorRef.current = 0;
              goToCard(cur - 1);
            }
            return;
          }

          // If on Card 01 (cur === 0):
          // DO NOT preventDefault! Allow browser to naturally scroll back up to Hero!
          journeysCompletedRef.current = false;
          setJourneysCompleted(false);
          wheelAccumulatorRef.current = 0;
        }
      };

      window.addEventListener("wheel", handleWheel, { passive: false });
      return () => window.removeEventListener("wheel", handleWheel);
    }, [goToCard]);

    /* ── Reset state when scrolled above section into Hero ── */
    useEffect(() => {
      const handleScroll = () => {
        const section = internalRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        // Scrolled above Journeys back into Hero
        if (rect.top > 100) {
          if (journeysCompletedRef.current || currentIndexRef.current !== 0) {
            journeysCompletedRef.current = false;
            setJourneysCompleted(false);
            wheelAccumulatorRef.current = 0;
            goToCard(0);
          }
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }, [goToCard]);

    return (
      <section
        id={id}
        ref={internalRef}
        className={`journeys-section ${isVisible ? "is-visible" : ""}`}
        aria-label="Journeys for every mood"
      >
        {/* Subtle Kerala Botanical & Watermark Background Linework */}
        <div className="journeys-bg-decor" aria-hidden="true">
          {/* Top-Left Palm Frond */}
          <svg className="journeys-decor-corner journeys-decor-tl" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M5,5 Q40,30 85,15 M20,13 Q10,35 5,45 M32,18 Q25,48 20,60 M45,21 Q40,55 35,70 M58,21 Q60,55 58,75 M70,18 Q80,45 85,60" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M5,5 Q55,45 95,85" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Top-Right Botanical Frond */}
          <svg className="journeys-decor-corner journeys-decor-tr" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M95,5 Q60,30 15,15 M80,13 Q90,35 95,45 M68,18 Q75,48 80,60 M55,21 Q60,55 65,70 M42,21 Q40,55 42,75 M30,18 Q20,45 15,60" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M95,5 Q45,45 5,85" strokeWidth="1" strokeLinecap="round" />
          </svg>

          {/* Bottom-Left Coconut Palm Silhouette Linework */}
          <svg className="journeys-decor-corner journeys-decor-bl" viewBox="0 0 100 80" fill="none" stroke="currentColor">
            <path d="M10,80 Q25,40 35,10 M35,10 Q10,12 0,25 M35,10 Q20,2 15,-10 M35,10 Q50,0 65,5 M35,10 Q55,18 70,30 M35,10 Q40,30 45,45" strokeWidth="0.8" strokeLinecap="round" />
          </svg>

          {/* Bottom-Right Palm Linework */}
          <svg className="journeys-decor-corner journeys-decor-br" viewBox="0 0 100 80" fill="none" stroke="currentColor">
            <path d="M90,80 Q75,40 65,10 M65,10 Q90,12 100,25 M65,10 Q80,2 85,-10 M65,10 Q50,0 35,5 M65,10 Q45,18 30,30 M65,10 Q60,30 55,45" strokeWidth="0.8" strokeLinecap="round" />
          </svg>

          {/* Bottom Center Kerala Backwater Houseboat Linework Watermark */}
          <svg className="journeys-decor-bottom-watermark" viewBox="0 0 800 100" fill="none" stroke="currentColor">
            <path d="M0,80 Q100,75 200,80 T400,80 T600,80 T800,80" strokeWidth="0.6" strokeDasharray="6 4" />
            <path d="M50,88 Q150,84 250,88 T450,88 T650,88 T850,88" strokeWidth="0.5" strokeDasharray="8 6" />
            <path d="M120,78 Q130,55 135,40 M135,40 Q125,32 118,36 M135,40 Q145,30 152,36 M135,40 Q138,48 142,56" strokeWidth="0.7" />
            <path d="M150,78 Q158,60 162,48 M162,48 Q154,40 148,44 M162,48 Q170,42 176,46" strokeWidth="0.6" />
            <path d="M680,78 Q690,52 695,38 M695,38 Q685,30 678,35 M695,38 Q705,30 712,35" strokeWidth="0.7" />
            <path d="M420,78 C440,78 490,77 510,74 C518,72 522,66 520,62 C500,60 480,50 450,50 C410,50 395,58 385,64 C380,68 388,75 420,78 Z" strokeWidth="0.9" fill="currentColor" fillOpacity="0.04" />
            <path d="M410,64 L410,54 M430,64 L430,52 M450,64 L450,52 M470,64 L470,54" strokeWidth="0.7" />
            <path d="M380,66 C370,63 365,58 368,54 C372,50 384,58 395,64" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="journeys-container">
          <div className="journeys-layout">
            {/* LEFT: Editorial Content Block (~23%) */}
            <div className="journeys-editorial">
              <div className="journeys-editorial-top">
                {/* Eyebrow */}
                <div className="journeys-eyebrow-wrap">
                  <span className="journeys-eyebrow">CHOOSE YOUR WAY</span>
                  <div className="journeys-eyebrow-line" />
                </div>

                {/* Main Heading */}
                <h2 className="journeys-heading">
                  Journeys<br />
                  for every<br />
                  <span className="journeys-heading-accent">mood.</span>
                </h2>

                {/* Description */}
                <p className="journeys-description">
                  From misty highlands to serene backwaters, golden shores and living heritage — explore Kerala your way.
                </p>
              </div>

              {/* CTA Button */}
              <div className="journeys-cta-wrap">
                <Link href="/journeys" className="journeys-cta-btn" aria-label="Explore All Journeys">
                  <span>Explore All Journeys</span>
                  <span className="journeys-cta-arrow" aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Synchronized Navigation Buttons & Progress Indicator */}
              <div className="journeys-controls">
                <div className="journeys-nav-buttons">
                  <button
                    type="button"
                    className="journeys-nav-btn journeys-nav-prev"
                    onClick={() => goToCard(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    aria-label="Previous journey card"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5" />
                      <path d="m12 19-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className="journeys-nav-btn journeys-nav-next"
                    onClick={() => goToCard(currentIndex + 1)}
                    disabled={currentIndex === TOTAL_CARDS - 1}
                    aria-label="Next journey card"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="journeys-progress-wrap">
                  <div className="journeys-progress-track">
                    <div
                      className="journeys-progress-bar"
                      style={{
                        transform: `scaleX(${(currentIndex + 1) / TOTAL_CARDS})`,
                      }}
                    />
                  </div>
                  <span className="journeys-progress-counter">
                    0{currentIndex + 1} / 0{TOTAL_CARDS}
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT: Four Destination Cards in Animated Horizontal Track */}
            <div className="journeys-gallery-viewport">
              <motion.div
                className="journeys-cards-track"
                ref={trackRef}
                style={{ x: trackX }}
              >
                {JOURNEY_CARDS.map((card, idx) => (
                  <Link
                    key={card.id}
                    ref={idx === 0 ? firstCardRef : undefined}
                    href={card.link}
                    className={`journeys-card ${idx === currentIndex ? "is-active" : ""}`}
                    onClick={() => goToCard(idx)}
                    aria-label={`${card.title.replace("\n", " ")} — ${card.desc}`}
                  >
                    {/* Photo fill */}
                    <div className="journeys-card-image-wrap">
                      <img
                        src={card.image}
                        alt={card.title.replace("\n", " ")}
                        className="journeys-card-image"
                        loading="lazy"
                      />
                    </div>

                    {/* Scrim dark gradient for typography contrast */}
                    <div className="journeys-card-scrim" />

                    {/* Editorial Card Content */}
                    <div className="journeys-card-content">
                      {/* Top line: minimal icon + card number */}
                      <div className="journeys-card-meta-top">
                        <span className="journeys-card-icon">
                          <CardLineIcon type={card.icon} />
                        </span>
                        <span className="journeys-card-number">{card.number}</span>
                      </div>

                      {/* Card Title */}
                      <h3 className="journeys-card-title">{card.title}</h3>

                      {/* Card Description */}
                      <p className="journeys-card-desc">{card.desc}</p>

                      {/* Divider line */}
                      <div className="journeys-card-divider" />

                      {/* Card Bottom: Locations line + Circular arrow */}
                      <div className="journeys-card-bottom">
                        <span className="journeys-card-locations">{card.locations}</span>
                        <div className="journeys-card-arrow" aria-hidden="true">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            </div>

          </div>
        </div>
      </section>
    );
  }
);

JourneysSection.displayName = "JourneysSection";

export default JourneysSection;
