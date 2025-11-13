import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string; // The currently active category
  multiCategory: {
    banking: string; // Universe A: Strict Banking View
    behavioral: string; // Universe B: Behavioral View
    personalized: string; // Universe C: Personalized View
    minimalist: string; // Universe D: Minimal Categories View
  };
  status: 'pending' | 'reviewed' | 'flagged';
  dayOfWeek?: string;
  timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  embedding?: Embedding;
  health?: {
    riskTags?: ('pharmacy_frequent' | 'telemedicine_increase' | 'lab_tests_spike')[];
  };
  receipt?: {
    status: 'matched' | 'refund_detected';
    receipt_id: string;
  };
  tripId?: string;
};

export type Category = {
  value: string;
  label:string;
  icon: keyof typeof import('@/components/icons').categoryIcons;
  // Optional: specify which universes this category belongs to
  universes?: string[]; 
  moodColor?: string;
};

export type Embedding = {
  baseSequence: string;
  interpretationVector: string;
};

export type Universe = {
  id: 'banking' | 'behavioral' | 'personalized' | 'minimalist';
  label: string;
  description: string;
};

export type Trip = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    estimatedCost: number;
    status: 'Draft' | 'Confirmed';
    intent: 'Business' | 'Leisure' | 'Family' | 'Relocation';
    intentConfidence: number;
    savings: {
        goal: number;
        achieved: number;
    };
    transactions: Transaction[];
}
