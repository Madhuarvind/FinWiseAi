'use client';
import * as React from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  MoreVertical,
  PlusCircle,
  Pencil,
  Trash2,
  Wand2,
  Loader2,
  Database,
  Binary,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCategoryIcon, categoryIcons } from '@/components/icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { initialCategoriesForSeed, universes } from '@/lib/data';
import { useFirestore } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { findSimilarMerchants } from '@/ai/flows/find-similar-merchants';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Partial<Category> | null;
  onSave: (category: Omit<Category, 'id'>, id?: string) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = React.useState(category?.label || '');
  const [icon, setIcon] = React.useState(
    category?.icon || 'ShoppingCart'
  );
  const [universeIds, setUniverseIds] = React.useState<string[]>(category?.universes || ['banking']);
  const [moodColor, setMoodColor] = React.useState(category?.moodColor || 'bg-gray-500');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !icon) return;

    const newCategory: Omit<Category, 'id'> = {
      label,
      icon: icon as keyof typeof categoryIcons,
      universes: universeIds,
      moodColor,
    };
    onSave(newCategory, category?.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="category-label">Category Name</Label>
        <Input
          id="category-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g., Groceries"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category-icon">Icon</Label>
        <Select value={icon} onValueChange={setIcon}>
          <SelectTrigger id="category-icon">
            <SelectValue placeholder="Select an icon" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(categoryIcons).map((iconKey) => {
              const IconComponent =
                categoryIcons[iconKey as keyof typeof categoryIcons];
              return (
                <SelectItem key={iconKey} value={iconKey}>
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-4 w-4" />
                    <span>{iconKey}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Universes</Label>
         <div className='flex flex-wrap gap-2'>
           {universes.map(u => (
            <Button
              key={u.id}
              type="button"
              variant={universeIds.includes(u.id) ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => {
                setUniverseIds(current => 
                  current.includes(u.id)
                    ? current.filter(id => id !== u.id)
                    : [...current, u.id]
                );
              }}
            >
              {u.label}
            </Button>
           ))}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="mood-color">Mood Color</Label>
        <Input
          id="mood-color"
          value={moodColor}
          onChange={(e) => setMoodColor(e.target.value)}
          placeholder="e.g., bg-blue-500"
        />
        <p className="text-xs text-muted-foreground">Use Tailwind CSS color classes (e.g., `bg-red-500`).</p>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}

function RuleGenDialog({ category, isOpen, setIsOpen }: { category: Category | null, isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const [isLoading, setIsLoading] = React.useState(false);
    const [rules, setRules] = React.useState<string[]>([]);
    
    React.useEffect(() => {
        if (isOpen && category) {
            setIsLoading(true);
            setRules([]);
            // Use a timer to simulate network/computation delay for a better UX
            const timer = setTimeout(async () => {
                try {
                    const result = await findSimilarMerchants({ merchantName: category.label });
                    setRules(result.similarMerchants);
                } catch (e) {
                    // In a real app, you'd show a toast notification here
                    console.error("Failed to generate rules:", e);
                } finally {
                    setIsLoading(false);
                }
            }, 1500); // Simulate 1.5 seconds of AI "thinking"
            
            return () => clearTimeout(timer);
        }
    }, [isOpen, category]);

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>Automated Rule Generation (ARG)</DialogTitle>
                <DialogDescription>
                    The AI is analyzing transactions in &quot;{category?.label}&quot; to generate keyword-matching rules.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                {isLoading ? (
                    <div className='space-y-3'>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                            Analyzing semantic clusters...
                        </div>
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-8 w-3/4" />
                    </div>
                ) : (
                    <div>
                        <p className="text-sm font-semibold mb-2">Generated Rule Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                        {rules.map(rule => (
                            <Badge key={rule} variant="outline" className="text-base font-mono">{rule}</Badge>
                        ))}
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsOpen(false)} disabled={isLoading}>
                    Approve & Save Rules
                </Button>
            </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CategoryManager({
  initialCategories,
  onSuggestClick,
  isSuggesting,
}: {
  initialCategories: Category[];
  onSuggestClick: () => void;
  isSuggesting: boolean;
}) {
  const [isFormOpen, setFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isRuleGenOpen, setRuleGenOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(
    null
  );
  const { toast } = useToast();
  const firestore = useFirestore();

  const [isSeeding, setIsSeeding] = React.useState(false);

  const handleAddNew = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleGenerateRules = (category: Category) => {
    setSelectedCategory(category);
    setRuleGenOpen(true);
  }

  const confirmDelete = async () => {
    if (!selectedCategory || !firestore) return;
    try {
      const docRef = doc(firestore, 'categories', selectedCategory.id);
      await deleteDoc(docRef);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      toast({
        title: 'Category Deleted',
        description: `"${selectedCategory.label}" was successfully deleted.`,
      });
    } catch (error) {
      console.error("Error deleting category: ", error);
      toast({ variant: "destructive", title: "Deletion Failed", description: "Could not delete category." });
    }
  };

  const handleSave = async (savedCategoryData: Omit<Category, 'id'>, id?: string) => {
    if (!firestore) return;
    let categoryId = id;
    let toastTitle: string;
    let toastDescription: string;

    try {
      if (categoryId) {
        // Update existing category
        const docRef = doc(firestore, 'categories', categoryId);
        await setDoc(docRef, savedCategoryData, { merge: true });
        toastTitle = 'Category Updated';
        toastDescription = `"${savedCategoryData.label}" was successfully updated.`;
      } else {
        // Add new category
        categoryId = savedCategoryData.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const docRef = doc(firestore, 'categories', categoryId);
        await setDoc(docRef, savedCategoryData);
        toastTitle = 'Category Added';
        toastDescription = `"${savedCategoryData.label}" was successfully added.`;
      }
      
      setFormOpen(false);
      setSelectedCategory(null);
      toast({ title: toastTitle, description: toastDescription });
    } catch (error) {
      console.error("Error saving category: ", error);
      toast({ variant: "destructive", title: "Save Failed", description: "Could not save category." });
    }
  };
  
  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    toast({ title: "Seeding Categories...", description: "Populating the database with initial categories." });
    try {
      const batch = writeBatch(firestore);
      const collectionRef = collection(firestore, 'categories');
      
      initialCategoriesForSeed.forEach(category => {
        const docId = category.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const docRef = doc(collectionRef, docId);
        batch.set(docRef, category);
      });

      await batch.commit();
      toast({ title: "Seeding Complete!", description: `${initialCategoriesForSeed.length} categories have been added.` });
    } catch (error) {
      console.error("Error seeding categories: ", error);
      toast({ variant: "destructive", title: "Seeding Failed", description: "Could not add initial categories to the database." });
    } finally {
      setIsSeeding(false);
    }
  }

  const getUniverseLabel = (universeId: string) => {
    return universes.find(u => u.id === universeId)?.label || universeId;
  }

  return (
    <>
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
         <Button variant="outline" onClick={handleSeedData} disabled={isSeeding || initialCategories.length > 0}>
          {isSeeding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Database className="mr-2 h-4 w-4" />
          )}
          Seed Categories
        </Button>
        <Button variant="outline" onClick={onSuggestClick} disabled={isSuggesting}>
          {isSuggesting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Suggest Categories
        </Button>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {initialCategories.length === 0 && !isSeeding ? (
        <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted h-60">
            <CardTitle>No Categories Found</CardTitle>
            <CardDescription className="mt-2">
                Use the &quot;Seed Categories&quot; button to add the default set, or add them manually.
            </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {initialCategories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            return (
                <Card key={category.id} className="flex flex-col">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", category.moodColor)} />
                          {category.label}
                        </CardTitle>
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-1">
                            {category.universes?.map(universeId => (
                                <Badge key={universeId} variant="secondary" className="text-xs">{getUniverseLabel(universeId)}</Badge>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(category)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleGenerateRules(category)}>
                              <Binary className="mr-2 h-4 w-4" />
                              Generate Rules (AI)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                            onClick={() => handleDelete(category)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </CardFooter>
                </Card>
            );
            })}
        </div>
      )}

      </div>

      <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? `Editing "${selectedCategory.label}".`
                : 'Create a new category for transactions.'}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            onSave={handleSave}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "
              {selectedCategory?.label}" category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RuleGenDialog
        category={selectedCategory}
        isOpen={isRuleGenOpen}
        setIsOpen={setRuleGenOpen}
      />
    </>
  );
}
