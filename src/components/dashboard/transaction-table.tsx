
'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  PenSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Transaction, Category, Universe } from '@/lib/types';
import { TransactionDetailSheet } from './transaction-detail-sheet';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from '@/components/icons';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

type SortKey = keyof Transaction | 'createdAt' | '';


export default function TransactionTable({
  transactions,
  categories,
  activeUniverse,
}: {
  transactions: Transaction[];
  categories: Category[];
  activeUniverse?: Universe['id'];
}) {
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const { user } = useUser();
  const firestore = useFirestore();

  // Used to highlight newly added rows
  const [highlightedRows, setHighlightedRows] = React.useState<Set<string>>(new Set());
  const prevTransactionIds = React.useRef(new Set(transactions.map(t => t.id)));


  React.useEffect(() => {
      const currentTransactionIds = new Set(transactions.map(t => t.id));
      const newlyAdded = new Set([...currentTransactionIds].filter(id => !prevTransactionIds.current.has(id)));

      if (newlyAdded.size > 0) {
          setHighlightedRows(current => new Set([...current, ...newlyAdded]));
          const timer = setTimeout(() => {
              setHighlightedRows(new Set());
          }, 2000); 
          
          prevTransactionIds.current = new Set([...prevTransactionIds.current, ...newlyAdded]);
          
          return () => clearTimeout(timer);
      }
  }, [transactions]);


  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortKey || !transactions) return transactions || [];
    
    return [...transactions].sort((a, b) => {
      let aValue: any = a[sortKey as keyof Transaction];
      let bValue: any = b[sortKey as keyof Transaction];

      if (sortKey === 'createdAt') {
        aValue = a.createdAt ? (a.createdAt.seconds * 1000 + (a.createdAt.nanoseconds || 0) / 1000000) : 0;
        bValue = b.createdAt ? (b.createdAt.seconds * 1000 + (b.createdAt.nanoseconds || 0) / 1000000) : 0;
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortKey, sortDirection]);

  const handleOpenSheet = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setSheetOpen(true);
  };

  const handleUpdateTransaction = async (transactionId: string, updates: Partial<Transaction>) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'transactions', transactionId);
    await setDoc(docRef, updates, { merge: true });
    // Realtime listener will update the state, no need to manually set state here.
  };
  
  const getCategoryDetails = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  }

  const SortableHeader = ({ tKey, label }: { tKey: SortKey; label: string }) => (
    <TableHead onClick={() => handleSort(tKey)} className="cursor-pointer">
      <div className="flex items-center gap-2">
        {label}
        {sortKey === tKey && (sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
      </div>
    </TableHead>
  );

  return (
    <>
      <div className="overflow-hidden rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader tKey="createdAt" label="Date" />
              <TableHead>Description</TableHead>
              <SortableHeader tKey="amount" label="Amount" />
              <SortableHeader tKey="category" label="Category" />
              <SortableHeader tKey="status" label="Status" />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const categoryDetails = getCategoryDetails(transaction.category);
              const CategoryIcon = categoryDetails ? getCategoryIcon(categoryDetails.icon) : MoreHorizontal;

              const moodColor = categoryDetails?.moodColor || 'bg-muted';
              const isHighlighted = highlightedRows.has(transaction.id);
              
              let dateToShow = transaction.date;
              if (transaction.createdAt && typeof transaction.createdAt === 'object' && 'seconds' in transaction.createdAt) {
                 try {
                    dateToShow = new Date(transaction.createdAt.seconds * 1000).toLocaleDateString();
                 } catch (e) {
                    // fall back to original date
                 }
              }


              return (
                <TableRow 
                  key={transaction.id} 
                  onClick={() => handleOpenSheet(transaction)} 
                  className={cn(
                    "cursor-pointer transition-colors duration-1000",
                    transaction.status === 'flagged' && 'bg-destructive/10 hover:bg-destructive/20',
                    isHighlighted && 'bg-primary/10'
                  )}
                >
                  <TableCell>{dateToShow}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell
                    className={cn(transaction.amount > 0 ? 'text-green-600' : 'text-foreground')}
                  >
                    {transaction.amount.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div className={cn("h-4 w-4 rounded-full flex items-center justify-center", moodColor)}>
                           <CategoryIcon className="h-2.5 w-2.5 text-white" />
                        </div>
                        {categoryDetails?.label || 'Uncategorized'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === 'reviewed'
                          ? 'secondary'
                          : transaction.status === 'pending'
                          ? 'outline'
                          : 'destructive'
                      }
                      className="capitalize"
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenSheet(transaction); }}>
                        <PenSquare className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {selectedTransaction && activeUniverse && (
        <TransactionDetailSheet
          isOpen={isSheetOpen}
          setIsOpen={setSheetOpen}
          transaction={selectedTransaction}
          categories={categories}
          onUpdate={handleUpdateTransaction}
          activeUniverse={activeUniverse}
        />
      )}
    </>
  );
}
