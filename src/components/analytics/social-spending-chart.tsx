'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface SocialSpendingChartProps {
  data: { name: string; value: number, fill: string }[];
}

const chartConfig = {
  value: {
    label: 'Spending (INR)',
  },
} satisfies ChartConfig;

export function SocialSpendingChart({ data }: SocialSpendingChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[150px]">
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
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-xs font-semibold"
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="value" layout="vertical" radius={4}>
            <LabelList
                dataKey="value"
                position="right"
                offset={8}
                className="fill-foreground text-sm font-bold"
                formatter={(value: number) => `₹${value.toLocaleString()}`}
            />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
