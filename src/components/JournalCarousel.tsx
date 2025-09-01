// src/components/JournalCarousel.tsx
import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import type { JournalEntry } from '../types';

// --- Component Props ---
interface JournalCarouselProps {
  entries: JournalEntry[];
  selectedIndex: number;
  onClose: () => void;
  onSelectedIndexChange: (newIndex: number) => void;
}

// --- Animation & Layout Constants ---
const DRAG_BUFFER = 50;
const PEEK_X_PERCENTAGE = '65%';
const CARD_SCALE = 0.85;
const CARD_OPACITY = 0.5;

// --- Sub-component for a single card's UI (Memoized for performance) ---
const CarouselCard: React.FC<{ entry: JournalEntry }> = React.memo(({ entry }) => {
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
    <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Image */}
      <img
        src={entry.imgUrl}
        alt="Journal entry"
        className="w-full h-64 object-cover"
      />

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        {/* Header (categories + rating) */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">{getCategoryInitials(entry.categories)}</div>
          <div className="text-xl flex space-x-0.5">{renderStars(entry.rating)}</div>
        </div>

        {/* Date */}
        <h3 className="text-xl font-bold text-gray-900">
          {new Date(entry.date.split('/').reverse().join('-')).toLocaleDateString(
            'en-US',
            { day: '2-digit', month: 'long' }
          )}
        </h3>

        {/* Description */}
        <p className="h-24 text-gray-600 text-sm leading-relaxed mt-2 flex-1 overflow-y-auto pr-1 ">
          {entry.description}
        </p>

        {/* Button pinned at bottom */}
        <button className="mt-4 py-3 w-full text-center bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300">
          View Full Post
        </button>
      </div>
    </div>
  );
});

// --- New Card Component with Hooks ---
const AnimatedCarouselCard = ({ entry, index, motionIndex }: { entry: JournalEntry, index: number, motionIndex: any }) => {
  const scale = useTransform(motionIndex, [index - 1, index, index + 1], [CARD_SCALE, 1, CARD_SCALE], { clamp: false });
  const x = useTransform(motionIndex, [index - 1, index, index + 1], [PEEK_X_PERCENTAGE, '0%', `-${PEEK_X_PERCENTAGE}`], { clamp: false });
  const opacity = useTransform(motionIndex, [index - 1, index, index + 1], [CARD_OPACITY, 1, CARD_OPACITY], { clamp: false });
  const zIndex = useTransform(motionIndex, (latest: number) => (Math.round(latest) === index ? 3 : 1));

  // The display transform can cause performance issues and is not needed if the component is already being unmounted
  // const display = useTransform(motionIndex, (latest) => Math.abs(index - latest) >= 2 ? 'none' : 'block');

  return (
    <motion.div
      key={entry.date}
      className="absolute w-full h-full"
      style={{ x, scale, opacity, zIndex }}
    >
      <CarouselCard entry={entry} />
    </motion.div>
  );
};

// --- Main Carousel Component ---
export const JournalCarousel: React.FC<JournalCarouselProps> = ({ entries, selectedIndex, onClose, onSelectedIndexChange }) => {
  const index = useMotionValue(selectedIndex);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    animate(index, selectedIndex, { type: 'spring', stiffness: 400, damping: 40 });
  }, [selectedIndex, index]);

  const handleDrag = (_: any, info: PanInfo) => {
    const cardWidth = containerRef.current?.offsetWidth || 0;
    if (cardWidth === 0) return;
    index.set(selectedIndex - info.offset.x / cardWidth);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const cardWidth = containerRef.current?.offsetWidth || 0;
    if (cardWidth === 0) return;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (Math.abs(offset) > DRAG_BUFFER || Math.abs(velocity) > 300) {
      const direction = offset < 0 ? 1 : -1;
      let newIndex = selectedIndex + direction;
      newIndex = Math.max(0, Math.min(newIndex, entries.length - 1));
      onSelectedIndexChange(newIndex);
    } else {
      animate(index, selectedIndex, { type: 'spring', stiffness: 400, damping: 40 });
    }
  };

  const getVisibleCards = () => {
    const start = Math.max(0, selectedIndex - 2);
    const end = Math.min(entries.length, selectedIndex + 3);
    return entries.slice(start, end).map((entry, i) => ({
      entry,
      originalIndex: start + i
    }));
  };

  return (
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
      <div className="absolute inset-0 z-40 flex justify-between items-center pointer-events-none">
        <button className="hidden md:block w-12 h-12 bg-black/30 rounded-full ml-4 pointer-events-auto disabled:opacity-30" onClick={(e) => { e.stopPropagation(); onSelectedIndexChange(selectedIndex - 1); }} disabled={selectedIndex === 0}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className="hidden md:block w-12 h-12 bg-black/30 rounded-full mr-4 pointer-events-auto disabled:opacity-30" onClick={(e) => { e.stopPropagation(); onSelectedIndexChange(selectedIndex + 1); }} disabled={selectedIndex === entries.length - 1}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <motion.div
        ref={containerRef}
        className="relative w-[80%] max-w-sm aspect-[3/5]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={(e) => e.stopPropagation()}
        whileTap={{ cursor: 'grabbing' }}
        style={{ cursor: 'grab' }}
      >
        {getVisibleCards().map(({ entry, originalIndex }) => (
          <AnimatedCarouselCard
            key={entry.date}
            entry={entry}
            index={originalIndex}
            motionIndex={index}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};