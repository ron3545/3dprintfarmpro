/**
 * Dashboard Page
 * Overview of all printers, active jobs, and queue status
 */

'use client'

import { useAppStore } from '@/store/appStore'
import { PrinterCard } from '@/components/PrinterCard'
import { BarChart3, TrendingUp, Zap, AlertCircle } from 'lucide-react'
import { PricingService } from '@/services/PricingService'
import { QueueService } from '@/services/QueueService'
import { PrinterService } from '@/services/PrinterService'

export default function DashboardPage() {
  const { printers, jobs, queue } = useAppStore()

  // Calculate statistics
  const availablePrinters = PrinterService.getAvailablePrinters(printers)
  const queueStats = QueueService.calculateQueueStats(queue)
  const printingJobs = jobs.filter((j) => j.status === 'PRINTING')
  const totalRevenue = jobs
    .filter((j) => j.status === 'COMPLETED')
    .reduce((sum, j) => sum + j.finalPrice, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
          <p className="text-slate-400">
            Real-time overview of your print farm operations
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Printers */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Printers</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {printers.length}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {availablePrinters.length} available
                </p>
              </div>
              <Zap className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </div>

          {/* Queue Status */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Queue Items</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {queueStats.total}
                </p>
                <p className="text-xs text-yellow-400 mt-1">
                  {queueStats.pending} pending
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          {/* Currently Printing */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Now Printing</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {printingJobs.length}
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  {queueStats.printing} in queue
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500 opacity-20 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Daily Revenue */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {PricingService.formatCurrency(totalRevenue)}
                </p>
                <p className="text-xs text-green-400 mt-1">
                  {jobs.filter((j) => j.status === 'COMPLETED').length} jobs completed
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Printers Grid */}
        <div className="mb-8">
          <div className="mb-6">
            <h2 className="section-title">Printers</h2>
          </div>
          {printers.length > 0 ? (
            <div className="grid-auto-fit">
              {printers.map((printer) => (
                <PrinterCard key={printer.id} printer={printer} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-slate-400">No printers configured yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Add your first printer from the Printers page
              </p>
            </div>
          )}
        </div>

        {/* Queue Overview */}
        <div>
          <div className="mb-6">
            <h2 className="section-title">Queue Overview</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">
                {queueStats.pending}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-slate-400 text-sm">Printing</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">
                {queueStats.printing}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-slate-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {queueStats.completed}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-slate-400 text-sm">Failed</p>
              <p className="text-3xl font-bold text-red-400 mt-2">
                {queueStats.failed}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
