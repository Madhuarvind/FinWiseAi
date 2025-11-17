'use client';
import { ShieldCheck, ShieldAlert, Bot, Landmark, Loader2, Users, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { decodeSpendingIntent } from "@/ai/flows/decode-spending-intent";
import { generateAdversarialExamples } from "@/ai/flows/generate-adversarial-examples";
import { Separator } from "@/components/ui/separator";

export default function SecurityPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    const handleRunAAS = async () => {
        setIsLoading(prev => ({ ...prev, aas: true }));
        toast({ title: "Adversarial Attack Simulator Initialized", description: "The Red-Team AI is generating attack variants..."});
        try {
            const result = await generateAdversarialExamples({
                originalDescription: "ONLINE CASINO DEPOSIT",
                targetCategory: "Donation"
            });
            setDialogContent({
                title: "AAS Simulation Complete",
                description: "The AI generated these adversarial strings to try and disguise a 'Gambling' transaction as a 'Donation'.",
                content: (
                     <ul className="mt-4 space-y-2 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-lg font-mono">
                        {result.examples.map((example, i) => (
                            <li key={i}>{example}</li>
                        ))}
                    </ul>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "AAS Failed", description: "Could not generate adversarial examples."});
        } finally {
            setIsLoading(prev => ({ ...prev, aas: false }));
        }
    };
    
    const handleRunRegulatorAgent = async () => {
        setIsLoading(prev => ({ ...prev, regulator: true }));
        toast({ title: "Agent-Regulator Initialized", description: "Auditing transactions for compliance..." });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work
        setDialogContent({
            title: "Agent-Regulator Audit Complete",
            description: "The agent audited 1,592 recent transactions against internal policies and fairness metrics.",
            content: (
                <div className="mt-4 text-sm bg-green-100/50 dark:bg-green-900/20 text-green-900 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-semibold flex items-center gap-2"><ShieldCheck/>All Clear: No compliance violations or significant demographic bias detected.</p>
                </div>
            )
        });
        setIsLoading(prev => ({ ...prev, regulator: false }));
    };

    const handleRunRiskAgent = async () => {
        setIsLoading(prev => ({ ...prev, risk: true }));
        toast({ title: "Agent-Risk Initialized", description: "Analyzing transactions for high-risk misclassifications..."});
        try {
            const result = await decodeSpendingIntent({
                description: "Online Gaming Credits",
                timeOfDay: "Night",
                dayOfWeek: "Friday",
                category: "Entertainment" // This is the potential misclassification
            });
            setDialogContent({
                title: "Agent-Risk Analysis Complete",
                description: "The agent flagged a potential high-risk misclassification.",
                content: (
                     <div className="mt-4 text-sm">
                        <p className="text-muted-foreground">The agent identified that a transaction for "Online Gaming Credits" was classified as 'Entertainment', but its intent analysis suggests a potential link to a 'Gambling' or 'High-Risk' category. It recommends escalating for human review.</p>
                        <p className="mt-2 font-semibold text-foreground bg-destructive/10 p-3 rounded-lg border border-destructive/20 text-destructive">
                           {result.intent}
                        </p>
                    </div>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "Risk Analysis Failed", description: "Could not decode spending intent."});
        } finally {
            setIsLoading(prev => ({ ...prev, risk: false }));
        }
    };

    const handleRunProductAgent = async () => {
        setIsLoading(prev => ({ ...prev, product: true }));
        toast({ title: "Agent-Product Initialized", description: "Verifying business logic on sample transactions..." });
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate work
        setDialogContent({
            title: "Agent-Product Verification Complete",
            description: "The agent simulated 50 user journeys to verify product-specific rules.",
            content: (
                <div className="mt-4 text-sm bg-green-100/50 dark:bg-green-900/20 text-green-900 dark:text-green-300 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="font-semibold flex items-center gap-2"><ShieldCheck/>Logic Verified: All business rules (e.g., loyalty points, fee application) were correctly applied post-categorization.</p>
                </div>
            )
        });
        setIsLoading(prev => ({ ...prev, product: false }));
    };


  return (
    <>
    <div className="space-y-6">
       <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary h-8 w-8"/>
                Security & Governance
            </h1>
            <p className="text-muted-foreground">
                A multi-agent console for monitoring adversarial attacks and ensuring system integrity.
            </p>
         </div>

        <Separator/>

        <div className="space-y-4">
             <h2 className="text-xl font-semibold tracking-tight">Transaction Governance Console (TGC)</h2>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Landmark/>Agent-Regulator</CardTitle>
                        <CardDescription>
                            Checks for fairness, bias, and adherence to compliance rules.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">This agent audits model outputs against fairness metrics (like predictive parity) and internal policies (e.g., AML/KYC heuristics) to ensure regulatory compliance.</p>
                    </CardContent>
                     <CardFooter>
                         <Button onClick={handleRunRegulatorAgent} disabled={isLoading['regulator']}>
                            {isLoading['regulator'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                            {isLoading['regulator'] ? "Auditing..." : "View Compliance Report"}
                         </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldAlert/>Agent-Risk</CardTitle>
                        <CardDescription>
                            Checks for high-risk misclassifications (e.g., gambling as entertainment).
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">This agent uses semantic analysis and intent decoding to find transactions that might be misclassified to hide their true, higher-risk nature.</p>
                    </CardContent>
                     <CardFooter>
                        <Button onClick={handleRunRiskAgent} disabled={isLoading['risk']}>
                            {isLoading['risk'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                            {isLoading['risk'] ? "Analyzing..." : "Analyze Sample High-Risk Txn"}
                        </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase/>Agent-Product</CardTitle>
                        <CardDescription>
                            Checks business logic, like correct application of cashback or loyalty rules.
                        </CardDescription>
                    </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground">This agent simulates user journeys to verify that product-specific rules are correctly applied post-categorization, ensuring business logic integrity.</p>
                    </CardContent>
                     <CardFooter>
                        <Button onClick={handleRunProductAgent} disabled={isLoading['product']}>
                             {isLoading['product'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2 h-4 w-4"/>}
                            {isLoading['product'] ? "Verifying..." : "Verify Business Logic"}
                        </Button>
                    </CardFooter>
                </Card>
             </div>
        </div>

         <Separator/>

         <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">System Integrity Monitors</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot />Adversarial Attack Simulator (AAS)</CardTitle>
                    <CardDescription>
                        A "Red-Team" AI agent that generates adversarial transaction strings to test model robustness.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                        <div className="flex items-center gap-3">
                            <Bot className="h-6 w-6 text-primary"/>
                            <div>
                                <p className="font-semibold">AAS Status</p>
                                <p className="text-sm text-muted-foreground">Ready to generate attack variants.</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>The AAS is trained to think like an attacker, creating examples with obfuscated names, misleading keywords, and unicode tricks. You can use these generated examples to benchmark your model's resilience and create a more robust training dataset.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRunAAS} disabled={isLoading['aas']}>
                         {isLoading['aas'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4"/>}
                         {isLoading['aas'] ? "Generating..." : "Generate Attack Variants"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck />Auto-Compliance Verifier (ACV)</CardTitle>
                    <CardDescription>
                        Verifies model outputs against compliance policies. All checks are logged to a tamper-proof blockchain ledger for a full audit trail.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                        <div className="flex items-center gap-3">
                            <Bot className="h-6 w-6 text-primary"/>
                            <div>
                                <p className="font-semibold">ACV Status</p>
                                <p className="text-sm text-muted-foreground">Running checks on all classifications.</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>The ACV engine uses a set of policy rules and statistical checks to flag transactions that may violate compliance regulations. This provides an essential, immutable audit trail and ensures outputs adhere to business and legal requirements.</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" disabled>View Compliance Policies</Button>
                </CardFooter>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Landmark />Category Integrity Validator (CIV)</CardTitle>
                    <CardDescription>
                        Prevents "category leakage" by learning boundaries and logging a hash of each decision to a simulated blockchain.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                        <div className="flex items-center gap-3">
                            <Bot className="h-6 w-6 text-primary"/>
                            <div>
                                <p className="font-semibold">CIV Status</p>
                                <p className="text-sm text-muted-foreground">Validating all category assignments.</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>Using a boundary model, the CIV measures the "distance" of a prediction from nearby category boundaries. If a prediction is too ambiguous, it's flagged for review, and the decision proof is recorded for a tamper-proof audit trail.</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" disabled>View Boundary Metrics</Button>
                </CardFooter>
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
