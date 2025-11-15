import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string; // The currently active category
  multiCategory?: {
    banking: string;
    behavioral: string;
    personalized: string;
    minimalist: string;
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
  userProfileId?: string; // Add userProfileId
  createdAt?: any; // For server timestamp
};

export type Category = {
  id: string;
  label:string;
  icon: keyof typeof import('@/components/icons').categoryIcons;
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

export type Policy = {
    id: string;
    name: string;
    naturalLanguage: string;
    conditions: {
        merchant: string[];
        dayOfWeek?: string[];
    };
    action: {
        type: 'CLASSIFY';
        category: string;
    };
    createdAt: any; // Firestore Timestamp
};