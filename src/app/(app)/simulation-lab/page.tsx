'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Binary, Telescope, Loader2, Fingerprint, Network, Repeat } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { generateCounterfactualExplanation } from '@/ai/flows/generate-counterfactual-explanation';
import { generateSemanticDNA } from '@/ai/flows/generate-semantic-dna';


export default function SimulationLabPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    const handleRunCounterfactual = async (scenario: 'delivery' | 'subscription') => {
        setIsLoading(prev => ({ ...prev, counterfactual: true }));
        let input;
        let toastTitle;

        switch(scenario) {
            case 'delivery':
                toastTitle = "Simulating 'No Food Delivery' Scenario...";
                input = {
                    transactionDescription: "Doordash*Taco Bell",
                    originalCategory: "Food & Drink",
                    targetCategory: "Groceries"
                };
                break;
            case 'subscription':
                toastTitle = "Simulating 'Cut Subscriptions' Scenario...";
                 input = {
                    transactionDescription: "Netflix.com",
                    originalCategory: "Entertainment",
                    targetCategory: "Savings"
                };
                break;
        }

        toast({ title: toastTitle, description: "The AI is calculating the counterfactual outcome..." });

        try {
            const result = await generateCounterfactualExplanation(input);
            setDialogContent({
                title: "Counterfactual Simulation Complete",
                description: `What would need to change for a "${input.originalCategory}" transaction to become "${input.targetCategory}"?`,
                content: (
                    <div className="mt-4 text-sm">
                        <p className="font-semibold text-primary bg-primary/10 p-3 rounded-lg">
                           {result.counterfactualExplanation}
                        </p>
                        <p className="text-muted-foreground mt-2">This simulates a behavioral change where spending is re-allocated, impacting future financial outcomes.</p>
                    </div>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "Simulation Failed", description: "Could not generate counterfactual explanation."});
        } finally {
            setIsLoading(prev => ({ ...prev, counterfactual: false }));
        }
    };
    
    const handleRunSBBR = async () => {
        setIsLoading(prev => ({ ...prev, sbbr: true }));
        toast({ title: "Spending Black Box Recorder Initialized", description: "Generating a Zero Interpretation Loss Embedding (ZILE)..."});
        try {
            const result = await generateSemanticDNA("AMAZON MKTPLACE PMTS");
            setDialogContent({
                title: "Semantic DNA Generated",
                description: "The AI has transformed the transaction into a privacy-preserving 'Semantic DNA' vector, representing its core features for advanced analysis.",
                content: (
                    <div className="mt-4 space-y-4 text-sm">
                        <div>
                            <p className="font-semibold text-foreground">Base Sequence (S-DNA)</p>
                            <p className="text-muted-foreground font-mono text-xs break-all bg-secondary/30 p-2 rounded-md">{result.baseSequence}</p>
                            <p className="text-xs text-muted-foreground mt-1">Represents core semantics like merchant type, temporal context, and user behavior.</p>
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">Interpretation Vector</p>
                            <p className="text-muted-foreground font-mono text-xs break-all bg-secondary/30 p-2 rounded-md">{result.interpretationVector}</p>
                            <p className="text-xs text-muted-foreground mt-1">Represents explainability signals like SHAP values and category cluster data.</p>
                        </div>
                    </div>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "Simulation Failed", description: "Could not generate Semantic DNA."});
        } finally {
            setIsLoading(prev => ({ ...prev, sbbr: false }));
        }
    };


  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Financial Reality & Simulation Lab
        </h1>
        <p className="text-muted-foreground">
          Explore advanced financial visualizations and predictive simulations.
        </p>
      </div>

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Telescope className="text-primary"/>Transaction Universe Explorer (TUE)</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Your Spending Galaxy</CardTitle>
                    <CardDescription>
                       Visualize your entire financial life as an interactive 3D galaxy. This explorer turns your transaction data into a stunning visual metaphor for exploration.
                    </CardDescription>
                </CardHeader>
                 <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>In this visualization:</p>
                    <ul className='list-disc list-inside space-y-1 pl-4'>
                        <li><span className='font-semibold text-foreground'>Category Clusters</span> form sprawling nebulae.</li>
                        <li><span className='font-semibold text-foreground'>Merchants</span> are represented as individual stars.</li>
                        <li><span className='font-semibold text-foreground'>Spending Habits</span> become planets orbiting these stars.</li>
                        <li><span className='font-semibold text-foreground'>Transaction Frequency</span> defines the orbits and gravitational pull.</li>
                    </ul>
                     <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed mt-4">
                        <p className="text-muted-foreground">[3D Galaxy Visualization Placeholder]</p>
                    </div>
                </CardContent>
            </Card>
       </div>

       <Separator/>

        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Repeat className="text-primary"/>Financial Parallel Universe Navigator (FPUN)</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Simulate Your Alternate Financial Lives</CardTitle>
                    <CardDescription>
                      Ever wonder "what if?" This tool lets you explore parallel financial universes by changing key variables in your spending habits using counterfactual reasoning.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="font-medium">Choose a Scenario</p>
                            <Button variant="outline" className="w-full justify-start text-left" onClick={() => handleRunCounterfactual('delivery')} disabled={isLoading['counterfactual']}>
                                {isLoading['counterfactual'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Binary className="mr-2 h-4 w-4" />}
                                Universe: No Food Delivery
                            </Button>
                            <Button variant="secondary" className="w-full justify-start text-left" onClick={() => handleRunCounterfactual('subscription')} disabled={isLoading['counterfactual']}>
                                {isLoading['counterfactual'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Binary className="mr-2 h-4 w-4" />}
                                Universe: Minimalist (No Subscriptions)
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-left" disabled>Universe: Investor (Save 20% More)</Button>
                        </div>
                        <div className="md:col-span-2 rounded-lg border bg-background p-4 flex items-center justify-center">
                            <div className="text-center">
                                <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                                <p className="mt-4 font-medium text-foreground">AI Simulation Results</p>
                                <p className="text-muted-foreground text-sm">Select a parallel universe to see the simulated outcome.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
       </div>
       
       <Separator/>

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Network className="text-primary"/>Hyper-Contextual Transaction Rewriting (HTR)</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Generate a Semantic DNA Fingerprint</CardTitle>
                    <CardDescription>
                       Simulate how the AI rewrites a transaction's semantic DNA based on different contextual universes, a core component of the Zero Interpretation Loss Embedding (ZILE).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This tool makes the abstract concept of embeddings tangible by visualizing a transaction's "Semantic DNA." This fingerprint is crucial for tasks like similarity search, anomaly detection, and fine-grained classification, representing the core of the AI's understanding.</p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRunSBBR} disabled={isLoading['sbbr']}>
                         {isLoading['sbbr'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Fingerprint className="mr-2 h-4 w-4"/>}
                         {isLoading['sbbr'] ? "Generating..." : "Generate & Rewrite Semantic DNA"}
                    </Button>
                </CardFooter>
            </Card>
       </div>
    </div>
     <Dialog open={!!dialogContent} onOpenChange={() => setDialogContent(null)}>
        <DialogContent className="sm:max-w-md">
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
