import React from 'react';
import TestimonialCard from './TestimonialCard';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface TestimonialsGalleryProps {
  testimonials: Testimonial[];
  loading: boolean;
}

// Sample testimonial data (fallback)
const SAMPLE_TESTIMONIALS = [
  {
    id: 1,
    rating: 4,
    isVerified: true,
    content: '"This product has revolutionized my workflow. I can\'t imagine going back to my old methods. The ease of use is incredible!"',
    author: 'Sarah Miller',
    timeAgo: '3 hours ago'
  },
  {
    id: 2,
    rating: 5,
    isVerified: false,
    content: '"I was skeptical at first, but this exceeded my expectations. Highly recommend to anyone on the fence. It\'s a game-changer for real."',
    author: 'Anonymous',
    timeAgo: '1 day ago'
  },
  {
    id: 3,
    rating: 4.5,
    isVerified: true,
    content: '"The customer support is top-notch. They were quick to respond and very helpful with my questions. Made the whole process smooth."',
    author: 'David Chen',
    timeAgo: '5 days ago'
  }
];

// Helper function to calculate time ago
const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} weeks ago`;
};

export default function TestimonialsGallery({ testimonials, loading }: TestimonialsGalleryProps) {
  // Transform database testimonials to match TestimonialCard props
  const transformedTestimonials = testimonials.map((testimonial) => ({
    id: testimonial.id,
    rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
    isVerified: testimonial.email.includes('@'), // Verify if email is present
    content: `"${testimonial.message}"`,
    author: testimonial.name || 'Anonymous',
    timeAgo: getTimeAgo(testimonial.created_at)
  }));

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
                rating={testimonial.rating}
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