'use server';

/**
 * @fileOverview Generates a Zero Interpretation Loss Embedding (ZILE) for a transaction.
 * This simulates creating a rich feature vector with semantic and interpretive dimensions.
 *
 * - generateSemanticDNA - A function that creates the ZILE.
 * - GenerateSemanticDNAInput - The input type (transaction description string).
 * - GenerateSemanticDNAOutput - The output type (an object containing the ZILE components).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSemanticDNAInputSchema = z.string().describe('The raw transaction description.');
export type GenerateSemanticDNAInput = z.infer<typeof GenerateSemanticDNAInputSchema>;

const GenerateSemanticDNAOutputSchema = z.object({
  baseSequence: z.string().describe('A DNA-like encoded vector sequence representing the transaction\'s core semantic features.'),
  interpretationVector: z.string().describe('An encoded vector representing explainability signals like SHAP values and category context.'),
});
export type GenerateSemanticDNAOutput = z.infer<typeof GenerateSemanticDNAOutputSchema>;

export async function generateSemanticDNA(input: GenerateSemanticDNAInput): Promise<GenerateSemanticDNAOutput> {
  return generateSemanticDNAFlow(input);
}

const generateSemanticDNAPrompt = ai.definePrompt({
  name: 'generateSemanticDNAPrompt',
  input: { schema: GenerateSemanticDNAInputSchema },
  output: { schema: GenerateSemanticDNAOutputSchema },
  prompt: `You are a feature engineering expert creating a "Zero Interpretation Loss Embedding" (ZILE) for a financial transaction.
  
  1.  **Base Sequence**: Encode the transaction description into a DNA-like sequence (using A, T, G, C) representing core semantics (merchant, temporal context, etc.).
  2.  **Interpretation Vector**: Create a shorter, encoded vector (using 0s and 1s) representing interpretability signals (e.g., simulated SHAP values, category clusters).

  Transaction Description: {{{$input}}}
  `,
});

const generateSemanticDNAFlow = ai.defineFlow(
  {
    name: 'generateSemanticDNAFlow',
    inputSchema: GenerateSemanticDNAInputSchema,
    outputSchema: GenerateSemanticDNAOutputSchema,
  },
  async (input) => {
    const { output } = await generateSemanticDNAPrompt(input);
    return output!;
  }
);
