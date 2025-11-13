export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure application and account settings.
        </p>
      </div>
      <div className="flex h-96 w-full items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">Configuration options will be displayed here.</p>
      </div>
    </div>
  );
}
