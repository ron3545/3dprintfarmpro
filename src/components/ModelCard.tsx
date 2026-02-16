/**
 * ModelCard Component
 * Modern card display for individual model pricing
 * Shows model details, pricing, and available printers
 */

'use client'

import { ModelPricing, Printer } from '@/types'
import { formatCurrency, getCurrencySymbol } from '@/lib/pricingFormulas'
import { Trash2, Clock, Weight, Printer as PrinterIcon, Zap, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ModelCardProps {
  model: ModelPricing
  printers: Printer[]
  currency: string
  pricing: {
    materialCost: number
    electricityCost: number
    addOnsCost: number
    packagingCost: number
    shippingCost: number
    laborCost: number
    subtotal: number
    finalPrice: number
    printTimeHours: number
  }
  onRemove: () => void
  onUpdate: (field: keyof ModelPricing, value: any) => void
}

export default function ModelCard({
  model,
  printers,
  currency,
  pricing,
  onRemove,
  onUpdate,
}: ModelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Filter printers that are in IDLE/standby mode
  const availablePrinters = Array.isArray(printers) 
    ? printers.filter((p) => p.status === 'IDLE' && p.available)
    : []

  const selectedPrinter = Array.isArray(printers)
    ? printers.find((p) => p.id === model.selectedPrinterId)
    : undefined

  return (
    <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur border border-slate-700 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              value={model.modelName}
              onChange={(e) => onUpdate('modelName', e.target.value)}
              placeholder="Model Name"
              className="text-lg font-bold bg-transparent border-none outline-none focus:outline-none text-white placeholder-slate-500 w-full"
            />
            {model.modelFile && (
              <p className="text-xs text-slate-400 mt-1 truncate">
                {model.modelFile}
              </p>
            )}
          </div>
          <button
            onClick={onRemove}
            className="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Remove model"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Material Weight */}
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Weight className="w-3.5 h-3.5" />
              <span>Material</span>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={model.materialGrams}
                onChange={(e) =>
                  onUpdate('materialGrams', parseFloat(e.target.value) || 0)
                }
                className="w-full text-lg font-bold bg-transparent border-none outline-none text-white"
                step="1"
              />
              <span className="text-xs text-slate-400">g</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {formatCurrency(pricing.materialCost, currency)}
            </p>
          </div>

          {/* Print Time */}
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Print Time</span>
            </div>
            <div className="text-lg font-bold text-white">
              {pricing.printTimeHours.toFixed(1)}h
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Zap className="w-3 h-3" />
              <span>{formatCurrency(pricing.electricityCost, currency)}</span>
            </div>
          </div>

          {/* Price per Kg */}
          <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <span>Price/kg</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-slate-400">
                {getCurrencySymbol(currency)}
              </span>
              <input
                type="number"
                value={model.filamentCostPerKg}
                onChange={(e) =>
                  onUpdate('filamentCostPerKg', parseFloat(e.target.value) || 0)
                }
                className="w-full text-lg font-bold bg-transparent border-none outline-none text-white"
                step="0.01"
              />
            </div>
          </div>

          {/* Final Price */}
          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-3 border border-green-700/50">
            <div className="flex items-center gap-2 text-green-400 text-xs mb-1">
              <span>Total Price</span>
            </div>
            <div className="text-lg font-bold text-green-400">
              {formatCurrency(pricing.finalPrice, currency)}
            </div>
            <p className="text-xs text-green-500/70 mt-1">
              Base: {formatCurrency(pricing.subtotal, currency)}
            </p>
          </div>
        </div>

        {/* Printer Selection */}
        <div className="mb-4">
          <label className="text-xs font-medium text-slate-400 mb-2 block">
            Available Printers ({availablePrinters.length} ready)
          </label>
          <div className="relative">
            <select
              value={model.selectedPrinterId || ''}
              onChange={(e) => onUpdate('selectedPrinterId', e.target.value || undefined)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm appearance-none cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="">Select Printer...</option>
              {availablePrinters.length === 0 && (
                <option value="" disabled>
                  No printers available
                </option>
              )}
              {availablePrinters.map((printer) => (
                <option key={printer.id} value={printer.id}>
                  {printer.name} - {printer.model} ({printer.wattage}W)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          {selectedPrinter && (
            <div className="mt-2 flex items-center gap-2 text-xs text-blue-400 bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-800/30">
              <PrinterIcon className="w-3.5 h-3.5" />
              <span className="font-medium">{selectedPrinter.name}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">{selectedPrinter.wattage}W</span>
            </div>
          )}
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2 py-2 border-t border-slate-700/50"
        >
          <span>{isExpanded ? 'Hide' : 'Show'} Details</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
            {/* Print Time Details */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">
                Print Time Breakdown
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-slate-500">Days</label>
                  <input
                    type="number"
                    value={model.printTimeDays}
                    onChange={(e) =>
                      onUpdate('printTimeDays', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Hours</label>
                  <input
                    type="number"
                    value={model.printTimeHours}
                    onChange={(e) =>
                      onUpdate('printTimeHours', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">Minutes</label>
                  <input
                    type="number"
                    value={model.printTimeMinutes}
                    onChange={(e) =>
                      onUpdate(
                        'printTimeMinutes',
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded text-sm text-white"

                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-medium text-slate-400 mb-2 block">
                Notes
              </label>
              <textarea
                value={model.notes || ''}
                onChange={(e) => onUpdate('notes', e.target.value)}
                placeholder="Add any notes about this model..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-600 resize-none focus:border-blue-500 focus:outline-none"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
