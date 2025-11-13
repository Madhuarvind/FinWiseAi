'use client';
import CategoryManager from '@/components/taxonomy/category-manager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function TaxonomyPage() {
  const firestore = useFirestore();
  const categoriesQuery = useMemoFirebase(() => collection(firestore, 'categories'), [firestore]);
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Taxonomy Management
        </h1>
        <p className="text-muted-foreground">
          View, create, and manage your transaction categories.
        </p>
      </div>
      <CategoryManager initialCategories={categories || []} />
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Wand2 className="text-primary"/> Category Evolution Forecast (PCM)</CardTitle>
          <CardDescription>
            The AI predicts how category definitions may naturally evolve based on emerging spending patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-sm text-muted-foreground">
                <p><span className="font-semibold text-foreground">&quot;Dining&quot;</span> is evolving. The model predicts a 15% increase in &quot;morning coffee&quot; transactions clustering within this category over the next 30 days, suggesting a potential new sub-category: <span className="font-semibold text-foreground">&quot;Coffee Runs&quot;</span>.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
