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
import { Loader2, Wand2, Lightbulb, Fingerprint } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type AIState = {
  explanation: string;
  suggestedCategory: string;
  llmReranked: boolean;
  semanticFingerprint: string;
  isLoading: boolean;
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
          isLoading: true,
        });

        try {
          const [categorizationResult, explanationResult, fingerprintResult] = await Promise.all([
            categorizeTransactionWithLLM({
              transactionDescription: transaction.description,
              confidenceScore: 0.5, // Mock confidence score to trigger LLM
              candidateCategories: categories.map((c) => c.label),
            }),
            explainTransactionClassification({
              transactionDescription: transaction.description,
              predictedCategory:
                categories.find((c) => c.value === transaction.category)
                  ?.label || transaction.category,
              confidenceScore: 0.85, // Mock confidence
            }),
            generateSemanticFingerprint(transaction.description)
          ]);

          setAiState({
            explanation: explanationResult.explanation,
            suggestedCategory:
              categories.find(
                (c) => c.label === categorizationResult.category
              )?.value || transaction.category,
            llmReranked: categorizationResult.llmReRanked,
            semanticFingerprint: fingerprintResult.semanticFingerprint,
            isLoading: false,
          });
          setCurrentCategory(
            categories.find((c) => c.label === categorizationResult.category)
              ?.value || transaction.category
          );
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
      title: 'Transaction Updated',
      description: `Categorized as ${
        categories.find((c) => c.value === currentCategory)?.label
      }.`,
    });
  };

  const InfoBlock = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            Review and re-categorize with AI-powered assistance.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4">
            <InfoBlock label="Description" value={transaction.description} />
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
            <InfoBlock label="Status" value={transaction.status} />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              Categorization
            </h3>
            <div className="space-y-2">
              <Label htmlFor="category-select">Select Category</Label>
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
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Lightbulb className="text-primary" /> AI Analysis
            </h3>
            {aiState.isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                {aiState.llmReranked && (
                  <div className="flex items-center gap-2 rounded-md bg-secondary p-3 text-secondary-foreground">
                    <Wand2 className="h-5 w-5" />
                    <p>
                      Our LLM re-ranked this and suggests{' '}
                      <span className="font-semibold">
                        {
                          categories.find(
                            (c) => c.value === aiState.suggestedCategory
                          )?.label
                        }
                      </span>
                      .
                    </p>
                  </div>
                )}
                <div className="rounded-lg border bg-background p-4 leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Explanation:</p>
                  {aiState.explanation || "No explanation available."}
                </div>
                <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground flex items-center gap-2"><Fingerprint className="h-4 w-4"/>Semantic Fingerprint:</p>
                  <p className="text-muted-foreground leading-relaxed font-mono text-xs">{aiState.semanticFingerprint || "Not available."}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <SheetFooter className="mt-auto pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={aiState.isLoading}>
            {aiState.isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Confirm
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
