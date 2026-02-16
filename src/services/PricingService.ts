/**
 * Pricing Service
 * Handles all pricing calculations for print jobs
 * Now uses centralized formulas from pricingFormulas.ts
 */

import { PricingInput, PricingAddOn } from '@/types'
import * as formulas from '@/lib/pricingFormulas'

export interface PricingBreakdown {
  materialCost: number
  electricityCost: number
  addOnsCost: number
  packagingCost: number
  shippingCost: number
  laborCost: number
  subtotal: number
  marginAmount: number
  finalPrice: number
  profitAmount: number
}

export class PricingService {
  /**
   * Convert print time to total hours
   * @deprecated Use formulas.convertToHours() directly
   */
  static convertToHours(days: number, hours: number, minutes: number): number {
    return formulas.convertToHours(days, hours, minutes)
  }

  /**
   * Calculate electricity cost
   * @deprecated Use formulas.calculateElectricityCost() directly
   */
  static calculateElectricityCost(
    printerWattage: number,
    printTimeHours: number,
    kwhRate: number
  ): number {
    return formulas.calculateElectricityCost(printerWattage, printTimeHours, kwhRate)
  }

  /**
   * Calculate material cost
   * @deprecated Use formulas.calculateMaterialCost() directly
   */
  static calculateMaterialCost(
    costPerGram: number,
    grams: number
  ): number {
    return formulas.calculateMaterialCost(costPerGram, grams)
  }

  /**
   * Calculate total add-ons cost
   * @deprecated Use formulas.calculateTotalAddOnsCost() directly
   */
  static calculateAddOnsCost(addOns: PricingAddOn[]): number {
    return formulas.calculateTotalAddOnsCost(addOns)
  }

  /**
   * Calculate labor cost
   * @deprecated Use formulas.calculateLaborCost() directly
   */
  static calculateLaborCost(laborRate: number, laborTime: number): number {
    return formulas.calculateLaborCost(laborRate, laborTime)
  }

  /**
   * Calculate complete pricing breakdown
   */
  static calculatePricing(input: PricingInput): PricingBreakdown {
    // Calculate component costs using formulas library
    const materialCost = formulas.calculateMaterialCost(
      input.materialCost,
      input.materialGrams
    )

    const electricityCost = formulas.calculateElectricityCost(
      input.printerWattage,
      input.printTimeHours,
      input.kwhRate
    )

    const addOnsCost = formulas.calculateTotalAddOnsCost(input.addOns)
    const laborCost = formulas.calculateLaborCost(input.laborRate, input.laborTime)

    // Calculate subtotal
    const subtotal = formulas.calculateSubtotal({
      materialCost,
      electricityCost,
      addOnsCost,
      packagingCost: input.packagingCost,
      shippingCost: input.shippingCost,
      laborCost,
    })

    // Apply margin
    const marginAmount = formulas.calculateMarginAmount(subtotal, input.marginPercentage)
    const finalPrice = formulas.calculateFinalPrice(subtotal, input.marginPercentage)
    const profitAmount = marginAmount

    return {
      materialCost: formulas.roundCurrency(materialCost),
      electricityCost: formulas.roundCurrency(electricityCost),
      addOnsCost: formulas.roundCurrency(addOnsCost),
      packagingCost: input.packagingCost,
      shippingCost: input.shippingCost,
      laborCost: formulas.roundCurrency(laborCost),
      subtotal: formulas.roundCurrency(subtotal),
      marginAmount: formulas.roundCurrency(marginAmount),
      finalPrice: formulas.roundCurrency(finalPrice),
      profitAmount: formulas.roundCurrency(profitAmount),
    }
  }

  /**
   * Update pricing when only margin changes
   */
  static updateMargin(
    subtotal: number,
    newMarginPercentage: number
  ): PricingBreakdown {
    const marginAmount = formulas.calculateMarginAmount(subtotal, newMarginPercentage)
    const finalPrice = formulas.calculateFinalPrice(subtotal, newMarginPercentage)

    return {
      materialCost: 0,
      electricityCost: 0,
      addOnsCost: 0,
      packagingCost: 0,
      shippingCost: 0,
      laborCost: 0,
      subtotal: formulas.roundCurrency(subtotal),
      marginAmount: formulas.roundCurrency(marginAmount),
      finalPrice: formulas.roundCurrency(finalPrice),
      profitAmount: formulas.roundCurrency(marginAmount),
    }
  }

  /**
   * Format currency for display
   * @deprecated Use formulas.formatCurrency() directly
   */
  static formatCurrency(value: number, currency: string = 'USD'): string {
    return formulas.formatCurrency(value, currency)
  }
}
