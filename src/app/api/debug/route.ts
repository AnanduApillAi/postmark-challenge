import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Debug endpoint not available in production' },
      { status: 404 }
    );
  }

  try {
    console.log('Environment variables:');
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('testimonials')
      .select('count', { count: 'exact', head: true });
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return NextResponse.json({
        status: 'error',
        message: 'Connection failed',
        error: connectionError,
        env: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
        }
      }, { status: 500 });
    }

    // Try to fetch testimonials
    const { data: testimonials, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('Fetch result:', { testimonials, fetchError });

    return NextResponse.json({
      status: 'success',
      message: 'Debug information',
      connectionTest: connectionTest,
      testimonials: testimonials,
      fetchError: fetchError,
      env: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing'
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Debug failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 