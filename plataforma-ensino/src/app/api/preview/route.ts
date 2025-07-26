
import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

// Force dynamic rendering for draft mode
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirect = searchParams.get('redirect');

  if (!redirect) {
    return NextResponse.json({ error: 'Redirect parameter is required' }, { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(redirect, request.url));
}
