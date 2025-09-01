// src/components/JournalCarousel.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import type { JournalEntry } from '../types';

// --- Component Props ---
interface JournalCarouselProps {
  entries: JournalEntry[];
  selectedIndex: number;
  onClose: () => void;
  onSelectedIndexChange: (newIndex: number) => void;
}

// --- Animation & Layout Constants ---
const DRAG_CONFIDENCE_THRESHOLD = 10000;
const PEEK_X_PERCENTAGE = '65%'; // How far to push the side cards (percentage of their own width)
const CARD_SCALE = 0.85;
const CARD_OPACITY = 0.5;

const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

// --- Sub-component for a single card's UI (No changes from before) ---
const CarouselCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={`align-middle ${i < Math.round(rating) ? 'text-blue-500' : 'text-gray-300'}`}>★</span>
  ));

  const getCategoryInitials = (categories: string[]) => {
    const colors = ['bg-purple-100 text-purple-700', 'bg-yellow-100 text-yellow-700'];
    return categories.slice(0, 2).map((cat, i) => (
      <div key={cat} className={`w-9 h-9 flex items-center justify-center font-bold rounded-full text-sm ${colors[i % colors.length]}`}>
        {cat.charAt(0).toUpperCase()}
      </div>
    ));
  };

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden pointer-events-none select-none">
      <img src={entry.imgUrl} alt="Journal entry" className="w-full h-64 object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">{getCategoryInitials(entry.categories)}</div>
          <div className="text-xl flex space-x-0.5">{renderStars(entry.rating)}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          {new Date(entry.date.split('/').reverse().join('-')).toLocaleDateString('en-US', { day: '2-digit', month: 'long' })}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mt-2 h-14 overflow-hidden text-ellipsis">
          {entry.description}
        </p>
        <button className="w-full mt-4 py-3 text-center bg-gray-900 text-white font-semibold rounded-lg">
          View full Post
        </button>
      </div>
    </div>
  );
};

// --- Main Carousel Component (Updated Logic) ---
export const JournalCarousel: React.FC<JournalCarouselProps> = ({ entries, selectedIndex, onClose, onSelectedIndexChange }) => {
  
  // New animation logic using percentage-based translation for perfect peeking
  const getCardAnimation = (index: number, selectedIndex: number) => {
    const offset = index - selectedIndex;
    if (offset === 0) {
      return { x: '0%', scale: 1, opacity: 1, zIndex: 3 };
    } else if (offset === -1) {
      return { x: `-${PEEK_X_PERCENTAGE}`, scale: CARD_SCALE, opacity: CARD_OPACITY, zIndex: 2 };
    } else if (offset === 1) {
      return { x: PEEK_X_PERCENTAGE, scale: CARD_SCALE, opacity: CARD_OPACITY, zIndex: 2 };
    } 
    // Fly the cards that are further away completely off-screen
    else if (offset < -1) {
      return { x: '-150%', scale: CARD_SCALE, opacity: 0, zIndex: 1 };
    } else { // (offset > 1)
      return { x: '150%', scale: CARD_SCALE, opacity: 0, zIndex: 1 };
    }
  };

  const handleDragEnd = (_: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -DRAG_CONFIDENCE_THRESHOLD && selectedIndex < entries.length - 1) {
      onSelectedIndexChange(selectedIndex + 1);
    } else if (swipe > DRAG_CONFIDENCE_THRESHOLD && selectedIndex > 0) {
      onSelectedIndexChange(selectedIndex - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50">
          <div className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </div>
        </button>

        {/* --- Desktop Arrows (No changes) --- */}
        <div className="absolute inset-0 z-40 flex justify-between items-center pointer-events-none">
          <button className="hidden md:block w-12 h-12 bg-black/30 rounded-full ml-4 pointer-events-auto disabled:opacity-30" onClick={(e) => { e.stopPropagation(); onSelectedIndexChange(selectedIndex - 1); }} disabled={selectedIndex === 0} >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button className="hidden md:block w-12 h-12 bg-black/30 rounded-full mr-4 pointer-events-auto disabled:opacity-30" onClick={(e) => { e.stopPropagation(); onSelectedIndexChange(selectedIndex + 1); }} disabled={selectedIndex === entries.length - 1} >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* --- Card Stage (Updated Structure) --- */}
        <div 
          className="w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="relative w-[80%] max-w-sm aspect-[3/5]" // Use aspect ratio for consistent card shape
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {entries.map((entry, index) => {
              const animationProps = getCardAnimation(index, selectedIndex);
              return (
                <motion.div
                  key={entry.date}
                  className="absolute w-full h-full"
                  initial={false}
                  animate={animationProps}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <CarouselCard entry={entry} />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};