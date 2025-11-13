'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Binary, Telescope, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { generateCounterfactualExplanation } from '@/ai/flows/generate-counterfactual-explanation';


export default function SimulationLabPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    const handleRunSimulation = async (scenario: 'delivery' | 'subscription' | 'saving') => {
        setIsLoading(true);
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
            default:
                 toast({ variant: 'destructive', title: "Scenario not implemented" });
                 setIsLoading(false);
                 return;
        }

        toast({ title: toastTitle, description: "The AI is calculating the counterfactual outcome..." });

        try {
            const result = await generateCounterfactualExplanation(input);
            setDialogContent({
                title: "Simulation Complete",
                description: `What would need to change for a "${input.originalCategory}" transaction to become "${input.targetCategory}"?`,
                content: (
                    <div className="mt-4 text-sm">
                        <p className="font-semibold text-primary bg-primary/10 p-3 rounded-lg">
                           {result.counterfactualExplanation}
                        </p>
                        <p className="text-muted-foreground mt-2">This simulates a behavioral change where spending is re-allocated to a different category, impacting future financial outcomes.</p>
                    </div>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "Simulation Failed", description: "Could not generate counterfactual explanation."});
        } finally {
            setIsLoading(false);
        }
    };


  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          AI Simulation Lab
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
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Binary className="text-primary"/>Financial Parallel World Simulator (FPWS)</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Simulate Your Alternate Financial Future</CardTitle>
                    <CardDescription>
                      Ever wonder "what if?" This tool lets you explore parallel financial worlds by changing key variables in your spending habits.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="font-medium">Choose a Scenario</p>
                            <Button variant="outline" className="w-full justify-start text-left" onClick={() => handleRunSimulation('delivery')} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Binary className="mr-2 h-4 w-4" />}
                                If I stopped all food delivery...
                            </Button>
                            <Button variant="secondary" className="w-full justify-start text-left" onClick={() => handleRunSimulation('subscription')} disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Binary className="mr-2 h-4 w-4" />}
                                If I cut all subscriptions...
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-left" disabled>If I saved 20% more monthly...</Button>
                        </div>
                        <div className="md:col-span-2 rounded-lg border bg-background p-4 flex items-center justify-center">
                            <div className="text-center">
                                <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                                <p className="mt-4 font-medium text-foreground">AI Simulation Results</p>
                                <p className="text-muted-foreground text-sm">Select a scenario to see the simulated outcome.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
       </div>
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
