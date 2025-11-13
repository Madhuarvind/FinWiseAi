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

type SortKey = keyof Transaction | '';

export default function TransactionTable({
  initialTransactions,
  categories,
}: {
  initialTransactions: Transaction[];
  categories: Category[];
}) {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const [selectedTransaction, setSelectedTransaction] =
    React.useState<Transaction | null>(null);
  const [isSheetOpen, setSheetOpen] = React.useState(false);
  const [sortKey, setSortKey] = React.useState<SortKey>('date');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

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
    // Show only the first 5 transactions
    const limitedTransactions = transactions.slice(0, 5);
    return [...limitedTransactions].sort((a, b) => {
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

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
  };
  
  const getCategoryDetails = (categoryId: string) => {
    return categories.find((c) => c.value === categoryId);
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

              return (
                <TableRow key={transaction.id} onClick={() => handleOpenSheet(transaction)} className="cursor-pointer">
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell
                    className={cn(transaction.amount > 0 ? 'text-green-600' : 'text-foreground')}
                  >
                    {transaction.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <CategoryIcon className="h-4 w-4 text-muted-foreground" />
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
