
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, GitMerge, Layers3, Rocket, Wrench, CircleDashed, Bot } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const models = [
    {
        name: "FAI-BERT",
        version: "v1.2.0",
        description: "Domain-adaptive foundation model for financial text. Trained on MLM, NSP, and contrastive learning.",
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
        description: "LoRA fine-tuning adapter focused on new retail and e-commerce merchants from Q2 2024 feedback.",
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
        description: "Legacy adapter for utility payment patterns. Needs migration to FAI-BERT v1.2.0.",
        status: "Archived",
        samples: 1200
    }
]

export default function ModelHubPage() {
  return (
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
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><BrainCircuit className="text-primary"/>Core Models</h2>
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
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><GitMerge className="text-primary"/>Fine-Tuning Adapters (LoRA)</h2>
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

    </div>
  );
}
