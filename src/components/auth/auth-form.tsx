import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAuthForm } from './user-auth-form';
import Link from 'next/link';

interface AuthFormProps {
  defaultTab?: 'login' | 'signup';
}

export function AuthForm({ defaultTab = 'login' }: AuthFormProps) {
  return (
    <Card className="w-[320px]">
      <CardHeader>
        <CardTitle>AI-Powered Notes</CardTitle>
        <CardDescription>
          Create notes and get AI-generated summaries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="pt-4 pb-2">
              <UserAuthForm type="login" />
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <div className="pt-4 pb-2">
              <UserAuthForm type="signup" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        {defaultTab === 'login' ? (
          <span>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </span>
        ) : (
          <span>
            Already have an account?{' '}
            <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
              Login
            </Link>
          </span>
        )}
      </CardFooter>
    </Card>
  );
}