import CategoryManager from '@/components/taxonomy/category-manager';
import { categories } from '@/lib/data';

export default function TaxonomyPage() {
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
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
