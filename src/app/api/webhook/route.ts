import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

// Basic security checks for webhook requests
function basicSecurityCheck(request: NextRequest, data: any): { isValid: boolean; reason?: string } {
  // Check if request comes from a reasonable source
  const contentType = request.headers.get('content-type') || '';
  
  // Basic checks for webhook-like requests
  if (!contentType.includes('application/json')) {
    return { isValid: false, reason: 'Invalid content type' };
  }

  // Check if it has typical webhook structure
  if (!data.From || !data.TextBody || !data.To) {
    return { isValid: false, reason: 'Missing typical email webhook fields' };
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.From)) {
    return { isValid: false, reason: 'Invalid email format' };
  }

  return { isValid: true };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Basic security checks
    const securityCheck = basicSecurityCheck(request, data);
    if (!securityCheck.isValid) {
      console.log('Security check failed:', securityCheck.reason);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate email is going to correct address
    const expectedTo = 'testimonial@anandu.dev';
    if (!data.To || data.To !== expectedTo) {
      console.log(`Webhook received for wrong email: ${data.To}, expected: ${expectedTo}`);
      return NextResponse.json(
        { message: 'Email not for testimonials' },
        { status: 200 }
      );
    }
    
    // Log the received data
    console.log('Valid webhook received from:', data.From);
    
    // Extract and sanitize testimonial data
    const testimonialData = {
      name: sanitizeInput(data.FromName || data.From || 'Anonymous'),
      email: data.From.toLowerCase().trim(),
      message: sanitizeInput(data.TextBody || data.HtmlBody?.replace(/<[^>]*>/g, '') || 'No message content')
    };

    // Validate message is not empty after sanitization
    if (!testimonialData.message || testimonialData.message.length < 5) {
      return NextResponse.json(
        { error: 'Message too short or empty' },
        { status: 400 }
      );
    }

    // Check for duplicate recent testimonials (basic spam protection)
    const { data: recentTestimonials } = await supabaseAdmin
      .from('testimonials')
      .select('email')
      .eq('email', testimonialData.email)
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .limit(1);

    if (recentTestimonials && recentTestimonials.length > 0) {
      console.log(`Rate limit: Recent testimonial from ${testimonialData.email}`);
      return NextResponse.json(
        { message: 'Testimonial received (rate limited)' },
        { status: 200 }
      );
    }

    // Insert testimonial into Supabase
    const { error } = await supabaseAdmin
      .from('testimonials')
      .insert([testimonialData]);

    if (error) {
      console.error('Error inserting testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to save testimonial' },
        { status: 500 }
      );
    }

    console.log('Testimonial saved successfully from:', testimonialData.email);
    
    // Return success response
    return NextResponse.json(
      { 
        message: 'Testimonial received and saved successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 400 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { message: 'Webhook endpoint is active. Send POST requests here.' },
    { status: 200 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Only POST requests are supported.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Only POST requests are supported.' },
    { status: 405 }
  );
} 