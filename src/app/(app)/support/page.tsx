'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  {
    question: "How does the AI categorization work?",
    answer: "Our system uses a hybrid model that combines a fast, rule-based engine with a powerful Large Language Model (LLM). For most transactions, the rule-based system provides an instant category. If its confidence is low, the transaction is automatically sent to the LLM for a more nuanced analysis, ensuring high accuracy across the board."
  },
  {
    question: "What is a 'Categorization Universe'?",
    answer: "Universes are different lenses for viewing your financial data. The 'Strict Banking' view uses traditional categories, while the 'Behavioral' view categorizes spending by its psychological driver (e.g., 'Impulse' vs. 'Necessity'). This allows for deeper insights into your financial habits."
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. Your data is protected with end-to-end encryption and stored securely using Firebase's infrastructure. Our AI models are designed with privacy as a core principle, and we employ techniques like our 'Behavioural Anonymizer' to analyze trends without compromising individual privacy."
  },
  {
    question: "How do I correct a miscategorized transaction?",
    answer: "Simply click on any transaction in the dashboard to open the detail view. From there, you can select the correct category from the dropdown menu and confirm your change. This feedback is crucial, as our AI learns from your corrections over time to become even more accurate."
  }
];

export default function SupportPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Support Request Sent",
      description: "Thank you for contacting us. Our team will get back to you within 24 hours.",
    });
    // In a real app, you would also clear the form fields here.
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground">
          Support
        </h1>
        <p className="text-muted-foreground">
          Get help and find answers to your questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
        </div>
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Support</h2>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                        <CardDescription>Our team is here to help with any questions or issues.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" placeholder="Please describe your issue in detail..." rows={6}/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Send Request</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
      </div>
    </div>
  );
}
