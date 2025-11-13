export type TripStatus = 'Confirmed' | 'Draft';
export type TripIntent = 'Business' | 'Leisure' | 'Family' | 'Relocation';
export type TripTransactionType = 'flight' | 'hotel' | 'local_transport' | 'dining' | 'attraction' | 'other';
export type SavingsActionStatus = 'pending' | 'completed';

export interface TripTransaction {
  id: string;
  type: TripTransactionType;
  description: string;
  amount: number;
  date: string;
}

export interface SavingsAction {
  id: string;
  description: string;
  potentialSaving: number;
  status: SavingsActionStatus;
  savedAmount?: number;
}

export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  totalEstimatedCost: number;
  intent: {
    type: TripIntent;
    confidence: number;
  };
  transactions: TripTransaction[];
  savings: {
    target: number;
    actions: SavingsAction[];
  };
}
