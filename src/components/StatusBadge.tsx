/**
 * Status Badge Component
 * Displays status with color coding
 */

import { PrinterStatusEnum, JobStatusEnum } from '@/types'
import { PrinterService } from '@/services/PrinterService'

interface StatusBadgeProps {
  status: PrinterStatusEnum | JobStatusEnum | string
  type?: 'printer' | 'job'
}

export function StatusBadge({ status, type = 'printer' }: StatusBadgeProps) {
  let bgColor = 'bg-gray-500'
  let textColor = 'text-white'
  let displayText = status

  if (type === 'printer') {
    bgColor = PrinterService.getStatusColor(status as PrinterStatusEnum)
    displayText = PrinterService.getStatusText(status as PrinterStatusEnum)
  } else if (type === 'job') {
    const statusTexts: Record<string, string> = {
      DRAFT: 'Draft',
      READY: 'Ready',
      QUEUED: 'Queued',
      PRINTING: 'Printing',
      COMPLETED: 'Completed',
      FAILED: 'Failed',
      CANCELLED: 'Cancelled',
    }
    const statusColors: Record<string, string> = {
      DRAFT: 'bg-slate-500',
      READY: 'bg-yellow-500',
      QUEUED: 'bg-blue-500',
      PRINTING: 'bg-purple-500',
      COMPLETED: 'bg-green-500',
      FAILED: 'bg-red-500',
      CANCELLED: 'bg-gray-500',
    }
    bgColor = statusColors[status] || 'bg-gray-500'
    displayText = statusTexts[status] || status
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${textColor}`}
    >
      {displayText}
    </span>
  )
}
