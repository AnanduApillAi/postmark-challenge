import React from 'react';

interface TestimonialCardProps {
  rating: number;
  isVerified?: boolean;
  content: string;
  author: string;
  timeAgo: string;
}

export default function TestimonialCard({ 
  rating, 
  isVerified = false, 
  content, 
  author, 
  timeAgo 
}: TestimonialCardProps) {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="material-icons-outlined">star</span>
        );
      } else if (i - 0.5 === rating) {
        stars.push(
          <span key={i} className="material-icons-outlined">star_half</span>
        );
      } else {
        stars.push(
          <span key={i} className="material-icons-outlined">star_border</span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="testimonial-card p-6 flex flex-col">
      <div className="flex items-center mb-3">
        <span className="text-yellow-400 flex">
          {renderStars()}
        </span>
        {isVerified && (
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
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