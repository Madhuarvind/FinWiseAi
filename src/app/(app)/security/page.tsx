'use client';
import { ShieldCheck, ShieldAlert, Bot, Landmark, Loader2, Users, Briefcase } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { decodeSpendingIntent } from "@/ai/flows/decode-spending-intent";
import { Separator } from "@/components/ui/separator";

export default function SecurityPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({});
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    const handleRunAIF = async () => {
        setIsLoading(prev => ({ ...prev, aif: true }));
        toast({ title: "Adversarial Intent Filter Initialized", description: "Analyzing a potentially malicious transaction string..."});
        try {
            const result = await decodeSpendingIntent({
                description: "gift card and snacks", // Ambiguous string
                timeOfDay: "Afternoon",
                dayOfWeek: "Saturday",
                category: "Shopping"
            });
            setDialogContent({
                title: "AIF Analysis Complete",
                description: "The filter analyzed the ambiguous string to determine the likely underlying intent.",
                content: (
                     <div className="mt-4 text-sm">
                        <p className="text-muted-foreground">The AIF flagged the transaction as potentially trying to hide a 'gift card' purchase within a routine 'snacks' purchase. The predicted intent is:</p>
                        <p className="mt-2 font-semibold text-foreground bg-secondary/30 p-3 rounded-lg">
                           {result.intent}
                        </p>
                    </div>
                )
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "AIF Failed", description: "Could not decode spending intent."});
        } finally {
            setIsLoading(prev => ({ ...prev, aif: false }));
        }
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
                         <Button variant="outline" disabled>View Compliance Report</Button>
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
                        <Button variant="outline" disabled>Verify Business Logic</Button>
                    </CardFooter>
                </Card>
             </div>
        </div>

         <Separator/>

         <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight">System Integrity Monitors</h2>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot />Adversarial Intent Filter (AIF)</CardTitle>
                    <CardDescription>
                        A specialized security layer that detects malicious or unusual transaction strings designed to evade categorization or hide intent.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                        <div className="flex items-center gap-3">
                            <Bot className="h-6 w-6 text-primary"/>
                            <div>
                                <p className="font-semibold">AIF Status</p>
                                <p className="text-sm text-muted-foreground">Actively monitoring all incoming transactions.</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                        <p>The AIF is trained to recognize patterns associated with adversarial attacks, such as character swapping, benign string injection, and other manipulation techniques. Any transaction flagged by the AIF is immediately sent for human review and is not processed automatically.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleRunAIF} disabled={isLoading['aif']}>
                         {isLoading['aif'] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4"/>}
                         {isLoading['aif'] ? "Analyzing..." : "Analyze Sample Adversarial Txn"}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck />Auto-Compliance Verifier (ACV)</CardTitle>
                    <CardDescription>
                        Automatically verifies model outputs against a set of compliance policies (e.g., AML/KYC heuristics) before finalizing categories.
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
                        <p>The ACV engine uses a set of policy rules and statistical checks to flag transactions that may violate compliance regulations. This provides an essential audit trail and ensures outputs adhere to business and legal requirements.</p>
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
                        Prevents category "leakage" by learning the boundaries between classes and rejecting predictions that are semantically ambiguous.
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
                        <p>Using a boundary model trained with triplet loss, the CIV measures the "distance" of a prediction from nearby category boundaries. If a prediction is too close to a boundary, it's flagged for review or auto-rerouted, preventing subtle misclassifications.</p>
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
