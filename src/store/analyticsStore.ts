'use client'

import { create } from 'zustand'

export interface AnalyticsData {
  views: number          // 浏览量
  clicks: number         // 点击数
  conversions: number    // 转化数
  ctr: number           // 点击率
  conversionRate: number // 转化率
  avgTime: number        // 平均停留时间（秒）
}

export interface ABTestData {
  variantId: string       // 变体ID（A/B/C）
  variantName: string     // 变体名称
  config: string         // 名片配置（简化版，实际可用ID）
  analytics: AnalyticsData
  isWinner: boolean       // 是否获胜
}

export interface AnalyticsStore {
  // 当前分析数据
  currentData: AnalyticsData | null

  // AB测试数据
  abTests: ABTestData[]

  // 历史数据（用于趋势分析）
  historyData: AnalyticsData[]
  historyMaxSize: number

  // 操作方法
  setCurrentData: (data: AnalyticsData) => void
  recordView: () => void
  recordClick: () => void
  recordConversion: () => void
  startABTest: (testId: string) => void
  stopABTest: () => void
  getABTestData: (testId: string) => ABTestData[]
  calculateWinner: (testId: string) => string
  clearHistory: () => void
}

const defaultAnalyticsData: AnalyticsData = {
  views: 0,
  clicks: 0,
  conversions: 0,
  ctr: 0,
  conversionRate: 0,
  avgTime: 0,
}

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  currentData: defaultAnalyticsData,
  abTests: [],
  historyData: [],
  historyMaxSize: 30,

  setCurrentData: (data) => set({ currentData: data }),

  recordView: () => {
    const { currentData, historyData, historyMaxSize } = get()
    if (!currentData) return

    const newViews = currentData.views + 1
    const newData = {
      ...currentData,
      views: newViews,
      ctr: currentData.clicks > 0 ? (currentData.clicks / newViews * 100) : 0,
      conversionRate: newViews > 0 ? (currentData.conversions / newViews * 100) : 0,
    }

    // 添加到历史
    const newHistory = [newData, ...historyData].slice(0, historyMaxSize)

    set({
      currentData: newData,
      historyData: newHistory,
    })
  },

  recordClick: () => {
    const { currentData, historyData, historyMaxSize } = get()
    if (!currentData) return

    const newClicks = currentData.clicks + 1
    const newData = {
      ...currentData,
      clicks: newClicks,
      ctr: (newClicks / currentData.views * 100),
    }

    const newHistory = [newData, ...historyData].slice(0, historyMaxSize)

    set({
      currentData: newData,
      historyData: newHistory,
    })
  },

  recordConversion: () => {
    const { currentData, historyData, historyMaxSize } = get()
    if (!currentData) return

    const newConversions = currentData.conversions + 1
    const newData = {
      ...currentData,
      conversions: newConversions,
      conversionRate: (newConversions / currentData.views * 100),
    }

    const newHistory = [newData, ...historyData].slice(0, historyMaxSize)

    set({
      currentData: newData,
      historyData: newHistory,
    })
  },

  startABTest: (testId) => {
    const { abTests, currentData } = get()
    if (!currentData) return

    // 创建新的AB测试
    const newTest: ABTestData = {
      variantId: `${testId}-A`,
      variantName: '版本 A (当前)',
      config: 'current',
      analytics: { ...currentData },
      isWinner: false,
    }

    // 如果已有相同测试，添加B版本
    const existingTest = abTests.find(t => t.variantId.startsWith(testId))
    if (!existingTest) {
      set({
        abTests: [...abTests, newTest],
      })
    }
  },

  stopABTest: () => {
    const { abTests } = get()
    set({ abTests: [] })
  },

  getABTestData: (testId) => {
    const { abTests } = get()
    return abTests.filter(t => t.variantId.startsWith(testId))
  },

  calculateWinner: (testId) => {
    const { abTests } = get()
    const testData = abTests.filter(t => t.variantId.startsWith(testId))

    if (testData.length < 2) return ''

    // 计算获胜者（基于转化率）
    const sorted = testData.sort((a, b) => b.analytics.conversionRate - a.analytics.conversionRate)
    const winner = sorted[0]

    // 标记获胜
    const updatedTests = abTests.map(t => {
      if (t.variantId.startsWith(testId)) {
        return { ...t, isWinner: t.variantId === winner.variantId }
      }
      return t
    })

    set({ abTests: updatedTests })

    return winner.variantId
  },

  clearHistory: () => {
    set({ historyData: [] })
  },
}))
