
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Frown, Gauge, Target, HeartPulse, ShieldCheck, TrendingUp, Bot, Users, Activity, Fingerprint, Repeat } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Model Performance Analytics
        </h1>
        <p className="text-muted-foreground">
          Analyze model accuracy, latency, and operational metrics. (Placeholder Data)
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
              N/A
            </div>
            <p className="text-xs text-muted-foreground">
              Connect to analytics backend
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
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Connect to analytics backend
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
              N/A
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
          <CardContent className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Analytics data not available.</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Per-Category Accuracy</CardTitle>
                 <p className="text-sm text-muted-foreground pt-1">
                    Identifying performance variations between categories.
                </p>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Analytics data not available.</p>
            </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="space-y-6">
          <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <HeartPulse className="text-primary"/>
                Health Analytics
            </h2>
            <p className="text-muted-foreground">
                Monitoring financial signals related to your health and well-being.
            </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HeartPulse className="text-primary" /> Health Spend Risk Engine (HSRE)</CardTitle>
                    <CardDescription>
                    Analyzes spending for potential health-related patterns.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Health analytics data not available.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><HeartPulse className="text-primary" /> Medical Expense Forecast (MEF)</CardTitle>
                    <CardDescription>
                    Forecasts potential medical spend.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Health analytics data not available.</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="space-y-6">
          <Separator />
           <div>
            <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground">
                Behavioral Dynamics
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
                <CardContent className="flex items-center justify-center h-24">
                    <p className="text-muted-foreground text-center">Behavioral analytics data not available.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Activity />Spending Neuroplasticity (SNT)</CardTitle>
                     <CardDescription>
                        Tracks how flexible your spending habits are over time.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-24">
                   <p className="text-muted-foreground text-center">Behavioral analytics data not available.</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
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
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Fairness analytics data not available.</p>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <div>
                <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                    <Bot className="text-primary"/>
                    Predictive Category Drift Oracle (PCDO)
                </h2>
                <p className="text-muted-foreground">
                    Forecasting future changes in category definitions.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Drift Forecast</CardTitle>
                     <CardDescription>
                        The oracle predicts categories likely to expand and require re-evaluation.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">Predictive analytics data not available.</p>
                </CardContent>
            </Card>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
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
                        <CardTitle>Semantic Drift</CardTitle>
                        <CardDescription>
                            Tracking the change in transaction meaning over time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-48">
                        <p className="text-muted-foreground">Merchant analytics data not available.</p>
                    </CardContent>
                </Card>
            </div>
             <div className="space-y-6">
                <div>
                    <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Users className="text-primary"/>
                        Social Spending Benchmark (SSSC)
                    </h2>
                    <p className="text-muted-foreground">
                        Comparing your spending to a synthetic, anonymized peer group.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Spending vs. Peers</CardTitle>
                        <CardDescription>
                            Compare your spending to an anonymized demographic cluster.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center h-48">
                        <p className="text-muted-foreground">Social spending data not available.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
