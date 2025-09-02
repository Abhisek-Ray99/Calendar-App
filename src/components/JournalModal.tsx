
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JournalEntry } from '../types';

interface JournalModalProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onSwipe: (direction: 'next' | 'prev') => void;
}

const JournalModal: React.FC<JournalModalProps> = ({ entry, onClose, onSwipe }) => {
  if (!entry) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  const getCategoryInitials = (categories: string[]) => {
    return categories.slice(0, 2).map(cat => ({
      initial: cat.charAt(0).toUpperCase(),
      name: cat,
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key={entry.date}
          className="relative max-w-sm w-full bg-white rounded-xl overflow-hidden shadow-2xl"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = Math.abs(offset.x) * velocity.x;
            if (swipe < -10000) onSwipe('next');
            else if (swipe > 10000) onSwipe('prev');
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-2 right-2 bg-white/50 rounded-full p-1 z-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img src={entry.imgUrl} alt="Journal entry" className="w-full h-64 object-cover" />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex space-x-2">
                {getCategoryInitials(entry.categories).map(({ initial, name }) => (
                  <div key={name} className="text-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 font-bold rounded-full">{initial}</span>
                    <span className="text-xs text-gray-500 mt-1 block">{name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
              <div className="text-xl flex">{renderStars(entry.rating)}</div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {new Date(entry.date.split('/').reverse().join('-')).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">{entry.description}</p>
            <button className="w-full mt-6 py-3 text-center bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              View full Post
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JournalModal;