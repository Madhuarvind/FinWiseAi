
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Frown, Gauge, Target, Bot, Users, TrendingUp, ShieldCheck, Loader2 } from 'lucide-react';
import { ConfusionMatrix } from '@/components/analytics/confusion-matrix';
import { PerCategoryAccuracyChart } from '@/components/analytics/per-category-accuracy-chart';
import { SocialSpendingChart } from '@/components/analytics/social-spending-chart';
import { MerchantDriftChart } from '@/components/analytics/merchant-drift-chart';
import { FairnessMetricsTable } from '@/components/analytics/fairness-metrics-table';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Transaction, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// This is still simulated as there's no real data source for this.
const confusionMatrixData = {
  labels: ['Food', 'Shopping', 'Transport', 'Home'],
  values: [
    [120, 5, 2, 1],
    [8, 250, 4, 10],
    [1, 3, 95, 0],
    [3, 12, 1, 88],
  ],
};

const merchantDriftData = [
    { month: 'Jan', drift: 0.02 },
    { month: 'Feb', drift: 0.03 },
    { month: 'Mar', drift: 0.05 },
    { month: 'Apr', drift: 0.04 },
    { month: 'May', drift: 0.08 },
    { month: 'Jun', drift: 0.11 },
];

const AnalyticsSkeleton = () => (
    <div className="space-y-6">
        <div>
            <Skeleton className="h-9 w-1/2" />
            <Skeleton className="h-5 w-3/4 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Macro F1 Score (Simulated)</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Inference Latency</CardTitle>
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Error Clusters Detected</CardTitle>
                    <Frown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </CardContent>
            </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Confusion Matrix (Simulated)</CardTitle>
                    <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Per-Category Accuracy</CardTitle>
                    <CardDescription><Skeleton className="h-4 w-48" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[350px] w-full" />
                </CardContent>
            </Card>
        </div>
    </div>
);


export default function AnalyticsPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const transactionsQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'transactions');
    }, [user, firestore]);
    const { data: transactions, isLoading: isLoadingTransactions } = useCollection<Transaction>(transactionsQuery);

    const categoriesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'categories');
    }, [firestore]);
    const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

    const analyticsData = React.useMemo(() => {
        if (!transactions || !categories) {
            return null;
        }

        const categoryMap = new Map(categories.map(c => [c.id, c.label]));
        
        // Per-Category Accuracy
        const categoryStats: Record<string, { total: number; reviewed: number }> = {};
        transactions.forEach(t => {
            if (!categoryStats[t.category]) {
                categoryStats[t.category] = { total: 0, reviewed: 0 };
            }
            categoryStats[t.category].total++;
            if (t.status === 'reviewed') {
                categoryStats[t.category].reviewed++;
            }
        });

        const perCategoryAccuracyData = Object.entries(categoryStats)
            .map(([categoryId, stats]) => ({
                category: categoryMap.get(categoryId) || 'Unknown',
                accuracy: stats.total > 0 ? stats.reviewed / stats.total : 0,
            }))
            .filter(item => item.accuracy > 0)
            .sort((a, b) => b.accuracy - a.accuracy);

        // Social Spending (simulated peer)
        const foodAndDrinkSpending = transactions
            .filter(t => t.category === 'food-drink')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const socialSpendingData = [
            { name: 'You', value: foodAndDrinkSpending, fill: 'hsl(var(--primary))' },
            { name: 'Peer Group', value: foodAndDrinkSpending * 0.85, fill: 'hsl(var(--muted))' } // Simulated peer
        ];

        // Fairness Metrics
        const valueTiers = {
            'Low Value (<$20)': { total: 0, reviewed: 0 },
            'Med Value ($20-$100)': { total: 0, reviewed: 0 },
            'High Value (>$100)': { total: 0, reviewed: 0 },
        };

        transactions.forEach(t => {
            const amount = Math.abs(t.amount);
            let tier: keyof typeof valueTiers | null = null;
            if (amount < 20) tier = 'Low Value (<$20)';
            else if (amount <= 100) tier = 'Med Value ($20-$100)';
            else tier = 'High Value (>$100)';

            valueTiers[tier].total++;
            if (t.status === 'reviewed') valueTiers[tier].reviewed++;
        });
        
        const equalOpportunityScores = Object.values(valueTiers).map(tier => 
            tier.total > 0 ? tier.reviewed / tier.total : 0
        );

        const fairnessData = {
            groups: Object.keys(valueTiers),
            metrics: [
                {
                    metric: 'Equal Opportunity',
                    scores: equalOpportunityScores,
                    description: 'Measures if the model performs equally well for all groups on positive outcomes (based on "reviewed" status).',
                },
                {
                    metric: 'Predictive Parity',
                    scores: equalOpportunityScores.map(s => s + (Math.random() * 0.04 - 0.02)), // Simulate slight variation
                    description: 'Ensures the probability of a correct prediction is the same for all groups.',
                },
            ],
        };
        
        const f1Score = perCategoryAccuracyData.length > 0 
            ? perCategoryAccuracyData.reduce((acc, c) => acc + c.accuracy, 0) / perCategoryAccuracyData.length
            : 0;

        return { perCategoryAccuracyData, socialSpendingData, fairnessData, f1Score };
    }, [transactions, categories]);

    const isLoading = isLoadingTransactions || isLoadingCategories;

    if (isLoading) {
        return <AnalyticsSkeleton />;
    }

    return (
        <div className="space-y-6">
        <div>
            <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
            Self-Healing Model Debugger
            </h1>
            <p className="text-muted-foreground">
            The system actively monitors its own performance, diagnoses issues, and suggests corrective actions.
            </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Macro F1 Score (Simulated)</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-primary">
                {(analyticsData?.f1Score || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                Based on user-reviewed transaction accuracy.
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Avg. Inference Latency
                </CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">112ms</div>
                <p className="text-xs text-muted-foreground">
                +3% from last week
                </p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Error Clusters Detected
                </CardTitle>
                <Frown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                2
                </div>
                <p className="text-xs text-muted-foreground">"Swiggy Instamart", "Bank of India EMI"</p>
            </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
            <CardHeader>
                <CardTitle>Confusion Matrix (Simulated)</CardTitle>
                <p className="text-sm text-muted-foreground pt-1">
                Visualizing prediction accuracy across top categories.
                </p>
            </CardHeader>
            <CardContent>
                <ConfusionMatrix data={confusionMatrixData} />
            </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Per-Category Accuracy</CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">
                        Identifying performance variations between categories.
                    </p>
                </CardHeader>
                <CardContent>
                    {analyticsData ? (
                        <PerCategoryAccuracyChart data={analyticsData.perCategoryAccuracyData} />
                    ) : (
                        <div className="h-[350px] flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
                    )}
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div>
                    <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <ShieldCheck className="text-primary"/>
                        Fairness &amp; Bias Report
                    </h2>
                    <p className="text-muted-foreground">
                        Auditing model performance across different transaction segments.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Fairness Metrics</CardTitle>
                        <p className="text-sm text-muted-foreground pt-1">
                            Ensuring equitable performance across transaction value tiers.
                        </p>
                    </CardHeader>
                    <CardContent>
                        {analyticsData ? (
                            <FairnessMetricsTable data={analyticsData.fairnessData} />
                        ) : (
                            <div className="h-[200px] flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                        <Bot className="text-primary"/>
                        Predictive Category Drift Oracle (FCSS/CQPR)
                    </h2>
                    <p className="text-muted-foreground">
                        Forecasting future changes in category definitions.
                    </p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>AI-Suggested Action</CardTitle>
                        <CardDescription>
                            The oracle predicts the 'Shopping' category is likely to split.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">A new cluster is forming around "Quick Commerce" (e.g., Blinkit, Zepto). The AI recommends creating a new sub-category to maintain accuracy.</p>
                    </CardContent>
                </Card>
            </div>
        </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                            <TrendingUp className="text-primary"/>
                            Merchant Evolution Report (AMIF)
                        </h2>
                        <p className="text-muted-foreground">
                            Tracking how merchant semantics change over time.
                        </p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Semantic Drift Detected</CardTitle>
                            <CardDescription>
                                The meaning of "Swiggy" has drifted by 11% in the last month.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MerchantDriftChart data={merchantDriftData} />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <div>
                        <h2 className="font-headline text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                            <Users className="text-primary"/>
                            Social Spending Benchmark (AMIF)
                        </h2>
                        <p className="text-muted-foreground">
                            Comparing your spending to a synthetic, anonymized peer group.
                        </p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending vs. Peers (Food &amp; Drink)</CardTitle>
                            <CardDescription>
                                Compare your spending to an anonymized demographic cluster.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                        {analyticsData ? (
                            <SocialSpendingChart data={analyticsData.socialSpendingData} />
                        ): (
                            <div className="h-[150px] flex justify-center items-center"><Loader2 className="h-6 w-6 animate-spin"/></div>
                        )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
