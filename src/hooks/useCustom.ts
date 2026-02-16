/**
 * Custom Hooks for Common Operations
 */

import { useCallback, useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'

/**
 * Hook for managing async loading state
 */
export function useAsync<T>(
  callback: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    try {
      const response = await callback()
      setData(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as Error)
      setStatus('error')
      return undefined
    }
  }, [callback])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, data, error }
}

/**
 * Hook for format currency
 */
export function useCurrency(amount: number, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Hook for format time
 */
export function useFormatTime(ms: number) {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  return `${hours}h ${minutes}m ${seconds}s`
}

/**
 * Hook for debounced value
 */
export function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook for watching app store
 */
export function useAppState() {
  const store = useAppStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  return store
}
