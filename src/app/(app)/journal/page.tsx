export default function JournalPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Financial Journal
        </h1>
        <p className="text-muted-foreground">
          An AI-generated narrative of your financial story and habits.
        </p>
      </div>
      <div className="flex h-96 w-full items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">Journal entries and visualizations will be displayed here.</p>
      </div>
    </div>
  );
}
