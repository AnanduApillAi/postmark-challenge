"use client"
import React, { useEffect, useState } from 'react';
import CustomerStoriesHero from '@/components/frontend/CustomerStoriesHero';
import TestimonialsGrid from '@/components/frontend/TestimonialsGrid';
import FixedBottomNav from '@/components/frontend/FixedBottomNav';
import { supabase } from '@/lib/supabase';

interface Testimonial {
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
    <div className="relative flex min-h-screen flex-col bg-white pb-32">
      <main className="flex-grow">
        <CustomerStoriesHero />
        <TestimonialsGrid testimonials={testimonials} loading={loading} />
        {/* Call to Action */}
        <div className="text-lg md:text-xl mt-8 w-fit mx-auto">
          <p className="text-gray-700 font-medium">
            Send us your review to{' '}
            <span className="text-blue-600 font-semibold px-2 py-1 rounded-md">
             <a href="mailto:testimonials@anandu.dev" target='_blank'>testimonials@anandu.dev</a>
            </span>
          </p>

          {/* Decorative SVG */}
          <div className="justify-end mt-4 mr-10 hidden md:flex">
            
            <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="26"
            viewBox="0 0 401 52"
            fill="none"
            className="opacity-60">
              <path className='fill-blue-600' d="M445 5.58249C439.388 11.2545 431.653 11.5915 424.75 13.3324C391.31 21.7281 357.081 25.4908 322.765 27.5125C300.061 28.8603 277.184 27.6108 254.393 27.1053C231.76 26.6139 210.261 20.0153 188.604 14.3854C170.923 9.78036 152.911 9.02222 134.756 9.65401C107.732 10.5806 80.7789 12.4619 54.515 18.9904C39.1155 22.8232 24.1035 28.1723 9.00536 33.0862C5.3887 34.2656 2.59003 35.0377 1.05439 30.5872C-0.911816 24.859 -0.380804 23.5112 4.81456 22.1914C26.7155 16.6738 48.3868 9.83652 70.5891 6.00369C104.359 0.191261 138.646 -2.26569 172.832 2.578C188.045 4.74011 202.927 9.19069 217.939 12.6866C240.816 18.0076 264.109 20.0995 287.488 19.2852C311.499 18.4428 335.481 16.2667 359.449 14.4837C371.131 13.6132 382.813 12.6725 394.395 11.0439C402.719 9.87864 410.828 7.32342 419.109 5.80713C424.907 4.74012 430.835 4.38913 436.705 3.70118C437.322 3.63098 438.154 3.65906 438.513 3.29403C442.302 -0.566883 443.536 2.36741 444.971 5.58249H445Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </main>
      <FixedBottomNav />
    </div>
  );
}
