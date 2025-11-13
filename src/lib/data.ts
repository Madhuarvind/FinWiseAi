import type { Category, Universe } from '@/lib/types';

export const universes: Universe[] = [
  { id: 'banking', label: 'Strict Banking View', description: 'Standard categories like Dining, Shopping, etc.' },
  { id: 'behavioral', label: 'Behavioral View', description: 'Categories based on why people spend.' },
  { id: 'personalized', label: 'Personalized View', description: 'Categories learned from user behavior.' },
  { id: 'minimalist', label: 'Minimalist View', description: 'A simple view of needs vs. wants.' },
];

export const initialCategoriesForSeed: Omit<Category, 'id'>[] = [
  { label: 'Food & Drink', icon: 'Utensils', universes: ['banking'], moodColor: 'bg-blue-500' },
  { label: 'Shopping', icon: 'ShoppingCart', universes: ['banking'], moodColor: 'bg-red-500' },
  { label: 'Transport', icon: 'Car', universes: ['banking'], moodColor: 'bg-green-500' },
  { label: 'Groceries', icon: 'ShoppingBasket', universes: ['banking'], moodColor: 'bg-green-500' },
  { label: 'Home', icon: 'Home', universes: ['banking'], moodColor: 'bg-green-500' },
  { label: 'Entertainment', icon: 'Ticket', universes: ['banking'], moodColor: 'bg-purple-500' },
  { label: 'Health', icon: 'HeartPulse', universes: ['banking'], moodColor: 'bg-green-500' },
  { label: 'Utilities', icon: 'Lightbulb', universes: ['banking'], moodColor: 'bg-green-500' },
  { label: 'Travel', icon: 'Plane', universes: ['banking'], moodColor: 'bg-purple-500' },
  { label: 'Personal Care', icon: 'Smile', universes: ['banking'], moodColor: 'bg-blue-500' },
  { label: 'Routine', icon: 'Car', universes: ['behavioral'], moodColor: 'bg-blue-500' },
  { label: 'Impulse', icon: 'Wand2', universes: ['behavioral'], moodColor: 'bg-red-500' },
  { label: 'Necessity', icon: 'Home', universes: ['behavioral', 'minimalist'], moodColor: 'bg-green-500' },
  { label: 'Luxury', icon: 'Sparkles', universes: ['behavioral'], moodColor: 'bg-purple-500' },
  { label: 'Tech Gadgets', icon: 'Cpu', universes: ['personalized'], moodColor: 'bg-red-500' },
  { label: 'Coffee Runs', icon: 'Utensils', universes: ['personalized'], moodColor: 'bg-blue-500' },
  { label: 'Weekend Dining', icon: 'Utensils', universes: ['personalized'], moodColor: 'bg-purple-500' },
  { label: 'Wants', icon: 'ShoppingCart', universes: ['minimalist'], moodColor: 'bg-red-500' },
  { label: 'Other', icon: 'CircleDashed', universes: ['minimalist'], moodColor: 'bg-gray-500' },
];
