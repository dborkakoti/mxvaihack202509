'use client';

import { useState } from 'react';
import Link from 'next/link';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md lg:h-screen lg:w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:flex-col lg:h-full lg:items-start lg:justify-center">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          <div className="hidden lg:flex lg:flex-col">
            <div className="ml-10 flex items-baseline space-x-4 lg:flex-col lg:space-x-0 lg:space-y-4 lg:ml-0">
              <Link href="/" className="text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link href="/my-sessions" className="text-gray-500 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">My Sessions</Link>
              <Link href="/poster" className="text-gray-500 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Poster</Link>
              <Link href="/faq" className="text-gray-500 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">FAQ</Link>
              <Link href="/summary" className="text-gray-500 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium">Summary</Link>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="text-gray-800 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link href="/my-sessions" className="text-gray-500 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">My Sessions</Link>
            <Link href="/poster" className="text-gray-500 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Poster</Link>
            <Link href="/faq" className="text-gray-500 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">FAQ</Link>
            <Link href="/summary" className="text-gray-500 hover:bg-gray-200 block px-3 py-2 rounded-md text-base font-medium">Summary</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
