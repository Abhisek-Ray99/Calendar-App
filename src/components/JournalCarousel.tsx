// src/components/JournalCarousel.tsx
import { useEffect, useRef, useMemo, useState, memo } from 'react';
import { motion, MotionConfig, useMotionValue, useTransform, animate, type PanInfo, AnimatePresence } from 'framer-motion';
import type { JournalEntry } from '../types';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useEventStore } from '../stores/use-event-store';

// --- Props & Constants ---
interface JournalCarouselProps {
  entries: JournalEntry[];
  selectedIndex: number;
  onClose: () => void;
  onSelectedIndexChange: (newIndex: number) => void;
  onOpenEditForm: (entry: JournalEntry) => void;
}

const DRAG_BUFFER = 50;
const PEEK_X_PERCENTAGE = '65%';
const CARD_SCALE = 0.85;
const CARD_OPACITY = 0.5;

// --- Built-in throttle ---
function throttle<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let lastTime = 0;
  return ((...args: any[]) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func(...args);
    }
  }) as T;
}

// --- CarouselCard Component ---
const CarouselCard: React.FC<{
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}> = memo(({ entry, onEdit, onDelete }) => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // New star style
  const stars = Array.from({ length: 5 }, (_, i) => (
    <svg key={i} className={`w-5 h-5 ${i < Math.round(entry.rating) ? 'text-blue-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
    </svg>
  ));

  // New category initials style
  const initials = entry.categories.slice(0, 2).map((cat, i) => {
    const colors = ['bg-purple-100 text-purple-700', 'bg-pink-100 text-pink-700'];
    return (
      <div key={cat} className={`w-8 h-8 flex items-center justify-center font-bold rounded-full text-sm ${colors[i % colors.length]}`}>
        {cat.charAt(0).toUpperCase()}
      </div>
    );
  });

  const formattedDate = new Date(entry.date.split('/').reverse().join('-')).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
  });

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
    setIsMenuOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col relative">
      {/* Action Menu Button */}
      <button
        onClick={handleMenuClick}
        className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
      >
        <MoreVertical size={20} />
      </button>

      {/* Action Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-3 z-30 bg-white rounded-md shadow-lg border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={handleEditClick} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              <Pencil size={16} className="mr-2" /> Edit
            </button>
            <button onClick={handleDeleteClick} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <img src={entry.imgUrl} alt="Journal entry" className="w-full h-64 object-cover" />
      <div className="flex flex-col flex-1 p-5 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-2">{initials}</div>
          <div className="flex space-x-0.5">{stars}</div>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{formattedDate}</h3>
        <p className="text-gray-600 text-base leading-relaxed mt-2 flex-1 overflow-y-auto pr-1">
          {entry.description}
        </p>
      </div>
      <div className="border-t-2 -mx-5 px-5 sticky bottom-0 bg-white">
        <button className="py-3 w-full text-center bg-transparent text-gray-800 font-bold rounded-lg hover:bg-gray-100 transition-colors text-lg">
          View full Post
        </button>
      </div>
    </div>
  );
});

// --- Animated Card using MotionValues ---
const AnimatedCarouselCard = ({
  entry,
  index,
  motionIndex,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  index: number;
  motionIndex: any;
  onEdit: () => void;
  onDelete: () => void;
}) => {

  const scale = useTransform(motionIndex, [index - 1, index, index + 1], [CARD_SCALE, 1, CARD_SCALE], { clamp: false });
  const x = useTransform(motionIndex, [index - 1, index, index + 1], [PEEK_X_PERCENTAGE, '0%', `-${PEEK_X_PERCENTAGE}`], { clamp: false });
  const opacity = useTransform(motionIndex, [index - 1, index, index + 1], [CARD_OPACITY, 1, CARD_OPACITY], { clamp: false });
  const zIndex = useTransform(motionIndex, (latest: number) => (Math.round(latest) === index ? 3 : 1));

  return (
    <motion.div
      key={entry.date}
      className="absolute w-full h-full"
      style={{ x, scale, opacity, zIndex, willChange: 'transform, opacity' }}
    >
      <CarouselCard entry={entry} onEdit={onEdit} onDelete={onDelete} />
    </motion.div>
  );
};

// --- Main Carousel Component ---
export const JournalCarousel: React.FC<JournalCarouselProps> = ({
  entries,
  selectedIndex,
  onClose,
  onSelectedIndexChange,
  onOpenEditForm,
}) => {

  const { deleteEntry } = useEventStore();
  const index = useMotionValue(selectedIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleEdit = (entry: JournalEntry) => {
    // 1. Close the carousel immediately
    onClose();
    // 2. A small delay for the exit animation to start
    setTimeout(() => {
      // 3. Tell the App component to open the form with this entry's data
      onOpenEditForm(entry);
    }, 300); // Should match the exit animation duration
  };

  const handleDelete = (entry: JournalEntry) => {
    if (entry.id && window.confirm('Are you sure you want to delete this journal entry?')) {
      onClose();
      setTimeout(() => {
        // Inside this block, TypeScript knows entry.id is a string
        deleteEntry(entry.id as string);
      }, 300);
    }
  };

  // Animate when index changes
  useEffect(() => {
    animate(index, selectedIndex, { type: 'spring', stiffness: 400, damping: 40 });
  }, [selectedIndex, index]);

  // Prefetch images (with caching) before showing carousel
  useEffect(() => {
    let isMounted = true;
    const preload = async () => {
      await Promise.all(
        entries.map(e =>
          new Promise<void>(resolve => {
            // If there's no image URL, just resolve and do nothing.
            if (!e.imgUrl) {
              resolve();
              return;
            }

            // If there is a URL, proceed with loading.
            const img = new Image();
            img.src = e.imgUrl; // Now TypeScript knows e.imgUrl is a string here.
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Always resolve, even on error.
          })
        )
      );
      if (isMounted) setIsLoaded(true);
    };
    preload();
    return () => {
      isMounted = false;
    };
  }, [entries]);

  const handleDrag = throttle((_: any, info: PanInfo) => {
    const width = containerRef.current?.offsetWidth || 0;
    if (width) index.set(selectedIndex - info.offset.x / width);
  }, 16);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const width = containerRef.current?.offsetWidth || 0;
    if (!width) return;
    const { offset, velocity } = info;
    if (Math.abs(offset.x) > DRAG_BUFFER || Math.abs(velocity.x) > 300) {
      const dir = offset.x < 0 ? 1 : -1;
      const newIdx = Math.max(0, Math.min(entries.length - 1, selectedIndex + dir));
      onSelectedIndexChange(newIdx);
    } else {
      animate(index, selectedIndex, { type: 'spring', stiffness: 400, damping: 40 });
    }
  };

  const visibleCards = useMemo(() => {
    const start = Math.max(0, selectedIndex - 2);
    const end = Math.min(entries.length, selectedIndex + 3);
    return entries.slice(start, end).map((entry, i) => ({ entry, originalIndex: start + i }));
  }, [entries, selectedIndex]);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center">
        <div className="text-white text-lg">Loading images...</div>
      </div>
    );
  }

  return (
    <MotionConfig transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}>
      <motion.div
        className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50">
          <div className="w-9 h-9 bg-black/50 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </button>

        <div className="absolute inset-0 z-40 flex justify-between items-center pointer-events-none">
          <button onClick={e => { e.stopPropagation(); onSelectedIndexChange(selectedIndex - 1); }} disabled={selectedIndex === 0}
            className="hidden md:block w-12 h-12 bg-black/30 rounded-full ml-4 pointer-events-auto disabled:opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={e => { e.stopPropagation(); onSelectedIndexChange(selectedIndex + 1); }} disabled={selectedIndex === entries.length - 1}
            className="hidden md:block w-12 h-12 bg-black/30 rounded-full mr-4 pointer-events-auto disabled:opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
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
          onClick={e => e.stopPropagation()}
          whileTap={{ cursor: 'grabbing' }}
          style={{ cursor: 'grab' }}
        >
          {visibleCards.map(({ entry, originalIndex }) => (
            <AnimatedCarouselCard
              key={entry.id}
              entry={entry}
              index={originalIndex}
              motionIndex={index}
              // Pass the locally defined handlers
              onEdit={() => handleEdit(entry)}
              onDelete={() => handleDelete(entry)}
            />
          ))}
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
};
