import React from 'react';
import TestimonialCardFrontend from './TestimonialCardFrontend';

interface DatabaseTestimonial {
  id: string;
  name: string;
  email: string;
  message: string;
  cleaned_message?: string; // LLM-extracted content
  created_at: string;
  email_date?: string;
  subject?: string;
  spam_score?: number;
  spam_status?: string;
  sentiment_score?: number;
  sentiment_category?: string;
  is_testimonial_confidence?: number;
}

interface TestimonialsGridProps {
  testimonials: DatabaseTestimonial[];
  loading?: boolean;
}

export default function TestimonialsGrid({ testimonials, loading = false }: TestimonialsGridProps) {
  if (loading) {
    return (
      <div className="py-16 px-6" id="get-to-know">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-600">Loading testimonials...</div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="py-16 px-6" id="get-to-know">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-600">No testimonials available yet.</div>
        </div>
      </div>
    );
  }

  // Split testimonials into two columns for equal distribution
  const leftColumn = testimonials.filter((_, index) => index % 2 === 0);
  const rightColumn = testimonials.filter((_, index) => index % 2 === 1);

  return (
    <div className="py-16 px-6" id="get-to-know">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {leftColumn.map((testimonial) => (
              <TestimonialCardFrontend
                key={testimonial.id}
                quote={testimonial.cleaned_message || testimonial.message}
                author={testimonial.name}
                avatar="" // No avatar for real testimonials
              />
            ))}
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-6">
            {rightColumn.map((testimonial) => (
              <TestimonialCardFrontend
                key={testimonial.id}
                quote={testimonial.cleaned_message || testimonial.message}
                author={testimonial.name}
                avatar="" // No avatar for real testimonials
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 