'use client'

import { useEffect } from 'react'
import { useCardStore } from '@/store/cardStore'

export function useKeyboardShortcuts() {
  const { selectedElementId, removeElement, undo, redo, canUndo, canRedo } = useCardStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 删除元素
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementId) {
        // 如果在输入框中，不删除元素
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return
        }

        e.preventDefault()
        if (confirm('确定要删除这个元素吗？')) {
          removeElement(selectedElementId)
        }
      }

      // 取消选择
      if (e.key === 'Escape') {
        const { setSelectedElementId } = useCardStore.getState()
        setSelectedElementId(null)
      }

      // 撤销（Ctrl+Z 或 Cmd+Z）
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return
        }

        e.preventDefault()
        if (canUndo()) {
          undo()
        }
      }

      // 重做（Ctrl+Y 或 Ctrl+Shift+Z 或 Cmd+Shift+Z）
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return
        }

        e.preventDefault()
        if (canRedo()) {
          redo()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedElementId, removeElement, undo, redo, canUndo, canRedo])
}
