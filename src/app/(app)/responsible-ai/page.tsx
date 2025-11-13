'use client';
import { ShieldCheck, Scale, FileText, Bot, UserX, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { FairnessMetricsTable } from "@/components/analytics/fairness-metrics-table";
import { Badge } from "@/components/ui/badge";
import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { generateSemanticDNA } from "@/ai/flows/generate-semantic-dna";

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

export default function ResponsibleAIPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

  const handleRunAnonymizer = async () => {
    setIsLoading(true);
    toast({ title: "Behavioural Anonymizer Initialized", description: "Transforming user-specific patterns into an anonymous vector..."});
    try {
      const result = await generateSemanticDNA("STARBUCKS #12345 8.75 USD");
      setDialogContent({
        title: "Anonymization Complete",
        description: "The transaction has been transformed into a privacy-preserving 'Semantic DNA' vector.",
        content: (
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-foreground">Base Sequence (S-DNA)</p>
              <p className="text-muted-foreground font-mono text-xs break-all bg-secondary/30 p-2 rounded-md">{result.baseSequence}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Interpretation Vector</p>
              <p className="text-muted-foreground font-mono text-xs break-all bg-secondary/30 p-2 rounded-md">{result.interpretationVector}</p>
            </div>
          </div>
        )
      });
    } catch (e) {
      toast({ variant: 'destructive', title: "Anonymization Failed", description: "Could not generate Semantic DNA."});
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
    <div className="space-y-6">
       <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary h-8 w-8"/>
                Responsible AI & Governance
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
    <Dialog open={!!dialogContent} onOpenChange={() => setDialogContent(null)}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>{dialogContent?.title}</DialogTitle>
            <DialogDescription>
                {dialogContent?.description}
            </DialogDescription>
            </DialogHeader>
            <div>
                {dialogContent?.content}
            </div>
            <DialogFooter>
                <Button onClick={() => setDialogContent(null)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
