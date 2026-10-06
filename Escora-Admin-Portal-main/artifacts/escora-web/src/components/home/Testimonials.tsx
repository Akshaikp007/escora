import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./Testimonials.css";

interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  location: string;
  avatar: string;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "clara",
    quote: "“Escora took us into parts of Kerala we had no idea existed. Our stay at the cardamom estate felt like visiting old friends rather than checking into a hotel.”",
    name: "Lady Clara & Marcus Thorne",
    location: "London, United Kingdom",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "jean",
    quote: "“The kettuvallam cruise through the quietest lagoons of Kumarakom with a private chef was one of the most serene three days of our lives.”",
    name: "Jean-Philippe & Eléonore Roux",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "vikram",
    quote: "“Unpretentious, deeply knowledgeable, and endlessly thoughtful. When our flight was delayed into Cochin, our concierge already had everything reorganised seamlessly.”",
    name: "Vikram & Sunita Malhotra",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
];

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function Testimonials() {
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
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
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
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE_LUXURY },
    },
  };

  return (
    <section className="escora-testimonials-section" id="testimonials">
      <div className="escora-testimonials-container">
        {/* Header */}
        <motion.div
          className="escora-testimonials-header"
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="escora-testimonials-eyebrow-wrap" variants={headerItemVariants}>
            <span className="escora-testimonials-eyebrow">DISPATCHES &amp; REFLECTIONS</span>
            <div className="escora-testimonials-eyebrow-line" />
          </motion.div>
          <motion.h2 className="escora-testimonials-heading" variants={headerItemVariants}>
            Quiet praise, from{" "}
            <em className="escora-testimonials-heading-accent">quieter people</em>.
          </motion.h2>
        </motion.div>

        {/* 3 Cards Grid — Staggered individual card reveals */}
        <motion.div
          className="escora-testimonials-grid"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {TESTIMONIALS_DATA.map((t) => (
            <motion.div
              key={t.id}
              className="escora-testimonial-card"
              variants={cardVariants}
            >
              <p className="escora-testimonial-quote">{t.quote}</p>
              <div className="escora-testimonial-footer">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="escora-testimonial-avatar"
                  loading="lazy"
                />
                <div className="escora-testimonial-meta">
                  <span className="escora-testimonial-name">{t.name}</span>
                  <span className="escora-testimonial-location">{t.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Heritage Culture Art Watermark: Fort Kochi Coast Fishing Nets on bottom-left flank */}
      <div className="escora-testimonials-decor-art" aria-hidden="true">
        <img
          src="/images/art/cheenavala.jpg"
          alt=""
          className="escora-testimonials-art-img"
          loading="lazy"
        />
      </div>
    </section>
  );
}
