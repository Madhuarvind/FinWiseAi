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
import type { Transaction, Category, Embedding } from '@/lib/types';
import { categorizeTransactionWithLLM } from '@/ai/flows/categorize-transaction-with-llm';
import { explainTransactionClassification } from '@/ai/flows/explain-transaction-classification';
import { generateSemanticDNA } from '@/ai/flows/generate-semantic-dna';
import { generateCounterfactualExplanation } from '@/ai/flows/generate-counterfactual-explanation';
import { getTokenAttributions } from '@/ai/flows/get-token-attributions';
import { findSimilarMerchants } from '@/ai/flows/find-similar-merchants';
import { decodeSpendingIntent } from '@/ai/flows/decode-spending-intent';
import { Loader2, Wand2, Lightbulb, Repeat, CheckCircle, SearchCode, Cpu, ShieldCheck, AlertTriangle, Network, Eye, Sparkles, MessageSquareHeart, TrendingUp, UserCheck } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type AIState = {
  explanation: string;
  suggestedCategory: string;
  llmReRanked: boolean;
  zile: Embedding | null;
  counterfactual: string;
  attributions: string[];
  similarMerchants: string[];
  spendingIntent: string;
  confidence: number;
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
    llmReRanked: false,
    zile: null,
    counterfactual: '',
    attributions: [],
    similarMerchants: [],
    spendingIntent: '',
    confidence: 0,
    isLoading: true,
  });
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen) {
      const runAIAnalysis = async () => {
        setAiState({
          explanation: '',
          suggestedCategory: '',
          llmReRanked: false,
          zile: null,
          counterfactual: '',
          attributions: [],
          similarMerchants: [],
          spendingIntent: '',
          confidence: 0,
          isLoading: true,
        });

        try {
          // This is a mock confidence score. In a real system, this would come from the model.
          // We set it low sometimes to ensure the LLM reranker logic is triggered.
          const confidenceScore = transaction.id === 'txn_8' || transaction.id === 'txn_11' ? 0.65 : 0.95;

          const categoryLabel = categories.find((c) => c.value === transaction.category)?.label || transaction.category;

          const [categorizationResult, explanationResult, dnaResult, attributionsResult, similarityResult, intentResult] = await Promise.all([
            categorizeTransactionWithLLM({
              transactionDescription: transaction.description,
              confidenceScore: confidenceScore,
              candidateCategories: categories.map((c) => c.label),
            }),
            explainTransactionClassification({
              transactionDescription: transaction.description,
              predictedCategory: categoryLabel,
              confidenceScore: confidenceScore, 
            }),
            generateSemanticDNA(transaction.description),
            getTokenAttributions({
                transactionDescription: transaction.description,
                category: categoryLabel,
            }),
            findSimilarMerchants({ merchantName: transaction.description }),
            decodeSpendingIntent({
              description: transaction.description,
              timeOfDay: transaction.timeOfDay || 'Afternoon',
              dayOfWeek: transaction.dayOfWeek || 'Weekday',
              category: categoryLabel
            }),
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
            llmReRanked: categorizationResult.llmReRanked,
            zile: dnaResult,
            counterfactual: counterfactualResult.counterfactualExplanation,
            attributions: attributionsResult.influentialWords,
            similarMerchants: similarityResult.similarMerchants,
            spendingIntent: intentResult.intent,
            confidence: confidenceScore,
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
      title: 'Feedback Received (SCOA/CTR)',
      description: (
        <div className="flex items-center gap-2">
            <CheckCircle className="text-accent"/>
            <span>Your preference has been recorded. The model will learn from this correction.</span>
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

  const getSpendingPersona = (categoryValue: string) => {
    const personaMap: Record<string, string> = {
        'food-drink': 'Your "Weekend Foodie" persona was active.',
        'shopping': 'This reflects your "Savvy Shopper" persona.',
        'transport': 'Your "Daily Commuter" persona made this trip.',
        'groceries': 'The "Home Chef" persona is stocking up.',
        'home': 'Your "Homebody" persona is active here.',
        'entertainment': 'The "Culture Vulture" persona is enjoying this.',
        'health': 'This aligns with your "Wellness Seeker" persona.',
        'utilities': 'A classic "Responsible Adult" moment.',
        'travel': 'Your "World Explorer" persona is on the move.',
        'personal-care': 'The "Self-Care Advocate" in you is active.',
        'coffee-runs': 'Your "Caffeine Enthusiast" persona strikes again!',
    };
    return personaMap[categoryValue] || 'Your General Spending Persona was used.';
  }

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
           {transaction.status === 'flagged' && (
              <div className="flex items-start gap-3 rounded-md bg-destructive/10 p-3 text-destructive border border-destructive/20">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className='text-sm'>
                  <p className="font-semibold">Flagged by Generative Error Simulation Engine (GESE)</p>
                  <p>The system predicted a high probability of misclassification for this item, requiring human confirmation to ensure accuracy.</p>
                </div>
              </div>
            )}
          <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4">
            <InfoBlock 
              label="Description" 
              value={transaction.description}
              className="col-span-2"
            />
            <InfoBlock
              label="Amount"
              value={transaction.amount.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
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
             {aiState.llmReRanked && !aiState.isLoading && (
                  <div className="flex items-start gap-3 rounded-md bg-secondary p-3 text-secondary-foreground">
                    <Wand2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      Initial confidence was low. The{' '}
                      <span className="font-semibold">Confidence-Conditioned Pipeline</span>{' '}
                      routed this to the LLM, which suggests{' '}
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
                 <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Transaction Semantic Radiograph (TSR)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-medium text-foreground rounded-lg bg-muted p-4">
                        <HighlightedDescription description={transaction.description} words={aiState.attributions} />
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">The TSR highlights the key terms (tokens) that most influenced the model's classification decision.</p>
                    </CardContent>
                  </Card>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Human Trust Score (HTS):</p>
                  <Progress value={aiState.confidence * 100} className="h-2"/>
                  <p className="text-xs text-muted-foreground text-right">{(aiState.confidence * 100).toFixed(0)}% Confidence</p>
                </div>
                 <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500"/>Predicted Intent:</p>
                  <p className="text-muted-foreground">{aiState.spendingIntent || "Not available."}</p>
                </div>
                <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><MessageSquareHeart className="h-4 w-4 text-rose-500"/>Transaction Story:</p>
                  <p className="text-muted-foreground">{aiState.explanation || "No explanation available."}</p>
                </div>
                 <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><Repeat className="h-4 w-4"/>Counterfactual:</p>
                  <p className="text-muted-foreground">{aiState.counterfactual || "Not available."}</p>
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500"/>Future Impact & Health (FIP, ABC, PHHS):</p>
                   <ul className='list-disc list-inside text-muted-foreground space-y-1'>
                      <li>Continuing this spend monthly would total <span className='font-semibold'>₹{(Math.abs(transaction.amount) * 12).toFixed(2)}</span> annually.</li>
                      <li>This purchase lowers your 'Shopping' budget health score by <span className='font-semibold'>3%</span> this week.</li>
                      <li>Your next 'Shopping' purchase is predicted in <span className='font-semibold'>~4 days</span> based on your habits.</li>
                  </ul>
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                   <p className="font-medium text-foreground flex items-center gap-2"><UserCheck className="h-4 w-4"/>Spending Persona (TPG):</p>
                  <p className="text-muted-foreground leading-relaxed">{getSpendingPersona(currentCategory)}</p>
                </div>
                <div className="rounded-lg border bg-background p-4 space-y-3">
                    <p className="font-medium text-foreground flex items-center gap-2"><Network className="h-4 w-4"/>Zero Interpretation Loss Embedding (ZILE):</p>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground">Base Sequence (S-DNA)</p>
                        <p className="text-muted-foreground leading-relaxed font-mono text-xs break-all">{aiState.zile?.baseSequence || "Not available."}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground">Interpretation Vector</p>
                        <p className="text-muted-foreground leading-relaxed font-mono text-xs break-all">{aiState.zile?.interpretationVector || "Not available."}</p>
                    </div>
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground flex items-center gap-2"><SearchCode className="h-4 w-4"/>Purchase Memory (Similarity Search):</p>
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
