/**
 * Invoice Modal Component
 * Displays printable invoice/quote
 */

'use client'

import { PricingService } from '@/services/PricingService'
import { PricingAddOn } from '@/types'
import { X, Printer, Download } from 'lucide-react'
import { useRef } from 'react'

interface InvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceNumber: string
  invoiceDate: string
  currency: string
  pricing: {
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
  inputs: {
    filamentCostPerKg: number
    materialGrams: number
    printerWattage: number
    printTimeDays: number
    printTimeHours: number
    printTimeMinutes: number
    kwhRate: number
    packagingCost: number
    shippingCost: number
    laborRate: number
    laborTime: number
    marginPercentage: number
  }
  addOns: PricingAddOn[]
  totalHours: number
}

export default function InvoiceModal({
  isOpen,
  onClose,
  invoiceNumber,
  invoiceDate,
  currency,
  pricing,
  inputs,
  addOns,
  totalHours,
}: InvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, you'd generate a PDF here
    alert('PDF download would be implemented here using a library like jsPDF or react-pdf')
  }

  const getCurrencySymbol = (curr: string): string => {
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
    return symbols[curr] || '$'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header - No Print */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden z-10">
            <h2 className="text-xl font-bold text-gray-900">Invoice / Quote</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div ref={invoiceRef} className="p-8 text-gray-900">
            {/* Company Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">PrintFarm Pro</h1>
              <p className="text-gray-600">3D Printing Services</p>
              <p className="text-sm text-gray-500 mt-1">
                Email: info@printfarmpro.com | Phone: +1 (555) 123-4567
              </p>
            </div>

            {/* Invoice Details */}
            <div className="flex justify-end mb-8">
              <div className="text-right">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                  Invoice Details
                </h3>
                <div className="text-gray-700">
                  <p className="text-sm">
                    <span className="font-medium">Invoice #:</span> {invoiceNumber}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> {invoiceDate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Currency:</span> {currency}
                  </p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                      Details
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700 text-sm">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Material */}
                  <tr>
                    <td className="py-3 px-4 text-gray-700">3D Printing Material</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">
                      {inputs.materialGrams}g @ {getCurrencySymbol(currency)}
                      {(inputs.filamentCostPerKg / 1000).toFixed(4)}/g
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {PricingService.formatCurrency(pricing.materialCost, currency)}
                    </td>
                  </tr>

                  {/* Electricity */}
                  <tr>
                    <td className="py-3 px-4 text-gray-700">Electricity Cost</td>
                    <td className="py-3 px-4 text-right text-sm text-gray-600">
                      {inputs.printerWattage}W for {totalHours.toFixed(2)}h
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {PricingService.formatCurrency(pricing.electricityCost, currency)}
                    </td>
                  </tr>

                  {/* Add-ons */}
                  {addOns.map((addOn) => (
                    <tr key={addOn.id}>
                      <td className="py-3 px-4 text-gray-700">
                        {addOn.name || 'Add-on Item'}
                      </td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">
                        {addOn.quantity} × {getCurrencySymbol(currency)}
                        {addOn.cost.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {PricingService.formatCurrency(
                          addOn.quantity * addOn.cost,
                          currency
                        )}
                      </td>
                    </tr>
                  ))}

                  {/* Packaging */}
                  {inputs.packagingCost > 0 && (
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Packaging</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">-</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {PricingService.formatCurrency(pricing.packagingCost, currency)}
                      </td>
                    </tr>
                  )}

                  {/* Shipping */}
                  {inputs.shippingCost > 0 && (
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Shipping</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">-</td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {PricingService.formatCurrency(pricing.shippingCost, currency)}
                      </td>
                    </tr>
                  )}

                  {/* Labor */}
                  {inputs.laborTime > 0 && (
                    <tr>
                      <td className="py-3 px-4 text-gray-700">Labor</td>
                      <td className="py-3 px-4 text-right text-sm text-gray-600">
                        {inputs.laborTime}h @ {getCurrencySymbol(currency)}
                        {inputs.laborRate.toFixed(2)}/h
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900">
                        {PricingService.formatCurrency(pricing.laborCost, currency)}
                      </td>
                    </tr>
                  )}

                  {/* Subtotal */}
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-3 px-4 text-gray-700 font-semibold" colSpan={2}>
                      Subtotal
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900">
                      {PricingService.formatCurrency(pricing.subtotal, currency)}
                    </td>
                  </tr>

                  {/* Margin */}
                  <tr>
                    <td className="py-3 px-4 text-gray-700" colSpan={2}>
                      Profit Margin ({inputs.marginPercentage}%)
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      {PricingService.formatCurrency(pricing.profitAmount, currency)}
                    </td>
                  </tr>

                  {/* Total */}
                  <tr className="border-t-2 border-gray-300 bg-gray-50">
                    <td
                      className="py-4 px-4 text-gray-900 font-bold text-lg"
                      colSpan={2}
                    >
                      TOTAL
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-xl text-gray-900">
                      {PricingService.formatCurrency(pricing.finalPrice, currency)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Notes */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-sm text-gray-600">
                This quote is valid for 30 days from the date of issue. Payment terms: Net
                30 days. For questions about this invoice, please contact us at
                info@printfarmpro.com
              </p>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
              <p>Thank you for your business!</p>
              <p className="mt-1">PrintFarm Pro - Professional 3D Printing Services</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:hidden {
            display: none !important;
          }
          ${invoiceRef.current ? `
            .invoice-content,
            .invoice-content * {
              visibility: visible;
            }
            .invoice-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          ` : ''}
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
