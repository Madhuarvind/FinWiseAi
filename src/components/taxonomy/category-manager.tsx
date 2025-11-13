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
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { suggestTransactionCategories } from '@/ai/flows/suggest-transaction-categories';
import { Badge } from '../ui/badge';

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Partial<Category> | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = React.useState(category?.label || '');
  const [icon, setIcon] = React.useState(
    category?.icon || 'ShoppingCart'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label || !icon) return;

    const newCategory: Category = {
      value:
        category?.value ||
        label.toLowerCase().replace(/\s+/g, '-'),
      label,
      icon: icon as keyof typeof categoryIcons,
    };
    onSave(newCategory);
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
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
}

export default function CategoryManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [isFormOpen, setFormOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(
    null
  );
  const { toast } = useToast();

  const [isSuggesting, setIsSuggesting] = React.useState(false);
  const [suggestedCategories, setSuggestedCategories] = React.useState<string[]>([]);
  const [isSuggestionDialogOpen, setSuggestionDialogOpen] = React.useState(false);

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

  const confirmDelete = () => {
    if (!selectedCategory) return;
    setCategories(
      categories.filter((c) => c.value !== selectedCategory.value)
    );
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
    toast({
      title: 'Category Deleted',
      description: `"${selectedCategory.label}" was successfully deleted.`,
    });
  };

  const handleSave = (savedCategory: Category) => {
    if (selectedCategory) {
      // Update existing category
      setCategories(
        categories.map((c) =>
          c.value === savedCategory.value ? savedCategory : c
        )
      );
      toast({
        title: 'Category Updated',
        description: `"${savedCategory.label}" was successfully updated.`,
      });
    } else {
      // Add new category
      setCategories([...categories, savedCategory]);
      toast({
        title: 'Category Added',
        description: `"${savedCategory.label}" was successfully added.`,
      });
    }
    setFormOpen(false);
    setSelectedCategory(null);
  };
  
  const handleSuggestCategories = async () => {
    setIsSuggesting(true);
    setSuggestedCategories([]);
    try {
        // In a real app, you'd pass descriptions of uncategorized transactions.
        // For this demo, we'll use a hardcoded prompt.
        const exampleDescriptions = "Based on transactions like 'NETFLIX.COM', 'SPOTIFY AB', and 'DISNEY PLUS', suggest some new categories.";
        const suggestions = await suggestTransactionCategories(exampleDescriptions);
        
        // Filter out suggestions that already exist
        const existingCategoryLabels = new Set(categories.map(c => c.label.toLowerCase()));
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
    const newCategory: Category = {
        label,
        value: label.toLowerCase().replace(/\s+/g, '-'),
        icon: 'ShoppingCart', // Default icon
    };
    setCategories(prev => [...prev, newCategory]);
    setSuggestedCategories(prev => prev.filter(s => s !== label));
     toast({
        title: 'Category Added',
        description: `"${label}" was successfully added.`,
      });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleSuggestCategories} disabled={isSuggesting}>
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

      {categories.length === 0 ? (
        <Card className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-muted h-60">
            <CardTitle>No Categories Found</CardTitle>
            <CardDescription className="mt-2">
                Get started by adding a new category or using the AI suggestion feature.
            </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
            const Icon = getCategoryIcon(category.icon);
            return (
                <Card key={category.value}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base font-medium">
                    {category.label}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
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
                        Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        onClick={() => handleDelete(category)}
                        className="text-destructive"
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
    </div>
  );
}
