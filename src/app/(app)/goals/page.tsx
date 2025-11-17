
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Trip } from '@/lib/types';

// Placeholder data - in a real app, this would come from Firestore
const initialTrips: Trip[] = [
  {
    id: '1',
    title: "Q3 Tech Conference - Singapore",
    startDate: "2024-09-12",
    endDate: "2024-09-15",
    estimatedCost: 75000,
    status: "Confirmed",
    intent: 'Business',
    intentConfidence: 0.92,
    savings: { goal: 50000, achieved: 45000 },
    transactions: [],
  },
  {
    id: '2',
    title: "Diwali Family Trip - Jaipur",
    startDate: "2024-11-01",
    endDate: "2024-11-05",
    estimatedCost: 40000,
    status: "Draft",
    intent: 'Family',
    intentConfidence: 0.98,
    savings: { goal: 40000, achieved: 15000 },
    transactions: [],
  },
];

export default function TripsPage() {
    const [trips, setTrips] = useState<Trip[]>(initialTrips);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            Travel & Trips
          </h1>
          <p className="text-muted-foreground">
            Automatically group travel expenses and manage your trip budgets with AI.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Plan New Trip
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map(trip => (
          <Card key={trip.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{trip.title}</CardTitle>
                <Badge variant={trip.status === 'Confirmed' ? 'secondary' : 'outline'}>{trip.status}</Badge>
              </div>
              <CardDescription>
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div>
                 <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Budget Goal</span>
                    <span>{((trip.savings.achieved / trip.savings.goal) * 100).toFixed(0)}%</span>
                 </div>
                <Progress value={(trip.savings.achieved / trip.savings.goal) * 100} />
                <p className='text-xs text-right mt-1 text-muted-foreground'>
                    {trip.savings.achieved.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} / {trip.savings.goal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </p>
               </div>
               <div>
                <p className="text-sm font-medium">AI-Detected Intent</p>
                <p className="text-sm text-muted-foreground">
                    This trip is classified as <span className="font-semibold text-foreground">{trip.intent}</span> with {(trip.intentConfidence * 100).toFixed(0)}% confidence.
                </p>
               </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive"/></Button>
                <Button variant="outline"><Edit className="mr-2 h-4 w-4"/>Edit Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
