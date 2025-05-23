"use client"
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TestimonialsGallery from '@/components/TestimonialsGallery';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase';

export default function Home() {

  useEffect(() => {
    const insertTestimonial = async () => {
      await supabase.from('testimonials').insert([
        {
          name: 'John Doe',
        email: 'john@example.com',
          message: 'This tool saved me hours!',
        },
      ]);
    };
    insertTestimonial();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#f8fafc]">
      <Header />
      <main className="flex-grow">
        <Hero />
        <TestimonialsGallery />
      </main>
      <Footer />
    </div>
  );
}
