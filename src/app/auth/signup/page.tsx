import { AuthForm } from '@/components/auth/auth-form';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Sign Up | AI Notes',
  description: 'Create an AI Notes account',
};

export default async function SignUpPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();
  
  if (data?.session) {
    redirect('/dashboard');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to get started with AI Notes
          </p>
        </div>
        <AuthForm defaultTab="signup" />
      </div>
    </div>
  );
}