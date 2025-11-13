
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfusionMatrix } from '@/components/analytics/confusion-matrix';
import { Frown, Gauge, Target, Scale, ShieldCheck, TrendingUp } from 'lucide-react';
import { PerCategoryAccuracyChart } from '@/components/analytics/per-category-accuracy-chart';
import { FairnessMetricsTable } from '@/components/analytics/fairness-metrics-table';
import { MerchantDriftChart } from '@/components/analytics/merchant-drift-chart';

const performanceData = {
  macroF1: 0.92,
  latency: 38, // in ms
  throughput: 12500, // txns/sec
  confusionMatrix: {
    labels: ['Food', 'Shopping', 'Transport', 'Home'],
    values: [
      [120, 2, 1, 0],
      [3, 150, 5, 2],
      [0, 1, 95, 0],
      [1, 0, 0, 78],
    ],
  },
  perCategoryAccuracy: [
    { category: 'Food', accuracy: 0.98 },
    { category: 'Shopping', accuracy: 0.94 },
    { category: 'Transport', accuracy: 0.95 },
    { category: 'Home', accuracy: 0.99 },
    { category: 'Entertainment', accuracy: 0.88 },
    { category: 'Health', accuracy: 0.96 },
  ],
  fairnessMetrics: {
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
  },
  merchantDrift: [
    { month: 'Jan', drift: 0.02, merchant: "Starbucks" },
    { month: 'Feb', drift: 0.03, merchant: "Starbucks" },
    { month: 'Mar', drift: 0.05, merchant: "Starbucks" },
    { month: 'Apr', drift: 0.15, merchant: "Starbucks" },
    { month: 'May', drift: 0.12, merchant: "Starbucks" },
    { month: 'Jun', drift: 0.11, merchant: "Starbucks" },
  ],
};

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Model Performance Analytics
        </h1>
        <p className="text-muted-foreground">
          Analyze model accuracy, latency, and operational metrics.
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
              {performanceData.macroF1.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Target: &ge; 0.90 (Exceeded)
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
            <div className="text-2xl font-bold">{performanceData.latency}ms</div>
            <p className="text-xs text-muted-foreground">
              Target: &lt; 50ms (Met)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Batch Throughput
            </CardTitle>
            <Frown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.throughput.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">txns/sec</p>
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
            <ConfusionMatrix data={performanceData.confusionMatrix} />
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
                <PerCategoryAccuracyChart data={performanceData.perCategoryAccuracy} />
            </CardContent>
        </Card>
      </div>

       <div className="space-y-6 pt-4">
         <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <ShieldCheck className="text-primary"/>
                Fairness & Bias Report
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
                <FairnessMetricsTable data={performanceData.fairnessMetrics} />
            </CardContent>
         </Card>
       </div>
       
        <div className="space-y-6 pt-4">
         <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <TrendingUp className="text-primary"/>
                Merchant Evolution Report (METS)
            </h2>
            <p className="text-muted-foreground">
                Tracking how merchant semantics change over time.
            </p>
         </div>
         <Card>
            <CardHeader>
                <CardTitle>Semantic Drift: &quot;Starbucks&quot;</CardTitle>
                 <CardDescription>
                    Tracking the change in transaction meaning. A drift in April was detected, corresponding to a new &quot;Reserve&quot; store rollout.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <MerchantDriftChart data={performanceData.merchantDrift} />
            </CardContent>
         </Card>
       </div>
    </div>
  );
}
