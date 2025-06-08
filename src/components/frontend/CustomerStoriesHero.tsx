import React from 'react';
import { Badge } from './Badge';

export default function CustomerStoriesHero() {
  return (
    <div className="relative bg-white overflow-hidden pt-24">
      {/* Background decorative elements */}
      
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <Badge text="Testimonials" />
        
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
        Our Wall of {' '}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Love
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Listen to the stories written here by our community members.
        </p>
      
      </div>
    </div>
  );
} 