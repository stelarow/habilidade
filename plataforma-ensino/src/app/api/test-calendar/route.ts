import { NextRequest, NextResponse } from 'next/server';
import { testCalendarAPI } from '@/utils/testCalendarAPI';
import { checkDatabaseSchema } from '@/utils/checkDatabaseSchema';
import { verifySession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await verifySession();
    if (!session.isAuthenticated || !session.user || !session.profile) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Capture console output
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalLog(...args);
    };
    
    console.error = (...args) => {
      logs.push('ERROR: ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
      originalError(...args);
    };
    
    // Check if we should run schema check or API test
    const { searchParams } = new URL(request.url);
    const testType = searchParams.get('type') || 'api';
    
    if (testType === 'schema') {
      await checkDatabaseSchema();
    } else {
      await testCalendarAPI();
    }
    
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    
    return NextResponse.json({
      message: `${testType === 'schema' ? 'Schema' : 'Calendar API'} test completed`,
      logs: logs
    });
    
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ 
      error: 'Test failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}