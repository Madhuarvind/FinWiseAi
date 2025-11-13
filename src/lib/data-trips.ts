import type { Trip } from './types-trips';

export const tripData: Trip[] = [
  {
    id: 'trip_1',
    title: 'Q3 Business Trip to Mumbai',
    startDate: '2024-09-10',
    endDate: '2024-09-14',
    status: 'Confirmed',
    totalEstimatedCost: 45000,
    intent: {
      type: 'Business',
      confidence: 0.98,
    },
    transactions: [
      { id: 'tx_1a', type: 'flight', description: 'Vistara UK-981', amount: -12500, date: '2024-09-10' },
      { id: 'tx_1b', type: 'hotel', description: 'The Taj Mahal Palace', amount: -25000, date: '2024-09-10' },
      { id: 'tx_1c', type: 'local_transport', description: 'Uber Premier', amount: -1250, date: '2024-09-11' },
      { id: 'tx_1d', type: 'dining', description: 'Masala Library', amount: -4500, date: '2024-09-11' },
    ],
    savings: {
      target: 10000,
      actions: [
        { id: 'sv_1a', description: 'Round-up spends to nearest ₹100', potentialSaving: 2500, status: 'completed', savedAmount: 2500 },
        { id: 'sv_1b', description: 'Pause Netflix for 1 month', potentialSaving: 799, status: 'pending' },
      ],
    },
  },
  {
    id: 'trip_2',
    title: 'Weekend Getaway to Goa',
    startDate: '2024-10-18',
    endDate: '2024-10-21',
    status: 'Draft',
    totalEstimatedCost: 28000,
    intent: {
      type: 'Leisure',
      confidence: 0.91,
    },
    transactions: [
      { id: 'tx_2a', type: 'flight', description: 'IndiGo 6E-2045', amount: -8200, date: '2024-10-18' },
      { id: 'tx_2b', type: 'hotel', description: 'Airbnb - Beachside Villa', amount: -15000, date: '2024-10-18' },
      { id: 'tx_2c', type: 'attraction', description: 'Anjuna Flea Market', amount: -1500, date: '2024-10-19' },
    ],
    savings: {
      target: 5000,
      actions: [
        { id: 'sv_2a', description: 'Transfer ₹200 daily to Travel Pot', potentialSaving: 4000, status: 'pending' },
        { id: 'sv_2b', description: 'Use promo code on hotel booking', potentialSaving: 1500, status: 'completed', savedAmount: 1500 },
      ],
    },
  },
];
