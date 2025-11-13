'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicalExpenseForecastProps {
  data: {
    totalForecast: number;
    confidenceInterval: number;
    breakdown: { category: string; value: number; color: string }[];
    estimatedSavings: number;
  };
}

export function MedicalExpenseForecast({ data }: MedicalExpenseForecastProps) {
  const { totalForecast, confidenceInterval, breakdown, estimatedSavings } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="text-primary" /> Medical Expense Forecast (MEF)
        </CardTitle>
        <CardDescription>
          Expected medical spend for the next 90 days.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Forecasted Spend</p>
          <p className="text-4xl font-bold">
            ₹{totalForecast.toLocaleString()}
            <span className="text-lg font-normal text-muted-foreground"> ± ₹{confidenceInterval.toLocaleString()}</span>
          </p>
        </div>
        <div className="h-[150px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown} layout="vertical" margin={{ left: 10, right: 50 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="category" type="category" tickLine={false} axisLine={false} width={80} />
              <Bar dataKey="value" background={{ fill: 'hsl(var(--muted))' }}>
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                  className="fill-foreground font-medium text-sm"
                />
                {breakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg bg-accent/20 p-3 text-center">
            <p className="font-semibold text-accent-foreground">Potential Savings: ₹{estimatedSavings.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">By following AI recommendations (e.g., using generics, telemedicine).</p>
        </div>
      </CardContent>
    </Card>
  );
}
