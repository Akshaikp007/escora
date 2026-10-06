import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./WhyEscora.css";

interface WhyItem {
  num: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const WHY_ITEMS: WhyItem[] = [
  {
    num: "01",
    title: "Completely Private Journeys",
    desc: "No group departures or shared transfers. Every vehicle, guide and retreat is exclusively dedicated to your rhythm.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Local Specialists",
    desc: "Field naturalists, tribal historians, master chefs and estate families who have lived and preserved this land for generations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Handpicked Stays",
    desc: "Restored ancestral manors, secluded backwater sanctuaries, and eco-lodges chosen strictly for soul, privacy and character.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Local Context",
    desc: "Unfiltered private access to sacred groves, spice auctions, temple ritual masters, and centuries of living traditions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
        <path d="m4.93 4.93 2.12 2.12m9.9 9.9 2.12 2.12M4.93 19.07l2.12-2.12m9.9-9.9 2.12-2.12" />
      </svg>
    ),
  },
  {
    num: "05",
    title: "24/7 Concierge",
    desc: "Discreet, attentive hospitality from our Kochi studio before arrival, throughout your journey, and long after departure.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    num: "06",
    title: "Fully Tailored",
    desc: "We do not sell pre-packaged tours. Every hour, dietary preference and landscape is composed entirely from a blank canvas.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
];

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function WhyEscora() {
  const shouldReduceMotion = useReducedMotion();

  const headerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE_LUXURY },
    },
  };

  const gridContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE_LUXURY },
    },
  };

  return (
    <section className="why-escora-editorial-section" id="why-escora">
      <div className="why-escora-container">
        {/* Header — 1. eyebrow fades upward, 2. heading rises, 3. description fades in */}
        <motion.div
          className="why-escora-header"
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="why-escora-eyebrow-wrap" variants={headerItemVariants}>
            <span className="why-escora-eyebrow">THE ESCORA DISTINCTION</span>
            <div className="why-escora-eyebrow-line" />
          </motion.div>
          <motion.h2 className="why-escora-heading" variants={headerItemVariants}>
            Why the world's discerning travellers{" "}
            <em className="why-escora-heading-accent">choose Escora</em>
          </motion.h2>
          <motion.p className="why-escora-description" variants={headerItemVariants}>
            We don't sell packages. We compose bespoke private journeys — carefully crafted around your curiosities, from the first conversation to the final farewell.
          </motion.p>
        </motion.div>

        {/* 2x3 Grid — feature cards reveal one-by-one with subtle stagger */}
        <motion.div
          className="why-escora-grid"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {WHY_ITEMS.map((item) => (
            <motion.div
              key={item.num}
              className="why-escora-card"
              variants={cardVariants}
            >
              <div className="why-escora-card-top">
                <span className="why-escora-card-icon">{item.icon}</span>
                <span className="why-escora-card-num">{item.num}</span>
              </div>
              <h3 className="why-escora-card-title">{item.title}</h3>
              <p className="why-escora-card-desc">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Heritage Culture Art Watermark: Nalukettu Architecture on bottom-right flank */}
      <div className="why-escora-decor-art" aria-hidden="true">
        <img
          src="/images/art/nalukettu.png"
          alt=""
          className="why-escora-art-img"
          loading="lazy"
        />
      </div>
    </section>
  );
}
