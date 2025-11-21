
import type { Universe } from '@/lib/types';
import initialCategoriesForSeed from '../../config/taxonomy.json';

export const universes: Universe[] = [
  { id: 'banking', label: 'Strict Banking View', description: 'Standard categories like Dining, Shopping, etc.' },
  { id: 'behavioral', label: 'Comfort Brain View', description: 'Categorizes spending by its psychological driver and lifestyle fit.' },
  { id: 'personalized', label: 'Personalized Brain View', description: 'Categories are learned and adapted based on your direct feedback and habits.' },
  { id: 'minimalist', label: 'Risk Brain View', description: 'A disciplined view of your spending, focusing on needs vs. wants.' },
];

export { initialCategoriesForSeed };
