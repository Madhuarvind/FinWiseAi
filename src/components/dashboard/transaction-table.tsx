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
import type { Transaction, Category } from '@/lib/types';
import { TransactionDetailSheet } from './transaction-detail-sheet';
import { cn } from '@/lib/utils';
import { getCategoryIcon } from '@/components/icons';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

type SortKey = keyof Transaction | '';

export default function TransactionTable({
  transactions: initialTransactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>('date');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');
  const { user } = useUser();
  const firestore = useFirestore();

  React.useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedTransactions = React.useMemo(() => {
    if (!sortKey) return transactions;
    
    return [...transactions].sort((a, b) => {
      const aValue = a[sortKey as keyof Transaction];
      const bValue = b[sortKey as keyof Transaction];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortKey, sortDirection]);

  const handleOpenSheet = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setSheetOpen(true);
  };

  const handleUpdateTransaction = async (updatedTransaction: Transaction) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'transactions', updatedTransaction.id);
    const { id, ...dataToSave } = updatedTransaction;
    await setDoc(docRef, dataToSave, { merge: true });
    // Realtime listener will update the state
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
              <SortableHeader tKey="date" label="Date" />
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

              return (
                <TableRow 
                  key={transaction.id} 
                  onClick={() => handleOpenSheet(transaction)} 
                  className={cn(
                    "cursor-pointer",
                    transaction.status === 'flagged' && 'bg-destructive/10 hover:bg-destructive/20'
                  )}
                >
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
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
      {selectedTransaction && (
        <TransactionDetailSheet
          isOpen={isSheetOpen}
          setIsOpen={setSheetOpen}
          transaction={selectedTransaction}
          categories={categories}
          onUpdate={handleUpdateTransaction}
        />
      )}
    </>
  );
}
