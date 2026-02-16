/**
 * API Route: GET /api/health
 * Health check endpoint for Docker and monitoring
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection can be added here
    // const result = await prisma.$queryRaw`SELECT 1`

    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
