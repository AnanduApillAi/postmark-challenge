import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12 px-6" id="submit">
      <div className="container mx-auto text-center">
        <p className="mb-4">Built for the Postmark Inbox Innovators Challenge.</p>
        <div className="flex justify-center gap-6 mb-6">
          <Link
            className="hover:text-white transition-colors" 
            href="https://github.com/your-repo-link" 
            rel="noopener noreferrer" 
            target="_blank"
          >
            <svg className="h-6 w-6 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
            </svg>
            GitHub
          </Link>
          <Link 
            className="hover:text-white transition-colors" 
            href="#" 
            rel="noopener noreferrer" 
            target="_blank"
          >
            <span className="material-icons-outlined align-middle mr-1 text-xl">link</span>
            Live Demo
          </Link>
        </div>
        <p className="text-lg mb-2">Want to build your own?</p>
        <Link 
          className="cta-button inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-400" 
          href="https://github.com/your-repo-link/fork" 
          rel="noopener noreferrer" 
          target="_blank"
        >
          Fork it on GitHub
        </Link>
        <p className="mt-8 text-sm text-slate-400">© {new Date().getFullYear()} Testimonial Collector. All rights reserved.</p>
      </div>
    </footer>
  );
} 