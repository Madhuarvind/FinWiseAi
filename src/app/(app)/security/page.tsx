'use client';
import { ShieldCheck, ShieldAlert, Bot, Landmark, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { decodeSpendingIntent } from "@/ai/flows/decode-spending-intent";

export default function SecurityPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);
    const [dialogContent, setDialogContent] = React.useState<{ title: string; description: string; content: React.ReactNode } | null>(null);

    const handleRunAIF = async () => {
        setIsLoading(true);
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
            setIsLoading(false);
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
                Monitoring for adversarial attacks and ensuring system integrity.
            </p>
         </div>
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldAlert />Adversarial Intent Filter (AIF)</CardTitle>
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
                    <Button onClick={handleRunAIF} disabled={isLoading}>
                         {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4"/>}
                         {isLoading ? "Analyzing..." : "Analyze Sample Adversarial Txn"}
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
