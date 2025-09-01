// src/types/index.ts

export type JournalCategory = 
  | "Deep Conditioning"
  | "Moisture"
  | "Hair Growth"
  | "Natural Products"
  | "Protein Treatment"
  | "Hair Repair"
  | "Salon Visit"
  | "Protective Style"
  | "Braids"
  | "Scalp Care"
  | "Hair Mask"
  | "DIY Treatment"
  | "Hydration"
  | "New Product"
  | "Leave-in Conditioner"
  | "Curl Definition"
  | "Trim"
  | "Hair Health"
  | "Split Ends"
  | "Oil Treatment"
  | "Scalp Massage"
  | "Growth"
  | "Wash Day"
  | "Detangling"
  | "Deep Clean"
  | "Heatless Styling"
  | "Overnight Routine"
  | "Waves"
  | "Color Care"
  | "Purple Shampoo"
  | "Toning";

export interface JournalEntry {
  imgUrl: string;
  rating: number;
  categories: JournalCategory[];
  date: string; // Format: "dd/MM/yyyy"
  description: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  key: string;
}