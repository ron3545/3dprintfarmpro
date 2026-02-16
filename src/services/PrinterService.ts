/**
 * Printer Service
 * Handles printer communication and status management
 */

import { Printer, PrinterStatusEnum, PrintQueue, QueueStatusEnum } from '@/types'

export interface PrinterHealthCheck {
  printerId: string
  status: PrinterStatusEnum
  isResponsive: boolean
  lastResponseTime: Date
  errorMessage?: string
}

export class PrinterService {
  /**
   * Get all available printers
   */
  static getAvailablePrinters(printers: Printer[]): Printer[] {
    if (!Array.isArray(printers)) {
      return []
    }
    return printers.filter((p) => p.status === PrinterStatusEnum.IDLE)
  }

  /**
   * Get printer status color for UI
   */
  static getStatusColor(status: PrinterStatusEnum): string {
    const colors = {
      [PrinterStatusEnum.IDLE]: 'bg-green-500',
      [PrinterStatusEnum.PRINTING]: 'bg-blue-500',
      [PrinterStatusEnum.PAUSED]: 'bg-yellow-500',
      [PrinterStatusEnum.ERROR]: 'bg-red-500',
      [PrinterStatusEnum.OFFLINE]: 'bg-gray-500',
      [PrinterStatusEnum.MAINTENANCE]: 'bg-purple-500',
    }
    return colors[status] || 'bg-gray-500'
  }

  /**
   * Get printer status human-readable text
   */
  static getStatusText(status: PrinterStatusEnum): string {
    const texts = {
      [PrinterStatusEnum.IDLE]: 'Idle',
      [PrinterStatusEnum.PRINTING]: 'Printing',
      [PrinterStatusEnum.PAUSED]: 'Paused',
      [PrinterStatusEnum.ERROR]: 'Error',
      [PrinterStatusEnum.OFFLINE]: 'Offline',
      [PrinterStatusEnum.MAINTENANCE]: 'Maintenance',
    }
    return texts[status] || 'Unknown'
  }

  /**
   * Check if printer is online
   */
  static isOnline(printer: Printer): boolean {
    return printer.status !== PrinterStatusEnum.OFFLINE
  }

  /**
   * Check if printer is printing
   */
  static isPrinting(printer: Printer): boolean {
    return printer.status === PrinterStatusEnum.PRINTING
  }

  /**
   * Check if printer can accept new jobs
   */
  static canAcceptJob(printer: Printer): boolean {
    return (
      printer.status === PrinterStatusEnum.IDLE && printer.available === true
    )
  }

  /**
   * Update printer last seen timestamp
   */
  static updateLastSeen(printer: Printer): Printer {
    return {
      ...printer,
      lastSeen: new Date(),
    }
  }

  /**
   * Check if printer is stale (offline for > 5 minutes)
   */
  static isStale(printer: Printer, thresholdMinutes: number = 5): boolean {
    const now = new Date()
    const lastSeen = new Date(printer.lastSeen)
    const diffMinutes = (now.getTime() - lastSeen.getTime()) / (1000 * 60)
    return diffMinutes > thresholdMinutes
  }

  /**
   * Calculate estimated print completion time
   */
  static calculateCompletionTime(
    startedAt: Date,
    printTimeHours: number
  ): Date {
    const completionTime = new Date(startedAt)
    completionTime.setHours(completionTime.getHours() + printTimeHours)
    return completionTime
  }

  /**
   * Get printer utilization percentage
   */
  static calculateUtilization(
    queue: PrintQueue[],
    printerId: string,
    timeWindowHours: number = 24
  ): number {
    const printerQueue = queue.filter((q) => q.printerId === printerId)
    const printingJobs = printerQueue.filter(
      (q) => q.status === QueueStatusEnum.PRINTING
    )

    if (printingJobs.length === 0) return 0

    // Simplified: assumes 1 hour per print job for this calculation
    // In production, use actual job times
    const totalPrintHours = printingJobs.length
    return Math.min(100, (totalPrintHours / timeWindowHours) * 100)
  }

  /**
   * Format IP address for display
   */
  static formatIpAddress(ip?: string): string {
    return ip || 'Not configured'
  }

  /**
   * Validate printer IP address format
   */
  static isValidIpAddress(ip: string): boolean {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    if (!ipRegex.test(ip)) return false

    const parts = ip.split('.')
    return parts.every((part) => {
      const num = parseInt(part)
      return num >= 0 && num <= 255
    })
  }

  /**
   * Get next job for printer from queue
   */
  static getNextJobForPrinter(
    queue: PrintQueue[],
    printerId: string
  ): PrintQueue | null {
    return (
      queue.find(
        (q) =>
          q.printerId === printerId && q.status === QueueStatusEnum.PENDING
      ) || null
    )
  }

  /**
   * Simulate health check response (for demo)
   * In production, this would make actual HTTP/WiFi calls to printer
   */
  static async checkPrinterHealth(
    printer: Printer
  ): Promise<PrinterHealthCheck> {
    // Simulate network check
    const isResponsive = !this.isStale(printer)

    return {
      printerId: printer.id,
      status: printer.status,
      isResponsive,
      lastResponseTime: printer.lastSeen,
      errorMessage: isResponsive ? undefined : 'Printer not responding',
    }
  }
}
