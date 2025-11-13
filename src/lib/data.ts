import type { Transaction, Category, Universe } from '@/lib/types';

export const universes: Universe[] = [
  { id: 'banking', label: 'Strict Banking View', description: 'Standard categories like Dining, Shopping, etc.' },
  { id: 'behavioral', label: 'Behavioral View', description: 'Categories based on why people spend.' },
  { id: 'personalized', label: 'Personalized View', description: 'Categories learned from user behavior.' },
  { id: 'minimalist', label: 'Minimalist View', description: 'A simple view of needs vs. wants.' },
];

export const categories: Category[] = [
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

export const transactions: Transaction[] = [
  {
    id: 'txn_1',
    date: '2024-07-28',
    description: 'AMAZON MKTPLACE PMTS',
    amount: -42.99,
    category: 'shopping',
    multiCategory: {
        banking: 'shopping',
        behavioral: 'impulse',
        personalized: 'tech-gadgets',
        minimalist: 'wants'
    },
    status: 'pending',
  },
  {
    id: 'txn_2',
    date: '2024-07-28',
    description: 'STARBUCKS #12345',
    amount: -5.75,
    category: 'food-drink',
    multiCategory: {
        banking: 'food-drink',
        behavioral: 'routine',
        personalized: 'coffee-runs',
        minimalist: 'wants'
    },
    status: 'pending',
  },
  {
    id: 'txn_3',
    date: '2024-07-27',
    description: 'UBER TRIP',
    amount: -22.5,
    category: 'transport',
     multiCategory: {
        banking: 'transport',
        behavioral: 'necessity',
        personalized: 'weekend-dining',
        minimalist: 'necessity'
    },
    status: 'reviewed',
  },
  {
    id: 'txn_4',
    date: '2024-07-27',
    description: 'WHOLE FOODS MARKET',
    amount: -128.43,
    category: 'groceries',
    multiCategory: {
        banking: 'groceries',
        behavioral: 'necessity',
        personalized: 'groceries',
        minimalist: 'necessity'
    },
    status: 'pending',
  },
    {
    id: 'txn_health_1',
    date: '2024-07-26',
    description: 'CVS PHARMACY #9876',
    amount: -35.50,
    category: 'health',
    multiCategory: { banking: 'health', behavioral: 'necessity', personalized: 'health', minimalist: 'necessity' },
    status: 'reviewed',
    health: { riskTags: ['pharmacy_frequent'] }
  },
  {
    id: 'txn_5',
    date: '2024-07-26',
    description: 'NETFLIX.COM',
    amount: -15.99,
    category: 'entertainment',
    multiCategory: {
        banking: 'entertainment',
        behavioral: 'routine',
        personalized: 'entertainment',
        minimalist: 'wants'
    },
    status: 'reviewed',
  },
    {
    id: 'txn_health_2',
    date: '2024-07-24',
    description: 'TELADOC HEALTH INC',
    amount: -75.00,
    category: 'health',
    multiCategory: { banking: 'health', behavioral: 'necessity', personalized: 'health', minimalist: 'necessity' },
    status: 'reviewed',
    health: { riskTags: ['telemedicine_increase'] }
  },
   {
    id: 'txn_8',
    date: '2024-07-25',
    description: 'CHEZ PANISSE RESTAURANT',
    amount: -350.00,
    category: 'food-drink',
     multiCategory: {
        banking: 'food-drink',
        behavioral: 'luxury',
        personalized: 'weekend-dining',
        minimalist: 'wants'
    },
    status: 'flagged',
  },
   {
    id: 'txn_11',
    date: '2024-07-22',
    description: 'GUCCI STORE 5TH AVE',
    amount: -1250.00,
    category: 'shopping',
    multiCategory: {
        banking: 'shopping',
        behavioral: 'luxury',
        personalized: 'shopping',
        minimalist: 'wants'
    },
    status: 'flagged',
  },
  {
    id: 'txn_health_3',
    date: '2024-07-20',
    description: 'QUEST DIAGNOSTICS',
    amount: -250.00,
    category: 'health',
    multiCategory: { banking: 'health', behavioral: 'necessity', personalized: 'health', minimalist: 'necessity' },
    status: 'reviewed',
    health: { riskTags: ['lab_tests_spike'] }
  },
    {
    id: 'txn_health_4',
    date: '2024-07-15',
    description: 'WALGREENS PHARMACY',
    amount: -42.10,
    category: 'health',
    multiCategory: { banking: 'health', behavioral: 'necessity', personalized: 'health', minimalist: 'necessity' },
    status: 'reviewed',
    health: { riskTags: ['pharmacy_frequent'] }
  },
];
