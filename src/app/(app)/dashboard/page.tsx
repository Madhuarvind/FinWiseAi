'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TransactionTable from '@/components/dashboard/transaction-table';
import { transactions as rawTransactions, categories as allCategories, universes } from '@/lib/data';
import type { Category, Transaction, Universe } from '@/lib/types';
import { preprocessTransactions } from '@/lib/preprocessing';
import { DollarSign, ListChecks, AlertTriangle, Activity, MessageSquareHeart } from 'lucide-react';
import { SpendingByCategoryChart } from '@/components/dashboard/spending-by-category-chart';
import { UniverseSelector } from '@/components/dashboard/universe-selector';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [activeUniverseId, setActiveUniverseId] = React.useState<Universe['id']>('banking');
  
  // Memoize the initial preprocessing, so it only runs once
  const baseTransactions = React.useMemo(() => preprocessTransactions(rawTransactions), []);

  // State for transactions that can be updated by child components
  const [transactions, setTransactions] = React.useState<Transaction[]>(() => 
    baseTransactions.map(t => ({
      ...t,
      category: t.multiCategory[activeUniverseId] || 'other'
    }))
  );

  // Update transaction categories when the universe changes
  React.useEffect(() => {
    setTransactions(currentTxs => 
      currentTxs.map(t => {
        const originalTx = baseTransactions.find(bt => bt.id === t.id) || t;
        return {
          ...t,
          category: originalTx.multiCategory[activeUniverseId] || 'other',
        };
      })
    );
  }, [activeUniverseId, baseTransactions]);


  const totalSpending = transactions.reduce(
    (sum, t) => (t.amount < 0 ? sum + t.amount : sum),
    0
  );
  const reviewedTransactions = transactions.filter(
    (t) => t.status === 'reviewed'
  ).length;
  const flaggedTransactions = transactions.filter(
    (t) => t.status === 'flagged'
  ).length;

  const activeCategories = React.useMemo(() => {
    const categoriesForUniverse = new Set(transactions.map(t => t.category));
    return allCategories.filter(c => categoriesForUniverse.has(c.value));
  }, [transactions]);


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
            Transaction Dashboard
          </h1>
          <p className="text-muted-foreground">
            Review, categorize, and analyze your financial transactions with
            AI-powered insights.
          </p>
        </div>
        <UniverseSelector
          universes={universes}
          activeUniverse={activeUniverseId}
          onUniverseChange={setActiveUniverseId}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(totalSpending).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions Processed
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
             <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Human-in-the-Loop Reviews
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              transactions manually verified
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Flagged for Attention
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flaggedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              require manual inspection
            </p>
          </CardContent>
        </Card>
      </div>

       <Card className="bg-accent/30 border-accent/50">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <MessageSquareHeart className="h-5 w-5 text-accent-foreground"/>
                    Emotion-Aware Spending Coach (EASC)
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">This looks like impulsive nighttime shopping. Would you like me to help track such patterns?</p>
            </div>
            <Button variant="ghost" size="sm" className=" -mt-1 -mr-2">Review Patterns</Button>
          </CardHeader>
        </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TransactionTable
              initialTransactions={transactions}
              categories={allCategories}
            />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingByCategoryChart
              transactions={transactions}
              categories={activeCategories}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
