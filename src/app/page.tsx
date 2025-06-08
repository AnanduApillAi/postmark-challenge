"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TestimonialsGallery from '@/components/TestimonialsGallery';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  email_date?: string;
  subject?: string;
  spam_score?: number;
  spam_status?: string;
  sentiment_score?: number;
  sentiment_category?: string;
  is_testimonial_confidence?: number;
}

export default function Home() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Environment check:');
        console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
        console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
        
        // Fetch testimonials with all fields including new enhanced data
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('email_date', { ascending: false, nullsFirst: false })
          .order('created_at', { ascending: false });

        // Filter positive testimonials on client side if LLM columns exist
        let filteredData = data;
        if (data && data.length > 0 && data[0].sentiment_score !== undefined) {
          filteredData = data.filter(testimonial => 
            testimonial.sentiment_score >= 20 && 
            !['negative', 'very_negative'].includes(testimonial.sentiment_category)
          );
        }

        console.log('Supabase response:', { data, error });
        if (error) {
          console.error('Error fetching testimonials:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
        } else {
          setTestimonials(filteredData || []);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8fafc]">
      <Header />
      <main className="flex-grow">
        <Hero />
        <TestimonialsGallery testimonials={testimonials} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
