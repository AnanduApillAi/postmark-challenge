import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// Verify Postmark webhook signature
function verifyPostmarkWebhook(body: string, signature: string): boolean {
  if (!process.env.POSTMARK_WEBHOOK_SECRET) {
    console.warn('POSTMARK_WEBHOOK_SECRET not set - webhook verification disabled');
    return true; // Allow in development
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.POSTMARK_WEBHOOK_SECRET)
    .update(body)
    .digest('base64');
    
  return signature === expectedSignature;
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get('X-Postmark-Signature') || '';
    
    // Verify webhook is from Postmark
    if (!verifyPostmarkWebhook(body, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse the request body
    const data = JSON.parse(body);
    
    // Validate required fields
    if (!data.From || !data.TextBody) {
      return NextResponse.json(
        { error: 'Missing required fields (From, TextBody)' },
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
    
    // Log the received data (remove in production if sensitive)
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
    const { data: recentTestimonials } = await supabase
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
    const { data: insertedData, error } = await supabase
      .from('testimonials')
      .insert([testimonialData])
      .select();

    if (error) {
      console.error('Error inserting testimonial:', error);
      return NextResponse.json(
        { error: 'Failed to save testimonial' },
        { status: 500 }
      );
    }

    console.log('Testimonial saved successfully from:', testimonialData.email);
    
    // Return success response (don't expose internal data)
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

// Handle unsupported methods
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