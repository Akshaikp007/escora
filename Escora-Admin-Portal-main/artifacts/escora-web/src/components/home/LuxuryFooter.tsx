import React from "react";
import { Link } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import "./LuxuryFooter.css";

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export default function LuxuryFooter() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="luxury-footer" aria-label="Footer">
      <motion.div
        className="luxury-footer-container"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.85, ease: EASE_LUXURY }}
      >
        {/* Main 4-column Grid */}
        <div className="luxury-footer-grid">
          {/* Brand Column */}
          <div className="luxury-footer-brand-col">
            <h3 className="luxury-footer-brand-title">ESCORA</h3>
            <span className="luxury-footer-brand-sub">HOLIDAYS · KERALA</span>
            <p className="luxury-footer-brand-desc">
              A private destination studio composing bespoke journeys across Kerala for the world's most discerning travellers.
            </p>
          </div>

          {/* Column 01: EXPLORE */}
          <div className="luxury-footer-nav-col">
            <h4 className="luxury-footer-col-title">EXPLORE</h4>
            <ul className="luxury-footer-links">
              <li>
                <Link href="/destinations" className="luxury-footer-link">Destinations</Link>
              </li>
              <li>
                <Link href="/journeys" className="luxury-footer-link">Bespoke Journeys</Link>
              </li>
              <li>
                <a href="#healing" className="luxury-footer-link">Sanctuaries</a>
              </li>
              <li>
                <Link href="/journal" className="luxury-footer-link">Editorial Journal</Link>
              </li>
            </ul>
          </div>

          {/* Column 02: JOURNEY */}
          <div className="luxury-footer-nav-col">
            <h4 className="luxury-footer-col-title">JOURNEY</h4>
            <ul className="luxury-footer-links">
              <li>
                <Link href="/about" className="luxury-footer-link">About Escora</Link>
              </li>
              <li>
                <a href="#contact" className="luxury-footer-link">Contact</a>
              </li>
              <li>
                <Link href="/plan" className="luxury-footer-link">Private Departures</Link>
              </li>
              <li>
                <Link href="/about" className="luxury-footer-link">Travel Information</Link>
              </li>
            </ul>
          </div>

          {/* Column 03: CONNECT */}
          <div className="luxury-footer-nav-col">
            <h4 className="luxury-footer-col-title">CONNECT</h4>
            <ul className="luxury-footer-links">
              <li>
                <a href="https://www.instagram.com/escora_holidays" target="_blank" rel="noopener noreferrer" className="luxury-footer-link">
                  Instagram ↗
                </a>
              </li>
              <li>
                <a href="https://wa.me/918157003344" target="_blank" rel="noopener noreferrer" className="luxury-footer-link">
                  WhatsApp ↗
                </a>
              </li>
              <li>
                <a href="mailto:hello@escoraholidays.com" className="luxury-footer-link">
                  Email
                </a>
              </li>
              <li>
                <a href="tel:+918157003344" className="luxury-footer-link">
                  +91 8157 003 344
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Thin Divider */}
        <div className="luxury-footer-divider" />

        {/* Bottom Bar */}
        <div className="luxury-footer-bottom">
          <p className="luxury-footer-copy">
            © ESCORA HOLIDAYS · PRIVATE JOURNEYS · KERALA
          </p>
          <div className="luxury-footer-legal-links">
            <Link href="/privacy-policy" className="luxury-footer-legal-link">PRIVACY</Link>
            <Link href="/terms" className="luxury-footer-legal-link">TERMS</Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
