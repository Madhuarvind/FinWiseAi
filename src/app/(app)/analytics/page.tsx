'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Frown, Gauge, Target, HeartPulse, ShieldCheck, TrendingUp, Bot, Users, Activity, Fingerprint, Repeat, Wallet } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ConfusionMatrix } from '@/components/analytics/confusion-matrix';
import { PerCategoryAccuracyChart } from '@/components/analytics/per-category-accuracy-chart';
import { HealthRiskScore } from '@/components/analytics/health-risk-score';
import { MedicalExpenseForecast } from '@/components/analytics/medical-expense-forecast';
import { SocialSpendingChart } from '@/components/analytics/social-spending-chart';
import { MerchantDriftChart } from '@/components/analytics/merchant-drift-chart';

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

const healthRiskData = {
    score: 68,
    trend: 'increasing' as const,
    rationale: 'Increased frequency of pharmacy purchases and a recent telemedicine transaction were the primary drivers of this elevated risk score.',
    recommendations: [
        { text: 'Schedule a preventative health check-up', confidence: 0.9 },
        { text: 'Review health insurance coverage for prescription drugs', confidence: 0.85 },
    ]
}

const medicalExpenseData = {
    totalForecast: 12500,
    confidenceInterval: 1500,
    breakdown: [
        { category: 'Prescriptions', value: 6000, color: 'hsl(var(--chart-1))' },
        { category: 'Consultations', value: 4000, color: 'hsl(var(--chart-2))' },
        { category: 'Preventative', value: 2500, color: 'hsl(var(--chart-3))' },
    ],
    estimatedSavings: 2200,
}

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

      <Separator />

      <div className="space-y-6">
          <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <HeartPulse className="text-primary"/>
                Health Analytics (PFAG)
            </h2>
            <p className="text-muted-foreground">
                The Psycho-Financial Anomaly Guardian monitors signals related to your health and well-being.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HealthRiskScore {...healthRiskData} />
            <MedicalExpenseForecast data={medicalExpenseData} />
        </div>
      </div>
      
      <div className="space-y-6">
          <Separator />
           <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground">
                Behavioral Dynamics (AMIF)
            </h2>
            <p className="text-muted-foreground">
                Analyzing the underlying patterns and adaptability of your financial habits.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Repeat />Fractal Pattern Analysis (BFA)</CardTitle>
                     <CardDescription>
                        Identifies repeating micro-patterns in spending behavior.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                    <p>Detected a repeating pattern: a small coffee purchase is followed by a larger `food delivery` order within 3 hours, 85% of the time on weekdays. This suggests a work-related stress-spending loop.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity />Spending Neuroplasticity (SNT)</CardTitle>
                     <CardDescription>
                        Tracks how flexible your spending habits are over time.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                   <p>Your SNT score is <span className="font-bold text-primary">0.78</span>, indicating a high willingness to adapt spending. Your time-to-habit-change is <span className="font-bold text-primary">12 days</span>, down from 28 days last quarter.</p>
                </CardContent>
            </Card>
        </div>
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
                    <p className="text-sm text-muted-foreground">The model shows high predictive parity. However, the False Positive Rate for 'High Value' transactions is slightly elevated, suggesting a need for more diverse training data in that segment.</p>
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
