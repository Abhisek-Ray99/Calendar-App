
import React from 'react';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
       <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
       <p className="mt-2 text-gray-500">This page is under construction.</p>
    </div>
  );
};