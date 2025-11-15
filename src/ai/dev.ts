import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-transaction-with-llm.ts';
import '@/ai/flows/explain-transaction-classification.ts';
import '@/ai/flows/suggest-transaction-categories.ts';
import '@/ai/flows/generate-semantic-dna.ts';
import '@/ai/flows/generate-counterfactual-explanation.ts';
import '@/ai/flows/get-token-attributions.ts';
import '@/ai/flows/find-similar-merchants.ts';
import '@/ai/flows/synthesize-transactions.ts';
import '@/ai/flows/decode-spending-intent.ts';
import '@/ai/flows/reconstruct-transaction-from-text.ts';
import '@/ai/flows/generate-policy-from-text.ts';
import '@/ai/flows/generate-adversarial-examples.ts';
