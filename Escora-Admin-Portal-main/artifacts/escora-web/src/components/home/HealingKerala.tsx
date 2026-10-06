import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./HealingKerala.css";

interface ExperienceItem {
  id: string;
  title: string;
  desc: string;
  location: string;
  icon: React.ReactNode;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: "ayurveda",
    title: "Ayurveda & Rejuvenation",
    desc: "Classical physician-led Panchakarma, individualized medicated oils, pulse diagnosis, and restorative botanical therapies.",
    location: "Kumarakom · Palakkad",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1 4-2 6-2 10a4 4 0 0 0 8 0c0-4-3-6-2-10" />
        <path d="M8 18.5c0 1.5 1.8 2.5 4 2.5s4-1 4-2.5" />
      </svg>
    ),
  },
  {
    id: "yoga",
    title: "Yoga & Meditation",
    desc: "Lakeside sunrise asana practice, pranayama under ancient tropical canopies, and evening yoga nidra for profound stillness.",
    location: "Vembanad · Varkala",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2" />
        <path d="M5 20l2-8h10l2 8" />
        <path d="M12 10v5" />
      </svg>
    ),
  },
  {
    id: "kathakali",
    title: "Kathakali & Culture",
    desc: "Private green-room makeup rituals with hereditary masters, temple percussion ensembles, and ancient Kalaripayattu martial traditions.",
    location: "Kochi · Thrissur",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" />
        <path d="M3 9a9 9 0 0 1 18 0" />
        <path d="M6 18a6 6 0 0 0 12 0" />
      </svg>
    ),
  },
  {
    id: "nature",
    title: "Nature & Slow Living",
    desc: "Silent early dawn birding walks, organic forest pepper harvesting, and tranquil afternoons on private spice estates.",
    location: "Wayanad · Thekkady",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    ),
  },
];

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function HealingKerala() {
  const shouldReduceMotion = useReducedMotion();

  const headerContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.14,
      },
    },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, ease: EASE_LUXURY },
    },
  };

  const cardsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30,
      scale: shouldReduceMotion ? 1 : 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.0, ease: EASE_LUXURY },
    },
  };

  return (
    <section className="healing-kerala-section" id="healing">
      <div className="healing-kerala-container">
        {/* Split Header — Slower, atmospheric calm reveal */}
        <div className="healing-kerala-split">
          <motion.div
            className="healing-kerala-left"
            variants={headerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="healing-kerala-eyebrow-wrap" variants={headerItemVariants}>
              <span className="healing-kerala-eyebrow">AYURVEDA &amp; SLOW TRAVEL</span>
              <div className="healing-kerala-eyebrow-line" />
            </motion.div>
            <motion.h2 className="healing-kerala-heading" variants={headerItemVariants}>
              Healing, the{" "}
              <em className="healing-kerala-heading-accent">Kerala way</em>.
            </motion.h2>
            <motion.p className="healing-kerala-description" variants={headerItemVariants}>
              Set on the quiet shores of Vembanad Lake and secluded highland spice sanctuaries — our physician-led wellness journeys combine classical Keraliya medicine, daily yoga, and deep restorative silence. Every programme is composed for you alone.
            </motion.p>
          </motion.div>

          <motion.div
            className="healing-kerala-right"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.0, delay: 0.2, ease: EASE_LUXURY }}
          >
            <p className="healing-kerala-note">
              From classical 14-day Panchakarma detoxifications to quiet meditation sojourns, our resident vaidyas compose treatments around your unique dosha constitution.
            </p>
            <a href="#contact" className="healing-kerala-cta-btn">
              <span>EXPLORE SANCTUARIES</span>
              <span className="healing-arrow" aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>

        {/* 4 Cards — Calm staggered reveal, slow 1.0s timing */}
        <motion.div
          className="healing-kerala-cards"
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {EXPERIENCES.map((exp) => (
            <motion.div
              key={exp.id}
              className="healing-kerala-card"
              variants={cardVariants}
            >
              <div>
                <div className="healing-kerala-card-top">
                  <span className="healing-kerala-card-icon">{exp.icon}</span>
                  <span className="healing-kerala-card-loc">{exp.location}</span>
                </div>
                <h3 className="healing-kerala-card-title">{exp.title}</h3>
                <p className="healing-kerala-card-desc">{exp.desc}</p>
              </div>
              <span className="healing-kerala-card-link">
                Curated Programme <span className="healing-kerala-card-arrow">→</span>
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Heritage Culture Art Watermark: Ayurvedic Botanical Herbs & Nilavilakku on bottom-right flank */}
      <div className="healing-kerala-decor-art" aria-hidden="true">
        <img
          src="/images/art/ayurveda.jpg"
          alt=""
          className="healing-kerala-art-img"
          loading="lazy"
        />
      </div>
    </section>
  );
}
