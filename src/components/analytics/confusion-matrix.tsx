
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ConfusionMatrixProps {
  data: {
    labels: string[];
    values: number[][];
  };
}

export function ConfusionMatrix({ data }: ConfusionMatrixProps) {
  const { labels, values } = data;
  const totals = values.map((row) => row.reduce((sum, val) => sum + val, 0));
  const maxVal = Math.max(...values.flat());

  const getCellColor = (value: number, isDiagonal: boolean) => {
    if (isDiagonal) {
      // Correct predictions: shades of primary
      const opacity = Math.max(0.2, Math.min(1, value / maxVal));
      return `hsl(var(--primary) / ${opacity})`;
    } else {
      // Incorrect predictions: shades of destructive
      if (value === 0) return 'transparent';
      const opacity = Math.max(0.2, Math.min(1, (value / maxVal) * 2));
      return `hsl(var(--destructive) / ${opacity})`;
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px] font-semibold">
              Actual Category
            </TableHead>
            {labels.map((label) => (
              <TableHead key={label} className="text-center font-semibold">
                Predicted: {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {labels.map((actualLabel, rowIndex) => (
            <TableRow key={actualLabel}>
              <TableCell className="font-semibold">{actualLabel}</TableCell>
              {labels.map((_, colIndex) => {
                const value = values[rowIndex][colIndex];
                const isDiagonal = rowIndex === colIndex;
                const percentage =
                  totals[rowIndex] > 0
                    ? ((value / totals[rowIndex]) * 100).toFixed(1)
                    : '0.0';

                return (
                  <TableCell
                    key={`${actualLabel}-${labels[colIndex]}`}
                    className="text-center"
                    style={{
                      backgroundColor: getCellColor(value, isDiagonal),
                      color: isDiagonal ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                    }}
                  >
                    <div className="text-lg font-bold">{value}</div>
                    <div className={cn("text-xs", isDiagonal ? 'text-primary-foreground/80' : 'text-foreground/80')}>{percentage}%</div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
