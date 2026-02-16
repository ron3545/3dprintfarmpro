/**
 * Printers Page
 * Manage and configure printers
 */

'use client'

import { useAppStore } from '@/store/appStore'
import { PrinterCard } from '@/components/PrinterCard'
import { Printer, Plus } from 'lucide-react'

export default function PrintersPage() {
  const { printers } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Printer className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Printers</h1>
          </div>
          <p className="text-slate-400">Manage your 3D printer fleet</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Printer
          </button>
        </div>

        {/* Printers Grid */}
        {printers.length > 0 ? (
          <div className="grid-auto-fit">
            {printers.map((printer) => (
              <PrinterCard key={printer.id} printer={printer} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Printer className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No printers configured</p>
            <p className="text-sm text-slate-500 mt-2">
              Add your first printer to get started
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
