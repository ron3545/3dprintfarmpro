/**
 * Printer Card Component
 * Displays printer status with key information
 */

import { Printer } from '@/types'
import { PrinterService } from '@/services/PrinterService'
import { StatusBadge } from './StatusBadge'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'

interface PrinterCardProps {
  printer: Printer
  onClick?: () => void
}

export function PrinterCard({ printer, onClick }: PrinterCardProps) {
  const isOnline = PrinterService.isOnline(printer)
  const isPrinting = PrinterService.isPrinting(printer)

  return (
    <div
      onClick={onClick}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer hover:bg-slate-750"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{printer.name}</h3>
          <p className="text-sm text-slate-400">{printer.model}</p>
        </div>
        {isOnline ? (
          <Wifi className="w-5 h-5 text-green-500" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-500" />
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <StatusBadge status={printer.status} type="printer" />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-700">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Power
          </p>
          <p className="text-sm text-white mt-1">{printer.wattage}W</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            IP Address
          </p>
          <p className="text-sm text-white mt-1 font-mono">
            {PrinterService.formatIpAddress(printer.ipAddress)}
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      {isPrinting && (
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Currently Printing</span>
        </div>
      )}

      {!isOnline && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Offline - Last seen: {printer.lastSeen.toLocaleTimeString()}</span>
        </div>
      )}

      {isOnline && !isPrinting && printer.available && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Ready for Jobs</span>
        </div>
      )}
    </div>
  )
}
