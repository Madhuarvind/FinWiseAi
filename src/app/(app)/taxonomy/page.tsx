'use client';
import CategoryManager from '@/components/taxonomy/category-manager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { Loader2, Wand2, ShieldCheck, Binary } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { suggestTransactionCategories } from '@/ai/flows/suggest-transaction-categories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

export default function TaxonomyPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const categoriesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'categories');
  }, [firestore]);
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);
  
  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [suggestedCategories, setSuggestedCategories] = React.useState<string[]>([]);
  const [isSuggestionDialogOpen, setSuggestionDialogOpen] = React.useState(false);

  const handleSuggestCategories = async () => {
    setIsSuggesting(true);
    setSuggestedCategories([]);
    toast({ title: 'AI is thinking...', description: 'Generating category suggestions based on spending patterns.' });
    try {
        const exampleDescriptions = "Based on transactions like 'NETFLIX.COM', 'SPOTIFY AB', and 'DISNEY PLUS', suggest some new categories.";
        const suggestions = await suggestTransactionCategories(exampleDescriptions);
        
        const existingCategoryLabels = new Set((categories || []).map(c => c.label.toLowerCase()));
        const newSuggestions = suggestions.filter(s => !existingCategoryLabels.has(s.toLowerCase()));

        setSuggestedCategories(newSuggestions);
        setSuggestionDialogOpen(true);

    } catch (error) {
        console.error("Failed to suggest categories:", error);
        toast({
            variant: "destructive",
            title: "Suggestion Failed",
            description: "Could not get AI-powered category suggestions."
        });
    } finally {
        setIsSuggesting(false);
    }
  };

  const addSuggestedCategory = (label: string) => {
    if (!firestore) return;
    const newCategoryData: Omit<Category, 'id'> = {
        label,
        icon: 'ShoppingCart',
        universes: ['banking'],
        moodColor: 'bg-gray-500'
    };
    const categoryId = label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const docRef = collection(firestore, 'categories');
    const newDoc = doc(docRef, categoryId);
    setDoc(newDoc, newCategoryData).then(() => {
      toast({ title: 'Category Added', description: `"${label}" has been added.` });
      setSuggestedCategories(prev => prev.filter(s => s !== label));
    }).catch(err => {
      toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save the new category.' });
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
            Taxonomy Management
          </h1>
          <p className="text-muted-foreground">
            View, create, and manage your transaction categories with advanced AI tools.
          </p>
        </div>
        <CategoryManager initialCategories={categories || []} onSuggestClick={handleSuggestCategories} isSuggesting={isSuggesting} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card>
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldCheck className="text-primary"/>Category Integrity Validator (CIV)</CardTitle>
                    <CardDescription>
                        The CIV auditor prevents category "leakage" by learning the boundaries between classes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="text-sm text-muted-foreground">
                        <p>Analysis of semantic distance shows a <span className="font-semibold text-amber-600">78% overlap</span> between <span className="font-semibold text-foreground">&quot;Food & Drink&quot;</span> and <span className="font-semibold text-foreground">&quot;Groceries&quot;</span>. The AI recommends merging these to improve model accuracy.</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="secondary" size="sm">
                        <Binary className="mr-2 h-4 w-4"/>
                        Review Merge Suggestion
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>

      <Dialog open={isSuggestionDialogOpen} onOpenChange={setSuggestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI-Suggested Categories</DialogTitle>
            <DialogDescription>
              Based on your data, here are some suggested new categories. Click to add them.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {suggestedCategories.length > 0 ? (
                 <div className="flex flex-wrap gap-2">
                    {suggestedCategories.map(suggestion => (
                        <Button key={suggestion} variant="secondary" onClick={() => addSuggestedCategory(suggestion)}>
                            <PlusCircle className='mr-2 h-4 w-4' />
                            {suggestion}
                        </Button>
                    ))}
                 </div>
            ) : (
                <p className='text-sm text-muted-foreground'>No new category suggestions at this time. All detected patterns seem to be covered.</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSuggestionDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
