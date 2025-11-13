import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-transaction-with-llm.ts';
import '@/ai/flows/explain-transaction-classification.ts';
import '@/ai/flows/suggest-transaction-categories.ts';
import '@/ai/flows/generate-semantic-fingerprint.ts';
import '@/ai/flows/generate-counterfactual-explanation.ts';
import '@/ai/flows/get-token-attributions.ts';
