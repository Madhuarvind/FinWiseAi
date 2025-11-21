
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function SimulationLabPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    // New state for the "What-If" playground
    const [selectedScenario, setSelectedScenario] = React.useState<string | null>(null);
    const [simulationResult, setSimulationResult] = React.useState<string | null>(null);
    const [isSimulating, setIsSimulating] = React.useState(false);

    const scenarios = [
        { id: 'delivery', label: 'What if I stop food delivery?', input: { transactionDescription: "Doordash*Taco Bell", originalCategory: "Food & Drink", targetCategory: "Groceries" } },
        { id: 'subscription', label: 'What if I cut all subscriptions?', input: { transactionDescription: "Netflix.com", originalCategory: "Entertainment", targetCategory: "Savings" } },
        { id: 'save', label: 'What if I save 20% more?', input: { transactionDescription: "Monthly Salary Credit", originalCategory: "Income", targetCategory: "Savings" } }
    ];

    const handleRunSimulation = async () => {
        if (!selectedScenario) {
            toast({ variant: 'destructive', title: 'No scenario selected', description: 'Please choose a simulation scenario first.' });
            return;
        }

        setIsSimulating(true);
        setSimulationResult(null);

        const scenario = scenarios.find(s => s.id === selectedScenario);
        if (!scenario) {
            setIsSimulating(false);
            return;
        }

        toast({ title: `Simulating "${scenario.label}"...`, description: "The AI is calculating the counterfactual outcome..." });

        try {
            const result = await generateCounterfactualExplanation(scenario.input);
            setSimulationResult(result.counterfactualExplanation);
        } catch (e) {
            toast({ variant: 'destructive', title: "Simulation Failed", description: "Could not generate counterfactual explanation." });
            setSimulationResult('The AI simulation failed to run for this scenario.');
        } finally {
            setIsSimulating(false);
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
          Explore advanced financial visualizations and predictive "What-If" simulations.
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
                     <div className="relative flex h-80 w-full items-center justify-center rounded-lg border bg-muted/20 mt-4 overflow-hidden">
                        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-16 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
                        <div className="absolute top-20 right-40 w-16 h-16 bg-red-500/10 rounded-full blur-2xl"></div>
                        
                        {/* Stars */}
                        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full"></div>
                        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-white/80 rounded-full"></div>
                        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white rounded-full"></div>
                        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white/70 rounded-full"></div>
                        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-white rounded-full"></div>

                        {/* Cluster Labels */}
                        <div className="absolute top-12 left-12 text-xs text-blue-300">Shopping Nebula</div>
                        <div className="absolute bottom-20 right-24 text-xs text-purple-300">Dining Out Cluster</div>
                         <div className="absolute top-24 right-44 text-xs text-red-300">Subscriptions</div>
                    </div>
                </CardContent>
            </Card>
       </div>

       <Separator/>

        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Repeat className="text-primary"/>Transaction "What-If" Playground</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Simulate Your Alternate Financial Lives</CardTitle>
                    <CardDescription>
                      Ever wonder "what if?" This tool lets you explore parallel financial universes by changing key variables in your spending habits and seeing the immediate impact.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <p className="font-medium">Choose a Simulation Scenario</p>
                            <RadioGroup value={selectedScenario || ''} onValueChange={setSelectedScenario}>
                                {scenarios.map(scenario => (
                                    <div key={scenario.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={scenario.id} id={scenario.id} />
                                        <Label htmlFor={scenario.id} className="font-normal cursor-pointer">{scenario.label}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                            <Button onClick={handleRunSimulation} disabled={!selectedScenario || isSimulating} className="w-full mt-4">
                                {isSimulating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Binary className="mr-2 h-4 w-4" />}
                                {isSimulating ? 'Simulating...' : 'Run Simulation'}
                            </Button>
                        </div>
                        <div className="md:col-span-2 rounded-lg border bg-background p-4 flex items-center justify-center min-h-[150px]">
                            {isSimulating ? (
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            ) : simulationResult ? (
                                <div>
                                    <p className="font-semibold text-foreground">AI Simulation Result:</p>
                                    <p className="text-primary mt-2 bg-primary/10 p-3 rounded-lg">{simulationResult}</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                                    <p className="mt-4 font-medium text-foreground">AI Simulation Results</p>
                                    <p className="text-muted-foreground text-sm">Select a scenario to see the simulated outcome.</p>
                                </div>
                            )}
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
