/**
 * Global Store using Zustand
 * Manages app-wide state for printers, jobs, queue, etc.
 */

import { create } from 'zustand'
import { Printer, Job, PrintQueue } from '@/types'

interface AppStore {
  // Printers
  printers: Printer[]
  setPrinters: (printers: Printer[]) => void
  addPrinter: (printer: Printer) => void
  updatePrinter: (id: string, printer: Partial<Printer>) => void
  removePrinter: (id: string) => void

  // Jobs
  jobs: Job[]
  setJobs: (jobs: Job[]) => void
  addJob: (job: Job) => void
  updateJob: (id: string, job: Partial<Job>) => void
  removeJob: (id: string) => void

  // Queue
  queue: PrintQueue[]
  setQueue: (queue: PrintQueue[]) => void
  addToQueue: (item: PrintQueue) => void
  removeFromQueue: (jobId: string) => void
  updateQueueItem: (jobId: string, item: Partial<PrintQueue>) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentPage: string
  setCurrentPage: (page: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  // Printers
  printers: [],
  setPrinters: (printers) => set({ printers }),
  addPrinter: (printer) =>
    set((state) => ({ printers: [...state.printers, printer] })),
  updatePrinter: (id, updates) =>
    set((state) => ({
      printers: state.printers.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removePrinter: (id) =>
    set((state) => ({
      printers: state.printers.filter((p) => p.id !== id),
    })),

  // Jobs
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((j) =>
        j.id === id ? { ...j, ...updates } : j
      ),
    })),
  removeJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== id),
    })),

  // Queue
  queue: [],
  setQueue: (queue) => set({ queue }),
  addToQueue: (item) =>
    set((state) => ({ queue: [...state.queue, item] })),
  removeFromQueue: (jobId) =>
    set((state) => ({
      queue: state.queue.filter((q) => q.jobId !== jobId),
    })),
  updateQueueItem: (jobId, updates) =>
    set((state) => ({
      queue: state.queue.map((q) =>
        q.jobId === jobId ? { ...q, ...updates } : q
      ),
    })),

  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),
}))
