/**
 * Settings Page
 * Configure business settings and preferences
 */

'use client'

import { useState } from 'react'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    kwhRate: 0.12,
    marginPercentage: 30,
    autoQueueEnabled: true,
    autoAssignPrinter: true,
  })

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setSettings({
      ...settings,
      [field]: value,
    })
  }

  const handleSave = () => {
    // Save settings logic
    console.log('Settings saved:', settings)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-slate-400">Configure your PrintFarm preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pricing Settings */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-6">Pricing Settings</h3>
          <div className="space-y-6">
            <div>
              <label className="input-label">kWh Rate ($/kWh)</label>
              <input
                type="number"
                step="0.01"
                value={settings.kwhRate}
                onChange={(e) =>
                  handleInputChange('kwhRate', parseFloat(e.target.value) || 0)
                }
                className="input-base"
              />
              <p className="text-xs text-slate-500 mt-2">
                Used to calculate electricity costs in pricing
              </p>
            </div>
            <div>
              <label className="input-label">Default Margin Percentage (%)</label>
              <input
                type="number"
                step="1"
                value={settings.marginPercentage}
                onChange={(e) =>
                  handleInputChange(
                    'marginPercentage',
                    parseFloat(e.target.value) || 0
                  )
                }
                className="input-base"
              />
              <p className="text-xs text-slate-500 mt-2">
                Default profit margin for new jobs
              </p>
            </div>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-6">Automation</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoQueueEnabled}
                onChange={(e) =>
                  handleInputChange('autoQueueEnabled', e.target.checked)
                }
                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
              />
              <span className="text-white">Enable Auto Queue</span>
            </label>
            <p className="text-xs text-slate-500 ml-7">
              Automatically send jobs to queue when ready
            </p>

            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={settings.autoAssignPrinter}
                onChange={(e) =>
                  handleInputChange('autoAssignPrinter', e.target.checked)
                }
                className="w-4 h-4 rounded border-slate-700 bg-slate-800"
              />
              <span className="text-white">Auto Assign Printer</span>
            </label>
            <p className="text-xs text-slate-500 ml-7">
              Automatically assign available printers to queued jobs
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button onClick={handleSave} className="btn-primary">
            Save Settings
          </button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  )
}
