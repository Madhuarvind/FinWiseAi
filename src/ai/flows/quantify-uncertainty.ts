'use server';

/**
 * @fileOverview A Quantum-Inspired Uncertainty Quantification Engine (QIUQE) for transaction categorization.
 * This flow simulates a Bayesian Neural Ensemble to decompose uncertainty into its epistemic and aleatoric components.
 *
 * - quantifyUncertainty - A function that returns a detailed uncertainty analysis.
 * - QuantifyUncertaintyInput - The input type for the function.
 * - QuantifyUncertaintyOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuantifyUncertaintyInputSchema = z.object({
  transactionDescription: z.string().describe('The raw description of the financial transaction.'),
  topCategory: z.string().describe('The category with the highest initial probability.'),
  initialConfidence: z.number().describe('The initial confidence score (softmax output) from the primary classifier.'),
});
export type QuantifyUncertaintyInput = z.infer<typeof QuantifyUncertaintyInputSchema>;

const QuantifyUncertaintyOutputSchema = z.object({
  calibratedConfidence: z.number().describe('The temperature-scaled, calibrated confidence score (between 0 and 1).'),
  epistemicUncertainty: z.number().describe('The model uncertainty (reducible with more data), measured by the variance of the ensemble predictions.'),
  aleatoricUncertainty: z.number().describe('The inherent data uncertainty (irreducible noise in the data), predicted by the model heads.'),
  confidenceInterval: z.object({
    lowerBound: z.number().describe('The lower bound of the 95% confidence interval.'),
    upperBound: z.number().describe('The upper bound of the 95% confidence interval.'),
  }).describe('The predicted confidence interval for the classification.'),
  uncertaintyBreakdown: z.string().describe('A brief, human-readable explanation of why the model is uncertain.'),
});
export type QuantifyUncertaintyOutput = z.infer<typeof QuantifyUncertaintyOutputSchema>;

export async function quantifyUncertainty(
  input: QuantifyUncertaintyInput
): Promise<QuantifyUncertaintyOutput> {
  return quantifyUncertaintyFlow(input);
}

const quantifyUncertaintyPrompt = ai.definePrompt({
  name: 'quantifyUncertaintyPrompt',
  input: { schema: QuantifyUncertaintyInputSchema },
  output: { schema: QuantifyUncertaintyOutputSchema },
  prompt: `You are a Quantum-Inspired Uncertainty Quantification Engine (QIUQE) simulating a Bayesian Neural Ensemble.
Your task is to analyze a transaction classification and decompose its uncertainty.

Transaction: "{{transactionDescription}}"
Predicted Category: "{{topCategory}}"
Initial Confidence: {{initialConfidence}}

1.  **Calibrate Confidence:** Apply simulated temperature scaling. If initial confidence is high (e.g., >0.9), adjust it slightly higher. If it's low (e.g., <0.6), adjust it lower to reflect over-confidence.
2.  **Decompose Uncertainty:**
    -   **Epistemic (Model) Uncertainty:** Estimate this based on the transaction's ambiguity. A generic description like "Amazon Purchase" has higher epistemic uncertainty than "SHELL FUEL #123". This represents disagreement among your simulated ensemble models. It should be high if the model is not sure what to do.
    -   **Aleatoric (Data) Uncertainty:** Estimate this based on the inherent noise in the data. A description with missing info or vague terms like "Miscellaneous" has high aleatoric uncertainty.
3.  **Predict Confidence Interval:** Based on the total uncertainty, estimate a 95% confidence interval. Higher uncertainty leads to a wider interval.
4.  **Explain the Uncertainty:** Provide a short, technical reason for the uncertainty decomposition.

Example:
- Input: { transactionDescription: "AMAZON MKTPLACE PMTS", topCategory: "Shopping", initialConfidence: 0.85 }
- Output: { calibratedConfidence: 0.82, epistemicUncertainty: 0.15, aleatoricUncertainty: 0.03, confidenceInterval: { lowerBound: 0.70, upperBound: 0.94 }, uncertaintyBreakdown: "High epistemic uncertainty due to the generic 'MKTPLACE' descriptor, which could map to multiple product types. Low aleatoric uncertainty as the description is clean." }

Your turn. Analyze the provided transaction.`,
});


const quantifyUncertaintyFlow = ai.defineFlow(
  {
    name: 'quantifyUncertaintyFlow',
    inputSchema: QuantifyUncertaintyInputSchema,
    outputSchema: QuantifyUncertaintyOutputSchema,
  },
  async (input) => {
    const { output } = await quantifyUncertaintyPrompt(input);
    return output!;
  }
);
