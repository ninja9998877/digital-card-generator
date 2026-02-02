'use client'

import { useState } from 'react'
import TemplateSelector from '@/components/Templates/TemplateSelector'
import Editor from '@/components/Editor/Editor'
import Toolbar from '@/components/Common/Toolbar'
import { useCardStore } from '@/store/cardStore'

export default function Home() {
  const [showTemplates, setShowTemplates] = useState(true)
  const { config } = useCardStore()

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部工具栏 */}
      <Toolbar
        onShowTemplates={() => setShowTemplates(true)}
        config={config}
      />

      {/* 主内容区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：模板选择器（响应式） */}
        {showTemplates && (
          <div className="hidden md:block w-80 h-full bg-white border-r border-gray-200 overflow-y-auto">
            <TemplateSelector
              onSelect={() => setShowTemplates(false)}
              onClose={() => setShowTemplates(false)}
            />
          </div>
        )}

        {/* 移动端模板选择器（全屏） */}
        {showTemplates && (
          <div className="fixed inset-0 md:hidden z-40 bg-white overflow-y-auto">
            <TemplateSelector
              onSelect={() => setShowTemplates(false)}
              onClose={() => setShowTemplates(false)}
            />
          </div>
        )}

        {/* 右侧：编辑器 */}
        <div className="flex-1 h-full overflow-hidden">
          <Editor />
        </div>
      </div>
    </main>
  )
}
