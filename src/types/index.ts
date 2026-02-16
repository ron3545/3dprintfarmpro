// ===== Business =====
export interface Business {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  website?: string
  logoUrl?: string
  createdAt: Date
  updatedAt: Date
}

// ===== Printer =====
export enum PrinterStatusEnum {
  IDLE = 'IDLE',
  PRINTING = 'PRINTING',
  PAUSED = 'PAUSED',
  ERROR = 'ERROR',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface Printer {
  id: string
  name: string
  model: string
  serialNumber?: string
  status: PrinterStatusEnum
  ipAddress?: string
  wattage: number
  available: boolean
  currentJobId?: string
  createdAt: Date
  updatedAt: Date
  lastSeen: Date
}

// ===== Job =====
export enum JobStatusEnum {
  DRAFT = 'DRAFT',
  READY = 'READY',
  QUEUED = 'QUEUED',
  PRINTING = 'PRINTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface Job {
  id: string
  name: string
  description?: string
  modelFile: string
  fileSize: number
  status: JobStatusEnum
  material: string
  materialGrams: number
  estimatedPrintTimeHours: number
  layerHeight?: number
  infill?: number
  basePrice: number
  finalPrice: number
  assignedPrinterId?: string
  createdAt: Date
  updatedAt: Date
  startedAt?: Date
  completedAt?: Date
}

// ===== Pricing =====
export interface PricingAddOn {
  id: string
  name: string
  quantity: number
  cost: number
}

export interface Pricing {
  id: string
  materialCost: number
  electricityCost: number
  addOnsCost: number
  packagingCost: number
  shippingCost: number
  laborCost: number
  subtotal: number
  marginPercentage: number
  finalPrice: number
  profitAmount: number
  jobId: string
}

export interface PricingInput {
  materialCost: number
  materialGrams: number
  printerWattage: number
  printTimeHours: number
  kwhRate: number
  addOns: PricingAddOn[]
  packagingCost: number
  shippingCost: number
  laborRate: number
  laborTime: number
  marginPercentage: number
}

// ===== Queue =====
export enum QueueStatusEnum {
  PENDING = 'PENDING',
  PRINTING = 'PRINTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface PrintQueue {
  id: string
  jobId: string
  printerId: string
  position: number
  status: QueueStatusEnum
  assignedManually: boolean
  createdAt: Date
  updatedAt: Date
}

// ===== Add-ons =====
export enum AddOnCategory {
  PACKAGING = 'PACKAGING',
  SHIPPING = 'SHIPPING',
  FINISHING = 'FINISHING',
  ASSEMBLY = 'ASSEMBLY',
  CUSTOM = 'CUSTOM',
}

export interface AddOn {
  id: string
  name: string
  description?: string
  category: AddOnCategory
  unitPrice: number
  createdAt: Date
  updatedAt: Date
}

// ===== API Response =====
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ===== Print Time =====
export interface PrintTime {
  days: number
  hours: number
  minutes: number
}

// ===== Model Pricing =====
export interface ModelPricing {
  id: string
  modelName: string
  modelFile?: string
  filamentCostPerKg: number
  materialGrams: number
  printTimeDays: number
  printTimeHours: number
  printTimeMinutes: number
  printerWattage: number
  selectedPrinterId?: string
  packagingCost: number
  shippingCost: number
  laborRate: number
  laborTime: number
  notes?: string
}

export interface ModelPricingResult {
  modelId: string
  materialCost: number
  electricityCost: number
  addOnsCost: number
  packagingCost: number
  shippingCost: number
  laborCost: number
  subtotal: number
  marginAmount: number
  finalPrice: number
  profitAmount: number
  printTimeHours: number
}
