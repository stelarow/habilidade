import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { logError } from '@/lib/utils/logger'

// Force dynamic rendering for token generation
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { playbackId, userId } = await request.json()

    if (!playbackId) {
      return NextResponse.json({ error: 'playbackId is required' }, { status: 400 })
    }

    const muxTokenId = process.env.MUX_TOKEN_ID
    const muxTokenSecret = process.env.MUX_TOKEN_SECRET

    if (!muxTokenId || !muxTokenSecret) {
      return NextResponse.json({ error: 'Mux credentials not configured' }, { status: 500 })
    }

    // Create playback token
    const token = jwt.sign(
      {
        sub: playbackId,
        aud: 'v', // video
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
        kid: muxTokenId,
        // Optional: add user context for analytics
        ...(userId && { metadata: { user_id: userId } })
      },
      Buffer.from(muxTokenSecret, 'base64'),
      { algorithm: 'RS256' }
    )

    return NextResponse.json({ token })
  } catch (error) {
    logError('Error generating Mux playback token:', error)
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 })
  }
}