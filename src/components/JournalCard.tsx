// src/components/JournalCard.tsx
import React from 'react';
import type { JournalEntry } from '../types';

interface JournalCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

const JournalCard: React.FC<JournalCardProps> = React.memo(({ entry, onClick }) => {
  const getCategoryInitials = (categories: string[]) => {
    return categories.slice(0, 2).map(cat => cat.charAt(0).toUpperCase());
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-3 h-3 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ));
  };

  return (
    <div
      className="w-full cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 active:scale-95"
      onClick={onClick}
    >
      <img src={entry.imgUrl} alt="Hair diary entry" className="w-full h-14 object-cover" />
      <div className="p-1.5 bg-white">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {getCategoryInitials(entry.categories).map((initial, index) => (
              <span key={index} className="text-xs font-semibold bg-gray-200 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center">
                {initial}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-0.5">
            {renderStars(entry.rating)}
          </div>
        </div>
      </div>
    </div>
  );
});

export default JournalCard;