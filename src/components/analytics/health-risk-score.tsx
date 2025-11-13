
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, CheckCircle, HeartPulse, ShieldAlert } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface HealthRiskScoreProps {
  score: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  rationale: string;
  recommendations: { text: string; confidence: number }[];
}

export function HealthRiskScore({ score, trend, rationale, recommendations }: HealthRiskScoreProps) {
  const getScoreColor = () => {
    if (score > 75) return 'hsl(var(--destructive))';
    if (score > 50) return 'hsl(var(--primary))';
    return 'hsl(var(--accent))';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="text-primary" /> Health Spend Risk Engine (HSRE)
        </CardTitle>
        <CardDescription>
          Your spending pattern indicates rising health needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Health Risk Score</p>
          <p className="text-6xl font-bold" style={{ color: getScoreColor() }}>
            {score}
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <div className="flex items-center justify-center gap-1 text-sm font-medium text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 text-destructive" />
            <span>{trend.charAt(0).toUpperCase() + trend.slice(1)}</span>
          </div>
        </div>
        <div className="rounded-lg border bg-background/50 p-3">
          <p className="text-sm font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            Risk Rationale
          </p>
          <p className="text-sm text-muted-foreground mt-1">{rationale}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <h4 className="font-semibold text-sm">Suggested Actions</h4>
        <div className="space-y-3 w-full">
          {recommendations.map((rec, index) => (
            <Button key={index} variant="outline" className="w-full justify-between h-auto py-2">
              <span className="whitespace-normal text-left">{rec.text}</span>
              <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

    