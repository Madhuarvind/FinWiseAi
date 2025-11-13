'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, UploadCloud, FileText, CheckCircle, XCircle, Wand2, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { transactions as initialTransactionsData, categories } from '@/lib/data';
import type { Transaction } from '@/lib/types';
import TransactionTable from '@/components/dashboard/transaction-table';
import { preprocessTransactions } from '@/lib/preprocessing';
import { Separator } from '@/components/ui/separator';
import { synthesizeTransactions } from '@/ai/flows/synthesize-transactions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DataIngestionPage() {
  const { toast } = useToast();
  // Manual entry state
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Table state
  const [allTransactions, setAllTransactions] = React.useState(preprocessTransactions(initialTransactionsData));

  // File upload state
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Synthetic data state
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [numToGenerate, setNumToGenerate] = React.useState("5");
  const [categoryToGenerate, setCategoryToGenerate] = React.useState<string>(categories[0]?.value || '');

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

  const handleGenerateSyntheticData = async () => {
    if (!categoryToGenerate || !numToGenerate) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please select a category and number of transactions to generate.',
      });
      return;
    }
    
    setIsGenerating(true);
    toast({ title: "Generating synthetic data...", description: "The AI is creating new transaction records." });

    try {
      const result = await synthesizeTransactions({
        count: parseInt(numToGenerate, 10),
        category: categories.find(c => c.value === categoryToGenerate)?.label || 'Unknown',
      });

      const syntheticTxs: Transaction[] = result.transactions.map((tx, i) => ({
        id: `syn_${categoryToGenerate}_${Date.now()}_${i}`,
        date: format(new Date(), 'yyyy-MM-dd'),
        description: tx.description,
        amount: -Math.abs(tx.amount),
        category: categoryToGenerate,
        status: 'pending',
      }));

      const preprocessedNew = preprocessTransactions(syntheticTxs);
      setAllTransactions(prev => [...preprocessedNew, ...prev]);

      toast({
        title: "Generation Complete",
        description: `${result.transactions.length} new transactions have been added.`,
      });

    } catch (error) {
      console.error("Synthetic data generation failed:", error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate synthetic transaction data.',
      });
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Data Ingestion & Validation
        </h1>
        <p className="text-muted-foreground">
          Add new transactions individually, via bulk upload, or generate synthetic data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Manual & Bulk Data Entry</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                 <h3 className="font-medium">Add a Single Transaction</h3>
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
              </div>

             <div className='space-y-4'>
                <h3 className="font-medium">Bulk Import from File</h3>
                <div className='flex flex-col gap-4 justify-center items-center text-center p-8 border-2 border-dashed border-muted rounded-lg h-[255px]'>
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
                </div>
                 <Button onClick={handleFileUpload} disabled={!file || isProcessing} className="w-full">
                  {isProcessing ? 'Processing...' : 'Upload and Ingest'}
                </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Synthetic Data Generation</CardTitle>
            <CardDescription>
              Use the AI to create realistic sample data to bootstrap your models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-select">Category</Label>
                <Select value={categoryToGenerate} onValueChange={setCategoryToGenerate} disabled={categories.length === 0}>
                  <SelectTrigger id="category-select">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {categories.length === 0 && <p className='text-xs text-muted-foreground'>Please add a category on the Taxonomy page first.</p>}
              </div>
               <div className="space-y-2">
                <Label htmlFor="num-to-generate">Number to Generate</Label>
                <Input
                  id="num-to-generate"
                  type="number"
                  value={numToGenerate}
                  onChange={(e) => setNumToGenerate(e.target.value)}
                  placeholder="e.g., 10"
                />
              </div>
            </div>
          </CardContent>
           <CardContent>
             <Button onClick={handleGenerateSyntheticData} disabled={isGenerating || categories.length === 0} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
              {isGenerating ? 'Generating...' : 'Generate Transactions'}
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
