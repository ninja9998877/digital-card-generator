'use client'

import { create } from 'zustand'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription?: 'free' | 'basic' | 'pro'
  subscriptionStatus?: 'active' | 'canceled' | 'past_due'
  subscriptionEndsAt?: string
  createdAt: string
  lastLoginAt?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number // 月费
  currency: string
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

interface UserStore {
  // 当前用户
  user: User | null
  isAuthenticated: boolean

  // 所有订阅计划
  plans: SubscriptionPlan[]

  // 当前订阅计划
  currentPlan: SubscriptionPlan | null

  // 认证状态
  isLoading: boolean
  error: string | null

  // 操作方法
  setUser: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  subscribe: (planId: string) => Promise<void>
  cancelSubscription: () => Promise<void>
  updatePaymentMethod: () => Promise<void>
  getInvoices: () => Promise<any[]>
}

// 订阅计划（与竞品持平的价格策略）
const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: '免费版',
    price: 0,
    currency: 'CNY',
    interval: 'month',
    features: [
      '30+ 模板',
      '基础自定义',
      'PNG/PDF 导出',
      '1 个项目',
    ],
  },
  {
    id: 'basic',
    name: '基础版',
    price: 5,
    currency: 'CNY',
    interval: 'month',
    popular: true,
    features: [
      '50+ 模板',
      '高级自定义',
      'PNG/PDF/SVG 导出',
      '5 个项目',
      'AI 智能推荐',
      '二维码生成',
    ],
  },
  {
    id: 'pro',
    name: '专业版',
    price: 9,
    currency: 'CNY',
    interval: 'month',
    features: [
      '100+ 模板',
      '高级自定义',
      'PNG/PDF/SVG 导出',
      '无限项目',
      'AI 智能推荐',
      '二维码生成',
      'A/B 测试',
      '数据分析',
      '优先支持',
      '自定义域名',
    ],
  },
]

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  plans,
  currentPlan: null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: true,
      currentPlan: plans.find(p => p.id === user.subscription) || null,
    })
    // 保存到 localStorage
    localStorage.setItem('user', JSON.stringify(user))
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      currentPlan: null,
    })
    localStorage.removeItem('user')
  },

  updateProfile: (updates) => {
    const { user } = get()
    if (!user) return

    const updatedUser = { ...user, ...updates }
    set({ user: updatedUser })
    localStorage.setItem('user', JSON.stringify(updatedUser))
  },

  subscribe: async (planId: string) => {
    set({ isLoading: true, error: null })

    try {
      // 模拟 Stripe 支付流程
      const plan = plans.find(p => p.id === planId)
      if (!plan) throw new Error('Plan not found')

      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 2000))

      const { user } = get()
      if (!user) throw new Error('User not authenticated')

      const updatedUser = {
        ...user,
        subscription: planId as any,
        subscriptionStatus: 'active',
        subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }

      set({
        user: updatedUser,
        currentPlan: plan,
      })

      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Subscription failed:', error)
      set({ error: '订阅失败，请重试' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null })

    try {
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))

      const { user } = get()
      if (!user) throw new Error('User not authenticated')

      const updatedUser = {
        ...user,
        subscription: 'free' as any,
        subscriptionStatus: 'canceled',
        subscriptionEndsAt: undefined,
      }

      set({
        user: updatedUser,
        currentPlan: plans.find(p => p.id === 'free'),
      })

      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (error) {
      console.error('Cancel subscription failed:', error)
      set({ error: '取消订阅失败，请重试' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updatePaymentMethod: async () => {
    set({ isLoading: true, error: null })

    try {
      // 模拟打开 Stripe 支付页面
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('支付方式更新成功')
    } catch (error) {
      console.error('Update payment method failed:', error)
      set({ error: '更新支付方式失败' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  getInvoices: async () => {
    // 模拟获取发票列表
    return [
      { id: 'inv-1', date: '2026-02-01', amount: 99, status: 'paid' },
      { id: 'inv-2', date: '2026-01-01', amount: 99, status: 'paid' },
    ]
  },
}))

// 初始化：检查 localStorage 中是否有用户
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('user')
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      useUserStore.getState().setUser(user)
    } catch (error) {
      console.error('Failed to parse saved user:', error)
    }
  }
}
