import { create } from 'zustand'
import { CardConfig, CardElement, Template } from '@/types/card'

interface CardStore {
  // 当前名片配置
  config: CardConfig | null

  // 当前选中的元素
  selectedElementId: string | null

  // 所有模板
  templates: Template[]

  // 操作方法
  setConfig: (config: CardConfig) => void
  setSelectedElementId: (id: string | null) => void
  addElement: (element: CardElement) => void
  updateElement: (id: string, updates: Partial<CardElement>) => void
  removeElement: (id: string) => void
  moveElement: (id: string, x: number, y: number) => void
  resizeElement: (id: string, width: number, height: number) => void
  loadTemplate: (template: Template) => void
  setBackgroundColor: (color: string) => void
  setBackgroundImage: (image: string) => void
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
  templates: [],

  setConfig: (config) => set({ config }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  addElement: (element) =>
    set((state) => ({
      config: state.config
        ? {
            ...state.config,
            elements: [...state.config.elements, element],
          }
        : null,
    })),

  updateElement: (id, updates) =>
    set((state) => ({
      config: state.config
        ? {
            ...state.config,
            elements: state.config.elements.map((el) =>
              el.id === id ? { ...el, ...updates } : el
            ),
          }
        : null,
    })),

  removeElement: (id) =>
    set((state) => ({
      config: state.config
        ? {
            ...state.config,
            elements: state.config.elements.filter((el) => el.id !== id),
          }
        : null,
    })),

  moveElement: (id, x, y) =>
    set((state) => ({
      config: state.config
        ? {
            ...state.config,
            elements: state.config.elements.map((el) =>
              el.id === id ? { ...el, x, y } : el
            ),
          }
        : null,
    })),

  resizeElement: (id, width, height) =>
    set((state) => ({
      config: state.config
        ? {
            ...state.config,
            elements: state.config.elements.map((el) =>
              el.id === id ? { ...el, width, height } : el
            ),
          }
        : null,
    })),

  loadTemplate: (template) =>
    set({
      config: { ...template.config, id: `${Date.now()}` },
      selectedElementId: null,
    }),

  setBackgroundColor: (color) =>
    set((state) => ({
      config: state.config ? { ...state.config, backgroundColor: color } : null,
    })),

  setBackgroundImage: (image) =>
    set((state) => ({
      config: state.config ? { ...state.config, backgroundImage: image } : null,
    })),
}))
