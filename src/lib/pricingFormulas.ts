/**
 * Pricing Formulas Library
 * All pricing calculation formulas in one place
 * Centralized for easy maintenance and testing
 */

import { PricingAddOn } from '@/types'

// ============================================
// TIME CONVERSIONS
// ============================================

/**
 * Convert print time components to total hours
 * Formula: totalHours = (days × 24) + hours + (minutes ÷ 60)
 * @param days - Number of days
 * @param hours - Number of hours
 * @param minutes - Number of minutes
 * @returns Total time in hours (decimal)
 * @example convertToHours(1, 2, 30) // returns 26.5 hours
 */
export function convertToHours(
  days: number,
  hours: number,
  minutes: number
): number {
  return days * 24 + hours + minutes / 60
}

/**
 * Convert hours to days, hours, and minutes
 * @param totalHours - Total time in hours
 * @returns Object with days, hours, minutes
 * @example convertHoursToComponents(26.5) // returns { days: 1, hours: 2, minutes: 30 }
 */
export function convertHoursToComponents(totalHours: number): {
  days: number
  hours: number
  minutes: number
} {
  const days = Math.floor(totalHours / 24)
  const remainingHours = totalHours % 24
  const hours = Math.floor(remainingHours)
  const minutes = Math.round((remainingHours - hours) * 60)

  return { days, hours, minutes }
}

// ============================================
// MATERIAL COSTS
// ============================================

/**
 * Calculate material cost per gram from per kilogram price
 * Formula: costPerGram = costPerKg ÷ 1000
 * @param costPerKg - Price per kilogram
 * @returns Price per gram
 * @example calculateCostPerGram(20) // returns 0.02
 */
export function calculateCostPerGram(costPerKg: number): number {
  return costPerKg / 1000
}

/**
 * Calculate total material cost
 * Formula: materialCost = costPerGram × grams
 * @param costPerGram - Price per gram
 * @param grams - Weight in grams
 * @returns Total material cost
 * @example calculateMaterialCost(0.02, 100) // returns 2.00
 */
export function calculateMaterialCost(
  costPerGram: number,
  grams: number
): number {
  return costPerGram * grams
}

/**
 * Calculate material cost from per kg price
 * Formula: materialCost = (costPerKg ÷ 1000) × grams
 * @param costPerKg - Price per kilogram
 * @param grams - Weight in grams
 * @returns Total material cost
 * @example calculateMaterialCostFromKg(20, 100) // returns 2.00
 */
export function calculateMaterialCostFromKg(
  costPerKg: number,
  grams: number
): number {
  const costPerGram = calculateCostPerGram(costPerKg)
  return calculateMaterialCost(costPerGram, grams)
}

// ============================================
// ELECTRICITY COSTS
// ============================================

/**
 * Calculate electricity consumption in kilowatt-hours (kWh)
 * Formula: kWh = (wattage ÷ 1000) × hours
 * @param printerWattage - Printer power consumption in watts
 * @param printTimeHours - Print duration in hours
 * @returns Energy consumed in kWh
 * @example calculateKwhUsage(200, 8) // returns 1.6 kWh
 */
export function calculateKwhUsage(
  printerWattage: number,
  printTimeHours: number
): number {
  return (printerWattage / 1000) * printTimeHours
}

/**
 * Calculate electricity cost
 * Formula: electricityCost = (wattage ÷ 1000) × hours × kwhRate
 * @param printerWattage - Printer power consumption in watts
 * @param printTimeHours - Print duration in hours
 * @param kwhRate - Cost per kilowatt-hour
 * @returns Total electricity cost
 * @example calculateElectricityCost(200, 8, 0.12) // returns 0.192
 */
export function calculateElectricityCost(
  printerWattage: number,
  printTimeHours: number,
  kwhRate: number
): number {
  const kwhUsed = calculateKwhUsage(printerWattage, printTimeHours)
  return kwhUsed * kwhRate
}

// ============================================
// ADD-ONS & EXTRAS
// ============================================

/**
 * Calculate total cost for a single add-on
 * Formula: addOnCost = quantity × unitCost
 * @param quantity - Number of units
 * @param cost - Cost per unit
 * @returns Total add-on cost
 * @example calculateAddOnCost(3, 5.50) // returns 16.50
 */
export function calculateAddOnCost(quantity: number, cost: number): number {
  return quantity * cost
}

/**
 * Calculate total cost for all add-ons
 * Formula: totalAddOns = Σ(quantity × cost) for each add-on
 * @param addOns - Array of add-on items
 * @returns Total add-ons cost
 * @example calculateTotalAddOnsCost([{quantity: 2, cost: 5}, {quantity: 1, cost: 10}]) // returns 20
 */
export function calculateTotalAddOnsCost(addOns: PricingAddOn[]): number {
  return addOns.reduce(
    (total, addOn) => total + calculateAddOnCost(addOn.quantity, addOn.cost),
    0
  )
}

// ============================================
// LABOR COSTS
// ============================================

/**
 * Calculate labor cost
 * Formula: laborCost = hourlyRate × hours
 * @param hourlyRate - Rate per hour
 * @param hours - Number of hours worked
 * @returns Total labor cost
 * @example calculateLaborCost(25, 2) // returns 50
 */
export function calculateLaborCost(hourlyRate: number, hours: number): number {
  return hourlyRate * hours
}

// ============================================
// TOTALS & SUBTOTALS
// ============================================

/**
 * Calculate subtotal (sum of all costs before margin)
 * Formula: subtotal = materialCost + electricityCost + addOnsCost + packagingCost + shippingCost + laborCost
 * @param costs - Object containing all cost components
 * @returns Subtotal before margin
 * @example calculateSubtotal({materialCost: 10, electricityCost: 2, ...}) // returns sum of all costs
 */
export function calculateSubtotal(costs: {
  materialCost: number
  electricityCost: number
  addOnsCost: number
  packagingCost: number
  shippingCost: number
  laborCost: number
}): number {
  return (
    costs.materialCost +
    costs.electricityCost +
    costs.addOnsCost +
    costs.packagingCost +
    costs.shippingCost +
    costs.laborCost
  )
}

// ============================================
// PROFIT MARGIN & PRICING
// ============================================

/**
 * Calculate margin amount
 * Formula: marginAmount = subtotal × (marginPercentage ÷ 100)
 * @param subtotal - Total cost before margin
 * @param marginPercentage - Desired profit margin percentage
 * @returns Margin amount in currency
 * @example calculateMarginAmount(100, 30) // returns 30
 */
export function calculateMarginAmount(
  subtotal: number,
  marginPercentage: number
): number {
  return subtotal * (marginPercentage / 100)
}

/**
 * Calculate final price with margin
 * Formula: finalPrice = subtotal + (subtotal × marginPercentage ÷ 100)
 * @param subtotal - Total cost before margin
 * @param marginPercentage - Desired profit margin percentage
 * @returns Final price including margin
 * @example calculateFinalPrice(100, 30) // returns 130
 */
export function calculateFinalPrice(
  subtotal: number,
  marginPercentage: number
): number {
  const marginAmount = calculateMarginAmount(subtotal, marginPercentage)
  return subtotal + marginAmount
}

/**
 * Calculate profit amount (same as margin amount in this context)
 * @param subtotal - Total cost before margin
 * @param marginPercentage - Desired profit margin percentage
 * @returns Profit amount
 * @example calculateProfitAmount(100, 30) // returns 30
 */
export function calculateProfitAmount(
  subtotal: number,
  marginPercentage: number
): number {
  return calculateMarginAmount(subtotal, marginPercentage)
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Round to 2 decimal places (currency precision)
 * @param value - Number to round
 * @returns Rounded value
 * @example roundCurrency(2.4567) // returns 2.46
 */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Round to specified decimal places
 * @param value - Number to round
 * @param decimals - Number of decimal places
 * @returns Rounded value
 * @example roundToDecimals(2.4567, 3) // returns 2.457
 */
export function roundToDecimals(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

/**
 * Ensure value is not negative
 * @param value - Value to check
 * @returns Non-negative value
 * @example ensurePositive(-5) // returns 0
 */
export function ensurePositive(value: number): number {
  return Math.max(0, value)
}

/**
 * Format currency for display
 * @param value - Currency value
 * @param currency - Currency code (e.g., 'USD', 'PHP')
 * @returns Formatted currency string
 * @example formatCurrency(1234.56, 'USD') // returns "$1,234.56"
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Get currency symbol from currency code
 * @param currency - Currency code
 * @returns Currency symbol
 * @example getCurrencySymbol('USD') // returns "$"
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
    MXN: '$',
    NZD: 'NZ$',
    SGD: 'S$',
    HKD: 'HK$',
    NOK: 'kr',
    SEK: 'kr',
    ZAR: 'R',
    PHP: '₱',
  }
  return symbols[currency] || '$'
}

// ============================================
// COMPLETE PRICING CALCULATION
// ============================================

export interface CompletePricingInput {
  // Material
  materialCostPerKg: number
  materialGrams: number

  // Time
  printTimeDays: number
  printTimeHours: number
  printTimeMinutes: number

  // Electricity
  printerWattage: number
  kwhRate: number

  // Add-ons & Extras
  addOns: PricingAddOn[]
  packagingCost: number
  shippingCost: number

  // Labor
  laborRate: number
  laborTime: number

  // Margin
  marginPercentage: number
}

export interface CompletePricingResult {
  materialCost: number
  electricityCost: number
  addOnsCost: number
  packagingCost: number
  shippingCost: number
  laborCost: number
  subtotal: number
  marginAmount: number
  profitAmount: number
  finalPrice: number
  printTimeHours: number
  kwhUsed: number
}

/**
 * Calculate complete pricing breakdown
 * ONE function to rule them all - uses all formulas above
 * @param input - All pricing inputs
 * @returns Complete pricing breakdown
 */
export function calculateCompletePricing(
  input: CompletePricingInput
): CompletePricingResult {
  // 1. Convert time to hours
  const printTimeHours = convertToHours(
    input.printTimeDays,
    input.printTimeHours,
    input.printTimeMinutes
  )

  // 2. Calculate material cost
  const materialCost = calculateMaterialCostFromKg(
    input.materialCostPerKg,
    input.materialGrams
  )

  // 3. Calculate electricity
  const kwhUsed = calculateKwhUsage(input.printerWattage, printTimeHours)
  const electricityCost = calculateElectricityCost(
    input.printerWattage,
    printTimeHours,
    input.kwhRate
  )

  // 4. Calculate add-ons
  const addOnsCost = calculateTotalAddOnsCost(input.addOns)

  // 5. Calculate labor
  const laborCost = calculateLaborCost(input.laborRate, input.laborTime)

  // 6. Calculate subtotal
  const subtotal = calculateSubtotal({
    materialCost,
    electricityCost,
    addOnsCost,
    packagingCost: input.packagingCost,
    shippingCost: input.shippingCost,
    laborCost,
  })

  // 7. Calculate margin and final price
  const marginAmount = calculateMarginAmount(subtotal, input.marginPercentage)
  const profitAmount = marginAmount
  const finalPrice = calculateFinalPrice(subtotal, input.marginPercentage)

  // 8. Round all currency values
  return {
    materialCost: roundCurrency(materialCost),
    electricityCost: roundCurrency(electricityCost),
    addOnsCost: roundCurrency(addOnsCost),
    packagingCost: roundCurrency(input.packagingCost),
    shippingCost: roundCurrency(input.shippingCost),
    laborCost: roundCurrency(laborCost),
    subtotal: roundCurrency(subtotal),
    marginAmount: roundCurrency(marginAmount),
    profitAmount: roundCurrency(profitAmount),
    finalPrice: roundCurrency(finalPrice),
    printTimeHours: roundToDecimals(printTimeHours, 2),
    kwhUsed: roundToDecimals(kwhUsed, 3),
  }
}
