
# FinWiseAI: Modules & Features Report

**Version:** 3.0
**Date:** 24/07/2024

---

This document provides a detailed overview of the advanced modules and unique features implemented within the FinWiseAI system. The architecture is designed as a multi-layered cognitive platform, moving beyond simple categorization into the realm of AGI-like financial intelligence.

## 🧠 Layer 1: Core AI Engine & Hybrid Pipeline

The foundation of FinWiseAI is a multi-stage, hybrid intelligence pipeline that ensures a balance of speed, cost, and accuracy.

-   **Confidence-Conditioned Pipeline (CCP):** Instead of treating all transactions equally, the system first uses a fast, simulated rule-based engine. If confidence is high (e.g., ≥ 95%), the transaction is categorized instantly. If confidence is low, it is automatically routed to a more powerful LLM for nuanced analysis. This is the core of the **Transaction Metacognition Engine (TME)**.
    -   **Implementation:** `categorizeTransactionWithLLM.ts` flow, visible in `TransactionDetailSheet.tsx`.

-   **LLM Re-Ranker:** For ambiguous cases, a sophisticated Large Language Model acts as a "reranker," choosing the most appropriate category from a list of candidates. This provides deep semantic understanding where rules fail.
    -   **Implementation:** `categorizeTransactionWithLLM.ts` flow.

-   **Autonomous AI Category Referee (AICR):** In complex scenarios, the system can simulate a "debate" between different AI models. The **Transaction Governance Console** demonstrates this with multiple agents (Regulator, Risk, Product) evaluating classifications.
    -   **Implementation:** Simulated in `security/page.tsx`.

## 💖 Layer 2: Behavioral Intelligence & Hyper-Personalization

This layer focuses on understanding the *user* behind the data, transforming the dashboard into a proactive, intelligent financial co-pilot.

-   **Financial Consciousness Projection (FCP):** The AI projects the "consciousness state" of the user's financial behavior, detecting money anxiety, subconscious patterns, and the emotional burden behind purchases.
    -   **Implementation:** Displayed prominently on the `dashboard/page.tsx` as the user's current financial consciousness state (e.g., "Calm, Intentional").

-   **AI Transaction Archeology System (ATAS):** The AI digs through years of transactions to find "spending eras," "lifestyle epochs," and "financial extinction moments," providing a historical narrative of the user's financial journey.
    -   **Implementation:** The "Financial Epoch" summary on the `dashboard/page.tsx`.

-   **Financial Entropy Score (FES):** A physics-inspired metric that measures the level of chaos or structure in a user's financial life.
    -   **Implementation:** Displayed as a key metric on the `dashboard/page.tsx`.

-   **Neuro-Financial Reflex System (NFRS):** The AI develops automated "reflex actions" to protect the user from harmful patterns, such as activating "Emotion-Safe Mode."
    -   **Implementation:** The NFRS card on `dashboard/page.tsx`.

-   **Emotion-Time Fusion Engine (ETFE):** The AI fuses time, emotion, and habit cycles to predict a user's "emotional danger zones" where impulsive behavior is most likely.
    -   **Implementation:** The ETFE card on `dashboard/page.tsx`.

-   **Personal Finance Persona Engine (PFPE) / Cross-Persona Adaptive Categorisation (CPAC):** The system learns a user's financial "persona" and adjusts categorization based on the active "universe" or "brain."
    -   **Implementation:** The "Spending Persona & Philosophy" module in `TransactionDetailSheet.tsx` and the "Universe Selector" on the dashboard.

## 🔍 Layer 3: Explainable AI (XAI) & Reality Reconstruction

The XAI suite, primarily located in the `TransactionDetailSheet`, provides unprecedented transparency into the AI's decision-making process for every single transaction.

-   **Gemini-Driven Money Memory Reconstruction (GMMR):** The system reconstructs the hidden reality and story behind a transaction.
    -   **Implementation:** The "Money Memory Reconstruction" module in `TransactionDetailSheet.tsx`, powered by the `explainTransactionClassification.ts` flow.

-   **Transaction Emotional Temperature (TET) / Sentiment-Synchronized Categorisation (SSC):** Every transaction is assigned an emotional temperature score, making the categorization system emotion-aware.
    -   **Implementation:** The "Predicted Intent & Emotional Temperature" module in `TransactionDetailSheet.tsx`, powered by the `decodeSpendingIntent.ts` flow.

-   **Transaction Semantic Radiograph (TSR):** Visually highlights the specific words (tokens) in a transaction description that most influenced the AI's classification.
    -   **Implementation:** The "HighlightedDescription" component in `TransactionDetailSheet.tsx`, driven by the `getTokenAttributions.ts` flow.

-   **Transaction Counterfactual Simulator (TCS):** Shows what would happen if the user made a different financial choice.
    -   **Implementation:** The "Counterfactual & Ethical Shadow" module in `TransactionDetailSheet.tsx`, powered by the `generateCounterfactualExplanation.ts` flow.

-   **Ethical Micro-Advisor AI Swarm (EMA-Swarm):** A council of AI agents with different moral viewpoints provide synthesized advice.
    -   **Implementation:** The "EMA-Swarm" module in `TransactionDetailSheet.tsx`.

-   **Spending Linguistics Interpreter (SLI):** The AI analyzes linguistic patterns in transaction descriptions to identify semantic clusters.
    -   **Implementation:** The "SLI" insight within the "Future Impact & Health" module in `TransactionDetailSheet.tsx`.

## 🛡️ Layer 4: Robustness, Security & Metacognition

This layer comprises the system's self-awareness, self-healing, and defense mechanisms.

-   **Transaction Metacognition Engine (TME):** The overarching "brain" that thinks about its own thinking, displayed on the "Self-Healing Model Debugger."
    -   **Implementation:** The dashboard at `analytics/page.tsx`, which displays the TME's internal metrics (F1 score, latency, errors).

-   **Predictive Feedback Targeting (PFT) / Active Learning (ALOE):** The AI predicts which transactions are most valuable for user correction to improve the model.
    -   **Implementation:** The "Flagged for Attention" alert in `TransactionDetailSheet.tsx`, which explains *why* the AI is asking for feedback (uncertainty sampling).

-   **Robustness Contract Checker (RCC) / User-Trainable FinAI:** A "Teach Mode" where users can define robustness contracts in natural language.
    -   **Implementation:** The "Policy OS" page at `policy-os/page.tsx`, powered by the `generatePolicyFromText.ts` flow.

-   **Adversarial Attack Simulator (AAS):** A "Red-Team" Gemini agent that actively tries to break the categorization model.
    -   **Implementation:** The "Adversarial Attack Simulator" module on the `security/page.tsx`, powered by `generateAdversarialExamples.ts`.

-   **Dynamic Ethical Checkpoint Network (DECN) / Bias Detection (BDMS):** An ethical audit is performed on every decision, checking for fairness and bias.
    -   **Implementation:** The "Fairness & Bias Report" on the `responsible-ai/page.tsx`, powered by the `FairnessMetricsTable` component.

-   **Blockchain-Based Model Provenance (BMP):** An immutable audit trail for model decisions.
    -   **Implementation:** Simulated in the descriptions of the "Auto-Compliance Verifier (ACV)" and "Category Integrity Validator (CIV)" modules on the `security/page.tsx`.

## 🌌 Layer 5: AGI-Level Simulation & Prediction

This layer contains the most futuristic features, showcasing the platform's ability to simulate, predict, and narrate complex financial scenarios.

-   **Financial Parallel Universe Navigator (FPUN) / Causal Inference (CIES):** A sandbox where users can explore "what-if" scenarios.
    -   **Implementation:** The "Transaction 'What-If' Playground" on the `simulation-lab/page.tsx`, powered by the `generateCounterfactualExplanation.ts` flow.

-   **Autonomous Merchant Intelligence Fabric (AMIF) / Real-Time Concept Drift (RCDD):** A real-time, evolving "merchant brain" that tracks merchant identity and category drift.
    -   **Implementation:** The "Merchant Evolution Report" on the `analytics/page.tsx`, which tracks semantic drift using the `MerchantDriftChart`.

-   **Financial Cognitive Shadow System (FCSS) / Self-Evolving Categories (SECDS):** A shadow AI engine that predicts when the main classifier will fail *in the future* and suggests new categories.
    -   **Implementation:** The "Predictive Category Drift Oracle" on the `analytics/page.tsx` and the "Suggest Categories" feature on `taxonomy/page.tsx`, powered by `suggestTransactionCategories.ts`.

-   **Hyper-Contextual Transaction Rewriting (HTR) / Federated Learning Privacy Layer (FLPL):** Simulates transforming a transaction into a privacy-preserving "Semantic DNA" vector.
    -   **Implementation:** The "Hyper-Contextual Transaction Rewriting" module on `simulation-lab/page.tsx` and the "Behavioural Anonymizer" on `responsible-ai/page.tsx`, both powered by the `generateSemanticDNA` flow.

-   **Quantum-Inspired Uncertainty Quantification Engine (QIUQE):** Decomposes model uncertainty into its epistemic and aleatoric components.
    -   **Implementation:** `quantifyUncertainty.ts` flow, with results simulated in the "Human Trust Score" module in the `TransactionDetailSheet.tsx`.

-   **Neural Architecture Search (NAS-OM):** An automated system for model optimization.
    -   **Implementation:** The `model-hub/page.tsx` simulates this via its structure of Core Models, Fine-Tuning Adapters, and Distilled Models.
