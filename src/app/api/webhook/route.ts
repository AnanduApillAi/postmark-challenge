import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Log the received data to console
    console.log('Webhook received data:', data);
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Request method:', request.method);
    console.log('Request URL:', request.url);
    
    // Return success response
    return NextResponse.json(
      { 
        message: 'Webhook received successfully', 
        received: data,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
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