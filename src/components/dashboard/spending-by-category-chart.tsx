'use client';

import * as React from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Transaction, Category } from '@/lib/types';
import { getCategoryIcon } from '@/components/icons';

type SpendingData = {
  category: string;
  value: number;
  label: string;
  fill: string;
  icon: React.ComponentType<{ className?: string }>;
};

const chartConfig = {
  spending: {
    label: 'Spending',
  },
  'food-drink': {
    label: 'Food & Drink',
    color: 'hsl(var(--chart-1))',
  },
  shopping: {
    label: 'Shopping',
    color: 'hsl(var(--chart-2))',
  },
  transport: {
    label: 'Transport',
    color: 'hsl(var(--chart-3))',
  },
  groceries: {
    label: 'Groceries',
    color: 'hsl(var(--chart-4))',
  },
  home: {
    label: 'Home',
    color: 'hsl(var(--chart-5))',
  },
  entertainment: {
    label: 'Entertainment',
    color: 'hsl(var(--chart-1))',
    theme: {
      light: 'hsl(197 37% 44%)',
      dark: 'hsl(197 37% 64%)',
    },
  },
  health: {
    label: 'Health',
    color: 'hsl(var(--chart-2))',
    theme: {
        light: 'hsl(120 40% 40%)',
        dark: 'hsl(120 40% 60%)',
    }
  },
  utilities: {
    label: 'Utilities',
    color: 'hsl(var(--chart-3))',
    theme: {
        light: 'hsl(43 84% 56%)',
        dark: 'hsl(43 84% 76%)',
    }
  },
  travel: {
    label: 'Travel',
    color: 'hsl(var(--chart-4))',
     theme: {
        light: 'hsl(27 87% 57%)',
        dark: 'hsl(27 87% 77%)',
    }
  },
  'personal-care': {
    label: 'Personal Care',
    color: 'hsl(var(--chart-5))',
    theme: {
        light: 'hsl(340 75% 55%)',
        dark: 'hsl(340 75% 75%)',
    }
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--muted))'
  }
};

export function SpendingByCategoryChart({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const spendingByCategory = React.useMemo(() => {
    if (!transactions) return [];
    const spending: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.amount < 0) {
        const categoryId = t.category || 'other';
        spending[categoryId] = (spending[categoryId] || 0) + Math.abs(t.amount);
      }
    });

    return Object.entries(spending)
      .map(([categoryId, value]) => {
        const categoryInfo = categories.find((c) => c.id === categoryId);
        const chartInfoKey = categoryId as keyof typeof chartConfig;
        const chartInfo = chartConfig[chartInfoKey];

        return {
          category: categoryId,
          value,
          label: categoryInfo?.label || 'Other',
          fill: chartInfo?.color || 'hsl(var(--muted))',
          icon: getCategoryIcon(categoryInfo?.icon || 'ShoppingCart'),
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  const onPieEnter = React.useCallback(
    (_: any, index: number) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );
  
  if (spendingByCategory.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No spending data available.
      </div>
    );
  }

  const activeSegment = spendingByCategory[activeIndex];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[250px]"
    >
      <PieChart onMouseEnter={onPieEnter}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={spendingByCategory}
          dataKey="value"
          nameKey="label"
          innerRadius={60}
          strokeWidth={5}
          activeIndex={activeIndex}
          activeShape={(props) => (
            <Sector {...props} cornerRadius={4} />
          )}
        >
          <Label
            content={() => {
              if (!activeSegment) return null;
              const Icon = activeSegment.icon;
              return (
                <g>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-2xl font-bold fill-foreground"
                  >
                    {activeSegment.value.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                       maximumFractionDigits: 0,
                    })}
                  </text>
                  <foreignObject x="42%" y="60%" width="32" height="24">
                     <Icon className="w-5 h-5 text-muted-foreground" />
                  </foreignObject>
                </g>
              );
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
