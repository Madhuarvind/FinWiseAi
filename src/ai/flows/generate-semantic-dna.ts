'use server';

/**
 * @fileOverview Generates a Semantic DNA sequence for a transaction description.
 * This simulates the process of creating a rich, multi-faceted feature vector.
 *
 * - generateSemanticDNA - A function that creates the Semantic DNA.
 * - GenerateSemanticDNAInput - The input type (transaction description string).
 * - GenerateSemanticDNAOutput - The output type (an object containing the DNA sequence).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSemanticDNAInputSchema = z.string().describe('The raw transaction description.');
export type GenerateSemanticDNAInput = z.infer<typeof GenerateSemanticDNAInputSchema>;

const GenerateSemanticDNAOutputSchema = z.object({
  semanticDNA: z.string().describe('A DNA-like encoded vector sequence representing the transaction\'s multi-faceted features.'),
});
export type GenerateSemanticDNAOutput = z.infer<typeof GenerateSemanticDNAOutputSchema>;

export async function generateSemanticDNA(input: GenerateSemanticDNAInput): Promise<GenerateSemanticDNAOutput> {
  return generateSemanticDNAFlow(input);
}

const generateSemanticDNAPrompt = ai.definePrompt({
  name: 'generateSemanticDNAPrompt',
  input: { schema: GenerateSemanticDNAInputSchema },
  output: { schema: GenerateSemanticDNAOutputSchema },
  prompt: `You are a feature engineering expert creating a "Semantic DNA" for a financial transaction.
  Encode the transaction description into a DNA-like sequence (using A, T, G, C).
  The sequence should represent merchant semantics, user behavior, temporal context, and spending signatures.
  - A-T pairs could represent entity types (e.g., A=Food, T=Restaurant).
  - G-C pairs could represent spending context (e.g., G=High-Value, C=Recurring).
  
  Be creative and consistent. The output should be a single, long string of these "base pairs".

  For example:
  - "STARBUCKS COFFEE #12345" -> "AT-AT-CG-GC-TA-CG-AT-GC-GC-AT" (Represents: Food, Restaurant, Low-Value, Frequent, etc.)
  - "AMAZON MKTPLACE PMTS" -> "TA-TA-GC-CG-AT-CG-GC-AT-AT-TA" (Represents: Shopping, Marketplace, High-Value, Infrequent, etc.)

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
    // In a real implementation, we would return a DNA-like encoded vector sequence.
    // For now, we simulate this with a string.
    return {
      semanticDNA: output!.semanticDNA,
    };
  }
);
