import { NextRequest, NextResponse } from 'next/server';
import { EmailAutomationService } from '@/services/emailAutomation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingData = searchParams.get('data');

    if (trackingData) {
      const data = JSON.parse(decodeURIComponent(trackingData));
      
      // Record email opened event
      const emailService = new EmailAutomationService();
      // This would call a method to record the metric
      // await emailService.recordEmailMetric(data.sequenceId, data.emailStep, 'opened');
    }

    // Return 1x1 transparent pixel
    const pixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      'base64'
    );

    return new NextResponse(pixel, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error tracking email:', error);
    return new NextResponse('Error', { status: 500 });
  }
}