/**
 * API Route: POST /api/pricing/calculate
 * Calculate pricing for a job
 */

import { NextRequest, NextResponse } from 'next/server'
import { PricingService, PricingBreakdown } from '@/services/PricingService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      materialCost,
      materialGrams,
      printerWattage,
      printTimeHours,
      kwhRate,
      addOns,
      packagingCost,
      shippingCost,
      laborRate,
      laborTime,
      marginPercentage,
    } = body

    const pricing: PricingBreakdown = PricingService.calculatePricing({
      materialCost,
      materialGrams,
      printerWattage,
      printTimeHours,
      kwhRate,
      addOns,
      packagingCost,
      shippingCost,
      laborRate,
      laborTime,
      marginPercentage,
    })

    return NextResponse.json({
      success: true,
      data: pricing,
      message: 'Pricing calculated successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate pricing',
      },
      { status: 500 }
    )
  }
}
