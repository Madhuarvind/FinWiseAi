
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, GitMerge, Layers3, Rocket, Wrench, CircleDashed, Bot, FlaskConical, Network, Zap, Telescope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { synthesizeTransactions } from '@/ai/flows/synthesize-transactions';
import { getTokenAttributions } from '@/ai/flows/get-token-attributions';

const models = [
    {
        name: "FAI-BERT (CDAT)",
        version: "v1.2.0",
        description: "Domain-adaptive foundation model (Cross-Domain Alignment Transformer) trained with multimodal contrastive learning to align merchant understanding across text, voice, and web data.",
        type: "Foundation Model",
        status: "Active",
        icon: BrainCircuit,
    },
    {
        name: "FT-Transformer",
        version: "v0.9.5",
        description: "Custom transformer architecture for merchant patterns, metadata, and embeddings.",
        type: "Classifier Head",
        status: "Active",
        icon: Layers3,
    },
    {
        name: "LightGBM",
        version: "v2.1.0",
        description: "Gradient-boosted model that classifies transactions using engineered features like amount, time-of-day, and location.",
        type: "Classifier Head",
        status: "Active",
        icon: Bot,
    }
];

const adapters = [
    {
        name: "Q2-Retail-Boost",
        basedOn: "FAI-BERT v1.2.0",
        description: "LoRA adapter for new retail merchants. Dataset curated by the SDMRB using uncertainty and diversity sampling.",
        status: "Active",
        samples: 2350
    },
    {
        name: "International-Travel",
        basedOn: "FAI-BERT v1.2.0",
        description: "Prefix-Tuning adapter for identifying patterns in non-USD travel transactions.",
        status: "Needs Training",
        samples: 850
    },
     {
        name: "Utility-Providers-v2",
        basedOn: "FAI-BERT v1.1.0",
        description: "Legacy adapter for utility payment patterns. This represents a previous stable version.",
        status: "Archived",
        samples: 1200
    }
]

const distilledModels = [
    {
        name: "FAI-Nano-BERT (Student)",
        version: "v2.0.1-distilled",
        description: "A compact student model created via Counterfactual Knowledge Distillation. It captures the causal reasoning of the larger teacher ensemble at a fraction of the size, making it ideal for edge deployment.",
        type: "Distilled Model (CKD)",
        status: "Active",
        icon: Network,
        teacher: "Full Ensemble v2.0"
    }
];

export default function ModelHubPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    const handleRunMAS = async () => {
        setIsLoading(prev => ({...prev, mas: true}));
        toast({ title: "MAS Workbench Initialized", description: "Finding informative samples for 'Travel'..."});
        try {
            const result = await synthesizeTransactions({ count: 3, category: 'Travel'});
            setDialogContent({
                title: "MAS Sampling Complete",
                description: "The sampler found these highly informative samples to improve the 'Travel' category.",
                content: (
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg">
                        {result.transactions.map((tx, i) => (
                            <li key={i}><strong>Description:</strong> {tx.description}, <strong>Amount:</strong> ₹{tx.amount.toFixed(2)}</li>
                        ))}
                    </ul>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "MAS Failed", description: "Could not generate samples."});
        } finally {
            setIsLoading(prev => ({...prev, mas: false}));
        }
    };

    const handleRunSRMA = async () => {
        setIsLoading(prev => ({...prev, srma: true}));
        toast({ title: "SRMA Auditor Initialized", description: "Generating self-confidence map for a sample transaction..."});
        try {
            const result = await getTokenAttributions({ transactionDescription: "UBER TRIP MUMBAI", category: "Transport"});
            setDialogContent({
                title: "SRMA Audit Complete",
                description: "The auditor identified the most influential tokens for the 'Transport' classification.",
                content: (
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>For transaction "UBER TRIP MUMBAI", the key attribution tokens are:</p>
                         <div className="flex flex-wrap gap-2 pt-2">
                            {result.influentialWords.map((word) => (
                                <Badge key={word} variant="secondary" className="text-base">{word}</Badge>
                            ))}
                        </div>
                    </div>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "SRMA Failed", description: "Could not get token attributions."});
        } finally {
            setIsLoading(prev => ({...prev, srma: false}));
        }
    }


  return (
    <>
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Model Hub
        </h1>
        <p className="text-muted-foreground">
          Manage, monitor, and fine-tune your AI categorization models and adapters.
        </p>
      </div>

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><BrainCircuit className="text-primary"/>Core Models (Teacher Ensemble)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {models.map(model => {
                    const Icon = model.icon;
                    return (
                        <Card key={model.name} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-3"><Icon className="h-6 w-6"/> {model.name}</span>
                                    <Badge variant={model.status === 'Active' ? 'secondary' : 'default'} className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">{model.status}</Badge>
                                </CardTitle>
                                <CardDescription>{model.type} - {model.version}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{model.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" disabled>
                                    <CircleDashed className="mr-2 h-4 w-4"/>
                                    View Architecture
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
       </div>

        <Separator />

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><GitMerge className="text-primary"/>Fine-Tuning Adapters (PEFT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {adapters.map(adapter => (
                    <Card key={adapter.name} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-lg">{adapter.name}</span>
                                 <Badge variant={adapter.status === 'Active' ? 'secondary' : adapter.status === 'Needs Training' ? 'destructive' : 'outline'}
                                    className={adapter.status === 'Active' ? "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300" : ""}>
                                    {adapter.status}
                                 </Badge>
                            </CardTitle>
                            <CardDescription>Based on: {adapter.basedOn}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-sm text-muted-foreground mb-4">{adapter.description}</p>
                             <p className="text-xs text-muted-foreground">{adapter.samples.toLocaleString()} samples in dataset</p>
                        </CardContent>
                        <CardFooter>
                             <Button size="sm" disabled={adapter.status !== 'Needs Training'}>
                                <Wrench className="mr-2 h-4 w-4"/>
                                Fine-Tune Model
                            </Button>
                            <Button variant="ghost" size="sm" className="ml-auto" disabled={adapter.status !== 'Active'}>
                                <Rocket className="mr-2 h-4 w-4"/>
                                Deploy
                            </Button>
                        </CardFooter>
                    </Card>
                 ))}
            </div>
       </div>
       
        <Separator />

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Network className="text-primary"/>Distilled Models (CKD)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {distilledModels.map(model => {
                    const Icon = model.icon;
                    return (
                        <Card key={model.name} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span className="flex items-center gap-3"><Icon className="h-6 w-6"/> {model.name}</span>
                                    <Badge variant={model.status === 'Active' ? 'secondary' : 'default'} className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">{model.status}</Badge>
                                </CardTitle>
                                <CardDescription>{model.type} - {model.version}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{model.description}</p>
                            </CardContent>
                             <CardFooter>
                                <Button variant="outline" size="sm">
                                    <Rocket className="mr-2 h-4 w-4"/>
                                    Deploy to Edge
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
       </div>

       <Separator />

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Zap className="text-primary"/>Automated Model Operations</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Meta-Active Sampler (MAS) Workbench</CardTitle>
                        <CardDescription>
                            This module uses a Reinforcement Learning agent to automatically find the most informative transaction samples for labeling.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            The MAS intelligently explores the data distribution to find samples that offer the highest potential for model improvement, maximizing F1 score while minimizing labeling costs.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleRunMAS} disabled={isLoading['mas']}>
                            {isLoading['mas'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical className="mr-2 h-4 w-4"/>}
                            {isLoading['mas'] ? "Sampling..." : "Run Active Sampler"}
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Self-Reflective Model Auditor (SRMA)</CardTitle>
                        <CardDescription>
                           An automated auditor that tracks the model's own weaknesses and creates a "self-confidence map" of its abilities.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            By tracking gradient norms, uncertainty clusters, and error patterns, the SRMA identifies areas where the model is least confident and suggests what it needs to learn next.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleRunSRMA} disabled={isLoading['srma']}>
                            {isLoading['srma'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Telescope className="mr-2 h-4 w-4"/>}
                            {isLoading['srma'] ? "Auditing..." : "View Self-Confidence Map"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
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
