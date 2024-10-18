'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout, userRolesResources } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-lg font-bold">
          MyApp
        </Link>
        <button onClick={toggleMenu} className="text-white md:hidden">
          Menu
        </button>
        <div className={`md:flex ${isOpen ? 'block' : 'hidden'}`}>
          <div className="space-x-4">
            <Link href="/" className="text-white hover:text-gray-300">
              Home
            </Link>
            <Link href="/about" className="text-white hover:text-gray-300">
              About
            </Link>
            {currentUser ? (
              <>
                {userRolesResources?.roles.includes('admin') && (
                  <Link
                    href="/newrecipe"
                    className="text-white hover:text-gray-300"
                  >
                    Add Recipe
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="text-white hover:text-gray-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-white hover:text-gray-300">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-white hover:text-gray-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
