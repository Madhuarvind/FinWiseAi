'use client';
import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Transaction, Category } from '@/lib/types';
import { categorizeTransactionWithLLM } from '@/ai/flows/categorize-transaction-with-llm';
import { explainTransactionClassification } from '@/ai/flows/explain-transaction-classification';
import { generateSemanticFingerprint } from '@/ai/flows/generate-semantic-fingerprint';
import { generateCounterfactualExplanation } from '@/ai/flows/generate-counterfactual-explanation';
import { getTokenAttributions } from '@/ai/flows/get-token-attributions';
import { findSimilarMerchants } from '@/ai/flows/find-similar-merchants';
import { Loader2, Wand2, Lightbulb, Fingerprint, Repeat, CheckCircle, SearchCode } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

type AIState = {
  explanation: string;
  suggestedCategory: string;
  llmReranked: boolean;
  semanticFingerprint: string;
  counterfactual: string;
  attributions: string[];
  similarMerchants: string[];
  isLoading: boolean;
};

const HighlightedDescription = ({ description, words }: { description: string; words: string[] }) => {
  if (words.length === 0) {
    return <span>{description}</span>;
  }
  const regex = new RegExp(`(${words.join('|')})`, 'gi');
  const parts = description.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        words.some(w => w.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="bg-primary/20 text-primary-foreground rounded-sm px-1 py-0.5">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};


export function TransactionDetailSheet({
  isOpen,
  setIsOpen,
  transaction,
  categories,
  onUpdate,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  categories: Category[];
  onUpdate: (transaction: Transaction) => void;
}) {
  const [currentCategory, setCurrentCategory] = React.useState(
    transaction.category
  );
  const [aiState, setAiState] = React.useState<AIState>({
    explanation: '',
    suggestedCategory: '',
    llmReranked: false,
    semanticFingerprint: '',
    counterfactual: '',
    attributions: [],
    similarMerchants: [],
    isLoading: true,
  });
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      const runAIAnalysis = async () => {
        setAiState({
          explanation: '',
          suggestedCategory: '',
          llmReranked: false,
          semanticFingerprint: '',
          counterfactual: '',
          attributions: [],
          similarMerchants: [],
          isLoading: true,
        });

        try {
          const confidenceScore = 0.5; // Simulate a low confidence score to trigger the LLM reranker

          const [categorizationResult, explanationResult, fingerprintResult, attributionsResult, similarityResult] = await Promise.all([
            categorizeTransactionWithLLM({
              transactionDescription: transaction.description,
              confidenceScore: confidenceScore,
              candidateCategories: categories.map((c) => c.label),
            }),
            explainTransactionClassification({
              transactionDescription: transaction.description,
              predictedCategory:
                categories.find((c) => c.value === transaction.category)
                  ?.label || transaction.category,
              confidenceScore: 0.85, // Mock confidence for explanation
            }),
            generateSemanticFingerprint(transaction.description),
            getTokenAttributions({
                transactionDescription: transaction.description,
                category: categories.find((c) => c.value === transaction.category)?.label || transaction.category,
            }),
            findSimilarMerchants({ merchantName: transaction.description }),
          ]);
          
          const suggestedCategoryValue = categories.find(c => c.label === categorizationResult.category)?.value || transaction.category;
          
          const plausibleAlternative = categories.find(c => c.value !== suggestedCategoryValue)?.label || 'Shopping';

          const counterfactualResult = await generateCounterfactualExplanation({
            transactionDescription: transaction.description,
            originalCategory: categorizationResult.category,
            targetCategory: plausibleAlternative,
          });

          setAiState({
            explanation: explanationResult.explanation,
            suggestedCategory: suggestedCategoryValue,
            llmReranked: categorizationResult.llmReRanked,
            semanticFingerprint: fingerprintResult.semanticFingerprint,
            counterfactual: counterfactualResult.counterfactualExplanation,
            attributions: attributionsResult.influentialWords,
            similarMerchants: similarityResult.similarMerchants,
            isLoading: false,
          });

          // Automatically set the category to the one suggested by the AI
          setCurrentCategory(suggestedCategoryValue);

        } catch (error) {
          console.error('AI analysis failed:', error);
          setAiState((s) => ({ ...s, isLoading: false }));
          toast({
            variant: 'destructive',
            title: 'AI Analysis Failed',
            description: 'Could not get insights for this transaction.',
          });
        }
      };

      runAIAnalysis();
    }
  }, [isOpen, transaction, categories, toast]);

  const handleConfirm = () => {
    onUpdate({ ...transaction, category: currentCategory, status: 'reviewed' });
    setIsOpen(false);
    toast({
      title: 'Feedback Submitted',
      description: (
        <div className="flex items-center gap-2">
            <CheckCircle className="text-accent"/>
            <span>Transaction marked as <strong>{categories.find((c) => c.value === currentCategory)?.label}</strong>.</span>
        </div>
      ),
    });
  };

  const InfoBlock = ({
    label,
    value,
    className
  }: {
    label: string;
    value: React.ReactNode;
    className?: string;
  }) => (
    <div className={className}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Transaction Details &amp; XAI</SheetTitle>
          <SheetDescription>
            Review, re-categorize, and understand the AI's reasoning.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4">
            <InfoBlock 
              label="Description" 
              value={<HighlightedDescription description={transaction.description} words={aiState.isLoading ? [] : aiState.attributions} />}
              className="col-span-2"
            />
            <InfoBlock
              label="Amount"
              value={transaction.amount.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
            />
            <InfoBlock
              label="Date"
              value={new Date(transaction.date).toLocaleDateString()}
            />
             <InfoBlock label="Status" value={<Badge
                variant={
                    transaction.status === 'reviewed'
                    ? 'secondary'
                    : transaction.status === 'pending'
                    ? 'outline'
                    : 'destructive'
                }
                className="capitalize"
                >
                {transaction.status}
                </Badge>} />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              Human-in-the-Loop: Review & Correct
            </h3>
            <div className="space-y-2">
              <Label htmlFor="category-select">Verify Category</Label>
              <Select
                value={currentCategory}
                onValueChange={setCurrentCategory}
                disabled={aiState.isLoading}
              >
                <SelectTrigger id="category-select">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
             {aiState.llmReranked && !aiState.isLoading && (
                  <div className="flex items-start gap-3 rounded-md bg-secondary p-3 text-secondary-foreground">
                    <Wand2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Our LLM re-ranked this and suggests{' '}
                      <span className="font-semibold">
                        {
                          categories.find(
                            (c) => c.value === aiState.suggestedCategory
                          )?.label
                        }
                      </span>
                      . The category has been pre-selected for you.
                    </p>
                  </div>
                )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="text-primary" /> Explainable AI (XAI) Analysis
            </h3>
            {aiState.isLoading ? (
              <div className="space-y-4 pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                
                <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2">Classification Rationale:</p>
                  <p className="text-muted-foreground">{aiState.explanation || "No explanation available."}</p>
                </div>
                 <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><Repeat className="h-4 w-4"/>Counterfactual:</p>
                  <p className="text-muted-foreground">{aiState.counterfactual || "Not available."}</p>
                </div>
                <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground flex items-center gap-2"><Fingerprint className="h-4 w-4"/>Semantic Fingerprint:</p>
                  <p className="text-muted-foreground leading-relaxed font-mono text-xs">{aiState.semanticFingerprint || "Not available."}</p>
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground flex items-center gap-2"><SearchCode className="h-4 w-4"/>Semantic Similarity (Dense Retrieval):</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {aiState.similarMerchants.map((merchant) => (
                        <Badge key={merchant} variant="outline" className="font-mono text-xs">{merchant}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <SheetFooter className="mt-auto pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={aiState.isLoading}>
            {aiState.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Confirm & Submit Feedback
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
