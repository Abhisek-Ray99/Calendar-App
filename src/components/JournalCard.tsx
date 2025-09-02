
import React from 'react';
import type { JournalEntry } from '../types';

interface JournalCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

const JournalCard: React.FC<JournalCardProps> = React.memo(({ entry, onClick }) => {
  const getCategoryInitials = (categories: string[]) => {
    const colors = ['bg-purple-100 text-purple-700', 'bg-pink-100 text-pink-700', 'bg-green-100 text-green-700'];
    return categories.slice(0, 3).map((cat, i) => (
      <span
        key={cat}
        className={`text-[6px] font-bold rounded-md w-4 h-4 flex items-center justify-center ${colors[i % colors.length]}`}
      >
        {cat.charAt(0).toUpperCase()}
      </span>
    ));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-[#5bb9e5]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ));
  };

  return (
    <div
      className="w-full h-full cursor-pointer flex flex-col space-y-1"
      onClick={onClick}
    >
      {/* Stars above the image */}
      <div className="flex items-center justify-center space-x-0.5">
        {renderStars(entry.rating)}
      </div>

      {/* Image */}
      <img
        src={entry.imgUrl}
        alt="Hair diary entry"
        className="w-full h-20 object-cover rounded-lg"
        loading="lazy"
      />

      {/* Initials below the image */}
      <div className="flex items-center justify-center space-x-1">
        {getCategoryInitials(entry.categories)}
      </div>
    </div>
  );
});

export default JournalCard;