'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface PerCategoryAccuracyChartProps {
  data: { category: string; accuracy: number }[];
}

const chartConfig = {
  accuracy: {
    label: 'Accuracy',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function PerCategoryAccuracyChart({ data }: PerCategoryAccuracyChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[350px]">
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 10,
          right: 40,
        }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="category"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-xs"
        />
        <XAxis dataKey="accuracy" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="accuracy" layout="vertical" fill="var(--color-accuracy)" radius={4}>
            <LabelList
                dataKey="accuracy"
                position="right"
                offset={8}
                className="fill-foreground text-xs"
                formatter={(value: number) => `${(value * 100).toFixed(0)}%`}
            />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
