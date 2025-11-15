'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface MerchantDriftChartProps {
  data: { month: string; drift: number }[];
}

const chartConfig = {
  drift: {
    label: 'Semantic Drift',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MerchantDriftChart({ data }: MerchantDriftChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full h-[300px]">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toFixed(2)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <ReferenceLine y={0.1} label="Drift Threshold" stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
        <Line
          dataKey="drift"
          type="monotone"
          stroke="var(--color-drift)"
          strokeWidth={2}
          dot={true}
        />
      </LineChart>
    </ChartContainer>
  );
}
