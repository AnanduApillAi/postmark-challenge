'use client';
import React from 'react';
import { copyToClipboard } from '@/utils/clipboard';

export default function Hero() {
  return (
    <section className="hero-section py-16 px-6 text-center">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Drop Us a Line, We&apos;ll Share the Love</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Send your testimonial via email and see it featured here. Your words help others discover how we can make a difference!
        </p>
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-xl mx-auto mb-12">
          <h3 className="text-xl font-semibold text-slate-700 mb-3">Our Testimonial Inbox:</h3>
          <div className="flex items-center justify-center bg-slate-100 p-4 rounded-lg mb-4">
            <span className="text-lg md:text-xl font-medium text-slate-700 mr-4" id="emailAddress">
              testimonials@example.com
            </span>
            <button
              className="copy-button bg-[#3b82f6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-opacity-50 flex items-center"
              onClick={(e) => copyToClipboard('#emailAddress', e.currentTarget)}
            >
              <span className="material-icons-outlined mr-1 text-base">content_copy</span>
              <span id="copyButtonText">Copy</span>
            </button>
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-3 mt-6">Ready-to-Use Template:</h3>
          <div className="bg-slate-50 p-4 rounded-lg text-left text-sm text-slate-600 relative">
            <button
              className="copy-button absolute top-2 right-2 bg-slate-200 text-slate-700 p-1.5 rounded-md hover:bg-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400"
              onClick={(e) => copyToClipboard('#emailTemplate', e.currentTarget, true)}
            >
              <span className="material-icons-outlined text-base">content_copy</span>
            </button>
            <pre className="whitespace-pre-wrap break-all" id="emailTemplate">
{`Subject: My Testimonial!
Hi Team,
I'd love to share my experience:
[Your awesome testimonial message here!]
Optional:
My Name: [Your Name, or leave blank for Anonymous]
Star Rating: [e.g., 5/5 stars]
Thanks!`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
} 