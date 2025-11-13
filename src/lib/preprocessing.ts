import type { Transaction } from '@/lib/types';
import { format, parseISO } from 'date-fns';

/**
 * Normalizes the transaction description.
 * - Converts to lowercase
 * - Removes common stopwords and symbols
 * - Trims extra whitespace
 * @param description The raw transaction description.
 * @returns A cleaned description.
 */
function normalizeDescription(description: string): string {
  const stopwords = ['corp', 'inc', 'llc', 'ltd', 'co', 'mktplace', 'pmts'];
  const stopwordRegex = new RegExp(`\\b(${stopwords.join('|')})\\b`, 'gi');

  return description
    .toLowerCase()
    .replace(stopwordRegex, '') // Remove stopwords
    .replace(/[^a-z0-9\s]/g, '') // Remove non-alphanumeric characters (except spaces)
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
}

/**
 * Enriches transaction data with additional context.
 * For now, it adds the day of the week.
 * @param transaction The transaction to enrich.
 * @returns The enriched transaction.
 */
function enrichTransaction(transaction: Transaction): Transaction {
  const date = parseISO(transaction.date);
  return {
    ...transaction,
    dayOfWeek: format(date, 'EEEE'), // e.g., "Monday"
  };
}


/**
 * Processes a list of raw transactions through the entire preprocessing pipeline.
 * @param transactions The array of raw transactions.
 * @returns A processed and enriched list of transactions.
 */
export function preprocessTransactions(transactions: Transaction[]): Transaction[] {
  return transactions.map(transaction => {
    // 1. Normalize description
    const normalizedTransaction = {
      ...transaction,
      description: normalizeDescription(transaction.description),
    };
    
    // 2. Enrich with context
    const enrichedTransaction = enrichTransaction(normalizedTransaction);

    // In the future, PII masking and noise reduction steps would go here.
    return enrichedTransaction;
  });
}
