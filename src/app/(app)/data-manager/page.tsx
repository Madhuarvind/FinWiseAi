'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { transactions, categories } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import TransactionTable from '@/components/dashboard/transaction-table';
import { preprocessTransactions } from '@/lib/preprocessing';

export default function DataManagerPage() {
  const { toast } = useToast();
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [allTransactions, setAllTransactions] = React.useState(preprocessTransactions(transactions));

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields to add a transaction.',
      });
      return;
    }

    // In a real app, you would send this to your backend.
    // For now, we'll just add it to our local state.
    const newTransaction: Transaction = {
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      date: format(date, 'yyyy-MM-dd'),
      description: description,
      amount: -Math.abs(parseFloat(amount)), // Assume it's a debit
      category: 'shopping', // Default category, AI would classify this
      status: 'pending',
    };
    
    const [preprocessedNew] = preprocessTransactions([newTransaction]);


    setAllTransactions(prev => [preprocessedNew, ...prev]);

    toast({
      title: 'Transaction Added',
      description: `${description} for $${amount} has been added.`,
    });

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Data Manager
        </h1>
        <p className="text-muted-foreground">
          Add new transactions to be processed by the AI engine.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add a New Transaction</CardTitle>
          <CardDescription>
            Enter the details for a new transaction below. The AI will automatically categorize it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="description">Merchant Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Amazon Marketplace"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 42.99"
              />
            </div>
             <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="col-span-1 md:col-span-4 flex justify-end">
                 <Button type="submit">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TransactionTable
              initialTransactions={allTransactions}
              categories={categories}
            />
          </CardContent>
        </Card>
    </div>
  );
}
