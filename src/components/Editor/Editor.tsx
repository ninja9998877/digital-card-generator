'use client'

import { useCardStore } from '@/store/cardStore'
import Canvas from '@/components/Editor/Canvas'
import ElementSidebar from '@/components/Editor/ElementSidebar'
import ExportPanel from '@/components/Export/ExportPanel'

export default function Editor() {
  const { config, selectedElementId } = useCardStore()

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
    <div className="flex h-full">
      {/* 左侧：元素面板 */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
        <ElementSidebar />
      </div>

      {/* 中间：画布 */}
      <div className="flex-1 flex items-center justify-center bg-gray-100 p-8 overflow-auto">
        <Canvas />
      </div>

      {/* 右侧：属性面板 */}
      {selectedElementId && (
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          <ExportPanel />
        </div>
      )}

      {/* 无选中时显示导出面板 */}
      {!selectedElementId && (
        <div className="w-72 bg-white border-l border-gray-200 overflow-y-auto">
          <ExportPanel />
        </div>
      )}
    </div>
  )
}
