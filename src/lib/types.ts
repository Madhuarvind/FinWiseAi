import type { LucideIcon } from 'lucide-react';

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  status: 'pending' | 'reviewed' | 'flagged';
};

export type Category = {
  value: string;
  label: string;
  icon: keyof typeof import('@/components/icons').categoryIcons;
};
