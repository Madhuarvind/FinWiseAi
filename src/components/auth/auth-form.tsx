'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  Unsubscribe,
} from 'firebase/auth';
import { useAuth } from '@/firebase';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

type AuthFormValues = z.infer<typeof formSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);

    const authAction =
      mode === 'register'
        ? createUserWithEmailAndPassword(auth, values.email, values.password)
        : signInWithEmailAndPassword(auth, values.email, values.password);

    authAction
      .then((userCredential) => {
        // The onAuthStateChanged listener below will handle the redirect.
        toast({
          title: mode === 'register' ? 'Registration successful!' : 'Login successful!',
          description: 'Redirecting you to the dashboard...',
        });
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: error.message || 'An unexpected error occurred.',
        });
        setIsLoading(false);
      });
  };
  
  React.useEffect(() => {
    let unsubscribe: Unsubscribe;
    
    // Only set up the listener if we are not already redirecting
    if (isLoading) {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, redirect to the dashboard.
                router.push('/dashboard');
                // We don't setIsLoading(false) because we are navigating away.
            }
        });
    }

    // Cleanup subscription on unmount
    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
}, [isLoading, auth, router]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'login' ? 'Log In' : 'Register'}
        </Button>
      </form>
    </Form>
  );
}
