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
import type { Transaction, Category, Embedding, Universe } from '@/lib/types';
import { categorizeTransactionWithLLM } from '@/ai/flows/categorize-transaction-with-llm';
import { explainTransactionClassification } from '@/ai/flows/explain-transaction-classification';
import { generateSemanticDNA } from '@/ai/flows/generate-semantic-dna';
import { generateCounterfactualExplanation } from '@/ai/flows/generate-counterfactual-explanation';
import { getTokenAttributions } from '@/ai/flows/get-token-attributions';
import { findSimilarMerchants } from '@/ai/flows/find-similar-merchants';
import { decodeSpendingIntent } from '@/ai/flows/decode-spending-intent';
import { Loader2, Wand2, Lightbulb, Repeat, CheckCircle, SearchCode, Cpu, ShieldCheck, AlertTriangle, Network, Eye, Sparkles, MessageSquareHeart, TrendingUp, UserCheck, Bot, Target, Gem, Receipt } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type AIState = {
  explanation: string | null;
  suggestedCategory: string | null;
  llmReRanked: boolean | null;
  zile: Embedding | null;
  counterfactual: string | null;
  attributions: string[] | null;
  similarMerchants: string[] | null;
  spendingIntent: string | null;
  confidence: number | null;
  isLoading: boolean;
};

const HighlightedDescription = ({ description, words }: { description: string; words: string[] | null }) => {
  if (!words || words.length === 0) {
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
  activeUniverse
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  categories: Category[];
  onUpdate: (transactionId: string, updates: Partial<Transaction>) => void;
  activeUniverse: Universe['id'];
}) {
  const [currentCategory, setCurrentCategory] = React.useState(
    transaction.category
  );
  const [aiState, setAiState] = React.useState<AIState>({
    explanation: null,
    suggestedCategory: null,
    llmReRanked: null,
    zile: null,
    counterfactual: null,
    attributions: null,
    similarMerchants: null,
    spendingIntent: null,
    confidence: null,
    isLoading: true,
  });
  const { toast } = useToast();

  React.useEffect(() => {
    if (isOpen && transaction) {
      setCurrentCategory(transaction.multiCategory?.[activeUniverse] || transaction.category);
      
      const runAIAnalysis = async () => {
        // Reset state for new transaction
        setAiState({
          explanation: null, suggestedCategory: null, llmReRanked: null, zile: null,
          counterfactual: null, attributions: null, similarMerchants: null,
          spendingIntent: null, confidence: null, isLoading: true
        });

        try {
          // STEP 1: Get the most important info first - the category
          const confidenceScore = transaction.id === 'txn_8' || transaction.id === 'txn_11' ? 0.65 : 0.95;
          const categorizationResult = await categorizeTransactionWithLLM({
            transactionDescription: transaction.description,
            confidenceScore: confidenceScore,
            candidateCategories: categories.map((c) => c.label),
          });
          
          const suggestedCategoryId = categories.find(c => c.label === categorizationResult.category)?.id || transaction.category;
          setCurrentCategory(suggestedCategoryId);
          setAiState(prev => ({
            ...prev,
            suggestedCategory: suggestedCategoryId,
            llmReRanked: categorizationResult.llmReRanked,
            confidence: confidenceScore,
            isLoading: false, // Stop initial loading, show primary results
          }));

          // STEP 2: Run all other independent analyses in parallel for secondary info
          const categoryLabel = categories.find((c) => c.id === suggestedCategoryId)?.label || suggestedCategoryId;

          const secondaryAnalyses = Promise.all([
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

          // STEP 3: Run dependent analysis (counterfactual) after categorization is done
          const plausibleAlternative = categories.find(c => c.id !== suggestedCategoryId)?.label || 'Shopping';
          const counterfactualPromise = generateCounterfactualExplanation({
            transactionDescription: transaction.description,
            originalCategory: categorizationResult.category,
            targetCategory: plausibleAlternative,
          });

          // Await and update state as secondary results come in
          const [explanationResult, dnaResult, attributionsResult, similarityResult, intentResult] = await secondaryAnalyses;
          setAiState(prev => ({
            ...prev,
            explanation: explanationResult.explanation,
            zile: dnaResult,
            attributions: attributionsResult.influentialWords,
            similarMerchants: similarityResult.similarMerchants,
            spendingIntent: intentResult.intent,
          }));

          const counterfactualResult = await counterfactualPromise;
          setAiState(prev => ({...prev, counterfactual: counterfactualResult.counterfactualExplanation }));

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
  }, [isOpen, transaction, categories, toast, activeUniverse]);

  const handleConfirm = () => {
    const updates: Partial<Transaction> = {
      status: 'reviewed',
      category: currentCategory, // Keep this for the 'all' view if needed
      multiCategory: {
        ...(transaction.multiCategory || { banking: 'other', behavioral: 'other', minimalist: 'other', personalized: 'other' }),
        [activeUniverse]: currentCategory,
      }
    };

    onUpdate(transaction.id, updates);
    setIsOpen(false);
    toast({
      title: 'Feedback Received (SCOA/CTR)',
      description: (
        <div className="flex items-center gap-2">
            <CheckCircle className="text-accent"/>
            <span>Your preference has been recorded for the {activeUniverse} view. The model will learn from this correction.</span>
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

  const getSpendingPersona = (categoryId: string) => {
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
    return personaMap[categoryId] || 'Your General Spending Persona was used.';
  }
  
   const getPurchasePurpose = (categoryId: string) => {
    const purposeMap: Record<string, string> = {
        'food-drink': 'Social / Enjoyment',
        'shopping': 'Personal / Gifting',
        'transport': 'Necessity / Commute',
        'groceries': 'Necessity / Home',
        'home': 'Necessity / Improvement',
        'entertainment': 'Relaxation / Leisure',
        'health': 'Well-being / Necessity',
        'utilities': 'Necessity / Household',
        'travel': 'Leisure / Work',
        'personal-care': 'Self-care / Routine',
        'coffee-runs': 'Routine / Work',
    };
    return purposeMap[categoryId] || 'General';
  }

  const getTransactionPersonality = (categoryId: string) => {
    const personalityMap: Record<string, string> = {
        'food-drink': 'Social Energy (The Explorer)',
        'shopping': 'Confidence Boost (The Creator)',
        'transport': 'Productivity (The Sage)',
        'groceries': 'Home Comfort (The Caregiver)',
        'home': 'Future Investment (The Ruler)',
        'entertainment': 'Relaxation (The Jester)',
        'health': 'Self-Care (The Innocent)',
        'utilities': 'Responsibility (The Sage)',
        'travel': 'Exploration (The Explorer)',
        'personal-care': 'Comfort & Care (The Caregiver)',
        'coffee-runs': 'Routine Boost (The Everyman)',
    };
    return personalityMap[categoryId] || 'General';
  }

  if (!transaction) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Transaction Details &amp; XAI</SheetTitle>
          <SheetDescription>
            Review, re-categorize, and understand the AI's reasoning for the <span className='capitalize font-medium'>{activeUniverse}</span> universe.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-6 overflow-y-auto pr-6 pl-2 -ml-2">
           {transaction.status === 'flagged' && (
              <div className="flex items-start gap-3 rounded-md bg-destructive/10 p-3 text-destructive border border-destructive/20">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className='text-sm'>
                  <p className="font-semibold">Flagged by CISA/SFA</p>
                  <p>This transaction was flagged as a potential regret-prone purchase due to unusual timing or amount, requiring human confirmation.</p>
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
            {transaction.receipt && (
               <InfoBlock label="Receipt Status" value={
                <Badge variant={transaction.receipt.status === 'matched' ? 'default' : 'secondary' } className={cn(transaction.receipt.status === 'matched' && "bg-green-100 text-green-900")}>
                    <Receipt className="mr-1 h-3 w-3" />
                    {transaction.receipt.status === 'matched' ? 'Receipt Matched' : 'Refund Detected'}
                </Badge>
               } />
            )}
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
                  <SelectValue placeholder={aiState.isLoading ? "AI is thinking..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
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
                            (c) => c.id === aiState.suggestedCategory
                          )?.label
                        }
                      </span>
                      .
                    </p>
                  </div>
                )}
          </div>

          <div className="space-y-4">
            <div className='flex justify-between items-center'>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="text-primary" /> Explainable AI (XAI) Analysis
              </h3>
              <div className='flex items-center gap-1.5 text-sm font-semibold'>
                <Gem className="h-4 w-4 text-primary"/> Karma: <span className='text-primary'>+3</span>
              </div>
            </div>
            {aiState.isLoading ? (
              <div className="space-y-4 pt-2">
                 <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Loading detailed XAI insights...</p>
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
                      {aiState.attributions ? (
                        <>
                          <p className="text-lg font-medium text-foreground rounded-lg bg-muted p-4">
                            <HighlightedDescription description={transaction.description} words={aiState.attributions} />
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">The TSR highlights the key terms (tokens) that most influenced the model's classification decision.</p>
                        </>
                      ) : <Skeleton className="h-16 w-full" />}
                    </CardContent>
                  </Card>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><ShieldCheck className="h-4 w-4"/>Human Trust Score (HTS):</p>
                   {aiState.confidence !== null ? (
                    <>
                      <Progress value={aiState.confidence * 100} className="h-2"/>
                      <p className="text-xs text-muted-foreground text-right">{(aiState.confidence * 100).toFixed(0)}% Confidence</p>
                    </>
                  ) : <Skeleton className="h-6 w-full" /> }
                </div>
                 <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500"/>Predicted Intent (TEM):</p>
                  {aiState.spendingIntent ? (
                    <>
                      <p className="text-muted-foreground">{aiState.spendingIntent}</p>
                      <p className="text-xs text-muted-foreground mt-1">This reflects how you might have felt, like comfort-spending after a long day.</p>
                    </>
                  ) : <Skeleton className="h-10 w-full" />}
                </div>
                <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><MessageSquareHeart className="h-4 w-4 text-rose-500"/>Transaction Story (TCL, LSF, PMR, NFRE):</p>
                   {aiState.explanation ? (
                     <p className="text-muted-foreground">"{aiState.explanation}"</p>
                   ) : <Skeleton className="h-10 w-full" />}
                </div>
                 <div className="rounded-lg border bg-background p-4 leading-relaxed">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><Repeat className="h-4 w-4"/>Counterfactual & Ethical Shadow (RCSL):</p>
                  {aiState.counterfactual ? (
                    <>
                      <p className="text-muted-foreground"><span className='font-semibold'>Counterfactual: </span>{aiState.counterfactual}</p>
                      <p className="text-muted-foreground mt-1"><span className='font-semibold'>Ethical Shadow: </span>Reusing an existing item could have saved this amount for a future goal.</p>
                    </>
                  ) : <Skeleton className="h-10 w-full" />}
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500"/>Future Impact & Health (FIP, ABC, PHHS):</p>
                   <ul className='list-disc list-inside text-muted-foreground space-y-1'>
                      <li>Continuing this spend monthly would total <span className='font-semibold'>₹{(Math.abs(transaction.amount) * 12).toFixed(2)}</span> annually.</li>
                      <li>This purchase lowers your 'Shopping' budget health score by <span className='font-semibold'>3%</span> this week.</li>
                      <li>Your next 'Shopping' purchase is predicted in <span className='font-semibold'>~4 days</span> based on your habits.</li>
                      <li><span className='font-semibold'>(POA):</span> AI suggests this purchase was likely influenced by a <span className='font-semibold'>seasonal discount</span>.</li>
                       <li><span className='font-semibold'>Ripple Effect (PCV):</span> This reduces your available savings this month, a potential delay to your 'New Gadget' goal by <span className='font-semibold'>2 days</span>.</li>
                  </ul>
                </div>
                <div className="rounded-lg border bg-background p-4 space-y-2">
                    <p className="font-medium text-foreground flex items-center gap-2"><Bot className="h-4 w-4"/>AI Financial Twin's Advice (AIFT/GIP/SRD/FMIS):</p>
                    <p className="text-muted-foreground leading-relaxed">&quot;Your 'Saver-Self' would have skipped this, as it matches past regret patterns. However, your 'Lifestyle-Enhancer' identity approved it. This choice reduces your primary vacation savings goal by 2%.&quot;</p>
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                   <p className="font-medium text-foreground mb-2 flex items-center gap-2"><UserCheck className="h-4 w-4"/>Spending Persona & Philosophy (TPG/HPFA/TPFE/TPI/TAM):</p>
                   <p className="text-muted-foreground leading-relaxed">{getSpendingPersona(currentCategory)}</p>
                   <p className="text-muted-foreground leading-relaxed">Purpose: <span className="font-semibold">{getPurchasePurpose(currentCategory)}</span> | Personality: <span className='font-semibold'>{getTransactionPersonality(currentCategory)}</span> (Hedonic)</p>
                </div>
                <div className="rounded-lg border bg-background p-4 space-y-3">
                    <p className="font-medium text-foreground flex items-center gap-2"><Network className="h-4 w-4"/>Spending Black Box Recorder (SBBR):</p>
                    {aiState.zile ? (
                      <>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground">Base Sequence (S-DNA)</p>
                            <p className="text-muted-foreground leading-relaxed font-mono text-xs break-all">{aiState.zile.baseSequence}</p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground">Interpretation Vector</p>
                            <p className="text-muted-foreground leading-relaxed font-mono text-xs break-all">{aiState.zile.interpretationVector}</p>
                        </div>
                      </>
                    ) : <Skeleton className="h-16 w-full" />}
                </div>
                 <div className="rounded-lg border bg-background p-4 space-y-2">
                  <p className="font-medium text-foreground flex items-center gap-2"><SearchCode className="h-4 w-4"/>Purchase Memory (Similarity Search):</p>
                  {aiState.similarMerchants ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {aiState.similarMerchants.map((merchant) => (
                          <Badge key={merchant} variant="outline" className="font-mono text-xs">{merchant}</Badge>
                      ))}
                    </div>
                  ) : <Skeleton className="h-8 w-full" />}
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
            Confirm & Submit Feedback
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    