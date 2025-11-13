
# FinWiseAI: Technical Design Document

**Version:** 1.0
**Date:** 24/07/2024
**Project:** FinWiseAI — Hybrid, Explainable, and Autonomous Financial Transaction Categorisation System

---

## 1. Technology Stack

FinWiseAI is built on a modern, scalable, and type-safe technology stack, prioritizing developer experience and performance.

-   **Frontend Framework:** **Next.js 15** (with App Router)
-   **Language:** **TypeScript**
-   **UI Library:** **React 18**
-   **UI Components:** **ShadCN UI** - A collection of reusable components built on Radix UI and Tailwind CSS.
-   **Styling:** **Tailwind CSS** with a custom theme defined in `src/app/globals.css`.
-   **Generative AI Framework:** **Genkit** - Used for defining, running, and managing all LLM-based flows.
-   **AI Model Provider:** **Google AI (Gemini)** via `@genkit-ai/google-genai`.
-   **Backend-as-a-Service (BaaS):** **Firebase**
    -   **Database:** **Firestore** (NoSQL, real-time) for all application data.
    -   **Authentication:** **Firebase Authentication** for user management (Email/Password).
-   **Form Management:** **React Hook Form** for performance and validation.
-   **Schema Validation:** **Zod** for both client-side form validation and AI flow input/output validation.
-   **Icons:** **Lucide React** for a consistent and lightweight icon set.
-   **Data Visualization:** **Recharts** for charts and graphs on the analytics dashboard.

---

## 2. System Architecture

The system is designed as a hybrid client-server application, leveraging the strengths of serverless functions for AI processing and a real-time database for a responsive user experience.

### 2.1. Frontend Architecture (Next.js App Router)

-   The application uses the Next.js App Router, with distinct layouts for authenticated (`/app/(app)`) and unauthenticated (`/`, `/login`, `/register`) users.
-   Most components are **Client Components (`'use client'`)** to facilitate interaction with Firebase services (Firestore, Auth) and user-driven events.
-   A central `FirebaseProvider` manages the lifecycle of Firebase services and user authentication state, making them accessible throughout the component tree via custom hooks (`useUser`, `useFirestore`, `useAuth`).

### 2.2. Backend Architecture (Firebase & Genkit)

-   **Database & Auth:** Firebase provides the entire backend infrastructure for data storage and user management. All data reads and writes occur directly from the client to Firestore, secured by **Firestore Security Rules**.
-   **AI Logic:** Genkit flows are defined as **Server Actions (`'use server'`)**. These server-side functions encapsulate all interactions with the Gemini LLM. Client components invoke these flows as if they were local asynchronous functions, and Next.js handles the secure communication.

### 2.3. Hybrid AI Architecture

The core of FinWiseAI is its multi-stage classification pipeline, designed for a balance of speed, cost, and accuracy.

1.  **Stage 1: Client-Side Heuristics (Confidence Simulation):**
    -   A confidence score is simulated on the client (e.g., in `TransactionDetailSheet`). In a production environment, this would represent a fast, rule-based system.
    -   If confidence is high (e.g., ≥ 0.95), the system uses the top candidate category.

2.  **Stage 2: Adaptive LLM Reranker:**
    -   For low-confidence transactions, the client invokes the `categorizeTransactionWithLLMFlow`.
    -   This Genkit flow uses the Gemini model to analyze the transaction and select the best category from a list of candidates, acting as a powerful, nuanced reranker for ambiguous cases.

3.  **Stage 3: Parallel XAI & Enrichment Flows:**
    -   Once a classification is determined, the client triggers a suite of parallel Genkit flows to generate explainability and enrichment data. This includes:
        -   `explainTransactionClassification`: Creates a human-like story.
        -   `generateSemanticDNA`: Generates the embedding "fingerprint."
        -   `getTokenAttributions`: Identifies influential keywords.
        -   `generateCounterfactualExplanation`: Determines what would need to change for a different outcome.

This architecture ensures that simple transactions are handled instantly, while complex ones receive deep AI analysis without blocking the user interface.

---

## 3. Data Model and Storage

All application data is stored in **Firestore**. The data structure is defined in `docs/backend.json` and enforced by Firestore Security Rules.

### 3.1. Firestore Collections

-   `/users/{userId}`
    -   **Schema:** `UserProfile`
    -   **Description:** Stores user profile information. The document ID is the user's Firebase Auth UID. Access is restricted to the owning user.

-   `/users/{userId}/transactions/{transactionId}`
    -   **Schema:** `Transaction`
    -   **Description:** Stores all financial transactions for a specific user. This is a sub-collection of the user's document, ensuring strict data ownership via path-based security rules.

-   `/categories/{categoryId}`
    -   **Schema:** `Category`
    -   **Description:** A global collection storing all available transaction categories, their icons, and associated metadata (like "universes"). All authenticated users can read this collection.

### 3.2. Core Data Models (`src/lib/types.ts`)

-   **`Transaction`**: Represents a single financial transaction. Includes fields for `description`, `amount`, `date`, `status`, and `multiCategory`, which stores different classifications for each "universe."
-   **`Category`**: Defines a transaction category, including its `id`, `label`, `icon`, `moodColor`, and the `universes` it belongs to.
-   **`Trip`**: A data model for grouping travel-related expenses, laying the groundwork for advanced travel finance management.

---

## 4. AI/ML/Automation Components

The intelligence of FinWiseAI is distributed across several specialized Genkit flows.

-   **`categorizeTransactionWithLLM`**: The core re-ranking engine for low-confidence transactions.
-   **`explainTransactionClassification`**: Generates a human-like narrative for a transaction (The "Transaction Story").
-   **`suggestTransactionCategories`**: Analyzes transaction descriptions to suggest new, relevant categories for the taxonomy.
-   **`synthesizeTransactions`**: Generates realistic, synthetic transaction data for a given category, useful for bootstrapping and model training.
-   **`reconstructTransactionFromText`**: Parses unstructured text (e.g., an email receipt) to extract structured transaction data.
-   **`generateSemanticDNA`**: Simulates the creation of a "Zero Interpretation Loss Embedding" (ZILE) by producing a "Semantic DNA" vector for a transaction.
-   **`getTokenAttributions`**: Implements token-level XAI by identifying the specific words in a description that were most influential for a classification decision.
-   **`generateCounterfactualExplanation`**: Provides "what-if" analysis by explaining what would need to change for a transaction to be classified differently.
-   **`findSimilarMerchants`**: Simulates a semantic search for merchants, used for automated rule generation.
-   **`decodeSpendingIntent`**: Infers the likely psychological intent behind a purchase based on contextual clues.

---

## 5. Security and Compliance

Security and responsibility are designed into the core of the application.

-   **Authentication:** Handled by **Firebase Authentication**. User sessions are managed automatically and securely.
-   **Authorization:** Enforced by **Firestore Security Rules** (`firestore.rules`). The rules implement a strict user-ownership model: users can only read/write their own data (`/users/{userId}`).
-   **Data Privacy:**
    -   The **Behavioural Anonymizer (BA)** simulation demonstrates how user-specific patterns can be transformed into anonymous "Semantic DNA" vectors, enabling privacy-preserving analytics.
    -   The architecture avoids storing sensitive PII wherever possible, relying on Firebase Auth UIDs as the primary identifier.
-   **Adversarial Defense:**
    -   The **Adversarial Intent Filter (AIF)** simulation shows how the AI can detect and analyze malicious or ambiguous transaction strings designed to evade categorization.
-   **Compliance:**
    -   The **Policy-Aware Category Planner (PACP)** and **Auto-Compliance Verifier (ACV)** modules simulate a compliance layer that can flag transactions related to sensitive categories (e.g., AML/KYC heuristics), ensuring outputs adhere to regulatory policies.

---

## 6. Scalability and Performance

The system is architected for high scalability and real-time performance.

-   **Scalability:**
    -   **Firestore** is a massively scalable NoSQL database capable of handling millions of concurrent users.
    -   **Firebase Authentication** is a managed service that scales automatically.
    -   **Genkit flows**, running as serverless functions, can scale on demand to handle fluctuating AI inference workloads.
-   **Performance:**
    -   **Real-Time Database:** Firestore's real-time capabilities mean that UI updates happen instantly as data changes in the backend, without needing manual polling.
    -   **Client-Side Caching:** The `useCollection` and `useDoc` hooks maintain a local cache of data, making the UI feel fast and responsive.
    -   **Hybrid AI for Latency:** The two-stage AI architecture ensures low latency. The majority of transactions are handled by a fast, (simulated) rule-based engine, while only the most complex cases incur the latency of an LLM call.
    -   **Optimistic UI Updates:** New data (e.g., from synthetic generation) is added to the local state immediately for a responsive feel, while the batch write to Firestore happens in the background.
    -   **Code Splitting:** Next.js automatically splits code by route, so users only download the JavaScript needed for the page they are viewing.
