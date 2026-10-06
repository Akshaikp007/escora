import React from 'react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import type { TravelCategory } from './types';

interface ExploreSectionHeaderProps {
  categories: TravelCategory[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectIndex: (index: number) => void;
}

export const ExploreSectionHeader: React.FC<ExploreSectionHeaderProps> = ({
  categories,
  activeIndex,
  onPrev,
  onNext,
  onSelectIndex,
}) => {
  const currentCategory = categories[activeIndex] || categories[0];
  const totalCount = categories.length;

  return (
    <div className="w-full space-y-2 sm:space-y-2.5 select-none">
      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#0F231C]/10">
        
        {/* Title Block */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-5 h-px bg-[#C9A26D]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A26D] font-sans-luxury flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C9A26D]" />
              EXPLORE KERALA
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading-luxury font-normal text-[#0F231C] tracking-tight leading-tight">
            Kerala,{' '}
            <span className="italic font-serif-luxury font-normal text-[#B88E56] underline decoration-[#C9A26D]/30 underline-offset-4">
              one journey at a time.
            </span>
          </h2>
        </div>

        {/* Counter & Arrow Navigation Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          
          {/* Editorial Counter & Location Pill */}
          <div className="flex items-center gap-3 bg-[#FAF7F2]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#C9A26D]/40 shadow-sm">
            <div className="flex items-center gap-1 font-mono text-xs font-semibold">
              <span className="text-[#0F231C]">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[#C9A26D]">/</span>
              <span className="text-[#0F231C]/40">
                {String(totalCount).padStart(2, '0')}
              </span>
            </div>
            
            <div className="w-px h-3.5 bg-[#C9A26D]/40" />

            <span className="text-xs font-sans-luxury font-semibold text-[#0F231C] tracking-wide truncate max-w-[130px]">
              {currentCategory.location.split('&')[0].trim()}
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrev}
              disabled={activeIndex === 0}
              aria-label="Previous destination"
              className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#0F231C]/15 flex items-center justify-center text-[#0F231C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0F231C] hover:text-[#FAF8F5] hover:border-[#0F231C] transition-all duration-300 shadow-xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <button
              onClick={onNext}
              disabled={activeIndex === totalCount - 1}
              aria-label="Next destination"
              className="w-9 h-9 rounded-full bg-[#FAF7F2] border border-[#0F231C]/15 flex items-center justify-center text-[#0F231C] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#0F231C] hover:text-[#FAF8F5] hover:border-[#0F231C] transition-all duration-300 shadow-xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

        </div>

      </div>

      {/* Destination Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectIndex(idx)}
              className={`px-3 py-1 rounded-full text-[11px] font-sans-luxury transition-all duration-300 flex-shrink-0 border cursor-pointer ${
                isActive
                  ? 'bg-[#0F231C] text-[#FAF8F5] border-[#0F231C] font-semibold shadow-md ring-1 ring-[#C9A26D]/40'
                  : 'bg-[#FAF7F2]/80 text-[#0F231C]/75 border-[#0F231C]/12 hover:bg-[#FAF7F2] hover:text-[#0F231C] hover:border-[#C9A26D]/60 shadow-2xs'
              }`}
            >
              <span className={`font-mono mr-1.5 text-[10px] ${isActive ? 'text-[#C9A26D]' : 'text-[#B88E56]'}`}>
                {cat.number}
              </span>
              <span>{cat.location.split('&')[0].trim()}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ExploreSectionHeader;
