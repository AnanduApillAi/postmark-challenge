import React from 'react';

interface TestimonialCardFrontendProps {
  quote: string;
  author: string;
  avatar: string;
}

export default function TestimonialCardFrontend({ 
  quote, 
  author 
}: TestimonialCardFrontendProps) {
  return (
    <div className="group">
      <div className="border border-gray-300 rounded-2xl p-6 flex flex-col">
        {/* Quote */}
        <div className="flex-grow mb-6">
          <p className="text-gray-800 text-[15px] leading-7">
            {quote}
          </p>
        </div>

        {/* Author Info */}
        <div className="text-right">
          <p className="text-gray-900 font-semibold text-[15px]">
            - {author}
          </p>
        </div>
      </div>
    </div>
  );
} 