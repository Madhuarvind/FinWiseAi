# 🧠 FinWiseAI: A New Era of Financial Intelligence

**FinWiseAI** is a next-generation financial application that redefines transaction management. Moving far beyond simple categorization, it functions as a multi-layered cognitive platform, providing users with deep, explainable, and hyper-personalized insights into their financial lives.

Built with a state-of-the-art tech stack including **Next.js**, **Firebase**, and **Google's Gemini AI via Genkit**, FinWiseAI transforms a standard transaction list into a dynamic, intelligent financial co-pilot, ready for the **GHCI 2025 Hackathon**.

---

## ✨ Core Features & Innovations

The system's architecture is a multi-layered cognitive framework designed to deliver an end-to-end, reproducible, and transparent AI pipeline.

### 🧠 Tier 1: Core Intelligence Systems
- **Hybrid AI Pipeline (TME):** A "Transaction Metacognition Engine" that dynamically chooses between a fast, local classifier for simple transactions and a powerful Gemini LLM re-ranker for ambiguous ones, optimizing for speed, cost, and accuracy.
- **Self-Evolving Category Discovery (SECDS):** Autonomously discovers and suggests new spending categories from transaction data, allowing the user's financial taxonomy to evolve.
- **Automated Rule Generation (ARG):** AI-powered system that analyzes transaction patterns within a category to suggest fuzzy-matching keyword rules, automating the process of making categories more accurate.
- **Neural Architecture Search (NAS-OM):** A simulated model factory for discovering and optimizing model architectures based on user-defined goals like latency or accuracy.

### 💖 Tier 2: Behavioral & Health Intelligence
- **Behavioral Intelligence Engine:** A suite of features including a **Financial Entropy Score (FES)** to measure spending chaos, a **Neuro-Financial Reflex System (NFRS)** to suggest "cognitive repairs" for impulse buys, and an **Emotion-Time Fusion Engine (ETFE)** to identify emotional spending danger zones.
- **Health & Medical Analytics:** A specialized module that includes a **Health Risk Score Engine (HSRE)** to analyze health-related spending and a **Medical Expense Forecaster (MEF)** to predict future medical costs and suggest savings.

### 🔍 Tier 3: Explainable & Predictive AI (XAI)
- **Explainable AI Narrative Generator (GMMR):** Generates human-like stories to explain the "why" behind every transaction classification, reconstructing the "money memory."
- **Feature Attribution Visualizer (TSR):** The "Transaction Semantic Radiograph" visually highlights the specific words that most influenced the AI's decision.
- **Causal Inference Engine (CIES):** A "What-If" playground that allows users to explore alternate financial universes by simulating different spending choices.
- **Privacy-Preserving Semantic DNA (ZILE):** Simulates the transformation of a transaction into a rich, anonymous "Zero Interpretation Loss Embedding" for advanced analytics without exposing raw data.

### 🛡️ Tier 4: Robustness & Governance
- **Policy-Driven Categorization OS (PD-COS):** A "Teach Mode" where users can write rules in plain English, which are then converted by AI into machine-readable policies that govern the classification engine.
- **Adversarial Robustness Testing (AAS):** A "Red-Team" AI agent generates adversarial examples to constantly test and improve model resilience.
- **Model Evaluation Workbench:** An in-app tool to run evaluations, view performance metrics (F1, Precision, Recall), and analyze a confusion matrix, with AI-driven recommendations for improvement.

---

## 🛠️ Technology Stack

- **Framework:** **Next.js 15** (App Router)
- **Language:** **TypeScript**
- **UI:** **React 18** with **ShadCN UI** components
- **Styling:** **Tailwind CSS**
- **Generative AI:** **Genkit** with **Google AI (Gemini)**
- **Backend & Database:** **Firebase** (Firestore, Firebase Authentication)
- **Schema Validation:** **Zod**
- **Icons:** **Lucide React**
- **Data Visualization:** **Recharts**

---

## ⚡ Performance Benchmarks

The following benchmarks are based on simulated tests running in a cloud development environment.

| Metric | Value | Notes |
| :--- | :--- | :--- |
| **Fast Path Latency** | **~45ms** | For high-confidence transactions using the simulated local classifier (LLM-free). |
| **LLM Path Latency** | **~750ms** | For low-confidence transactions routed to the Gemini LLM re-ranker. |
| **Avg. Throughput**| **~120 trans/sec** | Calculated based on a 90/10 split between fast-path and LLM-path. |
| **Avg. Token Usage**| **~35 tokens/txn** | Average across the entire pipeline, including XAI enrichment flows. |

---

## 🚀 Getting Started

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd FinWiseAI
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the application in development mode, use the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.
