'use client'

import { CardConfig } from '@/types/card'
import { Undo, Redo, Download, Layers, Sparkles, Menu } from 'lucide-react'

interface ToolbarProps {
  onShowTemplates: () => void
  config: CardConfig | null
}

export default function Toolbar({ onShowTemplates, config }: ToolbarProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* 左侧：Logo 和 模板按钮 */}
      <div className="flex items-center gap-4">
        <button
          onClick={onShowTemplates}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
          <span className="font-semibold text-gray-900">模板</span>
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-900">电子名片生成器</span>
        </div>
      </div>

      {/* 中间：操作按钮 */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="撤销"
          disabled
        >
          <Undo size={20} className="text-gray-400" />
        </button>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="重做"
          disabled
        >
          <Redo size={20} className="text-gray-400" />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2" />

        <button
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="图层"
          disabled
        >
          <Layers size={20} className="text-gray-400" />
        </button>
      </div>

      {/* 右侧：导出按钮 */}
      <div className="flex items-center gap-3">
        {config && (
          <>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{config.name}</span>
            </div>
            <div className="h-6 w-px bg-gray-300" />
          </>
        )}

        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          onClick={() => {
            // TODO: 实现导出功能
            alert('导出功能即将上线')
          }}
        >
          <Download size={18} />
          <span>导出</span>
        </button>
      </div>
    </div>
  )
}
