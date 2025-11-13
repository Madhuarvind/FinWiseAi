'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { transactions, categories } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import TransactionTable from '@/components/dashboard/transaction-table';
import { preprocessTransactions } from '@/lib/preprocessing';
import { Separator } from '@/components/ui/separator';

export default function DataIngestionPage() {
  const { toast } = useToast();
  // Manual entry state
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Table state
  const [allTransactions, setAllTransactions] = React.useState(preprocessTransactions(transactions));

  // File upload state
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

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

    const newTransaction: Transaction = {
      id: `txn_${Math.random().toString(36).substr(2, 9)}`,
      date: format(date, 'yyyy-MM-dd'),
      description: description,
      amount: -Math.abs(parseFloat(amount)), // Assume it's a debit
      category: 'shopping', // AI will classify this
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please choose a CSV or JSON file to upload.',
      });
      return;
    }

    setIsProcessing(true);
    toast({
      title: 'Processing File...',
      description: `Ingesting and validating ${file.name}.`,
    });

    // Simulate backend processing
    setTimeout(() => {
      // Simulate adding a few transactions from the file
      const fileTransactions: Transaction[] = [
        { id: 'txn_file_1', date: '2024-07-20', description: 'DELTA AIRLINES', amount: -672.55, category: 'travel', status: 'pending' },
        { id: 'txn_file_2', date: '2024-07-20', description: 'HOME DEPOT #123', amount: -88.12, category: 'home', status: 'pending' },
        { id: 'txn_file_3_malformed', date: '2024-07-20', description: 'Vendor without amount', amount: 0, category: 'home', status: 'flagged'},
      ];

      const validTransactions = preprocessTransactions(fileTransactions.filter(t => t.amount !== 0));
      const malformedCount = fileTransactions.length - validTransactions.length;

      setAllTransactions(prev => [...validTransactions, ...prev]);

      setIsProcessing(false);
      setFile(null);

      toast({
        title: 'Ingestion Complete',
        description: (
          <div className='flex flex-col gap-2 text-sm'>
            <div className='flex items-center gap-2'><CheckCircle className='text-green-500'/><span>{validTransactions.length} records ingested successfully.</span></div>
            {malformedCount > 0 && <div className='flex items-center gap-2'><XCircle className='text-red-500' /><span>{malformedCount} malformed records were quarantined.</span></div>}
          </div>
        )
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Data Ingestion & Validation
        </h1>
        <p className="text-muted-foreground">
          Add new transactions individually or via bulk upload.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add a Single Transaction</CardTitle>
            <CardDescription>
              Enter details for a new transaction. The AI will automatically categorize it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Merchant Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Amazon Marketplace"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Bulk Import from File</CardTitle>
            <CardDescription>
              Upload a CSV or JSON file to ingest multiple transactions at once.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 justify-center items-center text-center p-8 border-2 border-dashed border-muted rounded-lg h-[255px]'>
            {!file ? (
                 <>
                    <div className='p-3 bg-muted rounded-full'>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-2">Drag & drop a file or click to select</p>
                    <Button variant="outline" asChild>
                        <Label htmlFor="file-upload" className='cursor-pointer'>
                           Select File
                        </Label>
                    </Button>
                    <Input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv,.json" />
                </>
            ) : (
                <div className='flex flex-col items-center gap-3'>
                    <FileText className='h-10 w-10 text-primary'/>
                    <p className='font-medium'>{file.name}</p>
                    <p className='text-xs text-muted-foreground'>Ready for ingestion</p>
                </div>
            )}
           
          </CardContent>
           <CardContent>
             <Button onClick={handleFileUpload} disabled={!file || isProcessing} className="w-full">
              {isProcessing ? 'Processing...' : 'Upload and Ingest'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>All ingested transactions are shown here, ready for AI processing and review.</CardDescription>
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
