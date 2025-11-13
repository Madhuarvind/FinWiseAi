import type { Transaction, Category, Universe } from '@/lib/types';

export const universes: Universe[] = [
  { id: 'banking', label: 'Strict Banking View', description: 'Standard categories like Dining, Shopping, etc.' },
  { id: 'behavioral', label: 'Behavioral View', description: 'Categories based on why people spend.' },
  { id: 'personalized', label: 'Personalized View', description: 'Categories learned from user behavior.' },
  { id: 'minimalist', label: 'Minimalist View', description: 'A simple view of needs vs. wants.' },
];

export const initialCategories: Category[] = [
  // Universe A: Banking
  { value: 'food-drink', label: 'Food & Drink', icon: 'Utensils', universes: ['banking'], moodColor: 'bg-blue-500' },
  { value: 'shopping', label: 'Shopping', icon: 'ShoppingCart', universes: ['banking'], moodColor: 'bg-red-500' },
  { value: 'transport', label: 'Transport', icon: 'Car', universes: ['banking'], moodColor: 'bg-green-500' },
  { value: 'groceries', label: 'Groceries', icon: 'ShoppingBasket', universes: ['banking'], moodColor: 'bg-green-500' },
  { value: 'home', label: 'Home', icon: 'Home', universes: ['banking'], moodColor: 'bg-green-500' },
  { value: 'entertainment', label: 'Entertainment', icon: 'Ticket', universes: ['banking'], moodColor: 'bg-purple-500' },
  { value: 'health', label: 'Health', icon: 'HeartPulse', universes: ['banking'], moodColor: 'bg-green-500' },
  { value: 'utilities', label: 'Utilities', icon: 'Lightbulb', universes: ['banking'], moodColor: 'bg-green-500' },
  { value: 'travel', label: 'Travel', icon: 'Plane', universes: ['banking'], moodColor: 'bg-purple-500' },
  { value: 'personal-care', label: 'Personal Care', icon: 'Smile', universes: ['banking'], moodColor: 'bg-blue-500' },
  
  // Universe B: Behavioral
  { value: 'routine', label: 'Routine', icon: 'Car', universes: ['behavioral'], moodColor: 'bg-blue-500' },
  { value: 'impulse', label: 'Impulse', icon: 'Wand2', universes: ['behavioral'], moodColor: 'bg-red-500' },
  { value: 'necessity', label: 'Necessity', icon: 'Home', universes: ['behavioral', 'minimalist'], moodColor: 'bg-green-500' },
  { value: 'luxury', label: 'Luxury', icon: 'Sparkles', universes: ['behavioral'], moodColor: 'bg-purple-500' },

  // Universe C: Personalized
  { value: 'tech-gadgets', label: 'Tech Gadgets', icon: 'Cpu', universes: ['personalized'], moodColor: 'bg-red-500' },
  { value: 'coffee-runs', label: 'Coffee Runs', icon: 'Utensils', universes: ['personalized'], moodColor: 'bg-blue-500' },
  { value: 'weekend-dining', label: 'Weekend Dining', icon: 'Utensils', universes: ['personalized'], moodColor: 'bg-purple-500' },

  // Universe D: Minimalist
  { value: 'wants', label: 'Wants', icon: 'ShoppingCart', universes: ['minimalist'], moodColor: 'bg-red-500' },
  { value: 'other', label: 'Other', icon: 'CircleDashed', universes: ['minimalist'], moodColor: 'bg-gray-500' },
];
