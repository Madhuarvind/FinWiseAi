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
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase';
import { Separator } from '../ui/separator';
import { GoogleIcon } from '../icons';
import { doc, setDoc } from 'firebase/firestore';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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
  const firestore = useFirestore();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
  });

  const writeUserToDb = async (user: any) => {
    if (!firestore || !user) return;
    const userRef = doc(firestore, 'users', user.uid);
    const [firstName, lastName] = user.displayName?.split(' ') || [user.email, ''];
    await setDoc(userRef, {
        id: user.uid,
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        registrationDate: new Date().toISOString(),
    }, { merge: true });
  }

  const onSubmit = async (values: AuthFormValues) => {
    setIsLoading(true);

    if (mode === 'register') {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const displayName = `${values.firstName} ${values.lastName}`.trim();
          await updateProfile(user, { displayName });
          await writeUserToDb({ ...user, displayName });
          toast({
            title: 'Registration successful!',
            description: 'Redirecting you to the dashboard...',
          });
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Registration Failed',
            description: error.message || 'An unexpected error occurred.',
          });
          setIsLoading(false);
        });
    } else {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          toast({
            title: 'Login successful!',
            description: 'Redirecting you to the dashboard...',
          });
        })
        .catch((error) => {
          toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message || 'An unexpected error occurred.',
          });
          setIsLoading(false);
        });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await writeUserToDb(result.user);
      toast({
        title: 'Login successful!',
        description: 'Redirecting you to the dashboard...',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error.message || 'An unexpected error occurred.',
      });
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    let unsubscribe: Unsubscribe;
    
    if (isLoading) {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/dashboard');
            }
        });
    }

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
}, [isLoading, auth, router]);


  return (
    <div className="space-y-4">
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
        {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Sign {mode === 'login' ? 'in' : 'up'} with Google
      </Button>

       <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {mode === 'register' && (
            <div className="flex flex-col sm:flex-row gap-4">
                 <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                            <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          )}
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
    </div>
  );
}
