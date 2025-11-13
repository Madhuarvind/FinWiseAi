
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, PlusCircle } from 'lucide-react';

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            <Briefcase className="h-8 w-8" />
            Trip Management
          </h1>
          <p className="text-muted-foreground">
            Plan, track, and analyze your travel spending with AI-powered insights.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Create New Trip
        </Button>
      </div>

      <Card className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-muted h-96">
        <CardHeader>
          <div className="mx-auto bg-secondary p-4 rounded-full">
            <Briefcase className="h-10 w-10 text-secondary-foreground" />
          </div>
          <CardTitle className="mt-4">No Trips Found</CardTitle>
          <CardDescription>
            Get started by creating a new trip to track your travel expenses. The AI will help you categorize and analyze spending.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button>
                <PlusCircle className="mr-2" />
                Create Your First Trip
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
