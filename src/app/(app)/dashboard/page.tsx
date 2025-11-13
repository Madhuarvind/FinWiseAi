import TransactionTable from '@/components/dashboard/transaction-table';
import { transactions, categories } from '@/lib/data';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Transaction Dashboard
        </h1>
        <p className="text-muted-foreground">
          Review, categorize, and analyze your financial transactions with AI-powered insights.
        </p>
      </div>
      <TransactionTable initialTransactions={transactions} categories={categories} />
    </div>
  );
}
