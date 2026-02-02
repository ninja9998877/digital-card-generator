'use client'

import { use } from 'react'
import { Toast } from '@/components/Common/Toast'

// Toast Context
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: ToastMessage[]
  showToast: (toast: Omit<ToastMessage, 'id'>) => void
  dismissToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([])

  const showToast = React.useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = Date.now().toString()
      const newToast: ToastMessage = {
        id,
        ...toast,
      }
      setToasts((prev) => [...prev, newToast])

      // 自动 dismiss
      if (toast.duration !== 0) {
        const duration = toast.duration || 3000
        setTimeout(() => {
          dismissToast(id)
        }, duration)
      }
    },
    []
  )

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const value: ToastContextType = {
    toasts,
    showToast,
    dismissToast,
  }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = use(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
