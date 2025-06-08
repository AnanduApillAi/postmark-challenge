import React from 'react';

interface TestimonialCardProps {
  isVerified?: boolean;
  content: string;
  author: string;
  timeAgo: string;
}

export default function TestimonialCard({ 
  isVerified = false, 
  content, 
  author, 
  timeAgo 
}: TestimonialCardProps) {
  return (
    <div className="testimonial-card p-6 flex flex-col">
      <div className="flex items-center mb-3">
        {isVerified && (
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Verified via Email
          </span>
        )}
      </div>
      <p className="text-slate-600 mb-4 flex-grow">{content}</p>
      <div className="mt-auto">
        <p className="text-slate-800 font-semibold">{author}</p>
        <p className="text-slate-500 text-sm">{timeAgo}</p>
      </div>
    </div>
  );
} 