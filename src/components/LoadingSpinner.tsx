// src/components/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);