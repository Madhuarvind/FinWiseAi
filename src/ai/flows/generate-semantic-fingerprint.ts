'use server';

/**
 * @fileOverview Generates a semantic fingerprint for a transaction description.
 * This simulates the process of creating a feature vector (embedding) for the transaction.
 *
 * - generateSemanticFingerprint - A function that creates the semantic fingerprint.
 * - GenerateSemanticFingerprintInput - The input type (transaction description string).
 * - GenerateSemanticFingerprintOutput - The output type (an object containing the fingerprint).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSemanticFingerprintInputSchema = z.string().describe('The raw transaction description.');
export type GenerateSemanticFingerprintInput = z.infer<typeof GenerateSemanticFingerprintInputSchema>;

const GenerateSemanticFingerprintOutputSchema = z.object({
  semanticFingerprint: z.string().describe('A descriptive fingerprint representing the semantic essence of the transaction, capturing entities, intent, and context.'),
});
export type GenerateSemanticFingerprintOutput = z.infer<typeof GenerateSemanticFingerprintOutputSchema>;

export async function generateSemanticFingerprint(input: GenerateSemanticFingerprintInput): Promise<GenerateSemanticFingerprintOutput> {
  return generateSemanticFingerprintFlow(input);
}

const generateSemanticFingerprintPrompt = ai.definePrompt({
  name: 'generateSemanticFingerprintPrompt',
  input: { schema: GenerateSemanticFingerprintInputSchema },
  output: { schema: GenerateSemanticFingerprintOutputSchema },
  prompt: `You are a feature engineering expert. Your task is to analyze the following raw transaction description and generate a "semantic fingerprint". 
  
This fingerprint should be a concise, structured string that distills the key entities, transaction type, and any implied context. Think of it as a human-readable summary of what a 768-dimensional embedding vector would represent.

For example:
- "STARBUCKS COFFEE #12345" -> "Entity:Starbucks; Type:Food/Beverage; Category:Coffee;"
- "AMAZON MKTPLACE PMTS" -> "Entity:Amazon; Platform:Marketplace; Type:Payment;"
- "SHELL FUEL 1234" -> "Entity:Shell; Type:Automotive; Category:Fuel;"

Transaction Description: {{{$input}}}
`,
});

const generateSemanticFingerprintFlow = ai.defineFlow(
  {
    name: 'generateSemanticFingerprintFlow',
    inputSchema: GenerateSemanticFingerprintInputSchema,
    outputSchema: GenerateSemanticFingerprintOutputSchema,
  },
  async (input) => {
    const { output } = await generateSemanticFingerprintPrompt(input);
    return output!;
  }
);
