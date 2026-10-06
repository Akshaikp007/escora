import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./JourneyProcess.css";

interface StepItem {
  num: string;
  title: string;
  desc: string;
}

const STEPS: StepItem[] = [
  {
    num: "01",
    title: "Tell us your ideas",
    desc: "Share your travel style, intended dates, companions and what you wish to feel. No request is too vague — we work with intuitions as naturally as details.",
  },
  {
    num: "02",
    title: "Speak with a Kerala curator",
    desc: "A dedicated Escora curator connects with you for an unhurried private consultation to understand your cadence, palate, and quiet curiosities.",
  },
  {
    num: "03",
    title: "Receive your private itinerary",
    desc: "Your curator crafts a tailored voyage — handpicked private estates, trusted hosts, exclusive backwater crossings, and seamless transit.",
  },
  {
    num: "04",
    title: "Refine until perfect",
    desc: "Nothing is locked until it resonates. We adjust stays, experiences and pacing across multiple revisions until the journey feels completely yours.",
  },
  {
    num: "05",
    title: "Confirm your journey",
    desc: "Seamless reservations, private transport allocation, and a dedicated concierge assigned to your file before your wheels touch the tarmac.",
  },
  {
    num: "06",
    title: "Travel with complete support",
    desc: "Step into Kerala with your private chauffeur, dedicated local specialists, and round-the-clock discreet Kochi support from arrival to departure.",
  },
];

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function JourneyProcess() {
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
        staggerChildren: shouldReduceMotion ? 0 : 0.09,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const stepVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: EASE_LUXURY },
    },
  };

  return (
    <section className="journey-process-section" id="how-it-works">
      <div className="journey-process-container">
        {/* Header: eyebrow → heading → description */}
        <motion.div
          className="journey-process-header"
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="journey-process-eyebrow-wrap" variants={headerItemVariants}>
            <span className="journey-process-eyebrow">THE CONSULTATION PROCESS</span>
            <div className="journey-process-eyebrow-line" />
          </motion.div>
          <motion.h2 className="journey-process-heading" variants={headerItemVariants}>
            How your{" "}
            <em className="journey-process-heading-accent">journey begins</em>
          </motion.h2>
          <motion.p className="journey-process-description" variants={headerItemVariants}>
            Private travel should begin with dialogue, not automated checkout. Here is how we compose each Kerala itinerary from a completely blank sheet of paper.
          </motion.p>
        </motion.div>

        {/* Storytelling animated line divider */}
        <motion.div
          className="journey-process-divider-line"
          initial={shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.95, ease: EASE_LUXURY }}
        />

        {/* 6 Steps Grid: Step 01 → 02 → ... → 06 sequential reveal */}
        <motion.div
          className="journey-process-grid"
          variants={gridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              className="journey-process-step"
              variants={stepVariants}
            >
              <span className="journey-process-step-num">{step.num}</span>
              <h3 className="journey-process-step-title">{step.title}</h3>
              <p className="journey-process-step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="journey-process-bottom"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, delay: 0.2, ease: EASE_LUXURY }}
        >
          <a href="#contact" className="journey-process-cta-btn">
            <span>START YOUR JOURNEY</span>
            <span className="journey-process-arrow" aria-hidden="true">→</span>
          </a>
        </motion.div>
      </div>

      {/* Heritage Culture Art Watermark: Temple Elephant on bottom-right flank */}
      <div className="journey-process-decor-art" aria-hidden="true">
        <img
          src="/images/art/elephant.jpg"
          alt=""
          className="journey-process-art-img"
          loading="lazy"
        />
      </div>
    </section>
  );
}
