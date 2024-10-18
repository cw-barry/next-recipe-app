'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userRolesResources } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      // No logged in user => redirect to login page
      toast.error('You have to be logged in to access this page');
      router.replace('/login');
    } else if (!userRolesResources?.roles.includes('admin')) {
      // No logged in user => redirect to login page
      toast.warn('You do not have permission to access this page');
      router.replace('/');
    }
  }, [currentUser]);

  return <section> {children}</section>;
};

export default PrivateLayout;
