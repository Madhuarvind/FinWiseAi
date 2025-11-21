# FinWiseAI: Modules & Features Report

**Version:** 3.0
**Date:** 24/07/2024

---

This document provides a detailed overview of the advanced modules and unique features implemented within the FinWiseAI system. The architecture is designed as a multi-layered cognitive platform, moving beyond simple categorization into the realm of AGI-like financial intelligence.

## 🧠 Layer 1: Core AI Engine & Hybrid Pipeline

The foundation of FinWiseAI is a multi-stage, hybrid intelligence pipeline that ensures a balance of speed, cost, and accuracy.

-   **Confidence-Conditioned Pipeline (CCP):** Instead of treating all transactions equally, the system first uses a fast, simulated local classifier. If confidence is high (e.g., ≥ 95%), the transaction is categorized instantly. If confidence is low, it is automatically routed to a more powerful LLM for nuanced analysis. This is the core of the **Transaction Metacognition Engine (TME)**.
    -   **Implementation:** `categorize-transaction-with-llm.ts` flow, visible in `TransactionDetailSheet.tsx`.

-   **LLM Re-Ranker:** For ambiguous cases, a sophisticated Large Language Model acts as a "reranker," choosing the most appropriate category from a list of candidates. This provides deep semantic understanding where rules fail.
    -   **Implementation:** `categorize-transaction-with-llm.ts` flow.

-   **Automated Rule Generation (ARG):** An AI agent that analyzes transactions within a given category to automatically generate and suggest a set of fuzzy-matching keyword rules.
    -   **Implementation:** `find-similar-merchants.ts` flow, used in the `taxonomy/page.tsx`.

## 💖 Layer 2: Behavioral & Health Intelligence

This layer focuses on understanding the *user* behind the data, transforming the dashboard into a proactive, intelligent financial co-pilot.

-   **Financial Consciousness Projection (FCP):** The AI projects the "consciousness state" of the user's financial behavior, detecting money anxiety, subconscious patterns, and the emotional burden behind purchases.
    -   **Implementation:** Displayed prominently on the `dashboard/page.tsx`.

-   **AI Transaction Archeology System (ATAS):** The AI digs through transactions to find "spending eras" and "lifestyle epochs," providing a historical narrative of the user's financial journey.
    -   **Implementation:** The "Financial Epoch" summary on the `dashboard/page.tsx`.

-   **Financial Entropy Score (FES):** A physics-inspired metric that measures the level of chaos or structure in a user's financial life.
    -   **Implementation:** Displayed as a key metric on the `dashboard/page.tsx`.

-   **Neuro-Financial Reflex System (NFRS):** The AI develops automated "reflex actions" to protect the user from harmful patterns, such as activating "Emotion-Safe Mode."
    -   **Implementation:** The NFRS card on `dashboard/page.tsx`.

-   **Emotion-Time Fusion Engine (ETFE):** The AI fuses time and emotion to predict a user's "emotional danger zones" where impulsive behavior is most likely.
    -   **Implementation:** The ETFE card on `dashboard/page.tsx`.

-   **Cross-Persona Adaptive Categorisation (CPAC):** The system learns a user's financial "persona" and adjusts categorization based on the active "universe" or "brain."
    -   **Implementation:** The "Spending Persona & Philosophy" module in `TransactionDetailSheet.tsx` and the "Universe Selector" on the dashboard.

-   **Health & Medical Analytics (HSRE & MEF):** A specialized module that includes a **Health Risk Score Engine** to analyze health-related spending patterns and a **Medical Expense Forecaster** to predict future costs.
    -   **Implementation:** The `analytics/page.tsx` features these dedicated components.

## 🔍 Layer 3: Explainable AI (XAI) & Reality Reconstruction

The XAI suite, primarily located in the `TransactionDetailSheet`, provides unprecedented transparency into the AI's decision-making process for every single transaction.

-   **Gemini-Driven Money Memory Reconstruction (GMMR):** The system reconstructs the hidden reality and story behind a transaction.
    -   **Implementation:** The "Money Memory Reconstruction" module in `TransactionDetailSheet.tsx`, powered by the `explainTransactionClassification.ts` flow.

-   **Transaction Emotional Temperature (TET):** Every transaction is assigned an emotional temperature score, making the categorization system emotion-aware.
    -   **Implementation:** The "Predicted Intent & Emotional Temperature" module in `TransactionDetailSheet.tsx`, powered by the `decodeSpendingIntent.ts` flow.

-   **Transaction Semantic Radiograph (TSR):** Visually highlights the specific words (tokens) in a transaction description that most influenced the AI's classification.
    -   **Implementation:** The `HighlightedDescription` component in `TransactionDetailSheet.tsx`, driven by the `getTokenAttributions.ts` flow.

-   **Transaction Counterfactual Simulator (TCS):** Shows what would happen if the user made a different financial choice.
    -   **Implementation:** The "Counterfactual & Ethical Shadow" module in `TransactionDetailSheet.tsx` and the "What-If Playground" on the `simulation-lab/page.tsx`.

-   **Ethical Micro-Advisor AI Swarm (EMA-Swarm):** A council of AI agents with different moral viewpoints provide synthesized advice.
    -   **Implementation:** The "EMA-Swarm" module in `TransactionDetailSheet.tsx`.

-   **Spending Linguistics Interpreter (SLI):** The AI analyzes linguistic patterns in transaction descriptions to identify semantic clusters.
    -   **Implementation:** The "SLI" insight within the "Future Impact & Health" module in `TransactionDetailSheet.tsx`.

## 🛡️ Layer 4: Robustness, Security & Metacognition

This layer comprises the system's self-awareness, self-healing, and defense mechanisms.

-   **Transaction Metacognition Engine (TME):** The overarching "brain" that thinks about its own thinking, displayed on the "Self-Healing Model Debugger."
    -   **Implementation:** The dashboard at `analytics/page.tsx`, which displays the TME's internal metrics.

-   **Predictive Feedback Targeting (PFT):** The AI predicts which transactions are most valuable for user correction to improve the model.
    -   **Implementation:** The "Flagged for Attention" alert in `TransactionDetailSheet.tsx`, which explains *why* the AI is asking for feedback.

-   **Robustness Contract Checker (RCC) / User-Trainable FinAI:** A "Teach Mode" where users can define robustness contracts in natural language.
    -   **Implementation:** The "Policy OS" page at `policy-os/page.tsx`, powered by the `generatePolicyFromText.ts` flow.

-   **Adversarial Attack Simulator (AAS):** A "Red-Team" Gemini agent that actively tries to break the categorization model.
    -   **Implementation:** The "Adversarial Attack Simulator" module on the `security/page.tsx`, powered by `generateAdversarialExamples.ts`.

-   **Model Evaluation Workbench:** An in-app tool to generate an evaluation report, including F1 scores and a confusion matrix, with AI-driven recommendations for model improvement.
    -   **Implementation:** The `model-hub/page.tsx`.

## 🌌 Layer 5: AGI-Level Simulation & Prediction

This layer contains the most futuristic features, showcasing the platform's ability to simulate, predict, and narrate complex financial scenarios.

-   **Financial Parallel Universe Navigator (FPUN) / Causal Inference (CIES):** A sandbox where users can explore "what-if" scenarios.
    -   **Implementation:** The "Transaction 'What-If' Playground" on the `simulation-lab/page.tsx`.

-   **Financial Cognitive Shadow System (FCSS) / Self-Evolving Categories (SECDS):** A shadow AI engine that predicts when the main classifier will fail *in the future* and suggests new categories.
    -   **Implementation:** The "Predictive Category Drift Oracle" on the `analytics/page.tsx` and the "Suggest Categories" feature on `taxonomy/page.tsx`, powered by `suggestTransactionCategories.ts`.

-   **Hyper-Contextual Transaction Rewriting (HTR) / Privacy-Preserving Semantic DNA (ZILE):** Simulates transforming a transaction into a privacy-preserving "Zero Interpretation Loss Embedding" vector.
    -   **Implementation:** The "Hyper-Contextual Transaction Rewriting" module on `simulation-lab/page.tsx` and the "Behavioural Anonymizer" on `responsible-ai/page.tsx`, both powered by the `generateSemanticDNA` flow.

-   **Neural Architecture Search (NAS-OM):** An automated system for model optimization.
    -   **Implementation:** The `model-hub/page.tsx` simulates this via its "NAS-OM Workbench."
