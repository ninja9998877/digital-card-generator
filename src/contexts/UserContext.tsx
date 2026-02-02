'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useUserStore, User } from '@/store/userStore'

interface UserContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  showAuthModal: boolean
  showSubscriptionModal: boolean
  setShowAuthModal: (show: boolean) => void
  setShowSubscriptionModal: (show: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useUserStore()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 模拟初始加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const value: UserContextType = {
    user,
    isAuthenticated,
    isLoading,
    showAuthModal,
    showSubscriptionModal,
    setShowAuthModal,
    setShowSubscriptionModal,
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
