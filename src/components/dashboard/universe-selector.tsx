'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle, Sparkles } from 'lucide-react';
import type { Universe } from '@/lib/types';

interface UniverseSelectorProps {
  universes: Universe[];
  activeUniverse: Universe['id'];
  onUniverseChange: (universeId: Universe['id']) => void;
}

export function UniverseSelector({
  universes,
  activeUniverse,
  onUniverseChange,
}: UniverseSelectorProps) {
  const activeUniverseData = universes.find((u) => u.id === activeUniverse);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm w-full md:w-auto">
        <Sparkles className="h-6 w-6 text-primary flex-shrink-0" />
        <div className="w-full">
          <div className="flex items-center justify-between">
            <Label htmlFor="universe-select" className="text-sm font-medium">
              Categorization Universe
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="max-w-xs">
                <p>
                  Switch between different lenses to view your transactions. Each
                  &quot;universe&quot; uses a different model to categorize your
                  spending.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            value={activeUniverse}
            onValueChange={(value) => onUniverseChange(value as Universe['id'])}
          >
            <SelectTrigger
              id="universe-select"
              className="w-full md:w-[260px] h-auto mt-1 border-0 bg-transparent px-0 py-0 shadow-none focus:ring-0 focus:ring-offset-0"
            >
              <SelectValue placeholder="Select a universe" />
            </SelectTrigger>
            <SelectContent>
              {universes.map((universe) => (
                <SelectItem key={universe.id} value={universe.id}>
                  {universe.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           {activeUniverseData && (
             <p className="text-xs text-muted-foreground mt-1">{activeUniverseData.description}</p>
            )}
        </div>
      </div>
    </TooltipProvider>
  );
}
