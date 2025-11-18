
'use client';

import * as React from 'react';
import { Cell, Label, Pie, PieChart, Sector } from 'recharts';
import { cn } from '@/lib/utils';
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
};

const colorMap: Record<string, string> = {
    'bg-blue-500': 'hsl(var(--chart-1))',
    'bg-red-500': 'hsl(var(--chart-2))',
    'bg-green-500': 'hsl(var(--chart-3))',
    'bg-purple-500': 'hsl(var(--chart-4))',
    'bg-yellow-500': 'hsl(var(--chart-5))',
    'bg-gray-500': 'hsl(var(--muted))'
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
    if (!transactions || !categories || categories.length === 0) return [];
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
        
        return {
          category: categoryId,
          value,
          label: categoryInfo?.label || 'Other',
          fill: categoryInfo?.moodColor
            ? (colorMap[categoryInfo.moodColor] || 'hsl(var(--chart-1))')
            : 'hsl(var(--muted))',
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
    <div className="flex flex-col items-center gap-4">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[260px] sm:h-[280px]"
      >
        <PieChart onMouseEnter={onPieEnter}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent 
            hideLabel 
            formatter={(value, name, props) => (
              <div className='flex flex-col gap-0.5'>
                <span className='font-medium'>{props.payload?.label}</span>
                <span className='text-muted-foreground'>{Number(value).toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                })}</span>
              </div>
            )}
          />}
        />
        <Pie
          data={spendingByCategory}
          dataKey="value"
          nameKey="label"
          innerRadius={70}
          outerRadius={100}
          strokeWidth={5}
          startAngle={90}
          endAngle={-270}
          paddingAngle={spendingByCategory.length > 1 ? 2 : 0}
          activeIndex={activeIndex}
          activeShape={(props) => {
            const outerRadius = (props.outerRadius as number) + 4;
            return (
              <Sector
                {...props}
                outerRadius={outerRadius}
                cornerRadius={6}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            );
          }}
        >
          {spendingByCategory.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} className={cn('outline-none ring-0 focus:ring-0 focus-visible:ring-0',
              index === activeIndex && 'stroke-border'
            )}/>
          ))}
          <Label
            content={() => {
              if (!activeSegment) return null;
              return (
                <g>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-semibold fill-foreground"
                    dy="-0.5em"
                  >
                    {activeSegment.value.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      maximumFractionDigits: 0,
                    })}
                  </text>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs sm:text-sm fill-muted-foreground"
                    dy="1.2em"
                  >
                    {activeSegment.label}
                  </text>
                </g>
              );
            }}
          />
        </Pie>
      </PieChart>
      </ChartContainer>
      <div className="grid w-full gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {spendingByCategory.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.category}
              type="button"
              className={cn(
                'flex items-center justify-between rounded-md border bg-background px-3 py-2 text-left transition-colors',
                index === activeIndex && 'border-primary/60 bg-primary/5'
              )}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="flex items-center gap-1">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate font-medium text-foreground">
                    {item.label}
                  </span>
                </span>
              </span>
              <span className="font-medium text-foreground">
                {item.value.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
