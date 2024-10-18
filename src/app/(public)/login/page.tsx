// app/login/page.tsx
import LoginForm from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" passHref>
              <Button variant="link">Register</Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
