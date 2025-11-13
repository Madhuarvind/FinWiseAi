'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import TransactionTable from '@/components/dashboard/transaction-table';
import { universes } from '@/lib/data';
import type { Category, Transaction, Universe } from '@/lib/types';
import { preprocessTransactions } from '@/lib/preprocessing';
import { DollarSign, ListChecks, AlertTriangle, Activity, MessageSquareHeart, BookText, Fingerprint, ShieldAlert, Loader2 } from 'lucide-react';
import { SpendingByCategoryChart } from '@/components/dashboard/spending-by-category-chart';
import { UniverseSelector } from '@/components/dashboard/universe-selector';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [activeUniverseId, setActiveUniverseId] = React.useState<Universe['id']>('banking');
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'transactions');
  }, [user, firestore]);
  const { data: rawTransactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsQuery);

  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);
  const { data: allCategories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const preprocessedTransactions = React.useMemo(() => {
    return preprocessTransactions(rawTransactions || []);
  }, [rawTransactions]);

  const transactions = React.useMemo(() => {
    return (preprocessedTransactions || []).map(t => ({
      ...t,
      category: t.multiCategory?.[activeUniverseId] || t.category || 'other'
    }));
  }, [preprocessedTransactions, activeUniverseId]);


  const totalSpending = (transactions || []).reduce(
    (sum, t) => (t.amount < 0 ? sum + t.amount : sum),
    0
  );
  
  const flaggedTransactions = (transactions || []).filter(
    (t) => t.status === 'flagged'
  ).length;

  const activeCategories = React.useMemo(() => {
    if (!transactions || !allCategories) return [];
    const categoriesForUniverse = new Set(transactions.map(t => t.category));
    return allCategories.filter(c => categoriesForUniverse.has(c.id));
  }, [transactions, allCategories]);

  const isLoading = isLoadingTransactions || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleActivateEmotionSafeMode = () => {
    toast({
      title: 'Emotion-Safe Mode Activated',
      description: 'Spending locks are now active for vulnerable categories and times.',
    });
  };

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
              Spending Stability (SSM)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Healthy</div>
             <p className="text-xs text-muted-foreground">Your weekly spending is consistent.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Financial Mood DNA (FM-DNA)
            </CardTitle>
            <Fingerprint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono tracking-widest">C-R-L-S-I</div>
            <p className="text-xs text-muted-foreground">
              (Calm, Routine, Low-Risk, Stable, Intentional)
            </p>
             <p className="text-xs text-muted-foreground mt-1">Lore: Evolving from 'Saver' to 'Smart Investor'.</p>
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

       <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
            <Card className="bg-accent/30 border-accent/50">
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <MessageSquareHeart className="h-5 w-5 text-accent-foreground"/>
                        Emotional Saving Advisor (ESA)
                    </CardTitle>
                    <CardDescription>This looks like impulsive nighttime shopping. Shall I set a spending lock for this category after 10 PM?</CardDescription>
                </CardHeader>
                <CardContent className='pt-0'>
                     <Button variant="secondary" size="sm" onClick={handleActivateEmotionSafeMode}>Activate Emotion-Safe Mode</Button>
                </CardContent>
            </Card>
            <Card className="bg-secondary/30 border-secondary/50">
                <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <BookText className="h-5 w-5 text-secondary-foreground"/>
                        Financial Journal (AFJW/FSOD)
                    </CardTitle>
                     <CardDescription>Today was a disciplined day—one essential purchase and no impulsive buys. A perfect step towards your goals.</CardDescription>
                </CardHeader>
                 <CardContent className='pt-0'>
                    <Button variant="secondary" size="sm">View Full Journal</Button>
                </CardContent>
            </Card>
            <Card className="border-destructive/50">
                 <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-destructive"/>
                        Habit Vulnerability Radar (HVR)
                    </CardTitle>
                    <CardDescription>AI has identified your spending weak points to help you stay on track.</CardDescription>
                 </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <p><span className='font-semibold'>Vulnerable Hours:</span> 10 PM - 2 AM</p>
                    <p><span className='font-semibold'>Vulnerable Category:</span> Online Shopping</p>
                 </CardContent>
            </Card>
        </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TransactionTable
              transactions={transactions}
              categories={allCategories || []}
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
