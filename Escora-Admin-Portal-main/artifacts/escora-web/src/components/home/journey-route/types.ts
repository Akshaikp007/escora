export interface TravelCategory {
  id: string;
  number: string;
  title: string;
  categoryLabel: string;
  tagline: string;
  metadata: string;
  description: string;
  highlights: string[];
  image: string;
  accentColor?: string;
  location: string;
  idealDuration: string;
}

export const KERALA_TRAVEL_CATEGORIES: TravelCategory[] = [
  {
    id: 'honeymoon',
    number: '01',
    title: 'Honeymoon',
    categoryLabel: 'ROMANTIC SANCTUARIES',
    tagline: 'Private infinity pools & secluded ocean bluffs',
    metadata: 'Private Villas • Candlelight Dining • 7–10 Days',
    description: 'Immerse in intimate luxury amid cliffside infinity pools, candlelit candlewood pavilions, and private villa sanctuaries designed for two.',
    highlights: ['Private Sunset Villa', 'Floating Breakfast', 'Couples Spa Ritual'],
    image: '/images/honeymoon.png',
    location: 'Bekal & Kumarakom',
    idealDuration: '7 - 10 Days'
  },
  {
    id: 'wellness',
    number: '02',
    title: 'Health & Wellness',
    categoryLabel: 'HOLISTIC AYURVEDA',
    tagline: 'Ancient healing wisdom & restorative retreats',
    metadata: 'Ayurvedic Physicians • Daily Yoga • 14–21 Days',
    description: 'Reclaim inner equilibrium with centuries-old Ayurvedic therapies, herbal elixir baths, and tailored wellness programs in serene tropical garden sanctuaries.',
    highlights: ['Panchakarma Detox', 'Veda Yoga Sessions', 'Doctor Consultations'],
    image: '/images/wellness.png',
    location: 'Palakkad & Kovalam',
    idealDuration: '14 - 21 Days'
  },
  {
    id: 'nature',
    number: '03',
    title: 'Nature & Wildlife',
    categoryLabel: 'BIODIVERSITY SAFARIS',
    tagline: 'Untamed rainforests & wild elephant corridors',
    metadata: 'Guided Jungle Trekking • Eco Lodges • 5–7 Days',
    description: 'Venture deep into lush Western Ghats reserves, tracking wild elephant herds, rare bird species, and exotic flora with expert naturalist guides.',
    highlights: ['Bamboo Rafting', 'Elephant Sanctuary Walk', 'Night Canopy Trek'],
    image: '/images/nature.png',
    location: 'Periyar & Wayanad',
    idealDuration: '5 - 7 Days'
  },
  {
    id: 'hillstations',
    number: '04',
    title: 'Hill Stations',
    categoryLabel: 'MISTY TEA HIGHLANDS',
    tagline: 'Emerald tea slopes & cool alpine breezes',
    metadata: 'Colonial Bungalows • High Tea • 4–6 Days',
    description: 'Ascend to misty mountain ridges blanketed by endless tea plantations, waterfalls, and heritage colonial estate houses floating above the clouds.',
    highlights: ['Tea Tasting Masterclass', 'Peak View Treks', 'Heritage Plantation Stay'],
    image: '/images/hillstations.png',
    location: 'Munnar & Vagamon',
    idealDuration: '4 - 6 Days'
  },
  {
    id: 'backwaters',
    number: '05',
    title: 'Backwaters',
    categoryLabel: 'EMERALD WATERWAYS',
    tagline: 'Luxury houseboats drifting through silent canals',
    metadata: 'Kettuvallam Yachts • Private Chef • 3–5 Days',
    description: 'Sail along serene palm-fringed lagoons and quiet village waterways aboard handcrafted wooden houseboats equipped with full luxury amenities and personal chefs.',
    highlights: ['Sunset Lagoon Cruise', 'Fresh Seafood Dining', 'Canoe Village Expedition'],
    image: '/images/backwaters.png',
    location: 'Alleppey & Vembanad Lake',
    idealDuration: '3 - 5 Days'
  },
  {
    id: 'beaches',
    number: '06',
    title: 'Kerala Beaches',
    categoryLabel: 'ARABIAN SEA COASTLINE',
    tagline: 'Golden sands, lighthouse bluffs & surf breaks',
    metadata: 'Beachfront Resorts • Ocean Spa • 5–8 Days',
    description: 'Unwind on golden coconut-shaded beaches along the turquoise Arabian Sea, where dramatic red cliffs meet warm tropical waters and serene coastal sunsets.',
    highlights: ['Sunset Cliff Dining', 'Catamaran Sailing', 'Seaside Yoga'],
    image: '/images/beaches.png',
    location: 'Varkala & Marari',
    idealDuration: '5 - 8 Days'
  },
  {
    id: 'functional-medicine',
    number: '07',
    title: 'Functional Medicine',
    categoryLabel: 'INTEGRATIVE REGENESIS',
    tagline: 'Precision longevity & bio-harmonization',
    metadata: 'Longevity Diagnostics • Cellular Repair • 10–14 Days',
    description: 'Experience cutting-edge integrative diagnostics paired with bio-individual cellular therapies and botanical medicine tailored by world-class specialists.',
    highlights: ['Epigenetic Mapping', 'Hyperbaric & Cryo Therapy', 'Nutrigenomic Cuisine'],
    image: '/images/func_med.png',
    location: 'Kochi & Thiruvananthapuram',
    idealDuration: '10 - 14 Days'
  },
  {
    id: 'heritage',
    number: '08',
    title: 'Historical & Heritage',
    categoryLabel: 'CULTURAL LEGACY',
    tagline: 'Royal timber palaces & living arts traditions',
    metadata: 'Palace Stays • Temple Architecture • 5–7 Days',
    description: 'Step into royal heritage at century-old Nalukettu mansions, spice trade ports, Kathakali dance rituals, and sacred architectural landmarks.',
    highlights: ['Private Kathakali Viewing', 'Heritage Spice Market Tour', 'Royal Palace Dining'],
    image: '/images/heritage.png',
    location: 'Fort Kochi & Padmanabhapuram',
    idealDuration: '5 - 7 Days'
  }
];

export interface JourneySchedule {
  viewportWidth: number;
  targetXs: number[];
  translations: number[];
  pArrive: number[];
  pDepart: number[];
  totalTravelDist: number;
}

export function computeJourneySchedule(vw: number): JourneySchedule {
  const isMobile = vw < 640;
  const isTablet = vw < 1024 && !isMobile;

  const cardWidth = isMobile ? 248 : isTablet ? 270 : 292;
  const targetXs = [280, 740, 1200, 1660, 2120, 2580, 3040, 3500];

  // Desired viewport center for each checkpoint
  const desiredV = targetXs.map((x, idx) => {
    if (idx === 0) {
      if (isMobile) return vw * 0.50;
      return Math.max(cardWidth / 2 + 24, Math.min(280, vw * 0.28));
    }
    // Checkpoints 1..7: centered in viewport with breathing room
    return vw * 0.50;
  });

  // Required translations T[i] to align card i center with desiredV[i]
  const translations = targetXs.map((x, idx) => {
    const rawT = desiredV[idx] - x;
    return Math.min(0, rawT);
  });

  // Calculate physical travel distances between consecutive checkpoints
  const deltas: number[] = [];
  for (let i = 1; i < 8; i++) {
    deltas.push(Math.abs(translations[i] - translations[i - 1]));
  }
  const totalTravelDist = deltas.reduce((a, b) => a + b, 0) || 1;

  // Allocate normalized journey progress:
  // 62% for active physical travel, 38% for checkpoint dwells
  const P_TRAVEL_TOTAL = 0.62;
  const travelDurs = deltas.map((d) => (d / totalTravelDist) * P_TRAVEL_TOTAL);

  const DWELL_BASE = 0.038;
  const dwellDurs = [
    DWELL_BASE, // Checkpoint 0
    DWELL_BASE, // Checkpoint 1
    DWELL_BASE, // Checkpoint 2
    DWELL_BASE, // Checkpoint 3
    DWELL_BASE, // Checkpoint 4
    DWELL_BASE, // Checkpoint 5
    DWELL_BASE, // Checkpoint 6
    0,          // Checkpoint 7 (remainder to 1.0)
  ];

  const sumUsed = dwellDurs.slice(0, 7).reduce((a, b) => a + b, 0) + P_TRAVEL_TOTAL;
  dwellDurs[7] = Math.max(0.08, 1.0 - sumUsed);

  const pArrive: number[] = new Array(8).fill(0);
  const pDepart: number[] = new Array(8).fill(0);

  // Checkpoint 0 starts immediately
  pArrive[0] = 0;
  pDepart[0] = dwellDurs[0];

  for (let i = 1; i < 8; i++) {
    pArrive[i] = pDepart[i - 1] + travelDurs[i - 1];
    pDepart[i] = i === 7 ? 1.0 : pArrive[i] + dwellDurs[i];
  }

  return {
    viewportWidth: vw,
    targetXs,
    translations,
    pArrive,
    pDepart,
    totalTravelDist,
  };
}

export function getTrackXForProgress(
  p: number,
  schedule: JourneySchedule,
  isReversing: boolean = false
): number {
  const { translations, pArrive, pDepart } = schedule;
  const clamped = Math.max(0, Math.min(1, p));

  if (!isReversing) {
    if (clamped <= pDepart[0]) {
      return translations[0];
    }

    if (clamped >= pArrive[7]) {
      return translations[7];
    }

    for (let i = 1; i < 8; i++) {
      const travelStart = pDepart[i - 1];
      const travelEnd = pArrive[i];
      const dwellEnd = pDepart[i];

      if (clamped >= travelStart && clamped < travelEnd) {
        const u = (clamped - travelStart) / (travelEnd - travelStart);
        const easeU = u * u * (3 - 2 * u); // Smoothstep
        return translations[i - 1] + (translations[i] - translations[i - 1]) * easeU;
      }

      if (clamped >= travelEnd && clamped <= dwellEnd) {
        return translations[i];
      }
    }

    return translations[7];
  }

  // Reverse mode: one unified smooth transition across all checkpoints without stopping
  const segProgress = clamped * 7;
  const segIdx = Math.min(6, Math.floor(segProgress));
  const segU = segProgress - segIdx;
  const easeU = segU * segU * (3 - 2 * segU);
  return translations[segIdx] + (translations[segIdx + 1] - translations[segIdx]) * easeU;
}

export function getActiveIndexForProgress(p: number, pArrive: number[]): number {
  const clamped = Math.max(0, Math.min(1, p));
  for (let i = 7; i >= 0; i--) {
    if (clamped >= pArrive[i]) {
      return i;
    }
  }
  return 0;
}

