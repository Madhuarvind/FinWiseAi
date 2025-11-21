
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Loader2,
  Wand2,
  Trash2,
  FileJson,
  MoreVertical,
} from 'lucide-react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import type { Policy } from '@/lib/types';
import { generatePolicyFromText } from '@/ai/flows/generate-policy-from-text';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';

const TableSkeleton = () => (
    <div className="space-y-2">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
    </div>
);

export default function PolicyOSPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const [policyText, setPolicyText] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [policyToDelete, setPolicyToDelete] = React.useState<Policy | null>(
    null
  );

  const policiesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'policies');
  }, [firestore]);
  const { data: policies, isLoading } = useCollection<Policy>(policiesQuery);

  const handleGeneratePolicy = async () => {
    if (!policyText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Policy text cannot be empty.',
      });
      return;
    }
    setIsGenerating(true);
    toast({
      title: 'AI is learning your rule...',
      description: 'Converting your instructions into a structured policy.',
    });

    try {
      const structuredPolicy = await generatePolicyFromText(policyText);

      if (!firestore) throw new Error('Firestore not available');
      const policiesCollection = collection(firestore, 'policies');

      await addDoc(policiesCollection, {
        ...structuredPolicy,
        naturalLanguage: policyText,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Rule Learned & Deployed!',
        description: `The "${structuredPolicy.name}" policy is now active in the engine.`,
      });
      setPolicyText('');
    } catch (error) {
      console.error('Failed to generate or save policy:', error);
      toast({
        variant: 'destructive',
        title: 'Learning Failed',
        description: 'The AI could not understand your instructions.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteClick = (policy: Policy) => {
    setPolicyToDelete(policy);
  };

  const confirmDelete = async () => {
    if (!policyToDelete || !firestore) return;
    try {
      const docRef = doc(firestore, 'policies', policyToDelete.id);
      await deleteDoc(docRef);
      toast({
        title: 'Policy Deleted',
        description: `The "${policyToDelete.name}" policy has been removed.`,
      });
      setPolicyToDelete(null);
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: 'Could not delete the policy.',
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Teach Mode: The Policy OS
          </h1>
          <p className="text-muted-foreground">
            Directly teach the AI how to categorize transactions using natural language. Your rules become permanent policies.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teach the AI a New Rule</CardTitle>
            <CardDescription>
              Write an instruction in plain English. The AI will convert it into a
              deployable policy that the categorization engine will use at
              runtime.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'Always categorize transactions from Uber or Ola as Transport.'"
              value={policyText}
              onChange={(e) => setPolicyText(e.target.value)}
              rows={4}
              disabled={isGenerating}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleGeneratePolicy} disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {isGenerating
                ? 'Teaching AI & Deploying...'
                : 'Teach AI & Deploy Rule'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Policies</CardTitle>
            <CardDescription>
              This is the current set of rules you have taught the AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Name</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {policies && policies.length > 0 ? (
                    policies.map((policy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">
                          {policy.name}
                        </TableCell>
                        <TableCell>
                          {`Merchant CONTAINS '${policy.conditions.merchant.join(
                            ', '
                          )}'`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {`CLASSIFY as '${policy.action.category}'`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem disabled>
                                <FileJson className="mr-2 h-4 w-4" />
                                View JSON
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(policy)}
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Policy
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No policies found. Teach the AI a rule to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!policyToDelete}
        onOpenChange={() => setPolicyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              policy{' '}
              <span className="font-semibold">"{policyToDelete?.name}"</span>{' '}
              and remove it from the categorization engine.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
