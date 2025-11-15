'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
import { DollarSign, AlertTriangle, Activity, MessageSquareHeart, BookText, Fingerprint, ShieldAlert, Loader2, BrainCircuit, Zap } from 'lucide-react';
import { SpendingByCategoryChart } from '@/components/dashboard/spending-by-category-chart';
import { UniverseSelector } from '@/components/dashboard/universe-selector';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function DashboardPage() {
  const [activeUniverseId, setActiveUniverseId] = React.useState<Universe['id']>('banking');
  const [isJournalOpen, setIsJournalOpen] = React.useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

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
      title: 'Cognitive Repair Activated',
      description: 'Emotion-Safe spending locks are now active for vulnerable categories and times.',
    });
  };

  const handleViewJournal = () => {
    setIsJournalOpen(true);
  };

  return (
    <>
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
            <p className="text-xs text-muted-foreground">in the last 30 days (Cool Blue Zone)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Financial Entropy Score (FES)
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0.21 (Low & Stable)</div>
             <p className="text-xs text-muted-foreground">Your spending is predictable and structured.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BrainCircuit className="h-4 w-4"/> Financial Consciousness
            </CardTitle>
            <Fingerprint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono tracking-widest text-primary">Calm, Intentional</div>
            <p className="text-xs text-muted-foreground">
             (Low Anxiety, High Discipline)
            </p>
             <p className="text-xs text-muted-foreground mt-1"><span className="font-semibold">Financial Epoch (ATAS):</span> Evolved from 'Saver' to 'Strategic Investor'.</p>
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
                        Neuro-Financial Reflex (NFRS)
                    </CardTitle>
                    <CardDescription>NFRS reflex triggered: A late-night shopping pattern was detected. This is a cognitive repair suggestion (CRS) to prevent impulse spending.</CardDescription>
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
                    <Button variant="secondary" size="sm" onClick={handleViewJournal}>View Full Journal</Button>
                </CardContent>
            </Card>
            <Card className="border-destructive/50">
                 <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Zap className="h-5 w-5 text-destructive"/>
                        Emotion-Time Fusion Engine (ETFE)
                    </CardTitle>
                    <CardDescription>AI has identified your emotional danger zones to help you stay on track.</CardDescription>
                 </CardHeader>
                  <CardContent className="text-sm pt-0">
                    <p><span className='font-semibold'>High Impulse Zone:</span> 10 PM - 1 AM</p>
                    <p><span className='font-semibold'>Emotional Shopping Window:</span> Sunday Evening</p>
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
              activeUniverse={activeUniverseId}
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
              categories={allCategories || []}
            />
          </CardContent>
        </Card>
      </div>
    </div>
    <Dialog open={isJournalOpen} onOpenChange={setIsJournalOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Intent-Driven Financial Chat</DialogTitle>
                <DialogDescription>
                    Ask the AI to narrate your financial story from different perspectives.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                <div className="p-4 border rounded-lg bg-muted h-64 overflow-y-auto">
                    <p className="text-sm text-muted-foreground">[Chat history placeholder]</p>
                    <p className="font-medium mt-4">AI: Hello! How can I help you understand your finances today?</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Explain this month like I'm 10.</Button>
                    <Button variant="outline" size="sm">Show me transactions I might regret.</Button>
                    <Button variant="outline" size="sm">If I want to save ₹5000, what should I cut?</Button>
                    <Button variant="outline" size="sm">Talk to me like a strict mentor.</Button>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={() => setIsJournalOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
