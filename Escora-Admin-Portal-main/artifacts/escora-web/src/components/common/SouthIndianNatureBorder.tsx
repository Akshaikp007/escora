import React from "react";
import "./SouthIndianNatureBorder.css";

export type NatureMotifType =
  | "coconut-palm-left"
  | "tropical-canopy-right"
  | "backwater-landscape"
  | "banana-leaves"
  | "areca-palm"
  | "flowering-branch";

export type NaturePositionType =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "mid-left"
  | "mid-right";

interface SouthIndianNatureBorderProps {
  motif: NatureMotifType;
  position: NaturePositionType;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   MOTIF 1: KERALA COCONUT PALM (Top-Left Corner)
   Arching coconut palm entering from beyond the top-left boundary
   Soft filled pinnate leaflets with delicate spine details
   ───────────────────────────────────────────────────────────── */
function CoconutPalmLeftSvg({ color = "#C5A875" }: { color?: string }) {
  return (
    <svg viewBox="0 0 380 420" fill="none" className="sinb-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Curving trunk silhouette extending out of frame */}
      <path
        d="M-40 -40 C -10 60, 40 180, 110 270 C 120 282, 132 292, 145 300"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        strokeOpacity="0.45"
      />
      <path
        d="M-40 -40 C -10 60, 40 180, 110 270 C 120 282, 132 292, 145 300"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
      {/* Trunk segment rings */}
      <circle cx="20" cy="90" r="12" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx="55" cy="160" r="11" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx="92" cy="230" r="10" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Main Arching Palm Frond 1 (Sweeping downward into the page) */}
      <g opacity="0.95">
        <path d="M145 300 C 180 280, 240 290, 310 350 C 340 375, 365 405, 380 420" stroke={color} strokeWidth="2.5" strokeOpacity="0.85" />
        {/* Soft filled pinnate leaflets */}
        <path d="M180 286 C 185 320, 175 350, 160 370 C 175 350, 192 315, 190 288 Z" fill={color} fillOpacity="0.65" />
        <path d="M205 288 C 215 330, 210 365, 195 390 C 210 365, 225 325, 218 290 Z" fill={color} fillOpacity="0.7" />
        <path d="M235 296 C 255 340, 255 380, 240 405 C 255 380, 265 335, 248 298 Z" fill={color} fillOpacity="0.7" />
        <path d="M265 310 C 295 350, 305 385, 295 415 C 305 385, 305 345, 278 312 Z" fill={color} fillOpacity="0.65" />
        <path d="M295 332 C 330 365, 345 395, 345 420 C 350 395, 340 360, 308 335 Z" fill={color} fillOpacity="0.6" />
        {/* Upper leaflets */}
        <path d="M175 285 C 190 250, 215 230, 240 220 C 220 240, 195 265, 185 286 Z" fill={color} fillOpacity="0.6" />
        <path d="M210 288 C 235 255, 265 240, 295 235 C 270 255, 238 275, 220 290 Z" fill={color} fillOpacity="0.65" />
        <path d="M245 300 C 280 270, 315 260, 345 260 C 315 280, 280 295, 255 302 Z" fill={color} fillOpacity="0.6" />
      </g>

      {/* Palm Frond 2 (Arching across rightward) */}
      <g opacity="0.85">
        <path d="M145 300 C 180 240, 250 200, 340 180 C 365 175, 385 172, 400 170" stroke={color} strokeWidth="2.2" strokeOpacity="0.8" />
        <path d="M185 245 C 190 210, 205 180, 225 160 C 215 190, 198 225, 195 248 Z" fill={color} fillOpacity="0.6" />
        <path d="M225 218 C 240 180, 265 155, 295 140 C 275 170, 248 200, 235 220 Z" fill={color} fillOpacity="0.65" />
        <path d="M268 200 C 295 165, 325 145, 360 135 C 335 160, 300 185, 278 202 Z" fill={color} fillOpacity="0.6" />
        <path d="M310 188 C 345 160, 375 145, 410 140 C 380 160, 345 178, 320 190 Z" fill={color} fillOpacity="0.55" />
      </g>

      {/* Palm Frond 3 (Emerging higher from upper canopy edge) */}
      <g opacity="0.75">
        <path d="M145 300 C 120 210, 130 120, 170 30 C 180 8, 192 -10, 200 -20" stroke={color} strokeWidth="2" strokeOpacity="0.75" />
        <path d="M135 230 C 105 200, 90 165, 85 130 C 105 165, 128 198, 140 225 Z" fill={color} fillOpacity="0.55" />
        <path d="M138 170 C 115 135, 110 95, 115 60 C 128 95, 140 135, 145 165 Z" fill={color} fillOpacity="0.6" />
        <path d="M148 110 C 135 75, 140 40, 155 10 C 158 45, 158 80, 154 105 Z" fill={color} fillOpacity="0.55" />
      </g>

      {/* Coconut cluster at crown base */}
      <circle cx="138" cy="305" r="9" fill={color} fillOpacity="0.7" />
      <circle cx="152" cy="312" r="8" fill={color} fillOpacity="0.65" />
      <circle cx="140" cy="320" r="7.5" fill={color} fillOpacity="0.6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOTIF 2: TROPICAL CANOPY (Top-Right Corner)
   Lush banana leaves & areca palm foliage entering from upper-right
   Broad filled leaves with elegant transverse veins
   ───────────────────────────────────────────────────────────── */
function TropicalCanopyRightSvg({ color = "#B99A62" }: { color?: string }) {
  return (
    <svg viewBox="0 0 380 420" fill="none" className="sinb-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Broad Kerala Banana Leaf 1 (Curving down and leftward) */}
      <g opacity="0.9">
        <path
          d="M390 -30 C 330 60, 240 160, 120 240 C 60 280, 10 310, -20 330"
          stroke={color}
          strokeWidth="3"
          strokeOpacity="0.8"
        />
        {/* Soft filled leaf blade with characteristic natural silhouette cuts */}
        <path
          d="M380 -20 
             C 320 20, 270 90, 210 150 
             C 180 180, 150 200, 110 230 
             C 80 250, 40 270, 0 290 
             C -20 300, -30 320, -10 325 
             C 30 310, 80 275, 130 240 
             C 180 205, 230 165, 280 115 
             C 330 65, 370 15, 395 -10 Z"
          fill={color}
          fillOpacity="0.32"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
        {/* Delicate lateral leaf veins */}
        <path d="M300 70 L 265 95" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M260 110 L 220 140" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M220 150 L 175 185" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M175 190 L 130 225" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M130 230 L 85 265" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      </g>

      {/* Layered Second Banana Leaf (Arching steeper down) */}
      <g opacity="0.8">
        <path
          d="M410 40 
             C 360 110, 310 180, 240 240 
             C 195 280, 140 320, 80 350
             C 120 310, 180 260, 230 210 
             C 280 160, 330 95, 375 30 Z"
          fill={color}
          fillOpacity="0.25"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.45"
        />
        <path d="M410 40 C 340 140, 240 240, 80 350" stroke={color} strokeWidth="2.2" strokeOpacity="0.75" />
      </g>

      {/* Slender Areca Palm Frond crossing behind */}
      <g opacity="0.85">
        <path d="M390 100 C 300 120, 200 170, 110 250 C 70 290, 40 330, 20 370" stroke={color} strokeWidth="2" strokeOpacity="0.75" />
        <path d="M310 125 C 290 160, 280 195, 285 220 C 300 190, 320 155, 325 130 Z" fill={color} fillOpacity="0.6" />
        <path d="M260 142 C 235 180, 220 215, 220 240 C 240 210, 265 175, 275 150 Z" fill={color} fillOpacity="0.65" />
        <path d="M210 168 C 180 205, 160 240, 155 265 C 180 235, 205 198, 220 175 Z" fill={color} fillOpacity="0.6" />
        <path d="M160 200 C 130 240, 110 275, 105 300 C 128 270, 150 232, 168 210 Z" fill={color} fillOpacity="0.55" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOTIF 3: KERALA BACKWATER LANDSCAPE (Bottom-Left Edge)
   Subtle kettuvallam (houseboat) silhouette, gentle water ripples,
   water lilies, and distant palms along the bottom margin
   ───────────────────────────────────────────────────────────── */
function BackwaterLandscapeSvg({ color = "#C5A875" }: { color?: string }) {
  return (
    <svg viewBox="0 0 440 260" fill="none" className="sinb-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Waterline & Gentle Ripple Reflection */}
      <path d="M-20 230 C 50 228, 120 232, 200 230 C 280 228, 360 232, 460 230" stroke={color} strokeWidth="1.2" strokeOpacity="0.5" />
      <path d="M10 242 C 70 240, 130 244, 190 242 C 260 240, 340 243, 420 241" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
      <path d="M40 252 C 100 250, 160 253, 230 251 C 300 249, 380 252, 440 251" stroke={color} strokeWidth="0.8" strokeOpacity="0.3" />

      {/* Traditional Kerala Kettuvallam (Houseboat) Silhouette */}
      <g opacity="0.85">
        {/* Curved wooden hull */}
        <path
          d="M110 228 
             C 130 226, 230 226, 265 228 
             C 278 228, 288 222, 292 216 
             C 285 220, 240 235, 130 235 
             C 95 235, 82 225, 78 218 
             C 85 224, 98 228, 110 228 Z"
          fill={color}
          fillOpacity="0.6"
        />
        {/* Thatched curved bamboo roof (Kettuvallam canopy) */}
        <path
          d="M125 226 
             C 130 195, 175 185, 215 185 
             C 245 185, 260 198, 268 226 
             C 255 223, 140 223, 125 226 Z"
          fill={color}
          fillOpacity="0.45"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.6"
        />
        {/* Houseboat front prow & steering pole */}
        <path d="M78 218 C 65 208, 55 195, 48 180" stroke={color} strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round" />
        <path d="M292 216 C 302 210, 310 200, 316 190" stroke={color} strokeWidth="1.8" strokeOpacity="0.55" strokeLinecap="round" />
        {/* Oar / punt pole slanted in water */}
        <line x1="88" y1="205" x2="68" y2="245" stroke={color} strokeWidth="1.4" strokeOpacity="0.6" />
      </g>

      {/* Tall Shoreline Reeds & Water Grasses (Kuttanad) */}
      <g opacity="0.8">
        <path d="M5 245 C 10 190, 18 140, 22 90" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
        <path d="M15 245 C 22 180, 32 125, 38 75" stroke={color} strokeWidth="1.6" strokeOpacity="0.65" strokeLinecap="round" />
        <path d="M28 245 C 32 200, 42 155, 52 110" stroke={color} strokeWidth="1.4" strokeOpacity="0.55" strokeLinecap="round" />
        <path d="M42 245 C 48 195, 60 150, 72 120" stroke={color} strokeWidth="1.3" strokeOpacity="0.5" strokeLinecap="round" />
        {/* Reed seedheads / plumes */}
        <path d="M22 90 C 26 78, 30 70, 34 65" stroke={color} strokeWidth="2.2" strokeOpacity="0.7" strokeLinecap="round" />
        <path d="M38 75 C 44 62, 50 54, 56 48" stroke={color} strokeWidth="2.4" strokeOpacity="0.75" strokeLinecap="round" />
        <path d="M52 110 C 58 98, 64 88, 70 82" stroke={color} strokeWidth="2.2" strokeOpacity="0.65" strokeLinecap="round" />
      </g>

      {/* Distant Palm Silhouettes along Horizon */}
      <g opacity="0.5">
        {/* Palm 1 */}
        <path d="M340 230 C 342 205, 345 180, 346 160" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
        <path d="M346 160 C 335 150, 320 152, 310 158" stroke={color} strokeWidth="1.2" />
        <path d="M346 160 C 358 148, 372 150, 380 156" stroke={color} strokeWidth="1.2" />
        <path d="M346 160 C 346 142, 348 135, 350 128" stroke={color} strokeWidth="1.2" />
        {/* Palm 2 */}
        <path d="M380 230 C 383 210, 388 190, 390 172" stroke={color} strokeWidth="1.4" strokeOpacity="0.55" />
        <path d="M390 172 C 380 162, 368 165, 360 170" stroke={color} strokeWidth="1.1" />
        <path d="M390 172 C 400 160, 412 162, 420 168" stroke={color} strokeWidth="1.1" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOTIF 4: LAYERED BANANA LEAVES (Bottom-Right / Side)
   Broad lush Kerala banana leaves with delicate midribs and venation
   ───────────────────────────────────────────────────────────── */
function BananaLeafClusterSvg({ color = "#C5A875" }: { color?: string }) {
  return (
    <svg viewBox="0 0 360 380" fill="none" className="sinb-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Leaf 1 (Large upright tropical leaf) */}
      <g opacity="0.85">
        <path
          d="M380 390 
             C 340 320, 280 230, 220 140 
             C 170 70, 120 20, 90 -10
             C 130 40, 190 130, 240 210 
             C 290 290, 340 350, 380 390 Z"
          fill={color}
          fillOpacity="0.28"
          stroke={color}
          strokeWidth="1.4"
          strokeOpacity="0.5"
        />
        <path d="M380 390 C 270 240, 160 90, 90 -10" stroke={color} strokeWidth="2.5" strokeOpacity="0.75" />
        {/* Lateral veins */}
        <path d="M280 260 L 245 285" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M240 205 L 200 230" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M200 150 L 160 175" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <path d="M160 95 L 120 120" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
      </g>

      {/* Leaf 2 (Curving horizontally into the margin) */}
      <g opacity="0.8">
        <path
          d="M390 340 
             C 320 310, 240 270, 160 250 
             C 100 235, 50 235, 10 240
             C 60 220, 130 215, 200 225 
             C 280 240, 340 280, 390 340 Z"
          fill={color}
          fillOpacity="0.32"
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
        <path d="M390 340 C 250 260, 130 235, 10 240" stroke={color} strokeWidth="2" strokeOpacity="0.7" />
      </g>

      {/* Small accent leaf at base */}
      <path
        d="M360 380 C 310 330, 250 300, 190 290 C 240 285, 300 310, 360 380 Z"
        fill={color}
        fillOpacity="0.35"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOTIF 5: ARECA PALM CLUSTER (Side / Vertical Border)
   Slender South Indian areca palms with fine feathery leaflets
   ───────────────────────────────────────────────────────────── */
function ArecaPalmClusterSvg({ color = "#D0B98A" }: { color?: string }) {
  return (
    <svg viewBox="0 0 320 380" fill="none" className="sinb-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Tall slender areca trunk 1 */}
      <path d="M-20 400 C 30 300, 70 180, 95 60" stroke={color} strokeWidth="4" strokeOpacity="0.6" strokeLinecap="round" />
      {/* Slender trunk 2 */}
      <path d="M10 400 C 60 290, 110 170, 145 40" stroke={color} strokeWidth="3.2" strokeOpacity="0.5" strokeLinecap="round" />

      {/* Palm 1 Crown fronds */}
      <g opacity="0.85">
        <path d="M95 60 C 130 40, 180 45, 230 75 C 260 95, 280 120, 290 140" stroke={color} strokeWidth="1.8" strokeOpacity="0.75" />
        <path d="M130 50 C 145 75, 150 100, 145 120 C 158 95, 160 70, 150 52 Z" fill={color} fillOpacity="0.55" />
        <path d="M170 55 C 190 85, 200 115, 195 138 C 205 110, 208 80, 190 58 Z" fill={color} fillOpacity="0.6" />
        <path d="M210 68 C 235 100, 250 130, 250 155 C 258 125, 255 95, 230 72 Z" fill={color} fillOpacity="0.55" />
        <path d="M250 90 C 278 122, 295 150, 300 172 C 302 145, 295 118, 270 95 Z" fill={color} fillOpacity="0.5" />
      </g>

      {/* Palm 2 Crown fronds (Arching leftward) */}
      <g opacity="0.8">
        <path d="M145 40 C 120 15, 80 5, 30 10 C 5 15, -15 25, -30 35" stroke={color} strokeWidth="1.6" strokeOpacity="0.7" />
        <path d="M115 25 C 95 45, 75 60, 55 70 C 75 52, 98 35, 110 24 Z" fill={color} fillOpacity="0.55" />
        <path d="M80 15 C 55 35, 30 50, 10 58 C 30 42, 58 25, 75 14 Z" fill={color} fillOpacity="0.5" />
      </g>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MOTIF 6: FLOWERING KERALA BRANCH (Wellness / Stats)
   Delicate champak / frangipani / jasmine branch with soft petals
   ───────────────────────────────────────────────────────────── */
function FloweringKeralaBranchSvg({ color = "#B99A62" }: { color?: string }) {
  return (
    <svg viewBox="0 0 320 340" fill="none" className="sinb-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Graceful woody branch */}
      <path
        d="M-30 360 C 20 280, 90 200, 160 130 C 210 80, 260 40, 310 10"
        stroke={color}
        strokeWidth="2.5"
        strokeOpacity="0.75"
        strokeLinecap="round"
      />
      {/* Side branchlet */}
      <path d="M120 170 C 150 145, 180 140, 210 150" stroke={color} strokeWidth="1.8" strokeOpacity="0.65" strokeLinecap="round" />

      {/* Flower 1 (5 soft filled petals) */}
      <g transform="translate(160, 130)" opacity="0.85">
        <ellipse cx="0" cy="-16" rx="9" ry="14" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <ellipse cx="15" cy="-5" rx="9" ry="14" transform="rotate(72 15 -5)" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <ellipse cx="9" cy="13" rx="9" ry="14" transform="rotate(144 9 13)" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <ellipse cx="-9" cy="13" rx="9" ry="14" transform="rotate(216 -9 13)" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <ellipse cx="-15" cy="-5" rx="9" ry="14" transform="rotate(288 -15 -5)" fill={color} fillOpacity="0.45" stroke={color} strokeWidth="1" strokeOpacity="0.6" />
        <circle cx="0" cy="0" r="4.5" fill={color} fillOpacity="0.75" />
      </g>

      {/* Flower 2 (Smaller at terminal branch) */}
      <g transform="translate(290, 25)" opacity="0.8">
        <ellipse cx="0" cy="-12" rx="7" ry="11" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
        <ellipse cx="11" cy="-4" rx="7" ry="11" transform="rotate(72 11 -4)" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
        <ellipse cx="7" cy="10" rx="7" ry="11" transform="rotate(144 7 10)" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
        <ellipse cx="-7" cy="10" rx="7" ry="11" transform="rotate(216 -7 10)" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
        <ellipse cx="-11" cy="-4" rx="7" ry="11" transform="rotate(288 -11 -4)" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="0.9" strokeOpacity="0.55" />
        <circle cx="0" cy="0" r="3.5" fill={color} fillOpacity="0.7" />
      </g>

      {/* Soft filled elliptical leaves along branch */}
      <path d="M70 230 C 50 195, 60 170, 90 175 C 95 200, 85 220, 70 230 Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <path d="M100 190 C 90 150, 110 130, 135 145 C 130 170, 118 185, 100 190 Z" fill={color} fillOpacity="0.38" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <path d="M185 145 C 180 115, 200 100, 225 115 C 220 135, 205 145, 185 145 Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
      <path d="M220 90 C 215 65, 235 50, 255 65 C 250 82, 238 90, 220 90 Z" fill={color} fillOpacity="0.32" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT: SouthIndianNatureBorder
   ───────────────────────────────────────────────────────────── */
export default function SouthIndianNatureBorder({
  motif,
  position,
  opacity = 0.18,
  className = "",
  style,
  animated = false,
}: SouthIndianNatureBorderProps) {
  const positionClass = `sinb-${position}`;
  const animClass = animated ? "sinb-animated" : "";

  return (
    <div
      className={`sinb-wrapper ${positionClass} ${animClass} ${className}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    >
      {motif === "coconut-palm-left" && <CoconutPalmLeftSvg />}
      {motif === "tropical-canopy-right" && <TropicalCanopyRightSvg />}
      {motif === "backwater-landscape" && <BackwaterLandscapeSvg />}
      {motif === "banana-leaves" && <BananaLeafClusterSvg />}
      {motif === "areca-palm" && <ArecaPalmClusterSvg />}
      {motif === "flowering-branch" && <FloweringKeralaBranchSvg />}
    </div>
  );
}
