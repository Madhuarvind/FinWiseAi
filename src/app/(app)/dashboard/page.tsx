import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TransactionTable from '@/components/dashboard/transaction-table';
import { transactions as rawTransactions, categories } from '@/lib/data';
import { preprocessTransactions } from '@/lib/preprocessing';
import { DollarSign, ListChecks, AlertTriangle, Activity } from 'lucide-react';
import { SpendingByCategoryChart } from '@/components/dashboard/spending-by-category-chart';

export default function DashboardPage() {
  // Preprocess transactions before using them
  const transactions = preprocessTransactions(rawTransactions);

  const totalSpending = transactions.reduce(
    (sum, t) => (t.amount < 0 ? sum + t.amount : sum),
    0
  );
  const reviewedTransactions = transactions.filter(
    (t) => t.status === 'reviewed'
  ).length;
  const flaggedTransactions = transactions.filter(
    (t) => t.status === 'flagged'
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Transaction Dashboard
        </h1>
        <p className="text-muted-foreground">
          Review, categorize, and analyze your financial transactions with
          AI-powered insights.
        </p>
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
              Transactions Processed
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
             <p className="text-xs text-muted-foreground">in the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Human-in-the-Loop Reviews
            </CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              transactions manually verified
            </p>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TransactionTable
              initialTransactions={transactions}
              categories={categories}
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
              categories={categories}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
