import { ShieldCheck, ShieldAlert, Bot } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SecurityPage() {
  return (
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
                    <Button variant="outline" disabled>View Flagged Transactions</Button>
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
        </div>
    </div>
  );
}
