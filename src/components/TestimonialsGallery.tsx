import React from 'react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  sentiment_score?: number;
  sentiment_category?: string;
  is_testimonial_confidence?: number;
}

interface TestimonialsGalleryProps {
  testimonials: Testimonial[];
  loading: boolean;
}

// Sample testimonial data (fallback)
const SAMPLE_TESTIMONIALS = [
  {
    id: 1,
    isVerified: true,
    content: '"This product has revolutionized my workflow. I can\'t imagine going back to my old methods. The ease of use is incredible!"',
    author: 'Sarah Miller',
    timeAgo: '3 hours ago'
  },
  {
    id: 2,
    isVerified: false,
    content: '"I was skeptical at first, but this exceeded my expectations. Highly recommend to anyone on the fence. It\'s a game-changer for real."',
    author: 'Anonymous',
    timeAgo: '1 day ago'
  },
  {
    id: 3,
    isVerified: true,
    content: '"The customer support is top-notch. They were quick to respond and very helpful with my questions. Made the whole process smooth."',
    author: 'David Chen',
    timeAgo: '5 days ago'
  }
];



// Improved function to calculate time ago with better precision
const getTimeAgo = (dateString: string) => {
  // Parse the timestamp as UTC (database stores in UTC but without Z suffix)
  // Add 'Z' suffix if not present to force UTC parsing
  const utcDateString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  const date = new Date(utcDateString);
  const now = new Date();
  
  // Both dates are now in local timezone, calculate the difference in milliseconds
  const diffInMs = now.getTime() - date.getTime();
  
  // Handle negative differences (future dates) or very small differences
  if (diffInMs < 0 || diffInMs < 30000) return 'Just now'; // Less than 30 seconds
  
  // Convert to different time units
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  
  // Return appropriate time string with proper pluralization
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`;
  } else {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
};

export default function TestimonialsGallery({ testimonials, loading }: TestimonialsGalleryProps) {
  // Transform database testimonials to match TestimonialCard props
  const transformedTestimonials = testimonials.map((testimonial) => {
    // Calculate time ago
    const timeAgoResult = getTimeAgo(testimonial.created_at);

    return {
      id: testimonial.id,
      isVerified: testimonial.email.includes('@'), // Verify if email is present
      content: `"${testimonial.message}"`,
      author: testimonial.name || 'Anonymous',
      timeAgo: timeAgoResult
    };
  });

  // Use database testimonials if available, otherwise fallback to sample data
  const displayTestimonials = testimonials.length > 0 ? transformedTestimonials : SAMPLE_TESTIMONIALS;

  if (loading) {
    return (
      <section className="py-16 px-6" id="gallery">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What Our Users Are Saying</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6" id="gallery">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What Our Users Are Saying</h2>
        {displayTestimonials.length === 0 ? (
          <div className="text-center text-slate-600">
            <p>No testimonials yet. Send an email to testimonial@anandu.dev to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                isVerified={testimonial.isVerified}
                content={testimonial.content}
                author={testimonial.author}
                timeAgo={testimonial.timeAgo}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 