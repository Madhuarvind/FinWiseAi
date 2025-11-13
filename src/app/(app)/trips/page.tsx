import { Plane } from "lucide-react";
import TripCard from "@/components/trips/trip-card";
import { tripData } from "@/lib/data-trips";

export default function TripsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
          <Plane className="h-8 w-8 text-primary" />
          Trip Spend Orchestrator
        </h1>
        <p className="text-muted-foreground">
          Automatically detected trip clusters, with forecasted budgets and real-time savings suggestions.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {tripData.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
