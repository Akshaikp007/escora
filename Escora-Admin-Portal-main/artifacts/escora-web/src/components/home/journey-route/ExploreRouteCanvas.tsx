import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { TravelCategory, JourneySchedule } from './types';

interface ExploreRouteCanvasProps {
  categories: TravelCategory[];
  scrollProgress: MotionValue<number>;
  trackX: MotionValue<number>;
  activeIndex: number;
  schedule: JourneySchedule;
  viewportWidth?: number;
  isReversing?: boolean;
  onSelectCategory: (category: TravelCategory) => void;
}

export const CANVAS_WIDTH = 4200;
export const CANVAS_HEIGHT = 380;

// Continuous wide curved horizontal route spanning 4200px width with gentle, elegant undulating waves
// High points ~270, low points ~305, providing balanced headroom for large cards above the route
const ROUTE_PATH_D = `M 80,290 C 160,290 220,290 280,290 C 420,290 580,270 740,270 C 900,270 1040,300 1200,300 C 1360,300 1500,270 1660,270 C 1820,270 1960,305 2120,305 C 2280,305 2420,275 2580,275 C 2740,275 2880,300 3040,300 C 3200,300 3340,285 3500,285 C 3700,285 3950,290 4150,290`;

/**
 * Calculates exact path arc length for current journeyProgress,
 * matching physical card movement and arrival checkpoints in lockstep.
 */
function getRoutePathLengthForProgress(
  p: number,
  schedule: JourneySchedule,
  points: { length: number }[],
  totalLen: number,
  isReversing: boolean = false
): number {
  if (points.length < 8) return 0;
  const clamped = Math.max(0, Math.min(1, p));

  if (!isReversing) {
    const { pArrive, pDepart } = schedule;
    if (clamped <= pDepart[0]) {
      return points[0]?.length ?? 0;
    }

    if (clamped >= pArrive[7]) {
      const flourishRatio = Math.min(1, (clamped - pArrive[7]) / Math.max(0.001, 1.0 - pArrive[7]));
      return points[7].length + flourishRatio * (totalLen - points[7].length);
    }

    for (let i = 1; i < 8; i++) {
      const travelStart = pDepart[i - 1];
      const travelEnd = pArrive[i];
      const dwellEnd = pDepart[i];

      if (clamped >= travelStart && clamped < travelEnd) {
        const u = (clamped - travelStart) / (travelEnd - travelStart);
        const easeU = u * u * (3 - 2 * u);
        return points[i - 1].length + (points[i].length - points[i - 1].length) * easeU;
      }

      if (clamped >= travelEnd && clamped <= dwellEnd) {
        return points[i].length;
      }
    }

    return points[7]?.length ?? totalLen;
  }

  // Reverse mode: smoothly unwinds across all checkpoints without stopping
  const segProgress = clamped * 7;
  const segIdx = Math.min(6, Math.floor(segProgress));
  const segU = segProgress - segIdx;
  const easeU = segU * segU * (3 - 2 * segU);
  const lenStart = points[segIdx]?.length ?? 0;
  const lenEnd = points[segIdx + 1]?.length ?? totalLen;
  return lenStart + (lenEnd - lenStart) * easeU;
}

export const ExploreRouteCanvas: React.FC<ExploreRouteCanvasProps> = ({
  categories,
  scrollProgress,
  trackX,
  activeIndex,
  schedule,
  viewportWidth = 1440,
  isReversing = false,
  onSelectCategory,
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pathLength, setPathLength] = useState(0);
  const [points, setPoints] = useState<{ x: number; y: number; length: number }[]>([]);
  const [lightPt, setLightPt] = useState<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth < 1024 && !isMobile;

  // Measure SVG path length & calculate exact (x, y) coordinates for all 8 checkpoints along 4200px path
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);

      const steps = 600;
      const samples: { length: number; pt: DOMPoint }[] = [];
      for (let i = 0; i <= steps; i++) {
        const l = (i / steps) * len;
        samples.push({ length: l, pt: pathRef.current.getPointAtLength(l) });
      }

      const sampledPoints = schedule.targetXs.map((targetX) => {
        let closest = samples[0];
        let minDiff = Math.abs(samples[0].pt.x - targetX);
        for (const s of samples) {
          const diff = Math.abs(s.pt.x - targetX);
          if (diff < minDiff) {
            minDiff = diff;
            closest = s;
          }
        }
        return { x: closest.pt.x, y: closest.pt.y, length: closest.length };
      });

      setPoints(sampledPoints);

      if (sampledPoints[0]) {
        setLightPt({ x: sampledPoints[0].x, y: sampledPoints[0].y });
      }
    }
  }, [categories, schedule.targetXs]);

  // Synchronize traveling light marker directly from master journey progress
  useEffect(() => {
    const unsubscribe = scrollProgress.on('change', (latest) => {
      if (pathRef.current && pathLength > 0 && points.length === 8) {
        const clamped = Math.max(0, Math.min(1, latest));
        const targetLen = getRoutePathLengthForProgress(clamped, schedule, points, pathLength, isReversing);
        const pt = pathRef.current.getPointAtLength(targetLen);
        setLightPt({ x: pt.x, y: pt.y });
      }
    });
    return () => unsubscribe();
  }, [scrollProgress, pathLength, points, schedule, isReversing]);

  // Synchronize gold route drawing with exact arrival checkpoints
  const strokeDashoffset = useTransform(scrollProgress, (p) => {
    if (!pathLength || points.length < 8) return pathLength;
    const clamped = Math.max(0, Math.min(1, p));
    const targetLen = getRoutePathLengthForProgress(clamped, schedule, points, pathLength, isReversing);
    return Math.max(0, pathLength - targetLen);
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[370px] sm:h-[380px] overflow-hidden select-none py-1"
    >
      {/* Horizontally Panning Route Track driven by master trackX */}
      <motion.div
        style={{ x: trackX }}
        className="relative h-full w-[4200px] will-change-transform"
      >
        {/* SVG Route Canvas & Background Paths */}
        <svg
          className="absolute inset-0 w-[4200px] h-[380px] pointer-events-none"
          viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
          fill="none"
        >
          <defs>
            <linearGradient id="goldRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9A26D" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B88E56" />
            </linearGradient>
          </defs>

          {/* Faint Background Guide Line */}
          <path
            d={ROUTE_PATH_D}
            stroke="#C9A26D"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.25"
          />

          {/* Primary Scroll-Drawn Gold Route Line */}
          <motion.path
            ref={pathRef}
            d={ROUTE_PATH_D}
            stroke="url(#goldRouteGradient)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: strokeDashoffset,
            }}
          />

          {/* Connector dashed lines between route dots & floating cards */}
          {points.map((pt, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx <= activeIndex;
            const lineY2 = pt.y - 24;

            return (
              <g key={`connector-group-${idx}`}>
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={lineY2}
                  stroke="#C9A26D"
                  strokeWidth={isActive ? 2 : 1.5}
                  strokeDasharray={isActive ? 'none' : '3 3'}
                  opacity={isActive ? 1 : isPassed ? 0.75 : 0.25}
                  className="transition-opacity duration-500"
                />
                <circle
                  cx={pt.x}
                  cy={lineY2}
                  r={isActive ? 3 : 2}
                  fill="#C9A26D"
                  opacity={isPassed ? 1 : 0.4}
                />
              </g>
            );
          })}

          {/* Traveling Light Marker */}
          {lightPt && (
            <g transform={`translate(${lightPt.x}, ${lightPt.y})`}>
              <circle r="22" fill="#C9A26D" opacity="0.25" />
              <circle r="11" fill="#D4AF37" opacity="0.8" />
              <circle r="5.5" fill="#FFFDF9" />
            </g>
          )}

          {/* Checkpoint Dots & Concentric Rings */}
          {points.map((pt, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = idx <= activeIndex;
            const isHovered = hoveredIndex === idx;

            return (
              <g key={`dot-${idx}`} transform={`translate(${pt.x}, ${pt.y})`}>
                {/* Active Concentric Rings */}
                {isActive && (
                  <>
                    <circle
                      r="24"
                      fill="none"
                      stroke="#C9A26D"
                      strokeWidth="1"
                      opacity="0.35"
                      className="animate-ping"
                    />
                    <circle
                      r="16"
                      fill="none"
                      stroke="#C9A26D"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  </>
                )}
                {isHovered && !isActive && (
                  <circle
                    r="14"
                    fill="none"
                    stroke="#C9A26D"
                    strokeWidth="1.5"
                    opacity="0.8"
                  />
                )}
                {/* Outer Ring */}
                <circle
                  r={isActive ? 10 : 7.5}
                  fill="#FAF7F2"
                  stroke="#0F231C"
                  strokeWidth="2"
                />
                {/* Inner Core Dot */}
                <circle
                  r={isActive ? 5.5 : isPassed ? 4.5 : 3.5}
                  fill={isPassed ? '#C9A26D' : '#0F231C'}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Large Editorial Destination Cards along 4200px Journey Track */}
        <div className="absolute inset-0 w-[4200px] h-[380px] pointer-events-none">
          {categories.map((category, idx) => {
            const pt = points[idx] || { x: schedule.targetXs[idx] || 280, y: 290 };
            const isActive = idx === activeIndex;
            const isPassed = idx <= activeIndex;
            const isHovered = hoveredIndex === idx;

            // Scaled-up large card dimensions:
            // Desktop: Active 282px x 242px, Inactive 262px x 226px
            let cardWidth = isActive ? 282 : 262;
            let cardHeight = isActive ? 242 : 226;

            if (isMobile) {
              cardWidth = isActive ? 240 : 220;
              cardHeight = isActive ? 218 : 204;
            } else if (isTablet) {
              cardWidth = isActive ? 264 : 246;
              cardHeight = isActive ? 230 : 216;
            }

            const leftPos = pt.x - cardWidth / 2;
            const topPos = pt.y - cardHeight - 24;

            return (
              <div
                key={category.id}
                style={{
                  position: 'absolute',
                  left: `${leftPos}px`,
                  top: `${topPos}px`,
                  width: `${cardWidth}px`,
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectCategory(category)}
                className={`group pointer-events-auto cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive
                    ? 'opacity-100 scale-100 z-30'
                    : isPassed
                    ? 'opacity-85 scale-95 z-20'
                    : 'opacity-55 scale-90 z-10'
                }`}
              >
                {/* Editorial Travel Card Container */}
                <div
                  className={`relative rounded-[22px] overflow-hidden border transition-all duration-500 ease-out shadow-lg flex flex-col ${
                    isActive
                      ? 'bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE4] border-[#C9A26D] shadow-[0_24px_50px_rgba(15,35,28,0.24)] ring-2 ring-[#C9A26D]/50'
                      : isHovered
                      ? 'bg-[#FAF7F2] border-[#C9A26D] shadow-[0_20px_40px_rgba(15,35,28,0.18)] -translate-y-1'
                      : 'bg-[#FAF7F2]/95 border-[#C9A26D]/35 hover:border-[#C9A26D]/60'
                  }`}
                  style={{ height: `${cardHeight}px` }}
                >
                  {/* Significantly Larger Destination Image Thumbnail */}
                  <div
                    className={`relative w-full overflow-hidden bg-[#0B1511] flex-shrink-0 ${
                      isMobile
                        ? isActive ? 'h-[124px]' : 'h-[114px]'
                        : isActive ? 'h-[146px]' : 'h-[134px]'
                    }`}
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      loading="eager"
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                        isHovered ? 'scale-105 brightness-105' : isActive ? 'scale-101 brightness-100' : 'scale-100 brightness-95'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
                    
                    {/* Category Number Badge */}
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-mono font-semibold text-[#C9A26D] bg-[#0F231C]/85 px-2 py-0.5 rounded backdrop-blur-xs border border-[#C9A26D]/35 shadow-xs">
                      {category.number}
                    </span>

                    {/* Active State Indicator Badge */}
                    {isActive && (
                      <span className="absolute top-2.5 right-2.5 flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-[#0F231C] bg-[#C9A26D] px-2.5 py-0.5 rounded-full uppercase shadow-xs">
                        <Sparkles className="w-3 h-3" /> ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Card Content Panel */}
                  <div className="p-3.5 sm:p-4 bg-[#FAF7F2] text-[#0F231C] flex flex-col justify-between flex-1 border-t border-[#C9A26D]/20">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#0F231C] font-heading-luxury truncate">
                        {category.location.split('&')[0].trim()}
                      </span>

                      <span className="text-xs sm:text-[13px] font-serif-luxury italic text-[#0F231C]/80 truncate leading-tight">
                        {category.title}
                      </span>
                    </div>

                    <div className="pt-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-[#B88E56] font-sans-luxury font-bold uppercase tracking-widest group-hover:text-[#0F231C] transition-colors duration-300">
                      <span>EXPLORE</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 stroke-[2]" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ExploreRouteCanvas;
