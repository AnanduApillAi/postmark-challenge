import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="h-8 w-8 text-[#2563eb]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M5.403 2.75A2.25 2.25 0 003.153 5v14a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021.153 19V7.787a2.25 2.25 0 00-.659-1.591l-2.828-2.828A2.25 2.25 0 0016.076 2.75H5.403zm12.84 3.338L15.414 3.25H5.403a.75.75 0 00-.75.75v14c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75V7.787a.75.75 0 00-.22-.53l-2.828-2.828a.75.75 0 00-.53-.22zM8.25 10.5a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm0 3a.75.75 0 01.75-.75h3a.75.75 0 010 1.5h-3a.75.75 0 01-.75-.75z" fillRule="evenodd"></path>
          </svg>
          <h1 className="text-2xl font-bold text-slate-800">Our Users Love Us</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-slate-600 hover:text-[#2563eb] text-sm font-medium nav-link">
            Home
          </Link>
          <Link href="#gallery" className="text-slate-600 hover:text-[#2563eb] text-sm font-medium nav-link">
            Gallery
          </Link>
          <Link href="#submit" className="text-slate-600 hover:text-[#2563eb] text-sm font-medium nav-link">
            Submit Yours
          </Link>
        </nav>
      </div>
    </header>
  );
} 