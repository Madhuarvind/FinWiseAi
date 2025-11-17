'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gem, PlusCircle, Shield, Target, Award, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const quests = [
    {
        title: "The Amazon Abyss",
        description: "Boss Level: No late-night Amazon purchases for 7 days.",
        type: "Boss Level",
        icon: Shield,
        progress: 4,
        goal: 7,
        reward: "Financial Discipline +50XP"
    },
    {
        title: "The Impulse Tamer",
        description: "Mini Quest: Keep 'Impulse' category transactions under 3 this week.",
        type: "Mini Quest",
        icon: Target,
        progress: 1,
        goal: 3,
        reward: "+10XP"
    },
    {
        title: "The Balanced Arc",
        description: "Story Quest: Turn this high-spend month into a balanced story arc.",
        type: "Story Quest",
        icon: Award,
        progress: 60,
        goal: 100,
        reward: "Achievement: 'The Strategist'"
    }
]

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-3">
            <Gem className="h-8 w-8 text-primary" />
            Goals & Quests
          </h1>
          <p className="text-muted-foreground">
            Complete AI-generated challenges to improve your financial habits and unlock achievements.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2" />
          Create Custom Goal
        </Button>
      </div>

      <div className="space-y-4">
        {quests.map(quest => {
            const QuestIcon = quest.icon;
            return (
                <Card key={quest.title}>
                    <CardHeader className="flex flex-row items-start justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-3">
                            <QuestIcon className='h-6 w-6'/>
                            {quest.title}
                         </CardTitle>
                         <CardDescription className='mt-2'>{quest.description}</CardDescription>
                       </div>
                        <Badge variant={quest.type === 'Boss Level' ? 'destructive' : 'secondary'}>{quest.type}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Progress value={(quest.progress / quest.goal) * 100} />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress: {quest.progress} / {quest.goal}</span>
                            <span className="font-medium text-primary flex items-center gap-1"><Rocket className='h-3 w-3'/>{quest.reward}</span>
                        </div>
                    </CardContent>
                </Card>
            )
        })}
      </div>

    </div>
  );
}
