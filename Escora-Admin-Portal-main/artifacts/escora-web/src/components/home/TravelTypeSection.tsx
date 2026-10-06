/**
 * TravelTypeSection.tsx
 *
 * Vertical-scroll → horizontal-track storytelling section.
 * Reproduces the interaction model from Test.zip reference.
 *
 * Architecture:
 *   TravelTypeSection
 *     ├── TravelTypeGallery (owns track + X MotionValue)
 *     │     └── TravelTypeCard × 8
 *     ├── GalleryControls
 *     └── CardModal
 */

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion";
import { useLenis } from "lenis/react";
import "./TravelTypeSection.css";

/* ============================================================
   DATA
   ============================================================ */
interface TravelCategory {
  id: string;
  number: string;
  category: string;
  title: string;
  tagline: string;
  metadata: string;
  description: string;
  highlights: string[];
  location: string;
  duration: string;
  image: string;
}

const TRAVEL_CATEGORIES: TravelCategory[] = [
  {
    id: "honeymoon",
    number: "01",
    category: "ROMANTIC SANCTUARIES",
    title: "Honeymoon",
    tagline: "Private infinity pools & secluded ocean bluffs",
    metadata: "Private Villas • Candlelight Dining • 7–10 Days",
    description:
      "Immerse in intimate luxury amid cliffside infinity pools, candlelit candlewood pavilions, and private villa sanctuaries designed for two.",
    highlights: ["Private Sunset Villa", "Floating Breakfast", "Couples Spa Ritual"],
    location: "Bekal & Kumarakom",
    duration: "7 - 10 Days",
    image: "/travel-type/honeymoon.png",
  },
  {
    id: "wellness",
    number: "02",
    category: "HOLISTIC AYURVEDA",
    title: "Health & Wellness",
    tagline: "Ancient healing wisdom & restorative retreats",
    metadata: "Ayurvedic Physicians • Daily Yoga • 14–21 Days",
    description:
      "Physician-led panchakarma and restorative Ayurveda programmes, combined with sunrise yoga and medicated oil therapies in Kerala's serene heartland.",
    highlights: ["Panchakarma Detox", "Veda Yoga Sessions", "Doctor Consultations"],
    location: "Palakkad & Kovalam",
    duration: "14 - 21 Days",
    image: "/travel-type/wellness.png",
  },
  {
    id: "nature",
    number: "03",
    category: "BIODIVERSITY SAFARIS",
    title: "Nature & Wildlife",
    tagline: "Untamed rainforests & wild elephant corridors",
    metadata: "Guided Jungle Trekking • Eco Lodges • 5–7 Days",
    description:
      "Guided expeditions through Kerala's tiger reserves, elephant corridors and shola forests — led by expert field naturalists from intimate eco lodges.",
    highlights: ["Bamboo Rafting", "Elephant Sanctuary Walk", "Night Canopy Trek"],
    location: "Periyar & Wayanad",
    duration: "5 - 7 Days",
    image: "/travel-type/nature.png",
  },
  {
    id: "hills",
    number: "04",
    category: "MISTY TEA HIGHLANDS",
    title: "Hill Stations",
    tagline: "Emerald tea slopes & cool alpine breezes",
    metadata: "Colonial Bungalows • High Tea • 4–6 Days",
    description:
      "Emerald tea estates, cardamom forests and colonial planter's bungalows — Kerala's misty highlands at their most unhurried and restorative.",
    highlights: ["Tea Tasting Masterclass", "Peak View Treks", "Heritage Plantation Stay"],
    location: "Munnar & Vagamon",
    duration: "4 - 6 Days",
    image: "/travel-type/hillstations.png",
  },
  {
    id: "backwaters",
    number: "05",
    category: "EMERALD WATERWAYS",
    title: "Backwaters",
    tagline: "Luxury houseboats drifting through silent canals",
    metadata: "Kettuvallam Yachts • Private Chef • 3–5 Days",
    description:
      "Private kettuvallam on 900 km of lagoons and canals — the slow, silent world of Kerala's interior waterways with your own chef and crew.",
    highlights: ["Sunset Lagoon Cruise", "Fresh Seafood Dining", "Canoe Village Expedition"],
    location: "Alleppey & Vembanad Lake",
    duration: "3 - 5 Days",
    image: "/travel-type/backwaters.png",
  },
  {
    id: "beaches",
    number: "06",
    category: "ARABIAN SEA COASTLINE",
    title: "Kerala Beaches",
    tagline: "Golden sands, lighthouse bluffs & surf breaks",
    metadata: "Beachfront Resorts • Ocean Spa • 5–8 Days",
    description:
      "Clifftop yoga at Varkala, white sands at Marari, fortress shores at Bekal — Kerala's most extraordinary coastal experiences.",
    highlights: ["Sunset Cliff Dining", "Catamaran Sailing", "Seaside Yoga"],
    location: "Varkala & Marari",
    duration: "5 - 8 Days",
    image: "/travel-type/beaches.png",
  },
  {
    id: "functional-medicine",
    number: "07",
    category: "INTEGRATIVE REGENESIS",
    title: "Functional Medicine",
    tagline: "Precision longevity & bio-harmonization",
    metadata: "Longevity Diagnostics • Cellular Repair • 10–14 Days",
    description:
      "Advanced diagnostics, physician-led protocols and root-cause healing — where Ayurveda meets integrative science for optimal longevity.",
    highlights: ["Epigenetic Mapping", "Hyperbaric & Cryo Therapy", "Nutrigenomic Cuisine"],
    location: "Kochi & Thiruvananthapuram",
    duration: "10 - 14 Days",
    image: "/travel-type/func_med.png",
  },
  {
    id: "heritage",
    number: "08",
    category: "CULTURAL LEGACY",
    title: "Historical & Heritage",
    tagline: "Royal timber palaces & living arts traditions",
    metadata: "Palace Stays • Temple Architecture • 5–7 Days",
    description:
      "Fort Kochi's spice routes, Padmanabhapuram's wood-carved halls and five centuries of colonial layering — Kerala's living history.",
    highlights: ["Private Kathakali Viewing", "Heritage Spice Market Tour", "Royal Palace Dining"],
    location: "Fort Kochi & Padmanabhapuram",
    duration: "5 - 7 Days",
    image: "/travel-type/heritage.png",
  },
];

const TOTAL_CARDS = TRAVEL_CATEGORIES.length; // 8

/* ============================================================
   STEP PROGRESSION
   Sequential 1-by-1 cycling through all 8 cards:
   0 → 1 → 2 → 3 → 4 → 5 → 6 → 7
   ============================================================ */
function getNextIndex(currentIndex: number): number {
  return Math.min(TOTAL_CARDS - 1, currentIndex + 1);
}

function getPrevIndex(currentIndex: number): number {
  return Math.max(0, currentIndex - 1);
}

/* Convert card index → scroll progress target */
function indexToProgress(index: number): number {
  return 0.05 + (index / (TOTAL_CARDS - 1)) * 0.83;
}

/* ============================================================
   TravelTypeCard
   ============================================================ */
interface CardProps {
  data: TravelCategory;
  isActive: boolean;
  onClick: (cat: TravelCategory) => void;
}

function TravelTypeCard({ data, isActive, onClick }: CardProps) {
  return (
    <div
      className="tts-card"
      style={{
        outline: isActive ? "1.5px solid rgba(201,162,109,0.5)" : "none",
      }}
      onClick={() => onClick(data)}
      role="button"
      tabIndex={0}
      aria-label={`View ${data.title} journey details`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(data);
      }}
    >
      {/* Full-bleed image */}
      <div className="tts-card-img-wrap">
        <img
          src={data.image}
          alt={data.title}
          className="tts-card-img"
          loading="lazy"
          draggable={false}
        />
      </div>

      {/* Gradient scrims */}
      <div className="tts-card-scrim-top" />
      <div className="tts-card-scrim-bottom" />

      {/* Cinematic grain */}
      <div className="tts-card-grain" aria-hidden="true" />

      {/* Content */}
      <div className="tts-card-content">
        {/* Top row: category + number */}
        <div className="tts-card-top">
          <span className="tts-card-category-label">{data.category}</span>
          <span className="tts-card-number-badge">{data.number}</span>
        </div>

        {/* Bottom area with hover elevation */}
        <div className="tts-card-content-inner">
          <div className="tts-card-bottom">
            <h3 className="tts-card-title">{data.title}</h3>
            <p className="tts-card-tagline">{data.tagline}</p>
            <div className="tts-card-divider" />
            <div className="tts-card-meta">
              <span className="tts-card-location">{data.location}</span>
              <span className="tts-card-duration">{data.duration}</span>
            </div>
            {/* Hidden CTA that reveals on hover via CSS */}
            <button
              className="tts-card-cta"
              onClick={(e) => {
                e.stopPropagation();
                onClick(data);
              }}
              aria-label={`Explore ${data.title} journey`}
              tabIndex={-1}
            >
              View Journey
              <svg
                className="tts-card-cta-arrow"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GalleryControls
   ============================================================ */
interface ControlsProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  isComplete: boolean;
}

function GalleryControls({ currentIndex, total, onPrev, onNext, isComplete }: ControlsProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex >= total - 1;
  const progressPct = ((currentIndex + 1) / total) * 100;

  return (
    <div className="tts-controls">
      {/* Currently viewing label */}
      <div className="tts-viewing-label">
        <span className="tts-viewing-prefix">CURRENTLY VIEWING:</span>
        <span className="tts-viewing-name">{TRAVEL_CATEGORIES[currentIndex]?.title}</span>
        <span className="tts-viewing-dot" aria-hidden="true" />
      </div>

      {/* Arrow buttons + progress line */}
      <div className="tts-controls-row">
        <button
          className="tts-btn"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Previous category"
        >
          <svg
            className="tts-btn-arrow-prev"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
        </button>

        <button
          className="tts-btn"
          onClick={onNext}
          disabled={isLast}
          aria-label="Next category"
        >
          <svg
            className="tts-btn-arrow-next"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>

        {/* Minimal progress line */}
        <div className="tts-progress-wrap" style={{ flex: 1 }}>
          <div className="tts-progress-track">
            <div
              className="tts-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="tts-progress-count">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CardModal
   ============================================================ */
interface ModalProps {
  category: TravelCategory | null;
  onClose: () => void;
}

function CardModal({ category, onClose }: ModalProps) {
  useEffect(() => {
    if (!category) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [category, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (category) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [category]);

  return (
    <AnimatePresence>
      {category && (
        <motion.div
          className="tts-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label={`${category.title} journey details`}
        >
          <motion.div
            className="tts-modal-box"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="tts-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            {/* Image side */}
            <div className="tts-modal-img-side">
              <img
                src={category.image}
                alt={category.title}
                className="tts-modal-img"
              />
              <div className="tts-modal-img-overlay" />
            </div>

            {/* Content side */}
            <div className="tts-modal-content-side">
              <div className="tts-modal-cat-badge">
                <span className="tts-modal-cat-number">{category.number}</span>
                <span className="tts-modal-cat-label">{category.category}</span>
              </div>

              <h2 className="tts-modal-title">{category.title}</h2>
              <p className="tts-modal-tagline">{category.tagline}</p>
              <p className="tts-modal-desc">{category.description}</p>

              <div>
                <p className="tts-modal-section-label">Curated Highlights</p>
                <div className="tts-modal-highlights">
                  {category.highlights.map((h) => (
                    <div key={h} className="tts-modal-highlight-item">
                      <span className="tts-modal-highlight-dot" aria-hidden="true" />
                      {h}
                    </div>
                  ))}
                </div>
              </div>

              <div className="tts-modal-meta-row">
                <div className="tts-modal-meta-item">
                  <span className="tts-modal-meta-label">Destinations</span>
                  <span className="tts-modal-meta-value">{category.location}</span>
                </div>
                <div className="tts-modal-meta-item">
                  <span className="tts-modal-meta-label">Duration</span>
                  <span className="tts-modal-meta-value">{category.duration}</span>
                </div>
              </div>

              <button className="tts-modal-cta" onClick={onClose}>
                Explore Itinerary
                <svg
                  className="tts-modal-cta-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================
   TravelTypeGallery
   Owns: containerRef, trackRef, currentX MotionValue,
         maxScroll measurement, reset animation
   ============================================================ */
interface GalleryProps {
  currentIndex: number;
  isResetting: boolean;
  onResetComplete: () => void;
  onCardClick: (cat: TravelCategory) => void;
  /** Spring-smoothed horizontal X in pixels (negative = moved right→left) */
  scrollX: number;
  onMaxScrollChange: (ms: number) => void;
}

function TravelTypeGallery({
  currentIndex,
  isResetting,
  onResetComplete,
  onCardClick,
  scrollX,
  onMaxScrollChange,
}: GalleryProps) {
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const currentX = useMotionValue(0);
  const isResettingInternalRef = useRef(false);
  const resetAnimRef = useRef<ReturnType<typeof animate> | null>(null);

  /* ── Measure track ── */
  const measure = useCallback(() => {
    const container = galleryContainerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    const ms = Math.max(0, track.scrollWidth - container.clientWidth);
    onMaxScrollChange(ms);
  }, [onMaxScrollChange]);

  useEffect(() => {
    // Wait one frame for layout
    const id = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  /* ── Sync X from scroll (when not in reset mode) ── */
  useEffect(() => {
    if (!isResettingInternalRef.current) {
      currentX.set(scrollX);
    }
  }, [scrollX, currentX]);

  /* ── Reset animation ── */
  useEffect(() => {
    if (isResetting && !isResettingInternalRef.current) {
      isResettingInternalRef.current = true;

      // Cancel any prior animation
      if (resetAnimRef.current) {
        resetAnimRef.current.stop();
        resetAnimRef.current = null;
      }

      resetAnimRef.current = animate(currentX, 0, {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          isResettingInternalRef.current = false;
          onResetComplete();
        },
      });
    } else if (!isResetting && isResettingInternalRef.current) {
      // External cancel
      isResettingInternalRef.current = false;
      if (resetAnimRef.current) {
        resetAnimRef.current.stop();
        resetAnimRef.current = null;
      }
    }
  }, [isResetting, currentX, onResetComplete]);

  return (
    <div className="tts-gallery-container" ref={galleryContainerRef}>
      <motion.div
        className="tts-gallery-track"
        ref={trackRef}
        style={{ x: currentX }}
      >
        {TRAVEL_CATEGORIES.map((cat, i) => (
          <TravelTypeCard
            key={cat.id}
            data={cat}
            isActive={i === currentIndex}
            onClick={onCardClick}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================
   TravelTypeSection — root component
   ============================================================ */
export interface TravelTypeSectionProps {
  id?: string;
}

const TravelTypeSection = forwardRef<HTMLElement, TravelTypeSectionProps>(
  function TravelTypeSection({ id = "travel-by-type" }, ref) {
  const lenis = useLenis();
  /* ── The sticky section that useScroll tracks ── */
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ── State ── */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCardSequenceComplete, setIsCardSequenceComplete] = useState(false);
  const [maxScroll, setMaxScroll] = useState(0);

  /* Scroll-derived X to pass to gallery (computed from spring) */
  const [scrollX, setScrollX] = useState(0);

  /* ── Refs (avoid stale closure issues in event handlers) ── */
  const isTransitionLockedRef = useRef(false);
  const isResettingRef = useRef(false);
  const isCardSequenceCompleteRef = useRef(false);
  const currentIndexRef = useRef(0);
  const maxScrollRef = useRef(0);

  // Sync refs
  useEffect(() => { isCardSequenceCompleteRef.current = isCardSequenceComplete; }, [isCardSequenceComplete]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
  useEffect(() => { maxScrollRef.current = maxScroll; }, [maxScroll]);
  useEffect(() => { isResettingRef.current = isResetting; }, [isResetting]);

  /* ── Framer Motion scroll tracking on the 220vh section ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Spring gives the horizontal track its cinematic feel */
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 28,
    restDelta: 0.0001,
  });

  /* ── Compute horizontal X from spring progress ──
   *
   * Mapping: [0, 0.05, 0.88, 1] → [0, 0, -maxScroll, -maxScroll]
   *
   * First 5%: no movement (intro buffer)
   * 5%–88%:   linear horizontal travel
   * Last 12%: settled at final position
   */
  useEffect(() => {
    const unsubscribe = smoothProgress.on("change", (latest) => {
      if (isResettingRef.current) return;

      const ms = maxScrollRef.current;
      let x: number;

      if (latest <= 0.05) {
        x = 0;
      } else if (latest >= 0.88) {
        x = -ms;
      } else {
        const t = (latest - 0.05) / (0.88 - 0.05);
        x = -ms * t;
      }

      setScrollX(x);
    });
    return unsubscribe;
  }, [smoothProgress]);

  /* ── Card index from RAW (not spring) scroll progress ── */
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const clamped = Math.max(0, Math.min(1, (latest - 0.05) / 0.83));
    const step = 1 / TOTAL_CARDS;
    const computed = Math.floor(clamped / step);
    const idx = Math.max(0, Math.min(TOTAL_CARDS - 1, computed));

    if (idx !== currentIndexRef.current) {
      setCurrentIndex(idx);
      currentIndexRef.current = idx;
    }
  });

  /* ── Programmatic scroll to card position ── */
  const scrollToIndex = useCallback((index: number, isReverse: boolean = false) => {
    const section = sectionRef.current;
    if (!section) return;

    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;
    const totalScrollableDistance = sectionHeight - viewportHeight;
    const targetProgress = indexToProgress(index);
    const targetY = sectionTop + targetProgress * totalScrollableDistance;

    const duration = isReverse ? 0.4 : 0.85;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetY, { duration });
    } else {
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  }, [lenis]);

  /* ── Wheel interception ──
   *
   * DOWN: intercepts wheel and cycles 1 card at a time (0 → 1 → ... → 7).
   *       Only AFTER all cards are cycled does it release the page to scroll down.
   * UP:   cycles backward rapidly to return quickly to earlier content.
   *       At card 0, it releases the page to scroll back up to the Hero.
   */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      // Pinned condition: sticky viewport is pinned within view
      const inSection = rect.top <= 10 && rect.bottom >= window.innerHeight - 10;
      if (!inSection) return;

      const goingDown = e.deltaY > 0;
      const goingUp = e.deltaY < 0;

      /* ── DOWNWARD: Cycle all 8 cards before releasing page ── */
      if (goingDown) {
        const cur = currentIndexRef.current;

        if (!isCardSequenceCompleteRef.current) {
          e.preventDefault();

          if (isTransitionLockedRef.current) return;
          if (isResettingRef.current) return;

          // If already at the last card (index 7), all 8 cards have been cycled!
          // Mark complete so the next downward scroll continues down to the next section.
          if (cur >= TOTAL_CARDS - 1) {
            isCardSequenceCompleteRef.current = true;
            setIsCardSequenceComplete(true);
            return;
          }

          const nextIdx = Math.min(TOTAL_CARDS - 1, cur + 1);
          isTransitionLockedRef.current = true;
          setCurrentIndex(nextIdx);
          currentIndexRef.current = nextIdx;
          scrollToIndex(nextIdx, false);

          setTimeout(() => {
            isTransitionLockedRef.current = false;
          }, 350);

          return;
        }
        // Sequence is complete → let page scroll down naturally to FeaturedDestinations
      }

      /* ── UPWARD: Fast reverse through cards or return to hero ── */
      if (goingUp) {
        const cur = currentIndexRef.current;

        if (cur > 0) {
          e.preventDefault();
          if (isTransitionLockedRef.current) return;

          isCardSequenceCompleteRef.current = false;
          setIsCardSequenceComplete(false);

          const prevIdx = Math.max(0, cur - 1);
          isTransitionLockedRef.current = true;
          setCurrentIndex(prevIdx);
          currentIndexRef.current = prevIdx;
          scrollToIndex(prevIdx, true);

          setTimeout(() => {
            isTransitionLockedRef.current = false;
          }, 200);

          return;
        }

        // At card 0: naturally scroll back up to Hero!
        isCardSequenceCompleteRef.current = false;
        setIsCardSequenceComplete(false);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [scrollToIndex]);

  /* ── Reset state when scrolled above section into Hero ── */
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.top > 40) {
        if (isCardSequenceCompleteRef.current || currentIndexRef.current !== 0) {
          isCardSequenceCompleteRef.current = false;
          setIsCardSequenceComplete(false);
          setCurrentIndex(0);
          currentIndexRef.current = 0;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── Reset complete (called from gallery after animation) ── */
  const handleResetComplete = useCallback(() => {
    setTimeout(() => {
      setIsResetting(false);
      isResettingRef.current = false;
      setIsCardSequenceComplete(false);
      isCardSequenceCompleteRef.current = false;
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }, 200);
  }, []);

  /* ── Next button ── */
  const handleNext = useCallback(() => {
    if (isTransitionLockedRef.current) return;
    const cur = currentIndexRef.current;
    if (cur >= TOTAL_CARDS - 1) return;

    const nextIdx = Math.min(TOTAL_CARDS - 1, cur + 1);
    isTransitionLockedRef.current = true;
    setCurrentIndex(nextIdx);
    currentIndexRef.current = nextIdx;
    scrollToIndex(nextIdx);

    setTimeout(() => {
      isTransitionLockedRef.current = false;
    }, 350);
  }, [scrollToIndex]);

  /* ── Previous button ── */
  const handlePrev = useCallback(() => {
    if (isTransitionLockedRef.current) return;
    const cur = currentIndexRef.current;
    if (cur <= 0) return;

    const prevIdx = Math.max(0, cur - 1);
    isTransitionLockedRef.current = true;
    setCurrentIndex(prevIdx);
    currentIndexRef.current = prevIdx;
    scrollToIndex(prevIdx);

    if (isCardSequenceCompleteRef.current) {
      setIsCardSequenceComplete(false);
      isCardSequenceCompleteRef.current = false;
    }

    setTimeout(() => {
      isTransitionLockedRef.current = false;
    }, 350);
  }, [scrollToIndex]);

  /* ── Entrance animation easing ── */
  const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      {/* ── Section outer (ivory background + texture) ── */}
      <section className="tts-outer" id={id} ref={ref as any}>

        {/* ── 220vh sticky section ── */}
        <div className="tts-sticky-section" ref={sectionRef}>
          <div className="tts-sticky-viewport">

            {/* Decorative gold glow — top right */}
            <div className="tts-decor-gold-glow" aria-hidden="true" />
            {/* Decorative green glow — bottom left */}
            <div className="tts-decor-green-glow" aria-hidden="true" />

            {/* Geometric / line-art motif behind content */}
            <svg
              className="tts-decor-lines"
              viewBox="0 0 900 600"
              fill="none"
              stroke="#0F231C"
              strokeWidth="0.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="450" cy="300" r="280" strokeDasharray="8 14" />
              <circle cx="450" cy="300" r="200" strokeDasharray="6 18" />
              <circle cx="450" cy="300" r="120" strokeDasharray="4 22" />
              <line x1="170" y1="300" x2="730" y2="300" strokeDasharray="6 10" />
              <line x1="450" y1="20" x2="450" y2="580" strokeDasharray="6 10" />
              <line x1="252" y1="102" x2="648" y2="498" strokeDasharray="4 14" />
              <line x1="648" y1="102" x2="252" y2="498" strokeDasharray="4 14" />
            </svg>

            {/* Heritage Kerala Culture Art — Traditional Houseboat Sketch Watermark */}
            <div className="tts-decor-heritage-art" aria-hidden="true">
              <img
                src="/images/art/houseboat.png"
                alt=""
                className="tts-heritage-art-img"
                loading="lazy"
              />
            </div>

            {/* ── 12-col grid layout ── */}
            <div className="tts-inner">

              {/* LEFT: 4 cols — editorial + controls */}
              <div className="tts-editorial">

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: EASE_LUXURY }}
                >
                  <div className="tts-eyebrow-wrap">
                    <span className="tts-eyebrow">Travel by Type</span>
                    <div className="tts-eyebrow-line" />
                  </div>
                </motion.div>

                <motion.h2
                  className="tts-heading"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, delay: 0.25, ease: EASE_LUXURY }}
                >
                  Eight ways to discover<br />
                  <em>Kerala.</em>
                </motion.h2>

                <motion.p
                  className="tts-description"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: EASE_LUXURY }}
                >
                  Choose your travel personality — we'll compose a journey from scratch, entirely around you.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.55, ease: EASE_LUXURY }}
                >
                  <GalleryControls
                    currentIndex={currentIndex}
                    total={TOTAL_CARDS}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    isComplete={isCardSequenceComplete}
                  />
                </motion.div>

              </div>

              {/* RIGHT: 8 cols — horizontal gallery */}
              <TravelTypeGallery
                currentIndex={currentIndex}
                isResetting={isResetting}
                onResetComplete={handleResetComplete}
                onCardClick={setSelectedCategory}
                scrollX={scrollX}
                onMaxScrollChange={setMaxScroll}
              />

            </div>
          </div>
        </div>

      </section>

      {/* Modal — rendered outside section to avoid z-index clipping */}
      <CardModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </>
  );
});

export default TravelTypeSection;
