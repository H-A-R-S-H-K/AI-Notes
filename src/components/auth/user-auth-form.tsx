'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons';
import { useAuth } from '@/lib/hooks/use-auth';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserAuthFormProps {
  type: 'login' | 'signup';
}

export function UserAuthForm({ type }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signInWithEmail, signUp, signInWithGoogle } = useAuth();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (type === 'login') {
        const result = await signInWithEmail(email, password);
        if (!result.success) {
          setError(result.error || 'Failed to log in');
          return;
        }
        toast('Success!', {
          description: 'You have successfully logged in.',
        });
        router.push('/dashboard');
      } else {
        const result = await signUp(email, password);
        if (!result.success) {
          setError(result.error || 'Failed to sign up');
          return;
        }
        toast('Success!', {
          description: 'Please check your email to confirm your account.',
        });
        router.push('/auth/login');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete={type === 'login' ? 'current-password' : 'new-password'}
              autoCorrect="off"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading} type="submit">
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {type === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </div>
      </form>
      
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
      
      <Button variant="outline" type="button" disabled={isLoading} onClick={handleGoogleSignIn}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}
        Google
      </Button>
    </div>
  );
}