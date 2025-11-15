
# FinWiseAI: Modules & Features Report

**Version:** 2.0
**Date:** 24/07/2024

---

This document provides a detailed overview of the advanced modules and unique features implemented within the FinWiseAI system. The architecture is designed as a multi-layered cognitive platform, moving beyond simple categorization into the realm of AGI-like financial intelligence.

## 🧠 Layer 1: Core AI Engine & Hybrid Pipeline

The foundation of FinWiseAI is a multi-stage, hybrid intelligence pipeline that ensures a balance of speed, cost, and accuracy.

-   **Confidence-Conditioned Pipeline (CCP):** Instead of treating all transactions equally, the system first uses a fast, simulated rule-based engine. If confidence is high (e.g., ≥ 95%), the transaction is categorized instantly. If confidence is low, it is automatically routed to a more powerful LLM for nuanced analysis. This is the core of the **Transaction Metacognition Engine (TME)**.
    -   **Implementation:** `categorizeTransactionWithLLM.ts` flow.

-   **LLM Re-Ranker:** For ambiguous cases, a sophisticated Large Language Model acts as a "reranker," choosing the most appropriate category from a list of candidates. This provides deep semantic understanding where rules fail.
    -   **Implementation:** `categorizeTransactionWithLLM.ts` flow.

-   **Autonomous AI Category Referee (AICR):** In complex scenarios, the system can simulate a "debate" between different AI models (e.g., a rule-based engine vs. an LLM). A third "judge" agent makes the final call, dramatically reducing errors in ambiguous cases. This is demonstrated in the **Transaction Governance Console**.
    -   **Implementation:** Simulated in `security/page.tsx`.

## 💖 Layer 2: Behavioral Intelligence & Hyper-Personalization

This layer focuses on understanding the *user* behind the data, transforming the dashboard into a proactive, intelligent financial co-pilot.

-   **Financial Consciousness Projection (FCP):** The AI projects the "consciousness state" of the user's financial behavior, detecting money anxiety, subconscious patterns, and the emotional burden behind purchases.
    -   **Implementation:** Displayed prominently on the `dashboard/page.tsx` as the user's current financial consciousness state (e.g., "Calm, Intentional").

-   **AI Transaction Archeology System (ATAS):** The AI digs through years of transactions to find "spending eras," "lifestyle epochs," and "financial extinction moments," providing a historical narrative of the user's financial journey.
    -   **Implementation:** The "Financial Epoch" summary on the `dashboard/page.tsx` (e.g., "Evolved from 'Saver' to 'Strategic Investor'").

-   **Financial Entropy Score (FES):** A physics-inspired metric that measures the level of chaos or structure in a user's financial life. Low entropy signifies discipline, while high entropy indicates randomness and risk.
    -   **Implementation:** Displayed as a key metric on the `dashboard/page.tsx`.

-   **Neuro-Financial Reflex System (NFRS):** The AI develops automated "reflex actions" to protect the user from harmful patterns. It detects triggers like late-night impulse shopping and can activate "Emotion-Safe Mode" as a cognitive repair strategy.
    -   **Implementation:** The NFRS card on `dashboard/page.tsx` which suggests preventative actions.

-   **Emotion-Time Fusion Engine (ETFE):** The AI fuses time, emotion, and habit cycles to predict a user's "emotional danger zones"—times and categories where impulsive behavior is most likely.
    -   **Implementation:** The ETFE card on `dashboard/page.tsx` showing "High Impulse Zones."

-   **Personal Finance Persona Engine (PFPE 2.0) / Cross-Persona Adaptive Categorisation (CPAC):** The system learns a user's financial "persona" across multiple dimensions (risk tolerance, impulse level) and adjusts categorization accordingly. The same transaction can be classified differently based on the user's active "brain" or "universe."
    -   **Implementation:** The "Spending Persona & Philosophy" module in `TransactionDetailSheet.tsx` and the "Universe Selector" on the dashboard.

## 🔍 Layer 3: Explainable AI (XAI) & Reality Reconstruction

The XAI suite, primarily located in the `TransactionDetailSheet`, provides unprecedented transparency into the AI's decision-making process for every single transaction.

-   **Gemini-Driven Money Memory Reconstruction (GMMR):** The system reconstructs the hidden reality behind a transaction—what the user was doing, why they spent, and what emotion triggered it.
    -   **Implementation:** The "Money Memory Reconstruction" module in `TransactionDetailSheet.tsx` which provides a narrative story (e.g., "This purchase was likely triggered by fatigue...").

-   **Transaction Emotional Temperature (TET) / Sentiment-Synchronized Categorisation (SSC):** Every transaction is assigned an emotional temperature score (e.g., 0.0 for rational, 1.0 for impulsive), making the categorization system emotion-aware.
    -   **Implementation:** The "Predicted Intent & Emotional Temperature" module in `TransactionDetailSheet.tsx`.

-   **Transaction Semantic Radiograph (TSR):** Visually highlights the specific words (tokens) in a transaction description that most influenced the AI's classification.
    -   **Implementation:** The "HighlightedDescription" component driven by the `getTokenAttributions.ts` flow.

-   **Transaction Counterfactual Simulator (TCS):** Shows what would happen if the user made a different financial choice, forecasting long-term impact on savings and goals.
    -   **Implementation:** The "Future Impact & Health" and "Counterfactual & Ethical Shadow" modules in `TransactionDetailSheet.tsx`.

-   **Ethical Micro-Advisor AI Swarm (EMA-Swarm) / Synthetic Future Spending Self (SFSS):** A council of small AI agents, each with a different moral viewpoint (Frugality, Health, Future Self), provide synthesized advice on each transaction.
    -   **Implementation:** The "EMA-Swarm" module in `TransactionDetailSheet.tsx`, which gives a consensus opinion from various AI personas.

-   **Spending Linguistics Interpreter (SLI):** The AI analyzes linguistic patterns in transaction descriptions to identify semantic clusters and emotional micro-patterns.
    -   **Implementation:** The "SLI" insight within the "Future Impact & Health" module in `TransactionDetailSheet.tsx`.

## 🛡️ Layer 4: Robustness, Security & Metacognition

This layer comprises the system's self-awareness, self-healing, and defense mechanisms. It's the AI's immune system and consciousness.

-   **Transaction Metacognition Engine (TME):** The overarching "brain" that thinks about its own thinking. It evaluates its confidence, identifies its weaknesses, and decides which tools to use (rules, LLM, etc.) for a given task. It's the core of the self-healing system.
    -   **Implementation:** The "Self-Healing Model Debugger" on the `analytics/page.tsx`, which displays the TME's internal metrics.

-   **Predictive Feedback Targeting (PFT):** Instead of asking for feedback randomly, the AI predicts which transactions are most valuable for user correction to improve the model's F1 score and learn about new merchants.
    -   **Implementation:** The "Flagged for Attention" alert in `TransactionDetailSheet.tsx`, which explains *why* the AI is asking for feedback.

-   **Robustness Contract Checker (RCC) / User-Trainable FinAI:** A "Teach Mode" where users can define robustness contracts in natural language (e.g., "Always classify Uber as Transport"). The AI converts these into deployable policies.
    -   **Implementation:** The "Policy OS" page at `policy-os/page.tsx`, powered by the `generatePolicyFromText.ts` flow.

-   **Adversarial Attack Simulator (AAS):** A "Red-Team" Gemini agent that actively tries to break the categorization model by generating adversarial transaction strings (obfuscated names, misleading keywords).
    -   **Implementation:** The "Adversarial Attack Simulator" module on the `security/page.tsx`.

-   **Dynamic Ethical Checkpoint Network (DECN):** An ethical audit is performed on every decision, checking for fairness, bias, and compliance before a category is finalized.
    -   **Implementation:** The "Fairness & Bias Report" and "Policy-Aware Category Planner" on the `responsible-ai/page.tsx`.

## 🌌 Layer 5: AGI-Level Simulation & Prediction

This layer contains the most futuristic features, showcasing the platform's ability to simulate, predict, and narrate complex financial scenarios.

-   **Financial Parallel Universe Navigator (FPUN) / Hyper-Contextual Transaction Rewriting (HTR):** A sandbox where users can explore "what-if" scenarios by changing spending habits and see the AI rewrite their financial future in real-time.
    -   **Implementation:** The "Financial Parallel Universe Navigator" on the `simulation-lab/page.tsx`.

-   **Autonomous Merchant Intelligence Fabric (AMIF):** A real-time, evolving "merchant brain" that tracks merchant identity, behavior, category drift, and sentiment, going far beyond standard MCC codes.
    -   **Implementation:** The "Merchant Evolution Report" on the `analytics/page.tsx`, which tracks semantic drift.

-   **Financial Cognitive Shadow System (FCSS) / Category Mutation Predictor (CMP):** A shadow AI engine that predicts when the main classifier will fail *in the future*. It identifies emerging categories and recommends new training strategies.
    -   **Implementation:** The "Predictive Category Drift Oracle" on the `analytics/page.tsx`, which forecasts category splits.

-   **Transaction Belief Network (TBN) / Category Quantum Probabilistic Reasoner (CQPR):** The system models uncertainty like a human brain, understanding beliefs, doubts, and missing signals. It's "aware" of why data might be unreliable. The **Spending Black Box Recorder (SBBR)** makes this tangible by simulating a **Zero Interpretation Loss Embedding (ZILE)**.
    -   **Implementation:** The "Spending Black Box Recorder" on the `simulation-lab/page.tsx`.
