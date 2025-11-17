'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Frown, Gauge, Target, Bot, Users, TrendingUp, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ConfusionMatrix } from '@/components/analytics/confusion-matrix';
import { PerCategoryAccuracyChart } from '@/components/analytics/per-category-accuracy-chart';
import { SocialSpendingChart } from '@/components/analytics/social-spending-chart';
import { MerchantDriftChart } from '@/components/analytics/merchant-drift-chart';
import { FairnessMetricsTable } from '@/components/analytics/fairness-metrics-table';

// --- Placeholder Data ---
const confusionMatrixData = {
  labels: ['Food', 'Shopping', 'Transport', 'Home'],
  values: [
    [120, 5, 2, 1],
    [8, 250, 4, 10],
    [1, 3, 95, 0],
    [3, 12, 1, 88],
  ],
};

const perCategoryAccuracyData = [
  { category: 'Food & Drink', accuracy: 0.94 },
  { category: 'Shopping', accuracy: 0.92 },
  { category: 'Transport', accuracy: 0.98 },
  { category: 'Home', accuracy: 0.88 },
  { category: 'Utilities', accuracy: 0.99 },
  { category: 'Entertainment', accuracy: 0.85 },
];

const socialSpendingData = [
    { name: 'You', value: 4200, fill: 'hsl(var(--primary))' },
    { name: 'Peer Group', value: 3500, fill: 'hsl(var(--muted))' }
]

const merchantDriftData = [
    { month: 'Jan', drift: 0.02 },
    { month: 'Feb', drift: 0.03 },
    { month: 'Mar', drift: 0.05 },
    { month: 'Apr', drift: 0.04 },
    { month: 'May', drift: 0.08 },
    { month: 'Jun', drift: 0.11 },
];

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
    ],
  };


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Self-Healing Model Debugger
        </h1>
        <p className="text-muted-foreground">
          The system actively monitors its own performance, diagnoses issues, and suggests corrective actions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Macro F1 Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              0.93
            </div>
            <p className="text-xs text-muted-foreground">
              -1.2% from last week (Auto-Alert Triggered)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Inference Latency
            </CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">112ms</div>
            <p className="text-xs text-muted-foreground">
              +3% from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Error Clusters Detected
            </CardTitle>
            <Frown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              2
            </div>
            <p className="text-xs text-muted-foreground">"Swiggy Instamart", "Bank of India EMI"</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Confusion Matrix</CardTitle>
            <p className="text-sm text-muted-foreground pt-1">
              Visualizing prediction accuracy across top categories.
            </p>
          </CardHeader>
          <CardContent>
            <ConfusionMatrix data={confusionMatrixData} />
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Per-Category Accuracy</CardTitle>
                 <p className="text-sm text-muted-foreground pt-1">
                    Identifying performance variations between categories.
                </p>
            </CardHeader>
            <CardContent>
                <PerCategoryAccuracyChart data={perCategoryAccuracyData} />
            </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
            <div>
                <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                    <ShieldCheck className="text-primary"/>
                    Fairness &amp; Bias Report
                </h2>
                <p className="text-muted-foreground">
                    Auditing model performance across different transaction segments.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Fairness Metrics</CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">
                        Ensuring equitable performance across transaction value tiers.
                    </p>
                </CardHeader>
                <CardContent>
                    <FairnessMetricsTable data={fairnessData} />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <div>
                <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                    <Bot className="text-primary"/>
                    Predictive Category Drift Oracle (FCSS/CQPR)
                </h2>
                <p className="text-muted-foreground">
                    Forecasting future changes in category definitions.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>AI-Suggested Action</CardTitle>
                     <CardDescription>
                        The oracle predicts the 'Shopping' category is likely to split.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">A new cluster is forming around "Quick Commerce" (e.g., Blinkit, Zepto). The AI recommends creating a new sub-category to maintain accuracy.</p>
                </CardContent>
            </Card>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div>
                    <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <TrendingUp className="text-primary"/>
                        Merchant Evolution Report (AMIF)
                    </h2>
                    <p className="text-muted-foreground">
                        Tracking how merchant semantics change over time.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Semantic Drift Detected</CardTitle>
                        <CardDescription>
                            The meaning of "Swiggy" has drifted by 11% in the last month.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <MerchantDriftChart data={merchantDriftData} />
                    </CardContent>
                </Card>
            </div>
             <div className="space-y-6">
                <div>
                    <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="text-primary"/>
                        Social Spending Benchmark (AMIF)
                    </h2>
                    <p className="text-muted-foreground">
                        Comparing your spending to a synthetic, anonymized peer group.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Spending vs. Peers (Food &amp; Drink)</CardTitle>
                        <CardDescription>
                            Compare your spending to an anonymized demographic cluster.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SocialSpendingChart data={socialSpendingData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
