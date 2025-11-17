
import type { Transaction } from '@/lib/types';
import { format, parseISO, setHours, setMinutes, setSeconds } from 'date-fns';

/**
 * Normalizes the transaction description.
 * - Converts to lowercase
 * - Removes common stopwords, symbols, and numbers/IDs
 * - Trims extra whitespace
 * This simulates cleaning raw transaction strings before feature extraction.
 * @param description The raw transaction description.
 * @returns A cleaned description.
 */
function normalizeDescription(description: string): string {
  const stopwords = ['corp', 'inc', 'llc', 'ltd', 'co', 'pmts', 'com'];
  const stopwordRegex = new RegExp(`\\b(${stopwords.join('|')})\\b`, 'gi');

  return description
    .toLowerCase()
    .replace(stopwordRegex, '') // Remove stopwords
    .replace(/\*|\#|([0-9]+)/g, '') // Remove symbols and numbers that are often noise
    .replace(/[^a-z\s]/g, '') // Remove remaining non-alphabetic characters (except spaces)
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
}


/**
 * Enriches transaction data with additional context.
 * Adds day of the week and a simulated time of day.
 * @param transaction The transaction to enrich.
 * @returns The enriched transaction.
 */
function enrichTransaction(transaction: Transaction): Transaction {
  // Since mock data only has dates, we simulate a time to extract temporal features.
  const randomHour = Math.floor(Math.random() * 24);
  const randomMinute = Math.floor(Math.random() * 60);
  const date = setSeconds(setMinutes(setHours(parseISO(transaction.date), randomHour), randomMinute), 0);

  let timeOfDay: Transaction['timeOfDay'];
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'Morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'Afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'Evening';
  } else {
    timeOfDay = 'Night';
  }

  return {
    ...transaction,
    dayOfWeek: format(date, 'EEEE'), // e.g., "Monday"
    timeOfDay: timeOfDay,
  };
}


/**
 * Processes a list of raw transactions through the entire preprocessing pipeline.
 * @param transactions The array of raw transactions.
 * @returns A processed and enriched list of transactions.
 */
export function preprocessTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.map(transaction => {
    // This is a copy so we don't mutate the original object, important for React state
    const processedTransaction = { ...transaction };

    // 1. Normalize description to simulate cleaning and PII masking
    // In this demo, we use the original description for readability, but the function is available.
    // processedTransaction.description = normalizeDescription(transaction.description);
    
    // 2. Enrich with context
    const enrichedTransaction = enrichTransaction(processedTransaction);

    return enrichedTransaction;
  });
}
