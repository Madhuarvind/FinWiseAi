# FinWiseAI: Evaluation Dataset Documentation

**Version:** 1.0
**Date:** 24/07/2024

---

## 1. Overview

This document describes the dataset used for evaluating the FinWiseAI transaction categorization model. To ensure privacy, security, and reproducibility, the evaluation process relies exclusively on **synthetically generated data**. No real user data is used for benchmarking or testing.

The generation and evaluation pipeline is an integral part of the FinWiseAI application, making the entire process transparent and fully reproducible by the user.

---

## 2. Data Generation

-   **Source:** The dataset is generated on-demand using the **`synthesizeTransactions`** Genkit flow, which is implemented in `src/ai/flows/synthesize-transactions.ts`.
-   **Engine:** The flow utilizes the **Gemini** Large Language Model to create realistic but entirely fictional transaction descriptions and amounts for a given category.
-   **Process:**
    1.  The user selects a category (e.g., "Travel") and a number of transactions to generate via the "Data Ingestion" page.
    2.  The `synthesizeTransactions` flow is invoked with a prompt instructing the LLM to create diverse and plausible transaction data.
    3.  The LLM returns a structured JSON array of synthetic transactions.

---

## 3. Dataset Composition for Standard Evaluation

A standard evaluation run, as triggered from the "Model Evaluation Workbench" in the "Model Hub," uses the following parameters:

-   **Total Size:** 1,000 transactions.
-   **Composition:** 100 transactions are generated for each of the top 10 most common financial categories (e.g., Shopping, Food & Drink, Transport, etc.).
-   **Balance:** The dataset is perfectly balanced by category to ensure that metrics like Macro F1 Score are not skewed by class imbalance.

---

## 4. Preprocessing

Before being used for evaluation, all synthetic data is passed through the exact same preprocessing pipeline as live production data. This pipeline is defined in `src/lib/preprocessing.ts` and includes the following steps:

1.  **Enrichment:** Additional temporal features, such as `dayOfWeek` and `timeOfDay`, are added to each transaction to provide more context for the model.
2.  **Normalization (Simulated):** The pipeline includes functions for text normalization (lowercase, stopword removal, etc.), though this is often bypassed in the demo to maintain the readability of merchant names.

---

## 5. Reproducibility

The entire evaluation process is designed for end-to-end reproducibility directly within the application:

1.  **Navigate** to the **`Model Hub`** page.
2.  **Locate** the **"Model Evaluation Workbench"** card.
3.  **Click** the **"Run Evaluation"** button.

This action triggers the fresh generation of the 1,000-transaction dataset as described above and immediately runs the evaluation against it, displaying the results (F1 score, precision, recall, and confusion matrix) in the UI. This provides a live, verifiable, and consistent assessment of the model's current performance.
