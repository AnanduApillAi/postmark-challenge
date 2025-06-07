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
        
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .order('created_at', { ascending: false });

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
          setTestimonials(data || []);
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
