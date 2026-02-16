/**
 * API Client Utility
 * Handles all API communication
 */

import axios from 'axios'
import { ApiResponse } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Jobs API
export const jobsApi = {
  getAll: () => apiClient.get<ApiResponse<any>>('/api/jobs'),
  getById: (id: string) => apiClient.get<ApiResponse<any>>(`/api/jobs?id=${id}`),
  create: (data: any) => apiClient.post<ApiResponse<any>>('/api/jobs', data),
  update: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/api/jobs/${id}`, data),
  delete: (id: string) => apiClient.delete<ApiResponse<any>>(`/api/jobs/${id}`),
}

// Printers API
export const printersApi = {
  getAll: () => apiClient.get<ApiResponse<any>>('/api/printers'),
  getById: (id: string) =>
    apiClient.get<ApiResponse<any>>(`/api/printers?id=${id}`),
  create: (data: any) => apiClient.post<ApiResponse<any>>('/api/printers', data),
  update: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/api/printers/${id}`, data),
  delete: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/api/printers/${id}`),
}

// Pricing API
export const pricingApi = {
  calculate: (data: any) =>
    apiClient.post<ApiResponse<any>>('/api/pricing', data),
}

// Queue API
export const queueApi = {
  getAll: () => apiClient.get<ApiResponse<any>>('/api/queue'),
  getByPrinter: (printerId: string) =>
    apiClient.get<ApiResponse<any>>(`/api/queue?printerId=${printerId}`),
  getByStatus: (status: string) =>
    apiClient.get<ApiResponse<any>>(`/api/queue?status=${status}`),
  addJob: (data: any) => apiClient.post<ApiResponse<any>>('/api/queue', data),
  update: (id: string, data: any) =>
    apiClient.put<ApiResponse<any>>(`/api/queue/${id}`, data),
  remove: (id: string) =>
    apiClient.delete<ApiResponse<any>>(`/api/queue/${id}`),
}

export default apiClient
