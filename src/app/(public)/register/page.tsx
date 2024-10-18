// app/register/page.tsx
import RegisterForm from '@/components/RegisterForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Register</h1>
        <RegisterForm />
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account?{' '}
            <Link href="/login" passHref>
              <Button variant="link">Login</Button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
