import React, { useEffect } from 'react';
import { X, Calendar, MapPin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TravelCategory } from './types';

interface JourneyCardModalProps {
  category: TravelCategory | null;
  onClose: () => void;
}

export const JourneyCardModal: React.FC<JourneyCardModalProps> = ({ category, onClose }) => {
  // Lock body scroll and prevent unwanted wheel propagation while modal is open
  useEffect(() => {
    if (!category) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [category, onClose]);

  return (
    <AnimatePresence>
      {category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B1511]/80 backdrop-blur-md"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-[32px] overflow-hidden shadow-2xl z-10 border border-[#C9A26D]/30 grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto no-scrollbar"
            data-lenis-prevent
          >
            {/* Left: Image Banner */}
            <div className="relative h-64 md:h-full min-h-[320px] bg-[#0F231C] overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1511]/80 via-transparent to-black/20" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-mono tracking-widest text-[#C9A26D] uppercase">
                  Category {category.number}
                </span>
                <h2 className="text-3xl font-heading-luxury font-normal text-white mt-1">
                  {category.title}
                </h2>
              </div>
            </div>

            {/* Right: Content Details */}
            <div className="p-8 md:p-10 flex flex-col justify-between gap-6 bg-[#FAF8F5]">
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close detail modal"
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/80 border border-[#0F231C]/10 text-[#0F231C] flex items-center justify-center hover:bg-[#0F231C] hover:text-white transition-colors duration-300 shadow-sm cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              <div className="space-y-6 pt-2">
                <div>
                  <span className="text-xs tracking-[0.25em] text-[#C9A26D] uppercase font-bold font-sans-luxury">
                    {category.categoryLabel}
                  </span>
                  <p className="text-[#0F231C] text-sm font-sans-luxury font-medium mt-1 leading-relaxed">
                    "{category.tagline}"
                  </p>
                </div>

                <div className="h-px bg-[#0F231C]/10" />

                <p className="text-sm text-[#0F231C]/80 font-sans-luxury font-light leading-relaxed">
                  {category.description}
                </p>

                {/* Highlights List */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#0F231C]/50 font-bold mb-3 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A26D]" />
                    Curated Highlights
                  </h4>
                  <div className="space-y-2">
                    {category.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-[#0F231C]/90 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#C9A26D] flex-shrink-0" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location & Duration Badges */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-white border border-[#0F231C]/08 flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-[#C9A26D]" />
                    <div>
                      <span className="block text-[10px] text-[#0F231C]/50 uppercase font-semibold">Destinations</span>
                      <span className="text-xs font-semibold text-[#0F231C]">{category.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-[#0F231C]/08 flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-[#C9A26D]" />
                    <div>
                      <span className="block text-[10px] text-[#0F231C]/50 uppercase font-semibold">Recommended</span>
                      <span className="text-xs font-semibold text-[#0F231C]">{category.idealDuration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4 border-t border-[#0F231C]/10 flex items-center justify-between gap-4">
                <span className="text-xs text-[#0F231C]/60 italic font-serif-luxury">
                  Bespoke Kerala Journey
                </span>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full bg-[#0F231C] text-[#FAF8F5] text-xs font-semibold tracking-wider uppercase font-sans-luxury flex items-center gap-2 hover:bg-[#C9A26D] hover:text-[#0F231C] transition-all duration-300 shadow-md cursor-pointer"
                >
                  <span>Explore Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JourneyCardModal;
