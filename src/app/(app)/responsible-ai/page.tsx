'use client';
import { ShieldCheck, Scale, FileText, Bot, UserX, Loader2, HelpCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { FairnessMetricsTable } from "@/components/analytics/fairness-metrics-table";
import { Badge } from "@/components/ui/badge";
import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { generateSemanticDNA } from "@/ai/flows/generate-semantic-dna";
import { explainTransactionClassification } from "@/ai/flows/explain-transaction-classification";
import { Separator } from "@/components/ui/separator";

const fairnessData = {
    groups: ['Low Value (<$20)', 'Med Value ($20-$100)', 'High Value (>$100)'],
    metrics: [
      {
        metric: 'Equal Opportunity',
        scores: [0.94, 0.95, 0.93],
        description: 'Measures if the model performs equally well for all groups on positive outcomes.',
      },
      {
        metric: 'Predictive Parity',
        scores: [0.98, 0.97, 0.98],
        description: 'Ensures the probability of a correct prediction is the same for all groups.',
      },
      {
        metric: 'Demographic Parity',
        scores: [0.89, 0.91, 0.90],
        description: 'Checks if the proportion of positive predictions is the same across groups.',
      },
       {
        metric: 'False Positive Rate Parity',
        scores: [0.05, 0.04, 0.06],
        description: 'Ensures that the likelihood of an incorrect positive prediction is similar for all groups.',
      },
    ],
  };

const AnonymizationResultContent = ({ transactionDescription }: { transactionDescription: string }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(true);
    const [dnaResult, setDnaResult] = React.useState<{ baseSequence: string; interpretationVector: string } | null>(null);
    const [explanation, setExplanation] = React.useState<string | null>(null);
    const [isExplaining, setIsExplaining] = React.useState(false);

    React.useEffect(() => {
        async function getDna() {
            try {
                const result = await generateSemanticDNA(transactionDescription);
                setDnaResult(result);
            } catch (e) {
                toast({ variant: 'destructive', title: "Anonymization Failed", description: "Could not generate Semantic DNA." });
            } finally {
                setIsLoading(false);
            }
        }
        getDna();
    }, [transactionDescription, toast]);
    
    const handleExplainVector = async () => {
      if (!dnaResult) return;
      setIsExplaining(true);
      try {
          const result = await explainTransactionClassification({
              transactionDescription: `An anonymized vector: S-DNA=${dnaResult.baseSequence}, IV=${dnaResult.interpretationVector}`,
              predictedCategory: 'Unknown',
              confidenceScore: 0.9
          });
          setExplanation(result.explanation);
      } catch (e) {
          toast({ variant: 'destructive', title: "Explanation Failed", description: "The AI could not interpret the vector." });
      } finally {
          setIsExplaining(false);
      }
    };


    if (isLoading) {
        return <div className="flex items-center justify-center h-40"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }
    
    if (!dnaResult) {
      return <p className="text-destructive">Failed to generate the Semantic DNA vector.</p>
    }

    return (
        <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground flex items-center gap-1">Base Sequence (S-DNA) <HelpCircle className="h-4 w-4 text-muted-foreground" title="Represents core semantics like merchant type, temporal context, and user behavior."/></p>
              <p className="text-muted-foreground font-mono text-xs break-all bg-secondary/30 p-2 rounded-md">{dnaResult.baseSequence}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground flex items-center gap-1">Interpretation Vector <HelpCircle className="h-4 w-4 text-muted-foreground" title="Represents explainability signals like SHAP values and category cluster data."/></p>
              <p className="text-muted-foreground font-mono text-xs break-all bg-secondary/30 p-2 rounded-md">{dnaResult.interpretationVector}</p>
            </div>
            <Separator/>
            <Button onClick={handleExplainVector} disabled={isExplaining} className="w-full">
              {isExplaining ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Bot className="h-4 w-4 mr-2"/>}
              {isExplaining ? 'AI is Explaining...' : 'Explain this Vector'}
            </Button>
            {explanation && (
                <div className="p-3 bg-primary/10 rounded-lg text-primary-foreground/90 border border-primary/20">
                    <p className="font-semibold text-primary">AI Explanation:</p>
                    <p className="text-primary/90">{explanation}</p>
                </div>
            )}
        </div>
    );
};

export default function ResponsibleAIPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const transactionToAnonymize = "STARBUCKS #12345 8.75 USD";

  const handleRunAnonymizer = async () => {
    setIsLoading(true);
    toast({ title: "Behavioural Anonymizer Initialized", description: "Transforming user-specific patterns into an anonymous vector..."});
    
    // The dialog will handle the actual generation, we just open it.
    setIsDialogOpen(true);
    setIsLoading(false);
  };


  return (
    <>
    <div className="space-y-6">
       <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary h-8 w-8"/>
                Responsible AI
            </h1>
            <p className="text-muted-foreground">
                Auditing model for fairness, bias, and ethical compliance.
            </p>
         </div>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale />Fairness & Bias Report</CardTitle>
                 <p className="text-sm text-muted-foreground pt-1">
                    Ensuring equitable performance across different transaction value segments.
                </p>
            </CardHeader>
            <CardContent>
                <FairnessMetricsTable data={fairnessData} />
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText />Policy-Aware Category Planner (PACP)</CardTitle>
                 <CardDescription>
                    A compliance layer that identifies and enforces rules for regulatory-sensitive categories.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-semibold">PACP Status</p>
                            <p className="text-sm text-muted-foreground">Actively monitoring all classifications.</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>The PACP engine automatically tags sensitive categories (e.g., Gambling, Loans) and can trigger specific actions, such as data redaction or escalation for manual review, ensuring compliance with regional and internal policies.</p>
                </div>
            </CardContent>
         </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserX />Behavioural Anonymizer (BA)</CardTitle>
                    <CardDescription>
                    Transforms user-specific patterns into anonymous behavioral vectors for safe, cross-team analytics.
                    </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-semibold">BA Status</p>
                            <p className="text-sm text-muted-foreground">Ready to anonymize data streams.</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>Using differential privacy techniques and noise injection, the BA module enables powerful behavioral analytics across the dataset while ensuring that no personally identifiable information can be reverse-engineered.</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleRunAnonymizer} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                    {isLoading ? "Anonymizing..." : "Anonymize Sample Transaction"}
                </Button>
            </CardFooter>
        </Card>
    </div>
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Anonymization Complete</DialogTitle>
            <DialogDescription>
                The transaction has been transformed into a privacy-preserving 'Semantic DNA' vector.
            </DialogDescription>
            </DialogHeader>
            <AnonymizationResultContent transactionDescription={transactionToAnonymize} />
            <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
