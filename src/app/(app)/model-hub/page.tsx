
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, GitMerge, Layers3, Rocket, Wrench, CircleDashed, Bot, FlaskConical, Network, Zap, Telescope, Check, X, RefreshCw, ArrowDown, Share2, Binary, Eye, FileText, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { synthesizeTransactions } from '@/ai/flows/synthesize-transactions';
import { getTokenAttributions } from '@/ai/flows/get-token-attributions';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const initialAdapters = [
    {
        id: "q2-retail",
        name: "Q2-Retail-Boost",
        basedOn: "FAI-BERT v1.2.0",
        description: "LoRA adapter for new retail merchants. Dataset curated by the SDMRB using uncertainty and diversity sampling.",
        status: "Active",
        samples: 2350
    },
    {
        id: "intl-travel",
        name: "International-Travel",
        basedOn: "FAI-BERT v1.2.0",
        description: "Prefix-Tuning adapter for identifying patterns in non-USD travel transactions.",
        status: "Needs Training",
        samples: 850
    },
     {
        id: "util-v2",
        name: "Utility-Providers-v2",
        basedOn: "FAI-BERT v1.1.0",
        description: "Legacy adapter for utility payment patterns. This represents a previous stable version.",
        status: "Archived",
        samples: 1200
    }
]

const distilledModels = [
    {
        id: 'nano-bert-1',
        name: "FAI-Nano-BERT (Student)",
        version: "v2.0.1-distilled",
        description: "A compact student model created via Counterfactual Knowledge Distillation. It captures the causal reasoning of the larger teacher ensemble at a fraction of the size, making it ideal for edge deployment.",
        type: "Distilled Model (CKD)",
        status: "Active",
        icon: Network,
        teacher: "Full Ensemble v2.0"
    }
];

// --- Dialog Content Components ---

const SrmaDialogContent = () => {
    const [attributions, setAttributions] = React.useState<string[]>([]);
    const [feedback, setFeedback] = React.useState<Record<string, 'correct' | 'incorrect'>>({});
    const [isRerunning, setIsRerunning] = React.useState(false);

    const runAudit = async (isDeeperLayer = false) => {
        setIsRerunning(true);
        setFeedback({}); // Reset feedback on re-run
        try {
            const result = await getTokenAttributions({
                transactionDescription: "UBER TRIP MUMBAI",
                category: "Transport"
            });
            // Simulate different results for deeper layer
            const newAttributions = isDeeperLayer ? result.influentialWords.concat(['mumbai']) : result.influentialWords;
            setAttributions(newAttributions);
        } catch (e) {
            // Handle error, maybe show a toast
        } finally {
            setIsRerunning(false);
        }
    };

    React.useEffect(() => {
        runAudit(); // Initial run
    }, []);

    const handleFeedback = (token: string, newFeedback: 'correct' | 'incorrect') => {
        setFeedback(prev => ({
            ...prev,
            [token]: prev[token] === newFeedback ? undefined : newFeedback,
        }));
    };

    return (
        <div className="mt-4 text-sm text-muted-foreground">
            <p className="mb-4">For transaction "UBER TRIP MUMBAI", the key attribution tokens are:</p>
            
            <div className="space-y-3">
                {isRerunning ? (
                    <div className="flex items-center justify-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : (
                    attributions.map((word) => (
                        <div key={word} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                            <Badge variant="secondary" className="text-base font-mono uppercase">{word}</Badge>
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={feedback[word] === 'correct' ? 'default' : 'outline'}
                                    className={cn("h-8 w-8 p-0", feedback[word] === 'correct' && "bg-green-600 hover:bg-green-700")}
                                    onClick={() => handleFeedback(word, 'correct')}
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant={feedback[word] === 'incorrect' ? 'destructive' : 'outline'}
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleFeedback(word, 'incorrect')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <Separator className="my-4" />

            <div className="space-y-2">
                <p className="font-semibold text-foreground">Customization</p>
                <Button variant="outline" className="w-full" onClick={() => runAudit(true)} disabled={isRerunning}>
                    {isRerunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Re-run Audit on Deeper Layer
                </Button>
                 <p className="text-xs text-muted-foreground pt-1">Simulates inspecting a different layer of the neural network to understand how feature importance changes.</p>
            </div>
        </div>
    );
};

const ArchitectureDiagram = () => {
    const Layer = ({ title, subtitle, icon, className }: { title: string, subtitle: string, icon: React.ReactNode, className?: string }) => (
        <div className={cn("flex flex-col items-center", className)}>
            <div className="flex items-center justify-center w-full p-3 bg-muted/60 border rounded-lg">
                <div className="flex-shrink-0 mr-4">{icon}</div>
                <div className="text-left">
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                </div>
            </div>
        </div>
    );
    const Connector = () => (
        <div className="flex justify-center items-center my-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
        </div>
    );

    return (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            <Layer title="Input Layer" subtitle="Raw Transaction String" icon={<Layers3 className="h-6 w-6 text-primary" />} />
            <Connector />
            <Layer title="Embedding Layer" subtitle="384 Dimensions" icon={<Share2 className="h-6 w-6 text-primary" />} />
            <Connector />
            <Layer title="Transformer Blocks x6" subtitle="Self-Attention Mechanism" icon={<BrainCircuit className="h-6 w-6 text-primary" />} />
            <Connector />
            <Layer title="Classification Head" subtitle="Softmax Activation" icon={<Zap className="h-6 w-6 text-primary" />} />
        </div>
    );
}

const CkdLogContent = () => (
  <div className="mt-4 space-y-4 text-sm font-mono bg-secondary/30 p-4 rounded-lg text-secondary-foreground max-h-80 overflow-y-auto">
    <p>&gt; [Teacher]: Query: &quot;AMAZON MKTPLACE&quot;. Why is this Shopping?</p>
    <p>&gt; [Student]: Response: Contains &quot;MKTPLACE&quot;, associated with retail. Confidence: 85%.</p>
    <p>&gt; [Teacher]: Feedback: Correct. Counterfactual: What if it was &quot;AMAZON WEB SERVICES&quot;?</p>
    <p>&gt; [Student]: Response: Would be &quot;Business Services&quot;. Confidence: 92%.</p>
    <p className="text-green-400">&gt; [Teacher]: Feedback: Excellent. Causal reasoning captured. KL Divergence: 0.08.</p>
    <p>&gt; [Teacher]: Query: &quot;DELTA FLIGHT 123&quot;. Why is this Travel?</p>
    <p>&gt; [Student]: Response: Contains &quot;FLIGHT&quot;, associated with airlines. Confidence: 99%.</p>
    <p className="text-green-400">&gt; [Teacher]: Feedback: Correct. No counterfactual needed. KL Divergence: 0.02.</p>
  </div>
);

const EvaluationConfusionMatrix = ({ data }: { data: { labels: string[], values: number[][] } }) => {
  const { labels, values } = data;
  const maxVal = Math.max(...values.flat());

  const getCellColor = (value: number, isDiagonal: boolean) => {
    if (isDiagonal) {
      const opacity = Math.max(0.2, Math.min(1, value / maxVal));
      return `hsl(var(--primary) / ${opacity})`;
    } else {
      if (value === 0) return 'transparent';
      const opacity = Math.max(0.2, Math.min(1, (value / maxVal) * 2));
      return `hsl(var(--destructive) / ${opacity})`;
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border my-4">
      <Table className="min-w-full text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-semibold">Actual</TableHead>
            {labels.map((label) => <TableHead key={label} className="text-center font-semibold text-muted-foreground">{label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {labels.map((actualLabel, rowIndex) => (
            <TableRow key={actualLabel}>
              <TableCell className="font-semibold">{actualLabel}</TableCell>
              {labels.map((_, colIndex) => {
                const value = values[rowIndex][colIndex];
                const isDiagonal = rowIndex === colIndex;
                return (
                  <TableCell
                    key={`${actualLabel}-${labels[colIndex]}`}
                    className="text-center p-2"
                    style={{ backgroundColor: getCellColor(value, isDiagonal), color: isDiagonal ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))' }}
                  >
                    <div className="font-bold">{value}</div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};


export default function ModelHubPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);
    const [adapters, setAdapters] = React.useState(initialAdapters);
    const [edgeDeployedModels, setEdgeDeployedModels] = React.useState<Set<string>>(new Set());
    const [nasGoal, setNasGoal] = React.useState<string>("latency");
    const [nasResult, setNasResult] = React.useState<string | null>(null);
    
    // State for Evaluation Workbench
    const [isEvaluating, setIsEvaluating] = React.useState(false);
    const [evaluationResult, setEvaluationResult] = React.useState<{ f1: number; precision: number; recall: number; matrix: { labels: string[]; values: number[][] } } | null>(null);
    const [isTrainingAdapter, setIsTrainingAdapter] = React.useState(false);


    const handleRunEvaluation = () => {
        setIsEvaluating(true);
        setEvaluationResult(null);
        toast({ title: "Running Model Evaluation...", description: "Benchmarking the current model against the test dataset." });
        setTimeout(() => {
            setEvaluationResult({
                f1: 0.92,
                precision: 0.94,
                recall: 0.90,
                matrix: {
                    labels: ['Shop', 'Food', 'Util'],
                    values: [[120, 8, 2], [5, 250, 1], [3, 0, 88]]
                }
            });
            setIsEvaluating(false);
        }, 3000);
    };

    const handleCreateAdapter = () => {
        setIsTrainingAdapter(true);
        toast({ title: "Creating & Training Adapter...", description: "AI is creating a new adapter to address model weaknesses."});
        setTimeout(() => {
            const newAdapter = {
                id: 'shopping-grocery-disambiguator',
                name: 'Shopping-Grocery-Disambiguator',
                basedOn: 'FAI-BERT v1.2.0',
                description: 'New adapter generated by the Evaluation Workbench to resolve ambiguity between Shopping and Grocery categories.',
                status: 'Needs Training',
                samples: 0
            };
            setAdapters(prev => [...prev, newAdapter]);
            setIsTrainingAdapter(false);
            setEvaluationResult(null);
            toast({ title: "Adapter Created!", description: "The new adapter is ready for fine-tuning." });
        }, 2500);
    };


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
        setIsLoading(prev => ({ ...prev, srma: true }));
        toast({ title: "SRMA Auditor Initialized", description: "Generating self-confidence map for a sample transaction..."});
        
        // The dialog content is now a self-contained component that handles its own logic
        setDialogContent({
            title: "SRMA Audit Complete",
            description: "The auditor identified the most influential tokens for the 'Transport' classification. You can now provide feedback.",
            content: <SrmaDialogContent />
        });
        
        // No need to await here, the dialog handles its own loading.
        // We set loading to false for the main button after a short delay to allow the dialog to open.
        setTimeout(() => setIsLoading(prev => ({ ...prev, srma: false })), 500);
    }
    
    const handleRunNAS = () => {
        setIsLoading(prev => ({ ...prev, nas: true }));
        setNasResult(null);
        toast({ title: "Neural Architecture Search Started", description: `Optimizing for: ${nasGoal === 'latency' ? 'Mobile Latency' : 'Accuracy'}` });
        setTimeout(() => {
            const result = nasGoal === 'latency'
                ? `Discovered Architecture 'Mobile-FinBERT-v3': { Layers: 4, AttentionHeads: 4, EmbeddingDim: 128 }, Est. Latency: 45ms`
                : `Discovered Architecture 'Accuracy-Max-v2': { Layers: 12, AttentionHeads: 8, EmbeddingDim: 512 }, Est. F1-Score: 0.96`;
            setNasResult(result);
            setIsLoading(prev => ({ ...prev, nas: false }));
        }, 3000);
    };


    const handleFineTune = (adapterId: string) => {
        setIsLoading(prev => ({ ...prev, [`tune-${adapterId}`]: true }));
        toast({
            title: "Fine-Tuning Process Initiated",
            description: "The model adapter is now being trained on the new dataset..."
        });
        setTimeout(() => {
            setAdapters(prevAdapters => 
                prevAdapters.map(adapter => 
                    adapter.id === adapterId ? { ...adapter, status: 'Active' } : adapter
                )
            );
            setIsLoading(prev => ({ ...prev, [`tune-${adapterId}`]: false }));
            toast({
                title: "Fine-Tuning Complete!",
                description: "The model has been updated with the new data."
            });
        }, 3000); // Simulate a 3-second process
    };

    const handleDeploy = (adapterId: string) => {
        setIsLoading(prev => ({ ...prev, [`deploy-${adapterId}`]: true }));
        toast({
            title: "Deployment Started",
            description: "The updated model is being deployed to the production environment..."
        });
        setTimeout(() => {
            setIsLoading(prev => ({ ...prev, [`deploy-${adapterId}`]: false }));
            toast({
                title: "Deployment Successful!",
                description: "The new model is now live."
            });
        }, 3000); // Simulate a 3-second process
    };
    
    const handleViewArchitecture = (modelName: string) => {
        setDialogContent({
            title: `Architecture: ${modelName}`,
            description: "This is a simplified representation of the model's data flow and layers.",
            content: <ArchitectureDiagram />
        });
    };

    const handleDeployToEdge = (modelId: string) => {
        setIsLoading(prev => ({ ...prev, [`edge-${modelId}`]: true }));
        toast({
            title: "Deployment to Edge Started",
            description: "The distilled model is being packaged for edge devices..."
        });
        setTimeout(() => {
            setIsLoading(prev => ({ ...prev, [`edge-${modelId}`]: false }));
            setEdgeDeployedModels(prev => new Set(prev).add(modelId));
            toast({
                title: "Deployment to Edge Successful!",
                description: "The model is now available for on-device inference."
            });
        }, 3000);
    };
    
    const handleViewCkdLog = () => {
        setDialogContent({
            title: "Counterfactual Knowledge Distillation Log",
            description: "Simulated log of the student model learning from the teacher model's reasoning.",
            content: <CkdLogContent />
        });
    };


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
                                <Button variant="outline" size="sm" onClick={() => handleViewArchitecture(model.name)}>
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
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Activity className="text-primary"/>Model Evaluation Workbench</h2>
             <Card>
                 <CardHeader>
                     <CardTitle>Evaluation & Reporting</CardTitle>
                     <CardDescription>Run an evaluation against a test dataset to measure performance and find weaknesses.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     {isEvaluating ? (
                         <div className="flex items-center justify-center h-40">
                             <Loader2 className="h-8 w-8 animate-spin text-primary" />
                         </div>
                     ) : evaluationResult ? (
                         <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-muted-foreground">F1 Score</p>
                                    <p className="text-2xl font-bold text-primary">{evaluationResult.f1.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Precision</p>
                                    <p className="text-2xl font-bold">{evaluationResult.precision.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Recall</p>
                                    <p className="text-2xl font-bold">{evaluationResult.recall.toFixed(2)}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-1">Confusion Matrix</p>
                                <EvaluationConfusionMatrix data={evaluationResult.matrix} />
                            </div>
                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                                <p className="font-semibold text-primary flex items-center gap-2"><Bot />AI Insight & Recommendation</p>
                                <p className="text-sm text-primary/90 mt-1">The model shows minor confusion between 'Shopping' and 'Food' categories. Creating a dedicated adapter with more specific examples (e.g., restaurant names vs. retail store names) could improve precision by an estimated 3-5%.</p>
                                 <Button size="sm" className="mt-3" onClick={handleCreateAdapter} disabled={isTrainingAdapter}>
                                     {isTrainingAdapter ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wrench className="mr-2 h-4 w-4"/>}
                                     {isTrainingAdapter ? "Creating Adapter..." : "Create & Train Adapter"}
                                 </Button>
                            </div>
                         </div>
                     ) : (
                         <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed h-40 rounded-lg">
                             <p className="font-medium">No evaluation has been run.</p>
                             <p className="text-sm text-muted-foreground">Click the button below to start.</p>
                         </div>
                     )}
                 </CardContent>
                 <CardFooter>
                     <Button onClick={handleRunEvaluation} disabled={isEvaluating}>
                         {isEvaluating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4"/>}
                         {isEvaluating ? 'Evaluating...' : 'Run Evaluation'}
                     </Button>
                 </CardFooter>
             </Card>
        </div>

        <Separator />

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><GitMerge className="text-primary"/>Fine-Tuning Adapters (PEFT)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {adapters.map(adapter => (
                    <Card key={adapter.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="text-lg">{adapter.name}</span>
                                 <Badge variant={adapter.status === 'Active' ? 'secondary' : adapter.status === 'Needs Training' ? 'destructive' : 'outline'}
                                    className={cn(
                                        adapter.status === 'Active' && "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300",
                                        adapter.status === 'Archived' && "pointer-events-none"
                                    )}>
                                    {adapter.status}
                                 </Badge>
                            </CardTitle>
                            <CardDescription>Based on: {adapter.basedOn}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-sm text-muted-foreground mb-4">{adapter.description}</p>
                             <p className="text-xs text-muted-foreground">{adapter.samples.toLocaleString()} samples in dataset</p>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                             <Button size="sm" onClick={() => handleFineTune(adapter.id)} disabled={adapter.status !== 'Needs Training' || isLoading[`tune-${adapter.id}`]}>
                                {isLoading[`tune-${adapter.id}`] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wrench className="mr-2 h-4 w-4"/>}
                                Fine-Tune Model
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeploy(adapter.id)} disabled={adapter.status !== 'Active' || adapter.status === 'Archived' || isLoading[`deploy-${adapter.id}`]}>
                                {isLoading[`deploy-${adapter.id}`] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Rocket className="mr-2 h-4 w-4"/>}
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
                    const isDeployed = edgeDeployedModels.has(model.id);
                    return (
                        <Card key={model.id} className="flex flex-col">
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
                             <CardFooter className="flex items-center justify-between">
                                <Button variant="outline" size="sm" onClick={() => handleDeployToEdge(model.id)} disabled={isLoading[`edge-${model.id}`] || isDeployed}>
                                    {isLoading[`edge-${model.id}`] ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : isDeployed ? (
                                        <Check className="mr-2 h-4 w-4" />
                                    ) : (
                                        <Rocket className="mr-2 h-4 w-4"/>
                                    )}
                                    {isLoading[`edge-${model.id}`] ? "Deploying..." : isDeployed ? "Deployed" : "Deploy to Edge"}
                                </Button>
                                {isDeployed && (
                                     <Button variant="secondary" size="sm" onClick={handleViewCkdLog}>
                                        <FileText className="mr-2 h-4 w-4"/>
                                        View Distillation Log
                                     </Button>
                                )}
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
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity className="text-primary"/>Neural Architecture Search (NAS-OM) Workbench</CardTitle>
                    <CardDescription>
                        Define a goal and let the AI discover an optimal model architecture for your needs.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup value={nasGoal} onValueChange={setNasGoal}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="latency" id="latency" />
                            <Label htmlFor="latency" className="font-normal">Optimize for Mobile Latency</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="accuracy" id="accuracy" />
                            <Label htmlFor="accuracy" className="font-normal">Maximize F1-Score Accuracy</Label>
                        </div>
                    </RadioGroup>
                    
                    <Button onClick={handleRunNAS} disabled={isLoading['nas']}>
                        {isLoading['nas'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Binary className="mr-2 h-4 w-4" />}
                        {isLoading['nas'] ? 'Searching...' : 'Run Architecture Search'}
                    </Button>
                    
                    {nasResult && (
                         <div className="p-3 bg-primary/10 rounded-lg text-primary-foreground/90 border border-primary/20">
                            <p className="font-semibold text-primary">AI Result:</p>
                            <p className="text-primary/90 font-mono text-sm">{nasResult}</p>
                        </div>
                    )}
                </CardContent>
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

    