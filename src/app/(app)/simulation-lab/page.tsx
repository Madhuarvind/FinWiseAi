'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Binary, Telescope } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


export default function SimulationLabPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          AI Simulation Lab
        </h1>
        <p className="text-muted-foreground">
          Explore advanced financial visualizations and predictive simulations.
        </p>
      </div>

       <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Telescope className="text-primary"/>Transaction Universe Explorer (TUE)</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Your Spending Galaxy</CardTitle>
                    <CardDescription>
                       Visualize your entire financial life as an interactive 3D galaxy. This explorer turns your transaction data into a stunning visual metaphor for exploration.
                    </CardDescription>
                </CardHeader>
                 <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>In this visualization:</p>
                    <ul className='list-disc list-inside space-y-1 pl-4'>
                        <li><span className='font-semibold text-foreground'>Category Clusters</span> form sprawling nebulae.</li>
                        <li><span className='font-semibold text-foreground'>Merchants</span> are represented as individual stars.</li>
                        <li><span className='font-semibold text-foreground'>Spending Habits</span> become planets orbiting these stars.</li>
                        <li><span className='font-semibold text-foreground'>Transaction Frequency</span> defines the orbits and gravitational pull.</li>
                    </ul>
                     <div className="flex h-64 w-full items-center justify-center rounded-lg border-2 border-dashed mt-4">
                        <p className="text-muted-foreground">[3D Galaxy Visualization Placeholder]</p>
                    </div>
                </CardContent>
            </Card>
       </div>

       <Separator/>

        <div className="space-y-6">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2"><Binary className="text-primary"/>Financial Parallel World Simulator (FPWS)</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Simulate Your Alternate Financial Future</CardTitle>
                    <CardDescription>
                      Ever wonder "what if?" This tool lets you explore parallel financial worlds by changing key variables in your spending habits.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <p className="font-medium">Scenario</p>
                            <Button variant="outline" className="w-full justify-start text-left">If I saved 20% more monthly...</Button>
                            <Button variant="secondary" className="w-full justify-start text-left">If I stopped all food delivery...</Button>
                            <Button variant="outline" className="w-full justify-start text-left">If I cut all subscriptions...</Button>
                        </div>
                        <div className="md:col-span-2 rounded-lg border bg-background p-4">
                            <p className="font-medium text-foreground">Simulated Outcome:</p>
                            <div className="mt-4 text-lg">
                                <p>Your total savings would be <span className="font-bold text-primary">₹24,000 higher</span> annually.</p>
                                <p>Your emotional spending-related stress score would be <span className="font-bold text-primary">18% lower</span>.</p>
                                <p>Your "Vacation" goal could be reached <span className="font-bold text-primary">3 months sooner</span>.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
       </div>

    </div>
  );
}
