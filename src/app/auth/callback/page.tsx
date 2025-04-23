'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/use-auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [user, loading, router]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Processing authentication...</h1>
        <p className="mt-4">Please wait while we complete the sign-in process.</p>
      </div>
    </div>
  );
}