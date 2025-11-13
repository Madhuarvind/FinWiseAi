import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfusionMatrix } from '@/components/analytics/confusion-matrix';
import { Frown, Gauge, Target } from 'lucide-react';

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

      <div className="grid grid-cols-1">
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
      </div>
    </div>
  );
}
