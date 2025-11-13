'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface FairnessMetricsTableProps {
  data: {
    groups: string[];
    metrics: {
      metric: string;
      scores: number[];
      description: string;
    }[];
  };
}

const getScoreColor = (score: number) => {
  if (score > 0.9) {
    return 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300';
  } else if (score > 0.8) {
    return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300';
  } else {
    return 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300';
  }
};

export function FairnessMetricsTable({ data }: FairnessMetricsTableProps) {
  const { groups, metrics } = data;

  return (
    <TooltipProvider>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Fairness Metric</TableHead>
              {groups.map((group) => (
                <TableHead key={group} className="text-center font-semibold">
                  {group}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map(({ metric, scores, description }) => (
              <TableRow key={metric}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{metric}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
                {scores.map((score, index) => (
                  <TableCell key={`${metric}-${groups[index]}`} className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-base font-semibold border-0 ${getScoreColor(score)}`}
                    >
                      {score.toFixed(2)}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}
