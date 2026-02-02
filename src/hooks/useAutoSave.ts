'use client'

import { useEffect } from 'react'
import { useCardStore } from '@/store/cardStore'
import { CardConfig } from '@/types/card'

const AUTOSAVE_KEY = 'digital-card-autosave'
const AUTOSAVE_DELAY = 3000 // 3秒延迟

export function useAutoSave() {
  const { config } = useCardStore()

  useEffect(() => {
    if (!config) return

    const timer = setTimeout(() => {
      // 保存到 localStorage
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(config))
        console.log('Auto-saved', new Date().toISOString())
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, AUTOSAVE_DELAY)

    return () => clearTimeout(timer)
  }, [config])
}

export function loadAutoSave(): CardConfig | null {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Load auto-save failed:', error)
  }
  return null
}

export function clearAutoSave() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY)
  } catch (error) {
    console.error('Clear auto-save failed:', error)
  }
}
