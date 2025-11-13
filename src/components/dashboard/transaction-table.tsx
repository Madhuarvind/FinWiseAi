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

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      )
    );
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.value === categoryId)?.label || 'N/A';
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
      <div className="overflow-hidden rounded-lg border">
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
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell
                    className={cn(transaction.amount > 0 ? 'text-accent-foreground' : 'text-foreground')}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenSheet(transaction)}>
                          Explain & Re-categorize
                        </DropdownMenuItem>
                        <DropdownMenuItem>Flag as incorrect</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
