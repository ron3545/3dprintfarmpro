/**
 * Queue Service
 * Handles print queue management and job sequencing
 */

import { PrintQueue, QueueStatusEnum } from '@/types'

export interface QueueItem {
  jobId: string
  printerId: string
  position: number
}

export class QueueService {
  /**
   * Get the next job to print from queue
   * Returns first item with PENDING status
   */
  static getNextJob(queueItems: PrintQueue[]): PrintQueue | null {
    return (
      queueItems.find((item) => item.status === QueueStatusEnum.PENDING) || null
    )
  }

  /**
   * Reorder queue items
   * Used for drag-and-drop functionality
   */
  static reorderQueue(
    queue: PrintQueue[],
    fromIndex: number,
    toIndex: number
  ): PrintQueue[] {
    const newQueue = [...queue]
    const [removed] = newQueue.splice(fromIndex, 1)
    newQueue.splice(toIndex, 0, removed)

    // Update positions
    return newQueue.map((item, idx) => ({
      ...item,
      position: idx,
    }))
  }

  /**
   * Get queue items for a specific printer
   */
  static getQueueForPrinter(
    queue: PrintQueue[],
    printerId: string
  ): PrintQueue[] {
    return queue
      .filter((item) => item.printerId === printerId)
      .sort((a, b) => a.position - b.position)
  }

  /**
   * Get jobs by status
   */
  static getQueueByStatus(
    queue: PrintQueue[],
    status: QueueStatusEnum
  ): PrintQueue[] {
    return queue.filter((item) => item.status === status)
  }

  /**
   * Calculate queue statistics
   */
  static calculateQueueStats(queue: PrintQueue[]) {
    return {
      total: queue.length,
      pending: queue.filter((q) => q.status === QueueStatusEnum.PENDING).length,
      printing: queue.filter((q) => q.status === QueueStatusEnum.PRINTING)
        .length,
      completed: queue.filter((q) => q.status === QueueStatusEnum.COMPLETED)
        .length,
      failed: queue.filter((q) => q.status === QueueStatusEnum.FAILED).length,
    }
  }

  /**
   * Move job to specific position in queue
   */
  static moveJobInQueue(
    queue: PrintQueue[],
    jobId: string,
    newPosition: number
  ): PrintQueue[] {
    const jobIndex = queue.findIndex((q) => q.jobId === jobId)
    if (jobIndex === -1) return queue

    const newQueue = [...queue]
    const [job] = newQueue.splice(jobIndex, 1)

    // Clamp position to valid range
    const clampedPosition = Math.max(0, Math.min(newPosition, newQueue.length))
    newQueue.splice(clampedPosition, 0, job)

    // Update all positions
    return newQueue.map((item, idx) => ({
      ...item,
      position: idx,
    }))
  }

  /**
   * Remove job from queue
   */
  static removeFromQueue(
    queue: PrintQueue[],
    jobId: string
  ): PrintQueue[] {
    return queue
      .filter((item) => item.jobId !== jobId)
      .map((item, idx) => ({
        ...item,
        position: idx,
      }))
  }

  /**
   * Add job to queue
   */
  static addToQueue(
    queue: PrintQueue[],
    queueItem: PrintQueue
  ): PrintQueue[] {
    const newQueue = [
      ...queue,
      {
        ...queueItem,
        position: queue.length,
      },
    ]
    return newQueue
  }

  /**
   * Check if printer has available slot
   */
  static isPrinterAvailable(
    queue: PrintQueue[],
    printerId: string
  ): boolean {
    const printerQueue = this.getQueueForPrinter(queue, printerId)
    const activePrintings = printerQueue.filter(
      (q) => q.status === QueueStatusEnum.PRINTING
    )
    return activePrintings.length === 0
  }

  /**
   * Get estimated wait time for a job in queue (minutes)
   * Assumes 1 minute average per position for simplicity
   * In production, use actual job print times
   */
  static calculateEstimatedWaitTime(
    queue: PrintQueue[],
    jobId: string,
    avgPrintTimeMinutes: number = 60
  ): number {
    const jobIndex = queue.findIndex((q) => q.jobId === jobId)
    if (jobIndex === -1) return 0

    // Count jobs ahead and multiply by average print time
    return jobIndex * avgPrintTimeMinutes
  }
}
