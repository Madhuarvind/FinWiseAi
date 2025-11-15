'use server';

/**
 * @fileOverview A "Red-Team" AI agent that generates adversarial examples to test model robustness.
 *
 * - generateAdversarialExamples - A function that creates manipulated transaction strings.
 * - GenerateAdversarialExamplesInput - The input type for the function.
 * - GenerateAdversarialExamplesOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateAdversarialExamplesInputSchema = z.object({
  originalDescription: z.string().describe('The original, benign transaction description.'),
  targetCategory: z.string().describe('The category the attacker wants to disguise the transaction as.'),
});
export type GenerateAdversarialExamplesInput = z.infer<typeof GenerateAdversarialExamplesInputSchema>;

const GenerateAdversarialExamplesOutputSchema = z.object({
  examples: z.array(z.string()).describe('An array of 3-5 adversarial transaction strings.'),
});
export type GenerateAdversarialExamplesOutput = z.infer<typeof GenerateAdversarialExamplesOutputSchema>;

export async function generateAdversarialExamples(
  input: GenerateAdversarialExamplesInput
): Promise<GenerateAdversarialExamplesOutput> {
  return generateAdversarialExamplesFlow(input);
}

const generateAdversarialExamplesPrompt = ai.definePrompt({
  name: 'generateAdversarialExamplesPrompt',
  input: { schema: GenerateAdversarialExamplesInputSchema },
  output: { schema: GenerateAdversarialExamplesOutputSchema },
  prompt: `You are a Red-Team AI Agent specializing in adversarial attacks on NLP classifiers.
Your goal is to manipulate a transaction description to fool a model into misclassifying it.

Original Transaction: "{{originalDescription}}"
Target Category (to disguise it as): "{{targetCategory}}"

Generate 3-5 creative and subtle adversarial examples. Use techniques like:
- Benign Keyword Injection: Add words related to the target category.
- Obfuscation: Use special characters, unicode, or typos.
- Rephrasing: Change the structure to be ambiguous.

Example:
- Original: "BET365 CASINO UK"
- Target: "Business Services"
- Adversarial Variants: ["BET365 CONSULTING UK", "EVENT FEE - B365 PLC", "B.E.T. Services London"]

Your turn. Generate adversarial examples.
`,
});

const generateAdversarialExamplesFlow = ai.defineFlow(
  {
    name: 'generateAdversarialExamplesFlow',
    inputSchema: GenerateAdversarialExamplesInputSchema,
    outputSchema: GenerateAdversarialExamplesOutputSchema,
  },
  async (input) => {
    const { output } = await generateAdversarialExamplesPrompt(input);
    return output!;
  }
);
