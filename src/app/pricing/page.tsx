/**
 * Modern Pricing Calculator Page
 * Multi-model support with beautiful UI/UX
 * Calculate pricing for multiple models simultaneously
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { ModelPricing, PricingAddOn } from '@/types'
import { calculateCompletePricing, formatCurrency, getCurrencySymbol } from '@/lib/pricingFormulas'
import { Calculator, Plus, DollarSign, Package, Settings2, FileText, Trash2 } from 'lucide-react'
import ModelCard from '@/components/ModelCard'
import InvoiceGenerator from '@/components/InvoiceGenerator'
import { useAppStore } from '@/store/appStore'

export default function PricingPage() {
  // Global state
  const { printers = [] } = useAppStore()

  // Local state
  const [models, setModels] = useState<ModelPricing[]>([])
  const [currency, setCurrency] = useState('PHP')
  const [globalSettings, setGlobalSettings] = useState({
    kwhRate: 0.12,
    packagingCost: 2.5,
    shippingCost: 0,
    laborRate: 0,
    laborTime: 0,
    marginPercentage: 30,
    addOns: [] as PricingAddOn[],
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)

  // Fetch printers on mount
  useEffect(() => {
    fetchPrinters()
  }, [])

  const fetchPrinters = async () => {
    try {
      const res = await fetch('/api/printers')
      if (res.ok) {
        const response = await res.json()
        // Extract data from API response { success, data, message }
        const printers = Array.isArray(response.data) ? response.data : []
        useAppStore.getState().setPrinters(printers)
      }
    } catch (error) {
      console.error('Failed to fetch printers:', error)
    }
  }

  // Add new model
  const addModel = () => {
    const newModel: ModelPricing = {
      id: `model-${Date.now()}`,
      modelName: `Model ${models.length + 1}`,
      filamentCostPerKg: 20,
      materialGrams: 100,
      printTimeDays: 0,
      printTimeHours: 8,
      printTimeMinutes: 0,
      printerWattage: 200,
      packagingCost: globalSettings.packagingCost,
      shippingCost: globalSettings.shippingCost,
      laborRate: globalSettings.laborRate,
      laborTime: globalSettings.laborTime,
    }
    setModels([...models, newModel])
  }

  // Remove model
  const removeModel = (id: string) => {
    setModels(models.filter((m) => m.id !== id))
  }

  // Update model field
  const updateModel = (id: string, field: keyof ModelPricing, value: any) => {
    setModels(
      models.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  // Global Add-ons handlers
  const addGlobalAddOn = () => {
    const newAddOn: PricingAddOn = {
      id: `addon-${Date.now()}`,
      name: '',
      quantity: 1,
      cost: 0,
    }
    setGlobalSettings({
      ...globalSettings,
      addOns: [...globalSettings.addOns, newAddOn],
    })
  }

  const removeGlobalAddOn = (id: string) => {
    setGlobalSettings({
      ...globalSettings,
      addOns: globalSettings.addOns.filter((a) => a.id !== id),
    })
  }

  const updateGlobalAddOn = (id: string, field: keyof PricingAddOn, value: string | number) => {
    setGlobalSettings({
      ...globalSettings,
      addOns: globalSettings.addOns.map((a) =>
        a.id === id ? { ...a, [field]: value } : a
      ),
    })
  }

  // Calculate pricing for each model
  const modelPricings = useMemo(() => {
    return models.map((model) => {
      const selectedPrinter = Array.isArray(printers) 
        ? printers.find((p) => p.id === model.selectedPrinterId)
        : undefined
      const wattage = selectedPrinter?.wattage || model.printerWattage

      const pricing = calculateCompletePricing({
        materialCostPerKg: model.filamentCostPerKg,
        materialGrams: model.materialGrams,
        printTimeDays: model.printTimeDays,
        printTimeHours: model.printTimeHours,
        printTimeMinutes: model.printTimeMinutes,
        printerWattage: wattage,
        kwhRate: globalSettings.kwhRate,
        addOns: globalSettings.addOns,
        packagingCost: model.packagingCost,
        shippingCost: model.shippingCost,
        laborRate: model.laborRate,
        laborTime: model.laborTime,
        marginPercentage: globalSettings.marginPercentage,
      })

      return {
        modelId: model.id,
        ...pricing,
      }
    })
  }, [models, printers, globalSettings])

  // Calculate totals across all models
  const totals = useMemo(() => {
    return modelPricings.reduce(
      (acc, pricing) => ({
        subtotal: acc.subtotal + pricing.subtotal,
        finalPrice: acc.finalPrice + pricing.finalPrice,
        profitAmount: acc.profitAmount + pricing.profitAmount,
        materialCost: acc.materialCost + pricing.materialCost,
        electricityCost: acc.electricityCost + pricing.electricityCost,
        addOnsCost: acc.addOnsCost + pricing.addOnsCost,
        packagingCost: acc.packagingCost + pricing.packagingCost,
        shippingCost: acc.shippingCost + pricing.shippingCost,
        laborCost: acc.laborCost + pricing.laborCost,
        printTimeHours: acc.printTimeHours + pricing.printTimeHours,
      }),
      {
        subtotal: 0,
        finalPrice: 0,
        profitAmount: 0,
        materialCost: 0,
        electricityCost: 0,
        addOnsCost: 0,
        packagingCost: 0,
        shippingCost: 0,
        laborCost: 0,
        printTimeHours: 0,
      }
    )
  }, [modelPricings])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-50 backdrop-blur-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Pricing Calculator</h1>
                <p className="text-sm text-slate-400">
                  Calculate pricing for multiple models simultaneously
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  showSettings
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-slate-300">
                  Currency:
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="PHP">₱ PHP</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="JPY">¥ JPY</option>
                  <option value="AUD">A$ AUD</option>
                  <option value="CAD">C$ CAD</option>
                  <option value="SGD">S$ SGD</option>
                  <option value="INR">₹ INR</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Models Section */}
          <div className="lg:col-span-3">
            {/* Global Settings Panel */}
            {showSettings && (
              <div className="mb-6 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-blue-400" />
                  Global Settings
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      kWh Rate ({getCurrencySymbol(currency)}/kWh)
                    </label>
                    <input
                      type="number"
                      value={globalSettings.kwhRate}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          kwhRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      Packaging ({getCurrencySymbol(currency)})
                    </label>
                    <input
                      type="number"
                      value={globalSettings.packagingCost}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          packagingCost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      Shipping ({getCurrencySymbol(currency)})
                    </label>
                    <input
                      type="number"
                      value={globalSettings.shippingCost}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          shippingCost: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      Labor Rate ({getCurrencySymbol(currency)}/hr)
                    </label>
                    <input
                      type="number"
                      value={globalSettings.laborRate}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          laborRate: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      Labor Time (hrs)
                    </label>
                    <input
                      type="number"
                      value={globalSettings.laborTime}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          laborTime: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      step="0.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">
                      Profit Margin (%)
                    </label>
                    <input
                      type="number"
                      value={globalSettings.marginPercentage}
                      onChange={(e) =>
                        setGlobalSettings({
                          ...globalSettings,
                          marginPercentage: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                      step="1"
                    />
                  </div>
                </div>

                {/* Global Add-ons Section */}
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-slate-300">
                      Global Add-ons (applied to all models)
                    </label>
                    <button
                      onClick={addGlobalAddOn}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Item
                    </button>
                  </div>
                  
                  {globalSettings.addOns.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                      No global add-ons yet. Add items that apply to all models.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {globalSettings.addOns.map((addOn) => (
                        <div
                          key={addOn.id}
                          className="grid grid-cols-12 gap-2 p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
                        >
                          <div className="col-span-5">
                            <input
                              type="text"
                              value={addOn.name}
                              onChange={(e) =>
                                updateGlobalAddOn(addOn.id, 'name', e.target.value)
                              }
                              placeholder="Item name"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              value={addOn.quantity}
                              onChange={(e) =>
                                updateGlobalAddOn(addOn.id, 'quantity', parseFloat(e.target.value) || 0)
                              }
                              placeholder="Qty"
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              value={addOn.cost}
                              onChange={(e) =>
                                updateGlobalAddOn(addOn.id, 'cost', parseFloat(e.target.value) || 0)
                              }
                              placeholder={`Cost (${getCurrencySymbol(currency)})`}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:border-blue-500 focus:outline-none"
                              step="0.01"
                            />
                          </div>
                          <div className="col-span-1 flex items-center">
                            <button
                              onClick={() => removeGlobalAddOn(addOn.id)}
                              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                              title="Remove add-on"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="col-span-12 text-xs text-slate-500 pl-1">
                            Subtotal: {formatCurrency(addOn.quantity * addOn.cost, currency)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Add Model Button */}
            <button
              onClick={addModel}
              className="w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              Add New Model
            </button>

            {/* Models Grid */}
            {models.length === 0 ? (
              <div className="bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center">
                <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-400 mb-2">
                  No models added yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Click &quot;Add New Model&quot; to start pricing your 3D prints
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {models.map((model) => {
                  const pricing = modelPricings.find(
                    (p) => p.modelId === model.id
                  )
                  return (
                    <ModelCard
                      key={model.id}
                      model={model}
                      printers={printers}
                      currency={currency}
                      pricing={{
                        materialCost: pricing?.materialCost || 0,
                        electricityCost: pricing?.electricityCost || 0,
                        addOnsCost: pricing?.addOnsCost || 0,
                        packagingCost: pricing?.packagingCost || 0,
                        shippingCost: pricing?.shippingCost || 0,
                        laborCost: pricing?.laborCost || 0,
                        subtotal: pricing?.subtotal || 0,
                        finalPrice: pricing?.finalPrice || 0,
                        printTimeHours: pricing?.printTimeHours || 0,
                      }}
                      onRemove={() => removeModel(model.id)}
                      onUpdate={(field, value) =>
                        updateModel(model.id, field, value)
                      }
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div>
            <div className="sticky top-28">
              {/* Total Summary */}
              <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur border border-slate-700 rounded-xl p-6 shadow-xl mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-semibold">Total Summary</h3>
                </div>

                {models.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    Add models to see pricing summary
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2 pb-4 border-b border-slate-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Models</span>
                        <span className="font-semibold text-white">
                          {models.length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total Print Time</span>
                        <span className="font-semibold text-white">
                          {totals.printTimeHours.toFixed(1)}h
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pb-4 border-b border-slate-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Material Cost</span>
                        <span className="text-white">
                          {formatCurrency(totals.materialCost, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Electricity Cost</span>
                        <span className="text-white">
                          {formatCurrency(totals.electricityCost, currency)}
                        </span>
                      </div>
                      {totals.addOnsCost > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Add-ons</span>
                          <span className="text-white">
                            {formatCurrency(totals.addOnsCost, currency)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pb-4 border-b border-slate-700">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300 font-medium">
                          Subtotal
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(totals.subtotal, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">
                          Profit ({globalSettings.marginPercentage}%)
                        </span>
                        <span className="font-semibold text-green-400">
                          {formatCurrency(totals.profitAmount, currency)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                        Total Final Price
                      </p>
                      <p className="text-3xl font-bold text-green-400">
                        {formatCurrency(totals.finalPrice, currency)}
                      </p>
                    </div>

                    {/* Generate Invoice Button */}
                    <button
                      onClick={() => setShowInvoice(true)}
                      className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <FileText className="w-5 h-5" />
                      Generate Invoice
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-blue-400 mb-2">
                  💡 Quick Tips
                </h4>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Select standby printers for accurate wattage</li>
                  <li>• Adjust global settings for consistent pricing</li>
                  <li>• Expand model details for fine-tuning</li>
                  <li>• Add notes for client reference</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Generator Modal */}
      <InvoiceGenerator
        models={models}
        modelPricings={modelPricings}
        currency={currency}
        globalSettings={globalSettings}
        totals={totals}
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
      />
    </div>
  )
}
