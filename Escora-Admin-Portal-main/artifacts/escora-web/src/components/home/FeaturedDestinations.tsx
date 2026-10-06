import React from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import "./FeaturedDestinations.css";

interface DestinationItem {
  id: string;
  name: string;
  tag: string;
  desc: string;
  image: string;
  link: string;
}

const DESTINATIONS: DestinationItem[] = [
  {
    id: "varkala",
    name: "Varkala",
    tag: "Cliffs · Arabian Sea",
    desc: "A dramatic coastal escape shaped by red cliffs, golden light and the Arabian Sea.",
    image: "/destinations/varkala.jpg",
    link: "/destinations/varkala",
  },
  {
    id: "bekal",
    name: "Bekal",
    tag: "Northern Coast",
    desc: "Quiet beaches, historic fortifications and untouched coastal landscapes.",
    image: "/destinations/bekal.jpg",
    link: "/destinations/bekal",
  },
  {
    id: "kannur",
    name: "Kannur",
    tag: "Malabar Coast",
    desc: "Living traditions, coastal villages and northern Kerala's rich cultural character.",
    image: "/destinations/kannur.jpg",
    link: "/destinations/kannur",
  },
  {
    id: "wayanad",
    name: "Wayanad",
    tag: "Western Ghats",
    desc: "Mist-covered forests, plantations and secluded mountain retreats.",
    image: "/destinations/wayanad.jpg",
    link: "/destinations/wayanad",
  },
];

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function FeaturedDestinations() {
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
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 35,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.85, ease: EASE_LUXURY },
    },
  };

  return (
    <section className="featured-destinations-section" id="destinations">
      <div className="featured-dest-container">
        {/* Header — Eyebrow → Heading → Description */}
        <motion.div
          className="featured-dest-header"
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="featured-dest-header-left">
            <motion.div className="featured-dest-eyebrow-wrap" variants={headerItemVariants}>
              <span className="featured-dest-eyebrow">CURATED REGIONS</span>
              <div className="featured-dest-eyebrow-line" />
            </motion.div>
            <motion.h2 className="featured-dest-heading" variants={headerItemVariants}>
              From Varkala's cliffs to{" "}
              <em className="featured-dest-heading-accent">Kannur's shores</em>.
            </motion.h2>
          </div>
          <motion.p className="featured-dest-header-desc" variants={headerItemVariants}>
            Escora curates private voyages across Kerala's most captivating geography — each territory revealed with rare intimacy and thoughtful pace.
          </motion.p>
        </motion.div>

        {/* 4 Cards Grid — Staggered, gentle emergence */}
        <motion.div
          className="featured-dest-grid"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {DESTINATIONS.map((dest) => (
            <motion.div
              key={dest.id}
              variants={cardVariants}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <Link
                href={dest.link}
                className="featured-dest-card"
                aria-label={`Explore ${dest.name} — ${dest.desc}`}
              >
                <div className="featured-dest-card-image-wrap">
                  <motion.img
                    src={dest.image}
                    alt={dest.name}
                    className="featured-dest-card-image"
                    loading="lazy"
                    initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.04 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.1, ease: EASE_LUXURY }}
                  />
                </div>
                <div className="featured-dest-card-scrim" />

                <div className="featured-dest-card-content">
                  <span className="featured-dest-card-tag">{dest.tag}</span>
                  <h3 className="featured-dest-card-title">{dest.name}</h3>
                  <p className="featured-dest-card-desc">{dest.desc}</p>
                  <div className="featured-dest-card-footer">
                    <span className="featured-dest-card-cta">
                      Explore Region <span className="featured-dest-card-cta-arrow">→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Heritage Culture Art Watermark: Vallam Kali Snake Boat on bottom-right flank */}
      <div className="featured-dest-decor-art" aria-hidden="true">
        <img
          src="/images/art/snakeboat.png"
          alt=""
          className="featured-dest-art-img"
          loading="lazy"
        />
      </div>
    </section>
  );
}
