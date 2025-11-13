import { ShieldCheck, Scale, FileText, Bot, UserX } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { FairnessMetricsTable } from "@/components/analytics/fairness-metrics-table";
import { Badge } from "@/components/ui/badge";

const fairnessData = {
    groups: ['Low Value (<$20)', 'Med Value ($20-$100)', 'High Value (>$100)'],
    metrics: [
      {
        metric: 'Equal Opportunity',
        scores: [0.94, 0.95, 0.93],
        description: 'Measures if the model performs equally well for all groups on positive outcomes.',
      },
      {
        metric: 'Predictive Parity',
        scores: [0.98, 0.97, 0.98],
        description: 'Ensures the probability of a correct prediction is the same for all groups.',
      },
      {
        metric: 'Demographic Parity',
        scores: [0.89, 0.91, 0.90],
        description: 'Checks if the proportion of positive predictions is the same across groups.',
      },
       {
        metric: 'False Positive Rate Parity',
        scores: [0.05, 0.04, 0.06],
        description: 'Ensures that the likelihood of an incorrect positive prediction is similar for all groups.',
      },
    ],
  };

export default function ResponsibleAIPage() {
  return (
    <div className="space-y-6">
       <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary h-8 w-8"/>
                Responsible AI & Governance
            </h1>
            <p className="text-muted-foreground">
                Auditing model for fairness, bias, and ethical compliance.
            </p>
         </div>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scale />Fairness & Bias Report</CardTitle>
                 <p className="text-sm text-muted-foreground pt-1">
                    Ensuring equitable performance across different transaction value segments.
                </p>
            </CardHeader>
            <CardContent>
                <FairnessMetricsTable data={fairnessData} />
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText />Policy-Aware Category Planner (PACP)</CardTitle>
                 <CardDescription>
                    A compliance layer that identifies and enforces rules for regulatory-sensitive categories.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-semibold">PACP Status</p>
                            <p className="text-sm text-muted-foreground">Actively monitoring all classifications.</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>The PACP engine automatically tags sensitive categories (e.g., Gambling, Loans) and can trigger specific actions, such as data redaction or escalation for manual review, ensuring compliance with regional and internal policies.</p>
                </div>
            </CardContent>
         </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserX />Behavioural Anonymizer (BA)</CardTitle>
                    <CardDescription>
                    Transforms user-specific patterns into anonymous behavioral vectors for safe, cross-team analytics.
                    </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border bg-background p-4">
                    <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-primary"/>
                        <div>
                            <p className="font-semibold">BA Status</p>
                            <p className="text-sm text-muted-foreground">Anonymizing data for analytics.</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>Using differential privacy techniques and noise injection, the BA module enables powerful behavioral analytics across the dataset while ensuring that no personally identifiable information can be reverse-engineered.</p>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
