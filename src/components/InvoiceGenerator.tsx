/**
 * Invoice Generator Component
 * Generate and download invoice/pricing breakdown as PDF
 */

'use client'

import { ModelPricing, PricingAddOn } from '@/types'
import { formatCurrency } from '@/lib/pricingFormulas'
import { Download, X, Loader } from 'lucide-react'
import { useRef, useState } from 'react'
import { generateTextBasedPdf } from '@/lib/invoicePdf'

interface InvoiceGeneratorProps {
  models: ModelPricing[]
  modelPricings: any[]
  currency: string
  globalSettings: {
    kwhRate: number
    packagingCost: number
    shippingCost: number
    laborRate: number
    laborTime: number
    marginPercentage: number
    addOns: PricingAddOn[]
  }
  totals: {
    subtotal: number
    finalPrice: number
    profitAmount: number
    materialCost: number
    electricityCost: number
    addOnsCost: number
    packagingCost: number
    shippingCost: number
    laborCost: number
    printTimeHours: number
  }
  isOpen: boolean
  onClose: () => void
}

export default function InvoiceGenerator({
  models,
  modelPricings,
  currency,
  globalSettings,
  totals,
  isOpen,
  onClose,
}: InvoiceGeneratorProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const today = new Date()
  const invoiceNumber = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Download as PDF (using text-based PDF generation)
  const handleDownloadPDF = async () => {
    setIsGenerating(true)
    try {
      // Prepare invoice data
      const invoiceNumber = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 10000)}`
      
      const models_data = models.map((model) => {
        const pricing = modelPricings.find((p) => p.modelId === model.id)
        return {
          name: model.modelName,
          weight: model.materialGrams,
          time: `${pricing?.printTimeHours.toFixed(1) || 0}h`,
          price: formatCurrency(pricing?.finalPrice || 0, currency),
        }
      })

      const addOns_data = globalSettings.addOns.map((addon) => ({
        name: addon.name || 'Unnamed',
        qty: addon.quantity,
        price: formatCurrency(addon.cost, currency),
        total: formatCurrency(addon.quantity * addon.cost, currency),
      }))

      generateTextBasedPdf(
        {
          invoiceNumber,
          date: formattedDate,
          models: models_data,
          addOns: addOns_data,
          costs: {
            material: formatCurrency(totals.materialCost, currency),
            electricity: formatCurrency(totals.electricityCost, currency),
            packaging: formatCurrency(totals.packagingCost, currency),
            shipping: formatCurrency(totals.shippingCost, currency),
            labor: formatCurrency(totals.laborCost, currency),
            addOns: formatCurrency(totals.addOnsCost, currency),
          },
          subtotal: formatCurrency(totals.subtotal, currency),
          profit: formatCurrency(totals.profitAmount, currency),
          profitPercentage: globalSettings.marginPercentage,
          finalPrice: formatCurrency(totals.finalPrice, currency),
          currency,
        },
        `invoice-${invoiceNumber}.pdf`
      )
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      alert('Failed to download invoice. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 print:hidden"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto invoice-print-container">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:rounded-none print:shadow-none print:max-h-none print:w-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors print:hidden no-print"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 left-4 flex gap-2 print:hidden no-print">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF Invoice
                </>
              )}
            </button>
          </div>

          {/* Invoice Content */}
          <div ref={invoiceRef} className="p-12 text-slate-900 invoice-content print:p-0" data-invoice="true">
            {/* Header */}
            <div className="mb-8 pb-6 border-b-2 border-slate-900">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    INVOICE
                  </h1>
                  <p className="text-slate-600">3D Printing Services</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Invoice Number</p>
                  <p className="text-lg font-bold text-slate-900">
                    {invoiceNumber}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">Date</p>
                  <p className="text-slate-900">{formattedDate}</p>
                </div>
              </div>
            </div>

            {/* Models Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Models Summary
              </h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-900">
                    <th className="text-left py-2 font-semibold">Model</th>
                    <th className="text-right py-2 font-semibold">Weight (g)</th>
                    <th className="text-right py-2 font-semibold">Print Time</th>
                    <th className="text-right py-2 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {models.map((model) => {
                    const pricing = modelPricings.find(
                      (p) => p.modelId === model.id
                    )
                    return (
                      <tr key={model.id} className="border-b border-slate-300">
                        <td className="py-3">
                          <p className="font-medium">{model.modelName}</p>
                          {model.notes && (
                            <p className="text-sm text-slate-600">
                              {model.notes}
                            </p>
                          )}
                        </td>
                        <td className="text-right py-3">
                          {model.materialGrams}g
                        </td>
                        <td className="text-right py-3">
                          {pricing?.printTimeHours.toFixed(1)}h
                        </td>
                        <td className="text-right py-3 font-semibold">
                          {formatCurrency(
                            pricing?.finalPrice || 0,
                            currency
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Add-ons Section */}
            {globalSettings.addOns.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">
                  Add-ons & Extras
                </h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-900">
                      <th className="text-left py-2 font-semibold">Item</th>
                      <th className="text-right py-2 font-semibold">
                        Quantity
                      </th>
                      <th className="text-right py-2 font-semibold">
                        Unit Price
                      </th>
                      <th className="text-right py-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalSettings.addOns.map((addOn) => (
                      <tr
                        key={addOn.id}
                        className="border-b border-slate-300"
                      >
                        <td className="py-3">{addOn.name || 'Unnamed'}</td>
                        <td className="text-right py-3">{addOn.quantity}</td>
                        <td className="text-right py-3">
                          {formatCurrency(addOn.cost, currency)}
                        </td>
                        <td className="text-right py-3 font-semibold">
                          {formatCurrency(
                            addOn.quantity * addOn.cost,
                            currency
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Cost Breakdown
              </h2>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Material Cost</span>
                    <span className="font-medium">
                      {formatCurrency(totals.materialCost, currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Electricity Cost</span>
                    <span className="font-medium">
                      {formatCurrency(totals.electricityCost, currency)}
                    </span>
                  </div>
                  {totals.addOnsCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Add-ons</span>
                      <span className="font-medium">
                        {formatCurrency(totals.addOnsCost, currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Packaging & Shipping
                    </span>
                    <span className="font-medium">
                      {formatCurrency(
                        (globalSettings.packagingCost +
                          globalSettings.shippingCost) *
                          models.length,
                        currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="border-t-2 border-slate-900 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(totals.subtotal, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-lg text-green-600">
                  <span className="font-semibold">
                    Profit Margin ({globalSettings.marginPercentage}%)
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(totals.profitAmount, currency)}
                  </span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t-2 border-slate-900 pt-4">
                  <span>TOTAL</span>
                  <span>{formatCurrency(totals.finalPrice, currency)}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-300 text-center text-sm text-slate-600">
              <p>Thank you for your business!</p>
              <p className="mt-2">
                Total Models: {models.length} • Total Print Time:{' '}
                {totals.printTimeHours.toFixed(1)} hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media (max-width: 768px) {
          .fixed {
            padding: 0 !important;
          }
          
          .relative {
            border-radius: 0 !important;
            max-height: 100vh !important;
          }
        }
      `}</style>
    </>
  )
}
