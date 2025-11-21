# FinWiseAI: AI Pipeline Demo Script (2-3 Minutes)

**Objective:** This script provides a focused, step-by-step walkthrough of the core AI data processing pipeline in action.

---

### Step 1: Ingesting New Data (0:00 - 0:30)

**(Screen: `/data-ingestion`)**

**Script:** "Let's start by adding some new transactions to see the AI pipeline at work. We'll use the 'Synthetic Data Generation' feature to create a few realistic but fictional transactions."

1.  **Select Category:** Choose 'Shopping' from the dropdown.
2.  **Set Number:** Enter '2'.
3.  **Click:** "Generate Transactions".

**Script:** "As you can see, two new transactions for 'Shopping' have appeared in our history. Now, let's see how the AI handles them. One is a straightforward purchase, and one is more ambiguous."

**(Action: For the demo, mentally designate one synthetic transaction as 'easy' and one as 'hard'. E.g., 'Nike Store' vs. 'Marketplace Purchase'.)**

---

### Step 2: The "Fast Path" - High-Confidence Classification (0:30 - 1:00)

**(Screen: Navigate to `/dashboard`, find the 'easy' transaction, e.g., 'Nike Store'.)**

**Script:** "First, let's look at the 'Nike Store' transaction. This is an easy one for our AI."

1.  **Click:** On the 'Nike Store' transaction to open the `TransactionDetailSheet`.

**Script:** "Notice two things. First, the category is correctly set to 'Shopping'. Second, there's no special message from the AI. This is our 'fast path' in action."

"The system's initial, lightweight classifier was over 95% confident, so it categorized it instantly without needing the expensive LLM. It was fast, cheap, and accurate. Now for the interesting part."

---

### Step 3: The "Slow Path" - LLM Re-Ranker for Ambiguity (1:00 - 1:45)

**(Screen: Close the sheet, find the 'hard' transaction, e.g., 'Marketplace Purchase'.)**

**Script:** "Now let's examine the 'Marketplace Purchase' transaction. This one is more ambiguous."

1.  **Click:** On the 'Marketplace Purchase' transaction to open the detail sheet.

**Script:** "This time, you see a message from the AI. The initial classifier wasn't confident, so our **Transaction Metacognition Engine** automatically routed this to our powerful Gemini LLM to re-rank the possibilities."

"The LLM analyzed the description and determined 'Shopping' was the most logical fit. This is our 'slow path'—it's more expensive, but it ensures high accuracy for the tricky cases where rules fail. This hybrid approach is key to how we maintain both performance and accuracy."

---

### Step 4: The XAI Deep Dive - Explaining the "Why" (1:45 - 2:30)

**(Screen: Stay in the `TransactionDetailSheet` for 'Marketplace Purchase'.)**

**Script:** "But we don't just give you an answer; we explain it. This is the **Explainable AI** analysis."

1.  **Point to TSR:** "The **Transaction Semantic Radiograph** highlights the exact words—'Marketplace'—that influenced the AI's decision."
2.  **Point to HTS:** "The **Human Trust Score** shows the AI's final confidence in its own prediction."
3.  **Point to GMMR:** "The **Money Memory Reconstruction** gives us a human-like story, explaining the likely context behind the purchase."
4.  **Point to Counterfactual:** "And the **Counterfactual Simulator** even tells us what would need to change—like adding the term 'services'—for it to be classified differently."

**Script:** "So we’ve seen high-confidence instant classification, low-confidence LLM reranking, and full explainability — all without relying on any third-party transaction categorization APIs. This entire suite of insights is generated in parallel to give the user complete transparency and build trust, transforming a simple category label into a rich, understandable financial story. Thank you."
