'use server';

/**
 * @fileOverview Converts natural language policy text into a structured JSON policy object.
 * This is a core component of the Policy-Driven Categorisation OS (PD-COS).
 *
 * - generatePolicyFromText - A function that handles the policy generation.
 * - GeneratePolicyFromTextInput - The input type for the function.
 * - GeneratePolicyFromTextOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePolicyFromTextInputSchema = z.string().describe('The natural language text of the policy.');
export type GeneratePolicyFromTextInput = z.infer<typeof GeneratePolicyFromTextInputSchema>;

const GeneratePolicyFromTextOutputSchema = z.object({
  name: z.string().describe('A short, descriptive name for the policy (e.g., "Weekend Swiggy Rule").'),
  conditions: z.object({
    merchant: z.array(z.string()).describe('List of merchant names or keywords to match.'),
    dayOfWeek: z.array(z.string()).optional().describe('Days of the week the policy applies to (e.g., ["Saturday", "Sunday"]).'),
  }).describe('The conditions under which the policy action should be triggered.'),
  action: z.object({
    type: z.literal('CLASSIFY').describe('The type of action to take.'),
    category: z.string().describe('The category to assign if the conditions are met.'),
  }).describe('The action to take when the conditions are met.'),
});
export type GeneratePolicyFromTextOutput = z.infer<typeof GeneratePolicyFromTextOutputSchema>;

export async function generatePolicyFromText(
  input: GeneratePolicyFromTextInput
): Promise<GeneratePolicyFromTextOutput> {
  return generatePolicyFromTextFlow(input);
}

const generatePolicyPrompt = ai.definePrompt({
  name: 'generatePolicyPrompt',
  input: { schema: GeneratePolicyFromTextInputSchema },
  output: { schema: GeneratePolicyFromTextOutputSchema },
  prompt: `You are an expert at converting natural language business rules into structured JSON policies for a financial transaction categorization engine.

Analyze the user's policy text and extract the core components:
1.  **name**: Create a concise, human-readable name for the policy.
2.  **conditions**: Identify the merchants and any temporal constraints (like day of the week).
3.  **action**: Determine the action to be taken, which is always to classify the transaction into a specific category.

Policy Text:
"{{{$input}}}"

Example 1:
Text: "For corporate cards, never classify Swiggy as Personal Dining; it must be Business Food unless transaction is on weekend."
Output: { "name": "Swiggy Corporate Rule", "conditions": { "merchant": ["Swiggy"], "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }, "action": { "type": "CLASSIFY", "category": "Business Food" } }

Example 2:
Text: "Always categorize transactions from 'Uber' or 'Ola' as Transport."
Output: { "name": "Rideshare Policy", "conditions": { "merchant": ["Uber", "Ola"] }, "action": { "type": "CLASSIFY", "category": "Transport" } }

Your turn. Convert the user's policy text.
`,
});

const generatePolicyFromTextFlow = ai.defineFlow(
  {
    name: 'generatePolicyFromTextFlow',
    inputSchema: GeneratePolicyFromTextInputSchema,
    outputSchema: GeneratePolicyFromTextOutputSchema,
  },
  async (input) => {
    const { output } = await generatePolicyPrompt(input);
    return output!;
  }
);
