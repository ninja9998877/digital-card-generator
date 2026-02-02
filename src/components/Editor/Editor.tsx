'use client'

import { useCardStore } from '@/store/cardStore'
import Canvas, { CanvasRef } from '@/components/Editor/Canvas'
import ElementSidebar from '@/components/Editor/ElementSidebar'
import ExportPanel from '@/components/Export/ExportPanel'
import PropertyPanel from '@/components/Editor/PropertyPanel'
import AnalyticsPanel from '@/components/Editor/AnalyticsPanel'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useAutoSave, loadAutoSave } from '@/hooks/useAutoSave'
import { useRef, useEffect, useState } from 'react'
import { Menu, X, Settings } from 'lucide-react'

export default function Editor() {
  const { config, selectedElementId, setConfig } = useCardStore()
  const canvasRef = useRef<CanvasRef>(null)
  const [showElementSidebar, setShowElementSidebar] = useState(false)
  const [showPropertyPanel, setShowPropertyPanel] = useState(false)
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false)

  // 启用键盘快捷键
  useKeyboardShortcuts()

  // 启用自动保存
  useAutoSave()

  // 加载自动保存的草稿
  useEffect(() => {
    const savedConfig = loadAutoSave()
    if (savedConfig) {
      const shouldLoad = confirm('检测到未保存的草稿，是否恢复？')
      if (shouldLoad) {
        setConfig(savedConfig)
      } else {
        const { clearAutoSave } = require('@/hooks/useAutoSave')
        clearAutoSave()
      }
    }
  }, [setConfig])

  if (!config) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-lg">请先选择一个模板</p>
          <p className="text-sm mt-2">点击左侧模板面板选择</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full relative">
      {/* 桌面端布局 */}
      <div className="hidden md:flex w-full">
        {/* 左侧：元素面板 */}
        <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
          <ElementSidebar />
        </div>

        {/* 中间：画布 */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-8 overflow-auto">
          <Canvas ref={canvasRef} />
        </div>

        {/* 右侧：属性面板或导出面板 */}
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          {selectedElementId ? (
            <PropertyPanel element={config.elements.find(el => el.id === selectedElementId)!} />
          ) : (
            <ExportPanel canvasElement={canvasRef.current?.canvasElement || null} />
          )}
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="flex md:hidden w-full">
        {/* 移动端：画布占满 */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-4 overflow-auto">
          <Canvas ref={canvasRef} />
        </div>

        {/* 移动端：元素按钮 */}
        <button
          onClick={() => setShowElementSidebar(true)}
          className="fixed bottom-20 left-4 z-30 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* 移动端：属性按钮 */}
        <button
          onClick={() => setShowPropertyPanel(true)}
          className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center md:hidden"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* 移动端：元素侧边栏（全屏覆盖） */}
      {showElementSidebar && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="h-full bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">添加元素</h2>
              <button
                onClick={() => setShowElementSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <ElementSidebar />
            </div>
          </div>
        </div>
      )}

      {/* 移动端：属性侧边栏（全屏覆盖） */}
      {showPropertyPanel && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="h-full bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {selectedElementId ? '元素属性' : '导出名片'}
              </h2>
              <button
                onClick={() => setShowPropertyPanel(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              {selectedElementId ? (
                <PropertyPanel element={config.elements.find(el => el.id === selectedElementId)!} />
              ) : (
                <ExportPanel canvasElement={canvasRef.current?.canvasElement || null} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
