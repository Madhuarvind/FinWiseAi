# **App Name**: FinWiseAI

## Core Features:

- Transaction Classification: Categorize financial transactions using a hybrid AI architecture combining rule-based systems, deep learning, and LLMs.
- Rule-Augmented Semantic Layer: Utilize fuzzy-matching and merchant ontology to categorize high-confidence transactions quickly.
- Neural Ensemble Classifier: Employ a fine-tuned Sentence-Transformer with an XGBoost + MLP ensemble for accurate classification, enhanced with contrastive learning and data augmentation.
- Adaptive LLM Reranker: Use an LLM-based tool for refining predictions on ambiguous or rare transactions to enhance overall accuracy.
- Explainability Interface: Integrate SHAP, token-level attributions, and counterfactual reasoning to explain the rationale behind each classification.
- Dynamic Taxonomy Management: Provide an interface for administrators to modify transaction categories and rules without code changes.
- Bias Mitigation Pipeline: Implement per-merchant fairness auditing and region-balanced sampling to reduce bias in transaction categorization.

## Style Guidelines:

- Primary color: Deep teal (#008080) for a sense of financial stability and trustworthiness.
- Background color: Light teal (#E0F8F7), subtly desaturated, for a clean and professional look.
- Accent color: Soft green (#8FBC8F), analogous to teal, to highlight key actions and success indicators.
- Headline font: 'Space Grotesk' sans-serif for a modern and slightly technical feel, reflecting the AI-driven approach.
- Body font: 'Inter' sans-serif for readability and a neutral, clean appearance in reports and explanations.
- Use crisp, minimalist icons to represent transaction categories and AI functionalities, ensuring clarity and ease of use.
- Employ a clean, data-centric layout that emphasizes transaction data and explanations, ensuring that users can easily interpret results.