/**
 * Job Card Component
 * Displays job information and pricing
 */

import { Job } from '@/types'
import { StatusBadge } from './StatusBadge'
import { PricingService } from '@/services/PricingService'
import { Clock, FileText, Droplet } from 'lucide-react'

interface JobCardProps {
  job: Job
  onClick?: () => void
}

export function JobCard({ job, onClick }: JobCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer hover:bg-slate-750"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{job.name}</h3>
          {job.description && (
            <p className="text-sm text-slate-400 mt-1">{job.description}</p>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <StatusBadge status={job.status} type="job" />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-700">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Droplet className="w-3 h-3" />
            Material
          </p>
          <p className="text-sm text-white mt-1">{job.material}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Est. Time
          </p>
          <p className="text-sm text-white mt-1">
            {job.estimatedPrintTimeHours.toFixed(1)}h
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Weight
          </p>
          <p className="text-sm text-white mt-1">{job.materialGrams}g</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <FileText className="w-3 h-3" />
            File Size
          </p>
          <p className="text-sm text-white mt-1">
            {(job.fileSize / 1024 / 1024).toFixed(2)}MB
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Base Price
          </p>
          <p className="text-lg font-semibold text-slate-300 mt-1">
            {PricingService.formatCurrency(job.basePrice)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Final Price
          </p>
          <p className="text-lg font-semibold text-green-400 mt-1">
            {PricingService.formatCurrency(job.finalPrice)}
          </p>
        </div>
      </div>
    </div>
  )
}
