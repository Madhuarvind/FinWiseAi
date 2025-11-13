
# FinWiseAI: Modules & Features Report

**Version:** 1.0
**Date:** 24/07/2024

---

This document provides a detailed overview of the advanced modules and unique features implemented within the FinWiseAI system. Each component is designed to showcase a specific aspect of the hybrid, explainable, and autonomous financial transaction categorisation engine.

## 1. Core AI Engine & Pipeline

The foundation of FinWiseAI is a multi-stage, hybrid intelligence pipeline that ensures a balance of speed, cost, and accuracy.

-   **Confidence-Conditioned Pipeline (CCP):** This is the core architectural pattern. Instead of treating all transactions equally, the system first uses a fast, simulated rule-based engine. If confidence is high (≥ 95%), the transaction is categorized instantly. If confidence is low, it is automatically routed to a more powerful LLM for nuanced analysis.
    -   **Implementation:** `categorizeTransactionWithLLM.ts` flow.

-   **LLM Re-Ranker:** For ambiguous cases, a sophisticated Large Language Model acts as a "reranker," choosing the most appropriate category from a list of candidates. This provides deep semantic understanding where rules fail.
    -   **Implementation:** `categorizeTransactionWithLLM.ts` flow.

## 2. Dashboard Intelligence Suite

The dashboard is transformed from a simple data display into a proactive, intelligent financial co-pilot.

-   **Financial Mood DNA (FM-DNA):** A dynamic identifier that represents the user's current financial state (e.g., "Calm, Routine, Low-Risk"). It includes a "Lore" component that provides a narrative of the user's financial evolution (e.g., evolving from 'Saver' to 'Smart Investor').
    -   **Implementation:** `dashboard/page.tsx`

-   **Emotional Saving Advisor (ESA):** An AI advisor that provides empathetic, actionable advice. It detects patterns like impulsive late-night shopping and offers to activate "Emotion-Safe Mode," a preventative spending lock.
    -   **Implementation:** `dashboard/page.tsx`

-   **Automated Financial Journal (AFJW/FSOD):** The AI generates a daily narrative summary of the user's financial activities, highlighting disciplined behavior or gentle warnings. This turns financial tracking into a personalized story.
    -   **Implementation:** `dashboard/page.tsx` with a dialog for the full journal.

-   **Habit Vulnerability Radar (HVR):** A predictive security feature that identifies and displays a user's specific "weak points"—such as vulnerable hours and spending categories—where impulsive behavior is most likely.
    -   **Implementation:** `dashboard/page.tsx`

## 3. Explainable AI (XAI) Suite

Found within the `Transaction Detail Sheet`, this suite provides unprecedented transparency into the AI's decision-making process for every transaction.

-   **Transaction Semantic Radiograph (TSR):** Visually highlights the specific words (tokens) in a transaction description that most influenced the AI's classification decision.
    -   **Implementation:** `getTokenAttributions.ts` flow, displayed in `TransactionDetailSheet.tsx`.

-   **Human Trust Score (HTS):** A confidence score, displayed as a progress bar, that quantifies the AI's certainty in its own prediction.
    -   **Implementation:** Simulated confidence score in `TransactionDetailSheet.tsx`.

-   **Predicted Intent (TEM - Temporal-contextual Emotion Modeling):** Infers the likely emotional or psychological driver behind a purchase (e.g., "This seems to be a comfort-spending purchase after a long day.").
    -   **Implementation:** `decodeSpendingIntent.ts` flow.

-   **Transaction Story (TCL, LSF, PMR, NFRE):** A human-like narrative that explains the transaction in the context of the user's habits and routines.
    -   **Implementation:** `explainTransactionClassification.ts` flow.

-   **Counterfactual & Ethical Shadow (RCSL):** The AI explains what would need to change for a transaction to be classified differently and suggests a more goal-aligned "ethical" alternative (e.g., "Reusing an existing item could have saved this amount.").
    -   **Implementation:** `generateCounterfactualExplanation.ts` flow.

-   **Future Impact & Health (FIP, ABC, PHHS):** Forecasts the long-term financial and behavioral impact of a transaction, including annual cost, budget health score impact, and predicted time until the next similar purchase.
    -   **Implementation:** Simulated logic in `TransactionDetailSheet.tsx`.

-   **AI Financial Twin's Advice (AIFT/GIP):** Provides advice from a simulated "Saver-Self" persona, comparing the current action against past regret patterns and future goals.
    -   **Implementation:** Static text in `TransactionDetailSheet.tsx` demonstrating the concept.

-   **Spending Persona & Philosophy (TPG/HPFA):** Identifies which of the user's spending archetypes (e.g., 'Weekend Foodie,' 'Savvy Shopper') was active during the purchase.
    -   **Implementation:** Logic within `TransactionDetailSheet.tsx`.

-   **Purchase Memory (Similarity Search):** Simulates a memory lookup by displaying a list of semantically similar merchants, showing how the AI connects related entities.
    -   **Implementation:** `findSimilarMerchants.ts` flow.

## 4. AI Simulation Lab

An interactive environment for exploring the advanced capabilities of the FinWiseAI engine.

-   **Transaction Universe Explorer (TUE):** A placeholder for a stunning 3D visualization of the user's financial life as a "spending galaxy," where categories are nebulae and merchants are stars.
    -   **Implementation:** `simulation-lab/page.tsx`

-   **Financial Parallel World Simulator (FPWS):** An interactive tool that lets users explore "what if" scenarios by running counterfactual simulations on their spending habits.
    -   **Implementation:** `simulation-lab/page.tsx` using the `generateCounterfactualExplanation.ts` flow.

-   **Spending Black Box Recorder (SBBR):** A unique feature that makes the abstract concept of embeddings tangible. It simulates the generation of a "Zero Interpretation Loss Embedding" (ZILE) or "Semantic DNA" for a transaction, visualizing the rich feature vector the AI uses for analysis.
    -   **Implementation:** `simulation-lab/page.tsx` using the `generateSemanticDNA.ts` flow.

## 5. Model Hub & Automated MLOps

A command center for managing, monitoring, and fine-tuning the AI models.

-   **Teacher Ensemble & PEFT Adapters:** The UI displays the core foundation models, classifier heads, and fine-tuning adapters (like LoRA), making the complex model architecture understandable.
    -   **Implementation:** `model-hub/page.tsx`

-   **Meta-Active Sampler (MAS) Workbench:** Simulates an RL agent that intelligently finds the most informative transaction samples for labeling, optimizing the model improvement process.
    -   **Implementation:** `model-hub/page.tsx` using the `synthesizeTransactions.ts` flow.

-   **Self-Reflective Model Auditor (SRMA):** An automated auditor that tracks the model's own weaknesses by analyzing token attributions, creating a "self-confidence map" of its abilities.
    -   **Implementation:** `model-hub/page.tsx` using the `getTokenAttributions.ts` flow.

## 6. Responsible AI & Security

A dedicated section for AI governance, demonstrating a commitment to ethical, transparent, and secure operation.

-   **Fairness & Bias Report:** A quantitative analysis of model performance across different transaction value segments, ensuring equitable treatment.
    -   **Implementation:** `responsible-ai/page.tsx`

-   **Policy-Aware Category Planner (PACP):** A simulated compliance layer that identifies and enforces rules for regulatory-sensitive categories (e.g., AML/KYC).
    -   **Implementation:** `responsible-ai/page.tsx`

-   **Behavioural Anonymizer (BA):** An interactive simulation that transforms user-specific transaction data into an anonymous "Semantic DNA" vector, demonstrating privacy-preserving analytics.
    -   **Implementation:** `responsible-ai/page.tsx` using the `generateSemanticDNA.ts` flow.

-   **Adversarial Intent Filter (AIF):** A security layer that detects and analyzes malicious transaction strings designed to evade categorization, showcasing the system's robustness.
    -   **Implementation:** `security/page.tsx` using the `decodeSpendingIntent.ts` flow.

-   **Auto-Compliance Verifier (ACV) & Category Integrity Validator (CIV):** Modules that ensure model outputs adhere to compliance policies and prevent semantic "leakage" between categories.
    -   **Implementation:** `security/page.tsx`
