import React from 'react';
import TestimonialCard from './TestimonialCard';

// Sample testimonial data
const TESTIMONIALS = [
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
  },
  {
    id: 4,
    rating: 5,
    isVerified: false,
    content: '"I\'ve been using this for a few weeks now, and it\'s already become an essential tool in my daily routine. Saves me so much time."',
    author: 'Emily Carter',
    timeAgo: '1 week ago'
  },
  {
    id: 5,
    rating: 4,
    isVerified: true,
    content: '"Simply fantastic! The interface is intuitive and the results are exactly what I was looking for. A must-have."',
    author: 'Michael B.',
    timeAgo: '2 hours ago'
  },
  {
    id: 6,
    rating: 5,
    isVerified: false,
    content: '"I\'m impressed with the simplicity and effectiveness of this product. It\'s a game-changer. I recommended it to all my colleagues."',
    author: 'Anonymous',
    timeAgo: '10 hours ago'
  }
];

export default function TestimonialsGallery() {
  return (
    <section className="py-16 px-6" id="gallery">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">What Our Users Are Saying</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
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
      </div>
    </section>
  );
} 