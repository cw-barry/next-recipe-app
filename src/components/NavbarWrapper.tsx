'use client'; // Marking this component as client-side

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

// This component handles showing the navbar based on the path
export default function NavbarWrapper() {
  const pathname = usePathname();
  const hideNavbarRoutes = ['/login', '/register'];

  return !hideNavbarRoutes.includes(pathname) ? <Navbar /> : null;
}
