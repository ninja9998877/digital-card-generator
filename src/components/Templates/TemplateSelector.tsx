'use client'

import { useState } from 'react'
import { templates, getTemplatesByCategory } from '@/lib/templates'
import { useCardStore } from '@/store/cardStore'

type Category = 'all' | 'business' | 'creative' | 'minimal' | 'personal' | 'artistic'

const categories: { id: Category; name: string }[] = [
  { id: 'all', name: '全部' },
  { id: 'business', name: '商务' },
  { id: 'creative', name: '创意' },
  { id: 'minimal', name: '极简' },
  { id: 'personal', name: '个人' },
  { id: 'artistic', name: '艺术' },
]

interface TemplateSelectorProps {
  onSelect: () => void
  onClose: () => void
}

export default function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const loadTemplate = useCardStore((state) => state.loadTemplate)

  const filteredTemplates =
    selectedCategory === 'all' ? templates : getTemplatesByCategory(selectedCategory)

  const handleSelectTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    if (template) {
      loadTemplate(template)
      onSelect()
    }
  }

  return (
    <div className="p-4">
      {/* 关闭按钮 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">选择模板</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === cat.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelectTemplate(template.id)}
            className="cursor-pointer group"
          >
            {/* 模板预览 */}
            <div className="aspect-[2/3] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-colors">
              <div
                className="w-full h-full p-4"
                style={{ backgroundColor: template.config.backgroundColor }}
              >
                {/* 简化的预览 */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-20 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1 w-16 mx-auto"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-12 mx-auto"></div>
                  <div className="h-px bg-gray-200 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1 w-24 mx-auto"></div>
                  <div className="h-2 bg-gray-200 rounded mb-1 w-28 mx-auto"></div>
                  <div className="h-2 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* 模板名称 */}
            <div className="mt-2 text-center">
              <p className="text-sm font-medium text-gray-900">{template.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 空状态 */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          该分类下暂无模板
        </div>
      )}
    </div>
  )
}
