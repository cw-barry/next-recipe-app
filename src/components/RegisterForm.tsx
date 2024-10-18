'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// Define register schema
const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const { createUser, signupProvider } = useAuth(); // Use AuthContext
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    try {
      await createUser(values.email, values.password, values.displayName);
      router.push('/home');
    } catch (error) {
      alert('Error registering');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signupProvider();
      router.push('/home');
    } catch (error) {
      alert('Error signing in with Google');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-5 max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Register</Button>

          <div className="mt-4">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full"
            >
              Sign in with Google
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
