/**
 * Queue Manager Page
 * Manage print job queue and job sequencing
 */

'use client'

import { useAppStore } from '@/store/appStore'
import { QueueService } from '@/services/QueueService'
import { Zap } from 'lucide-react'

export default function QueuePage() {
  const { queue, jobs, printers } = useAppStore()

  const getJobName = (jobId: string) => {
    return jobs.find((j) => j.id === jobId)?.name || 'Unknown'
  }

  const getPrinterName = (printerId: string) => {
    return printers.find((p) => p.id === printerId)?.name || 'Unknown'
  }

  const queueStats = QueueService.calculateQueueStats(queue)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Print Queue</h1>
          </div>
          <p className="text-slate-400">Manage the print job queue and execution</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Queue Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-slate-400 text-sm">Total</p>
            <p className="text-3xl font-bold text-white mt-2">{queueStats.total}</p>
          </div>
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
        </div>

        {/* Queue List */}
        {queue.length > 0 ? (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Queue Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-400">Position</th>
                    <th className="text-left py-3 px-4 text-slate-400">Job</th>
                    <th className="text-left py-3 px-4 text-slate-400">Printer</th>
                    <th className="text-left py-3 px-4 text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="py-3 px-4">{idx + 1}</td>
                      <td className="py-3 px-4">{getJobName(item.jobId)}</td>
                      <td className="py-3 px-4">{getPrinterName(item.printerId)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-slate-700 rounded text-xs">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card text-center py-12">
            <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Queue is empty</p>
            <p className="text-sm text-slate-500 mt-2">
              Add jobs to the queue to start printing
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
