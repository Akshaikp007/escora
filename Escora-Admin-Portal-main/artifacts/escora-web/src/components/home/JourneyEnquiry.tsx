import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./JourneyEnquiry.css";

interface JourneyEnquiryProps {
  form: {
    name: string;
    phone: string;
    email: string;
    type: string;
    dates: string;
    pax: string;
    budget: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      email: string;
      type: string;
      dates: string;
      pax: string;
      budget: string;
    }>
  >;
  enquirySent: boolean;
  enquiryError: string;
  isPending: boolean;
  onSubmit: (e: React.FormEvent) => void;
  buildWAMsg: () => string;
}

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function JourneyEnquiry({
  form,
  setForm,
  enquirySent,
  enquiryError,
  isPending,
  onSubmit,
  buildWAMsg,
}: JourneyEnquiryProps) {
  const shouldReduceMotion = useReducedMotion();

  const leftContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const leftItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.95, ease: EASE_LUXURY },
    },
  };

  const formVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 40,
      scale: shouldReduceMotion ? 1 : 0.985,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1.0, delay: shouldReduceMotion ? 0 : 0.15, ease: EASE_LUXURY },
    },
  };

  return (
    <section className="journey-enquiry-section" id="contact">
      {/* Subtle Kerala Rainforest / Highlands background image texture */}
      <img
        src="/journeys/card-01-highlands.jpg"
        alt=""
        aria-hidden="true"
        className="journey-enquiry-bg-image"
      />
      <div className="journey-enquiry-overlay" aria-hidden="true" />

      <div className="journey-enquiry-container">
        <div className="journey-enquiry-layout">
          {/* LEFT COLUMN: Editorial & Contact Details — Sequenced reveal */}
          <motion.div
            className="journey-enquiry-left"
            variants={leftContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div className="journey-enquiry-eyebrow-wrap" variants={leftItemVariants}>
              <span className="journey-enquiry-eyebrow">BEGIN YOUR VOYAGE</span>
              <div className="journey-enquiry-eyebrow-line" />
            </motion.div>

            <motion.h2 className="journey-enquiry-heading" variants={leftItemVariants}>
              Start with a<br />
              <span className="journey-enquiry-heading-accent">blank canvas.</span>
            </motion.h2>

            <motion.p className="journey-enquiry-lede" variants={leftItemVariants}>
              Tell us how you want to experience Kerala and we'll build the journey around you. Within 24 hours, an Escora curator will compose a private draft tailored to your cadence.
            </motion.p>

            <motion.blockquote className="journey-enquiry-meta-quote" variants={leftItemVariants}>
              “Private journeys, thoughtfully created.”
            </motion.blockquote>

            {/* Direct Contact Points */}
            <motion.div className="journey-enquiry-contacts" variants={leftItemVariants}>
              <div className="journey-enquiry-contact-item">
                <span className="journey-enquiry-contact-lbl">Curators Direct Line / WhatsApp</span>
                <a href="https://wa.me/918157003344" className="journey-enquiry-contact-val" target="_blank" rel="noopener noreferrer">
                  +91 8157 003 344
                </a>
              </div>
              <div className="journey-enquiry-contact-item">
                <span className="journey-enquiry-contact-lbl">Editorial &amp; Client Inquiries</span>
                <a href="mailto:hello@escoraholidays.com" className="journey-enquiry-contact-val">
                  hello@escoraholidays.com
                </a>
              </div>
              <div className="journey-enquiry-contact-item">
                <span className="journey-enquiry-contact-lbl">Studio &amp; Operations</span>
                <span className="journey-enquiry-contact-val">
                  Fort Kochi &amp; Kozhikode · Kerala, India
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Luxury Form — Gently rises into view without bounce */}
          <motion.div
            className="journey-enquiry-form-wrap"
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {enquirySent ? (
              <div className="journey-enquiry-success">
                <div className="journey-enquiry-success-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="journey-enquiry-success-title">
                  Enquiry <em style={{ fontStyle: "italic", color: "#DFC8A2" }}>received</em>.
                </h3>
                <p className="journey-enquiry-success-text">
                  Your dedicated Kerala curator will review your request and connect within 24 hours. To begin an immediate dialogue, connect with us on WhatsApp.
                </p>
                <a
                  href={`https://wa.me/918157003344?text=${buildWAMsg()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="journey-enquiry-submit-btn"
                  style={{ textDecoration: "none" }}
                >
                  Continue on WhatsApp →
                </a>
              </div>
            ) : (
              <form className="journey-enquiry-form" onSubmit={onSubmit}>
                <div className="journey-enquiry-row">
                  <div className="journey-enquiry-field">
                    <label htmlFor="form-name" className="journey-enquiry-label">NAME *</label>
                    <input
                      id="form-name"
                      type="text"
                      placeholder="e.g. Eleanor Vance"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="journey-enquiry-input"
                    />
                  </div>
                  <div className="journey-enquiry-field">
                    <label htmlFor="form-email" className="journey-enquiry-label">EMAIL *</label>
                    <input
                      id="form-email"
                      type="email"
                      placeholder="e.g. eleanor@vance.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="journey-enquiry-input"
                    />
                  </div>
                </div>

                <div className="journey-enquiry-row">
                  <div className="journey-enquiry-field">
                    <label htmlFor="form-phone" className="journey-enquiry-label">PHONE / WHATSAPP *</label>
                    <input
                      id="form-phone"
                      type="tel"
                      placeholder="+91 / +44 …"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                      className="journey-enquiry-input"
                    />
                  </div>
                  <div className="journey-enquiry-field">
                    <label htmlFor="form-dates" className="journey-enquiry-label">TRAVEL DATES</label>
                    <input
                      id="form-dates"
                      type="text"
                      placeholder="e.g. Nov 2026, 8 nights"
                      value={form.dates}
                      onChange={(e) => setForm({ ...form, dates: e.target.value })}
                      className="journey-enquiry-input"
                    />
                  </div>
                </div>

                <div className="journey-enquiry-row">
                  <div className="journey-enquiry-field">
                    <label htmlFor="form-pax" className="journey-enquiry-label">NUMBER OF TRAVELLERS</label>
                    <select
                      id="form-pax"
                      value={form.pax}
                      onChange={(e) => setForm({ ...form, pax: e.target.value })}
                      className="journey-enquiry-select"
                    >
                      <option value="2 Guests">2 Guests (Couple)</option>
                      <option value="1 Guest">1 Guest (Solo)</option>
                      <option value="3-4 Guests">3–4 Guests (Family)</option>
                      <option value="5+ Guests">5+ Guests (Private Group)</option>
                    </select>
                  </div>
                  <div className="journey-enquiry-field">
                    <label htmlFor="form-type" className="journey-enquiry-label">PRIMARY CADENCE</label>
                    <select
                      id="form-type"
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="journey-enquiry-select"
                    >
                      <option value="Honeymoon & Romance">Honeymoon &amp; Romance</option>
                      <option value="Ayurveda & Wellness">Ayurveda &amp; Wellness</option>
                      <option value="Highlands & Wildlife">Highlands &amp; Wildlife</option>
                      <option value="Heritage & Architecture">Heritage &amp; Architecture</option>
                      <option value="Coastal & Backwaters">Coastal &amp; Backwaters</option>
                    </select>
                  </div>
                </div>

                <div className="journey-enquiry-row">
                  <div className="journey-enquiry-field full-width">
                    <label htmlFor="form-budget" className="journey-enquiry-label">APPROXIMATE BUDGET (PER PERSON)</label>
                    <select
                      id="form-budget"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      className="journey-enquiry-select"
                    >
                      <option value="USD 3,000 - 5,000">USD 3,000 – 5,000 / person</option>
                      <option value="USD 5,000 - 8,000">USD 5,000 – 8,000 / person</option>
                      <option value="USD 8,000+ (Ultra-luxury)">USD 8,000+ / person (Ultra-luxury)</option>
                      <option value="Custom / Undecided">Custom / Open to recommendation</option>
                    </select>
                  </div>
                </div>

                {enquiryError && (
                  <div className="journey-enquiry-error" role="alert">
                    {enquiryError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="journey-enquiry-submit-btn"
                >
                  {isPending ? "Composing Request…" : "Submit Private Enquiry →"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
