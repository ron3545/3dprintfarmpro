/**
 * Jobs Page
 * Manage 3D print jobs
 */

'use client'

import { useAppStore } from '@/store/appStore'
import { JobCard } from '@/components/JobCard'
import { Briefcase, Plus } from 'lucide-react'
import { useState } from 'react'

export default function JobsPage() {
  const { jobs } = useAppStore()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredJobs = jobs.filter(
    (job) =>
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.material.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Jobs & Models</h1>
          </div>
          <p className="text-slate-400">
            Manage and track all your print jobs
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Actions */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base flex-1"
          />
          <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            New Job
          </button>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid-auto-fit">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">
              {jobs.length === 0 ? 'No jobs yet' : 'No jobs match your search'}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {jobs.length === 0
                ? 'Create your first job to get started'
                : 'Try adjusting your search criteria'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
