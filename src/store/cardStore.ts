'use client'

import { create } from 'zustand'
import { CardConfig, CardElement, Template } from '@/types/card'

interface CardStore {
  // 当前名片配置
  config: CardConfig | null

  // 当前选中的元素
  selectedElementId: string | null

  // 历史记录
  history: CardConfig[]
  historyIndex: number

  // 所有模板
  templates: Template[]

  // 操作方法
  setConfig: (config: CardConfig) => void
  setSelectedElementId: (id: string | null) => void
  addElement: (element: CardElement) => void
  duplicateElement: (id: string) => void
  updateElement: (id: string, updates: Partial<CardElement>) => void
  removeElement: (id: string) => void
  moveElement: (id: string, x: number, y: number) => void
  resizeElement: (id: string, width: number, height: number) => void
  loadTemplate: (template: Template) => void
  setBackgroundColor: (color: string) => void
  setBackgroundImage: (image: string) => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveToHistory: () => void
}

const defaultConfig: CardConfig = {
  id: 'default',
  name: '未命名名片',
  width: 400,
  height: 600,
  backgroundColor: '#ffffff',
  elements: [],
}

export const useCardStore = create<CardStore>((set, get) => ({
  config: defaultConfig,
  selectedElementId: null,
  history: [],
  historyIndex: -1,
  templates: [],

  setConfig: (config) => set({ config }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  saveToHistory: () => {
    const { config, history, historyIndex } = get()
    if (!config) return

    // 如果不在历史记录末尾，删除之后的所有记录
    const newHistory = history.slice(0, historyIndex + 1)

    // 限制历史记录数量（最多50步）
    if (newHistory.length >= 50) {
      newHistory.shift()
    }

    newHistory.push({ ...config })
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },

  addElement: (element) => {
    const { config } = get()
    if (!config) return

    const newConfig = {
      ...config,
      elements: [...config.elements, element],
    }

    set({ config: newConfig })
    get().saveToHistory()
  },

  duplicateElement: (id) => {
    const { config } = get()
    if (!config) return

    const elementToDuplicate = config.elements.find((el) => el.id === id)
    if (!elementToDuplicate) return

    const newElement = {
      ...elementToDuplicate,
      id: `${elementToDuplicate.type}-${Date.now()}`,
      x: elementToDuplicate.x + 20,
      y: elementToDuplicate.y + 20,
      zIndex: Math.max(...config.elements.map((el) => el.zIndex)) + 1,
    }

    const newConfig = {
      ...config,
      elements: [...config.elements, newElement],
    }

    set({ config: newConfig })
    get().saveToHistory()
  },

  updateElement: (id, updates) => {
    const { config } = get()
    if (!config) return

    const newConfig = {
      ...config,
      elements: config.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }

    set({ config: newConfig })
    // 注意：不要在每个更新时保存历史，避免性能问题
    // 可以改为节流或手动调用 saveToHistory
  },

  removeElement: (id) => {
    const { config } = get()
    if (!config) return

    const newConfig = {
      ...config,
      elements: config.elements.filter((el) => el.id !== id),
    }

    set({ config: newConfig })
    get().saveToHistory()
  },

  moveElement: (id, x, y) => {
    const { config } = get()
    if (!config) return

    const newConfig = {
      ...config,
      elements: config.elements.map((el) =>
        el.id === id ? { ...el, x, y } : el
      ),
    }

    set({ config: newConfig })
  },

  resizeElement: (id, width, height) => {
    const { config } = get()
    if (!config) return

    const newConfig = {
      ...config,
      elements: config.elements.map((el) =>
        el.id === id ? { ...el, width, height } : el
      ),
    }

    set({ config: newConfig })
    get().saveToHistory()
  },

  loadTemplate: (template) => {
    const newConfig = { ...template.config, id: `${Date.now()}` }
    set({
      config: newConfig,
      selectedElementId: null,
    })
    get().saveToHistory()
  },

  setBackgroundColor: (color) => {
    const { config } = get()
    if (!config) return

    const newConfig = { ...config, backgroundColor: color }
    set({ config: newConfig })
    get().saveToHistory()
  },

  setBackgroundImage: (image) => {
    const { config } = get()
    if (!config) return

    const newConfig = { ...config, backgroundImage: image }
    set({ config: newConfig })
    get().saveToHistory()
  },

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    set({
      config: history[newIndex],
      historyIndex: newIndex,
    })
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    set({
      config: history[newIndex],
      historyIndex: newIndex,
    })
  },

  canUndo: () => {
    const { historyIndex } = get()
    return historyIndex > 0
  },

  canRedo: () => {
    const { history, historyIndex } = get()
    return historyIndex < history.length - 1
  },
}))
