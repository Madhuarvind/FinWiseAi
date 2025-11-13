'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle, Briefcase, CheckCircle, CircleDashed, Plane, Hotel, Car, Utensils, Ticket, Sparkles } from 'lucide-react';
import type { Trip, TripTransaction } from '@/lib/types-trips';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusConfig = {
  Confirmed: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300',
    icon: CheckCircle
  },
  Draft: {
    label: 'Draft',
    color: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-300',
    icon: CircleDashed
  },
};

const intentConfig = {
  Business: { icon: Briefcase, color: 'text-blue-500' },
  Leisure: { icon: Sparkles, color: 'text-amber-500' },
  Family: { icon: 'Users', color: 'text-purple-500' }, // Assuming Users icon exists
  Relocation: { icon: 'Package', color: 'text-gray-500' }, // Assuming Package icon exists
};

const transactionTypeIcons: { [key: string]: React.ElementType } = {
  flight: Plane,
  hotel: Hotel,
  local_transport: Car,
  dining: Utensils,
  attraction: Ticket,
  other: AlertCircle
};

export default function TripCard({ trip }: { trip: Trip }) {
  const { title, startDate, endDate, status, totalEstimatedCost, savings, intent, transactions } = trip;
  const StatusIcon = statusConfig[status].icon;
  const IntentIcon = intentConfig[intent.type]?.icon || AlertCircle;
  
  const savedAmount = savings.actions.reduce((sum, action) => action.status === 'completed' ? sum + action.savedAmount : sum, 0);
  const savingsProgress = (savedAmount / savings.target) * 100;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Badge className={cn("text-base", statusConfig[status].color)}>
            <StatusIcon className="mr-2 h-4 w-4" />
            {statusConfig[status].label}
          </Badge>
        </div>
        <CardDescription>
          {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Trip Intent</p>
            <div className="flex items-center gap-2">
              <IntentIcon className={cn("h-5 w-5", intentConfig[intent.type]?.color)} />
              <span className="font-semibold">{intent.type}</span>
              <Badge variant="outline" className="text-xs">{(intent.confidence * 100).toFixed(0)}% Conf.</Badge>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-2xl font-bold">₹{totalEstimatedCost.toLocaleString()}</p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-semibold mb-2">Dynamic Travel Saver (DTS)</h4>
          <p className="text-sm text-muted-foreground">
            You've offset {savedAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} of your trip cost.
          </p>
          <Progress value={savingsProgress} className="mt-2" />
          <div className="mt-4 space-y-2">
            {savings.actions.map(action => (
              <div key={action.id} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                <div className="text-sm">
                  <p className="font-medium">{action.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Potential Savings: ₹{action.potentialSaving.toLocaleString()}
                  </p>
                </div>
                {action.status === 'completed' ? (
                  <Badge variant="secondary" className='bg-green-100 text-green-900'>Completed</Badge>
                ) : (
                  <Button size="sm" variant="outline">Activate</Button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <Accordion type="single" collapsible>
          <AccordionItem value="transactions">
            <AccordionTrigger className="text-base font-semibold">
              Transaction Timeline ({transactions.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {transactions.map((tx) => {
                  const Icon = transactionTypeIcons[tx.type] || AlertCircle;
                  return (
                    <div key={tx.id} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ₹{Math.abs(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Manage Trip</Button>
      </CardFooter>
    </Card>
  );
}
