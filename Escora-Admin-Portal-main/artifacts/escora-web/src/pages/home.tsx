import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useListPackages, useListDestinations, useCreateEnquiry } from "@workspace/api-client-react";
import Layout from "@/components/layout/Layout";
import CinematicHero from "@/components/home/CinematicHero";
import JourneysSection from "@/components/home/JourneysSection";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import WhyEscora from "@/components/home/WhyEscora";
import JourneyProcess from "@/components/home/JourneyProcess";
import EscoraStats from "@/components/home/EscoraStats";
import HealingKerala from "@/components/home/HealingKerala";
import TravelTypeSection from "@/components/home/TravelTypeSection";
import ExploreKeralaJourneySection from "@/components/home/ExploreKeralaJourneySection";
import Testimonials from "@/components/home/Testimonials";
import JourneyEnquiry from "@/components/home/JourneyEnquiry";
import LuxuryFooter from "@/components/home/LuxuryFooter";
import { useSeo } from "@/hooks/useSeo";
import { useAutoScrollStrip } from "@/hooks/useAutoScrollStrip";
import "./home-v2.css";

const FALLBACK_PACKAGES = [
  { id: 1, name: "The Malabar Escape", durationNights: 5, route: "Kochi · Munnar · Alleppey", category: "Honeymoon", priceFrom: 150000, heroImageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80", description: "A private five-night journey through Kerala's most iconic backwaters, spice gardens and heritage hotels.", featured: true },
  { id: 2, name: "Cardamom Hills Retreat", durationNights: 4, route: "Munnar · Thekkady", category: "Wellness", priceFrom: 120000, heroImageUrl: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?auto=format&fit=crop&w=800&q=80", description: "Four nights among Kerala's cardamom and tea estates with yoga, ayurveda and forest walks.", featured: true },
  { id: 3, name: "Wayanad Wilds", durationNights: 3, route: "Calicut · Wayanad", category: "Adventure", priceFrom: 90000, heroImageUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80", description: "Three nights in Wayanad's tribal heartland — jungle treks, waterfalls and forest living.", featured: true },
  { id: 4, name: "Spice Coast Odyssey", durationNights: 7, route: "Kochi · Marari · Kumarakom", category: "Culture", priceFrom: 220000, heroImageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80", description: "Seven nights tracing the ancient spice trade across Kerala's storied coast and backwaters.", featured: false },
];

import escoraLogo from "@assets/escora/escora-logo-green.png";
import { KERALA_DESTINATIONS, DESTINATION_BADGES } from "@/lib/keralaDestinations";

import munnarHeroImg from "@assets/escora/hero/munnar-hero.jpg";
import munnarThumbImg from "@assets/escora/hero/munnar-thumb.jpg";
import thekkadyHeroImg from "@assets/escora/hero/thekkady-hero.jpg";
import alappuzhaHeroImg from "@assets/escora/hero/alappuzha-hero.jpg";
import kovalamHeroImg from "@assets/escora/hero/kovalam-hero.jpg";

const FALLBACK_DESTINATIONS = KERALA_DESTINATIONS;

/* ── Static data ── */
const CAT_CARDS = [
  {
    id: "honeymoon",
    label: "Honeymoon",
    img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    name: <>Honey-<br/><em>moon</em></>,
    desc: "Candlelit houseboats, private shores and moments composed only for two — along the most romantic waterways in India.",
    price: "₹6,99,000", priceLabel: "from / couple", count: "12 journeys",
  },
  {
    id: "health-wellness",
    label: "Wellness",
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    name: <>Health &amp;<br/><em>Wellness</em></>,
    desc: "Ayurveda, yoga, panchakarma and deep rest — under Kerala's ancient canopy, guided by resident physicians.",
    price: "₹8,200", priceLabel: "from / night", count: "9 programmes",
  },
  {
    id: "nature-wildlife",
    label: "Wildlife",
    img: thekkadyHeroImg,
    name: <>Nature &amp;<br/><em>Wildlife</em></>,
    desc: "Tiger reserves, elephant corridors and shola forests — Kerala's biodiversity, led by expert field naturalists.",
    price: "₹4,50,000", priceLabel: "from / person", count: "7 routes",
  },
  {
    id: "hill-stations",
    label: "Hills",
    img: munnarThumbImg,
    name: <>Hill<br/><em>Stations</em></>,
    desc: "Tea gardens, cardamom forests and colonial planter's bungalows — Kerala's highlands at their most unhurried.",
    price: "₹5,20,000", priceLabel: "from / person", count: "8 itineraries",
  },
  {
    id: "backwaters",
    label: "Backwaters",
    img: alappuzhaHeroImg,
    name: <>Back-<br/><em>waters</em></>,
    desc: "Private kettuvallam on 900 km of lagoons and canals — the slow, silent world of Kerala's interior waterways.",
    price: "₹3,80,000", priceLabel: "from / couple", count: "11 journeys",
  },
];

const CAT_CARDS_ROW2 = [
  {
    id: "beaches",
    label: "Beaches",
    img: kovalamHeroImg,
    name: <>Kerala<br/><em>Beaches</em></>,
    desc: "Sun, cliffs, sea and slow mornings. Clifftop yoga at Varkala, white sands at Marari and fortress shores at Bekal.",
    count: "11 coastal journeys",
  },
  {
    id: "functional-medicine",
    label: "Medicine",
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    name: <>Functional<br/><em>Medicine</em></>,
    desc: "Advanced diagnostics, physician-led protocols and root-cause healing — where Ayurveda meets integrative science.",
    count: "6 programmes",
  },
  {
    id: "historical-heritage",
    label: "Heritage",
    img: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    name: <>Historical<br/><em>&amp; Heritage</em></>,
    desc: "Fort Kochi's spice routes, Padmanabhapuram's wood-carved halls and five centuries of colonial layering.",
    count: "8 heritage routes",
  },
];

const PKG2_CARDS = [
  {
    cats: ["honeymoon", "luxury"],
    catTag: "Honeymoon", price: "₹6,99,000", priceLabel: "per couple",
    // Kerala backwaters — houseboat on golden water, perfect for romance
    img: alappuzhaHeroImg,
    nights: "07 Nights · 08 Days · Alleppey → Munnar",
    title: <>The <em>Backwater</em> Sonata</>,
    desc: "Private houseboat with chef, a 1920s heritage tea bungalow, dawn kalaripayattu and a moonlit dinner on a rice-barge.",
    tags: ["Romance", "Private", "Couples"],
  },
  {
    cats: ["health", "solo"],
    catTag: "Wellness", price: "₹12,30,000", priceLabel: "per person",
    // Yoga meditation by water — calm, restorative, Ayurveda retreat mood
    img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    nights: "14 Nights · 15 Days · Kumarakom → Varkala",
    title: <>The <em>Ayurveda</em> Retreat</>,
    desc: "Physician-led panchakarma on Vembanad Lake — medicated oils, daily consultations, vegetarian cuisine and a boat to a forgotten island.",
    tags: ["Wellness", "Solo", "Slow"],
  },
  {
    cats: ["family"],
    catTag: "Family", price: "₹10,15,000", priceLabel: "family of 4",
    // Authentic Munnar misty tea slopes
    img: munnarHeroImg,
    nights: "10 Nights · 11 Days · Thekkady → Wayanad",
    title: <>Hills, <em>Tea</em> &amp; Tigers</>,
    desc: "Periyar wildlife dawns, a private treehouse in Wayanad and a spice-estate stay — designed for curious families, ages 4 to 84.",
    tags: ["Family", "Wildlife", "Nature"],
  },
  {
    cats: ["luxury", "honeymoon"],
    catTag: "Luxury", price: "₹18,50,000", priceLabel: "per couple",
    // Private infinity pool in tropical luxury resort — heritage indulgence
    img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
    nights: "08 Nights · 09 Days · Kochi → Kovalam",
    title: <>The <em>Palace</em> Circuit</>,
    desc: "Four of Kerala's most extraordinary heritage properties — private butler, personal chef and a sunset cruise on a restored kettuvallam.",
    tags: ["Luxury", "Heritage", "Private"],
  },
  {
    cats: ["solo", "leisure"],
    catTag: "Solo", price: "₹4,50,000", priceLabel: "per person",
    img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80",
    nights: "07 Nights · 08 Days · Fort Kochi → Wayanad",
    title: <>The <em>Solo</em> Navigator</>,
    desc: "Meet a Kathakali master, cycle a spice village at dawn, spend two nights in a forest treehouse — entirely at your own pace.",
    tags: ["Solo", "Culture", "Adventure"],
  },
  {
    cats: ["leisure", "family"],
    catTag: "Leisure", price: "₹3,80,000", priceLabel: "per person",
    img: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    nights: "06 Nights · 07 Days · Varkala → Alleppey",
    title: <>Sun, <em>Sea</em> &amp; Spice</>,
    desc: "Clifftop yoga at sunrise, unhurried backwater days, fresh seafood by the shore — Kerala's most relaxed coastal route.",
    tags: ["Leisure", "Beach", "Slow"],
  },
];

const RETREAT_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 2c1 4-2 6-2 10a4 4 0 0 0 8 0c0-4-3-6-2-10"/><path d="M8 18.5c0 1.5 1.8 2.5 4 2.5s4-1 4-2.5"/></svg>
    ),
    title: <>Ayurveda &amp; <em>Panchakarma</em></>,
    desc: "Physician-led detox in the classical Keraliya tradition — pulse diagnosis, medicated oils prepared in-house, shirodhara and rasayana.",
    offers: ["Panchakarma", "Abhyanga", "Shirodhara", "Rasayana"],
    from: "₹14,500 / night",
    delay: "",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><path d="M5 20l2-8h10l2 8"/><path d="M12 10v5"/></svg>
    ),
    title: <>Yoga &amp; <em>Meditation</em></>,
    desc: "Lakeside sunrise practice from gentle Hatha to disciplined Ashtanga, with pranayama and yoga nidra to settle the mind.",
    offers: ["Hatha", "Ashtanga", "Pranayama", "Yoga Nidra"],
    from: "₹8,200 / night",
    delay: "d1",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M13 4l3 8-8-3 5 5-8 3 3-8 5 5z"/></svg>
    ),
    title: <>Kalaripayattu — <em>the art</em></>,
    desc: "The world's oldest martial art, taught at a traditional kalari by a Gurukkal — forms, footwork and healing marma therapy.",
    offers: ["Meipayattu", "Kolthari", "Marma", "Uzhichil"],
    from: "₹6,500 / session",
    delay: "d2",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    ),
    title: <>Naturopathy &amp; <em>Healthcare</em></>,
    desc: "Doctor-supervised detox, therapeutic diet, physiotherapy and lifestyle medicine — with full medical reports and home aftercare.",
    offers: ["Naturopathy", "Detox", "Physio", "Diet"],
    from: "₹11,000 / night",
    delay: "d3",
  },
];

const TESTIMONIALS = [
  {
    cat: "Honeymoon · Mar 2025",
    quote: '"They moved a sunset for us. Or it felt that way. A boat appeared on a backwater I\'d been told didn\'t exist — and a chef I\'d long admired was on it."',
    av: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    name: "Eleanor V.", meta: "London · Honeymoon", delay: "",
  },
  {
    cat: "Family · Dec 2024",
    quote: '"Our family of seven, ages 6 to 78. The itinerary anticipated every single one of us."',
    av: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    name: "Marcus T.", meta: "San Francisco · Family", delay: "d1",
  },
  {
    cat: "Wellness · Oct 2024",
    quote: '"Escora did not arrange a holiday — they arranged a <em>recovery</em>."',
    av: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    name: "Dr. Aiko N.", meta: "Tokyo · Wellness", delay: "d2",
  },
];

const MARQUEE_ITEMS = [
  "Backwaters of Alleppey", "Tea hills of Munnar", "Fort Kochi nights",
  "Wayanad jungles", "Varkala cliffs", "Ayurveda at Kumarakom", "Thekkady spice trails",
];

const TYPE_PILLS = [
  { label: "Honeymoon", id: "honeymoon" },
  { label: "Health & Wellness", id: "health-wellness" },
  { label: "Nature & Wildlife", id: "nature-wildlife" },
  { label: "Hill Stations", id: "hill-stations" },
  { label: "Backwaters", id: "backwaters" },
  { label: "Beaches", id: "beaches" },
  { label: "Functional Medicine", id: "functional-medicine" },
  { label: "Historical & Heritage", id: "historical-heritage" },
];

const CAT_STRIP_BTNS = [
  { label: "All Journeys", id: "all" },
  { label: "Honeymoon", id: "honeymoon" },
  { label: "Health & Wellness", id: "health-wellness" },
  { label: "Nature & Wildlife", id: "nature-wildlife" },
  { label: "Hill Stations", id: "hill-stations" },
  { label: "Backwaters", id: "backwaters" },
  { label: "Beaches", id: "beaches" },
  { label: "Functional Medicine", id: "functional-medicine" },
  { label: "Historical & Heritage", id: "historical-heritage" },
];

/* ── Enquiry form state ── */
interface EnquiryForm {
  name: string; phone: string; email: string; type: string;
  dates: string; pax: string; budget: string;
}

const LOADER_STORAGE_KEY = "escora-loader-last-seen";

function hasSeenLoaderToday() {
  try {
    return localStorage.getItem(LOADER_STORAGE_KEY) === new Date().toDateString();
  } catch {
    return false;
  }
}

export default function Home() {
  const [loaded, setLoaded] = useState(hasSeenLoaderToday);
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCat, setActiveCat] = useState("all");
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryError, setEnquiryError] = useState("");
  const [form, setForm] = useState<EnquiryForm>({
    name: "", phone: "", email: "", type: "", dates: "", pax: "2 adults (couple)", budget: "",
  });
  const createEnquiry = useCreateEnquiry();

  const categoriesRef = useRef<HTMLElement>(null);
  const packagesRef = useRef<HTMLElement>(null);
  const exploreScrollRef = useRef<HTMLDivElement>(null);

  useSeo({
    description: "Escora crafts luxury Kerala holiday packages — private honeymoon tours, Ayurveda retreats, backwater houseboat stays, and bespoke itineraries for discerning travellers from UK, Europe & the Gulf.",
    url: "https://www.escoraholidays.com/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      name: "Escora",
      url: "https://www.escoraholidays.com",
      logo: "https://www.escoraholidays.com/escora-logo.png",
      image: "https://www.escoraholidays.com/opengraph.jpg",
      description: "Boutique destination management studio crafting private journeys through Kerala for discerning travellers.",
      address: { "@type": "PostalAddress", streetAddress: "1st Floor, Landmark Maple Business Tower", addressLocality: "Kozhikode", addressRegion: "Kerala", postalCode: "673014", addressCountry: "IN" },
      telephone: "+918157003344",
      priceRange: "₹₹₹₹",
      areaServed: { "@type": "State", name: "Kerala", containedInPlace: { "@type": "Country", name: "India" } },
      sameAs: [
        "https://www.linkedin.com/company/escora-holidays/about/",
        "https://www.instagram.com/escora_holidays",
        "https://www.facebook.com/people/Escora-holidays",
      ],
      openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "09:00", closes: "18:00" },
    },
  });

  const { data: packagesData } = useListPackages({ published: true, featured: true });
  const { data: destinationsData } = useListDestinations({ published: true });
  const exploreDestinations = destinationsData && destinationsData.length > 0 ? destinationsData : FALLBACK_DESTINATIONS;

  /* Loader — only plays once per day */
  useEffect(() => {
    if (loaded) return;
    const t = setTimeout(() => {
      setLoaded(true);
      try {
        localStorage.setItem(LOADER_STORAGE_KEY, new Date().toDateString());
      } catch {
        /* private browsing or storage disabled — loader will just replay next visit */
      }
    }, 1700);
    return () => clearTimeout(t);
  }, [loaded]);

  /* Scroll reveal for .rv and .mr2 */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    document.querySelectorAll(".rv, .mr2").forEach((el) => io.observe(el));
    /* Also reveal elements already in view */
    const heroEls = document.querySelectorAll(".hero2 .rv, .hero2 .mr2");
    const t = setTimeout(() => heroEls.forEach((el) => el.classList.add("in")), 200);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [loaded]);

  useAutoScrollStrip(exploreScrollRef, [exploreDestinations]);

  /* Build pkg cards — fall back to built-in samples when API has no data */
  const pkgCards = (packagesData?.length ? packagesData : FALLBACK_PACKAGES).slice(0, 6).map((pkg) => ({
    cats: [pkg.category?.toLowerCase() || "luxury"],
    catTag: pkg.category || "Journey",
    price: pkg.priceFrom ? `₹${Number(pkg.priceFrom).toLocaleString("en-IN")}` : "₹—",
    priceLabel: "per person",
    img: pkg.heroImageUrl || "",
    nights: `${pkg.durationNights} Nights`,
    title: <>{pkg.name}</>,
    desc: pkg.description || "",
    tags: [pkg.category || "Private"],
  }));

  /* Scroll to categories + activate filter */
  function jumpToCategory(id: string) {
    setActiveCat(id === "all" ? "all" : id);
    setActiveFilter(id === "all" ? "all" : id);
    const el = id === "all" ? categoriesRef.current : packagesRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  }

  /* Cat strip click → sync pkg filter + scroll to packages */
  function onCatStripClick(id: string) {
    setActiveCat(id);
    setActiveFilter(id);
    if (packagesRef.current) {
      window.scrollTo({ top: packagesRef.current.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
    }
  }

  function handleEnquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email) return;
    setEnquiryError("");
    const message =
      `Journey type: ${form.type || "Not specified"}\n` +
      `Travellers: ${form.pax || "Not specified"}\n` +
      `Approximate dates: ${form.dates || "Not specified"}\n` +
      `Budget: ${form.budget || "Not specified"}`;
    createEnquiry.mutate(
      { data: { name: form.name, email: form.email, phone: form.phone, message } },
      {
        onSuccess: () => setEnquirySent(true),
        onError: () => setEnquiryError("Something went wrong. Please try again or message us on WhatsApp."),
      }
    );
  }

  function buildWAMsg() {
    return encodeURIComponent(
      `New Escora Enquiry\nName: ${form.name}\nPhone: ${form.phone}` +
      (form.type ? `\nJourney type: ${form.type}` : "") +
      (form.pax ? `\nTravellers: ${form.pax}` : "") +
      (form.dates ? `\nDates: ${form.dates}` : "") +
      (form.budget ? `\nBudget: ${form.budget}` : "")
    );
  }

  return (
    <Layout hideNavbar={true} hideFooter={true}>
      {/* ── Loader ── */}
      <div className={`loader${loaded ? " done" : ""}`} aria-hidden="true">
        <div className="stack">
          <img className="logo-img" src={escoraLogo} alt="Escora" />
        </div>
        <div className="bar" />
        <div className="count">Kerala · for the global traveller</div>
      </div>

      {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
      <CinematicHero />



      {/* ═══════════════════════ JOURNEYS FOR EVERY MOOD ═══════════════════════ */}
{/* <JourneysSection id="categories" ref={categoriesRef} /> */}
      {/* ══════════════════ TRAVEL BY TYPE ══════════════════ */}
      <TravelTypeSection />

      {/* ══════════════════ EXPLORE KERALA JOURNEY ROUTE ══════════════════ */}
      <ExploreKeralaJourneySection />

      {/* ══════════════════ 01: FEATURED KERALA DESTINATIONS ══════════════════ */}
      <FeaturedDestinations />

      {/* ══════════════════ 02: WHY ESCORA ══════════════════ */}
      <WhyEscora />

      {/* ══════════════════ 03: HOW YOUR JOURNEY BEGINS ══════════════════ */}
      <JourneyProcess />

      {/* ══════════════════ 04: STATISTICS / PROOF ══════════════════ */}
      <EscoraStats />

      {/* ══════════════════ 05: HEALING, THE KERALA WAY ══════════════════ */}
      <HealingKerala />

      {/* ══════════════════ 06: GUEST TESTIMONIALS ══════════════════ */}
      <Testimonials />

      {/* ══════════════════ 07: START WITH A BLANK CANVAS ══════════════════ */}
      <JourneyEnquiry
        form={form}
        setForm={setForm}
        enquirySent={enquirySent}
        enquiryError={enquiryError}
        isPending={createEnquiry.isPending}
        onSubmit={handleEnquirySubmit}
        buildWAMsg={buildWAMsg}
      />

      {/* ══════════════════ 08: FOOTER ══════════════════ */}
      <LuxuryFooter />

    </Layout>
  );
}
