
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JournalEntry } from '../types';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<JournalEntry, 'id'>, id?: string) => void;
  initialData?: JournalEntry | null;
}

const StarRating: React.FC<{ rating: number; setRating: (rating: number) => void }> = ({ rating, setRating }) => (
  <div className="flex space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
        <svg className={`w-8 h-8 ${star <= rating ? 'text-[#5bb9e5]' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      </button>
    ))}
  </div>
);

export const EventFormModal: React.FC<EventFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (initialData) {
      // We need to convert dd/MM/yyyy to yyyy-MM-dd for the input
      const [day, month, year] = initialData.date.split('/');
      setDate(`${year}-${month}-${day}`);
      setDescription(initialData.description);
      setRating(initialData.rating);
      setImgUrl(initialData.imgUrl);
    } else {
      // Reset form for new entry
      setDate(new Date().toISOString().split('T')[0]); // Default to today
      setDescription('');
      setRating(0);
      setImgUrl(undefined);
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgUrl(reader.result as string); // Store image as base64
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!description || !date) {
        alert("Please fill in at least the date and description.");
        return;
    }
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    onSubmit({
      date: formattedDate,
      description,
      rating,
      imgUrl,
      // Mock categories, you could add an input for this
      categories: ['Wash Day', 'Deep Clean'],
    }, initialData?.id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-4">{initialData ? 'Edit Entry' : 'Add New Entry'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <StarRating rating={rating} setRating={setRating} />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image (Optional)</label>
              <input type="file" id="image" onChange={handleImageChange} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {imgUrl && <img src={imgUrl} alt="Preview" className="mt-4 rounded-md h-32 w-auto object-cover" />}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
              <button type="submit" className="bg-[#5bb9e5] text-white px-4 py-2 rounded-md hover:bg-blue-700">{initialData ? 'Save Changes' : 'Add Entry'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};