'use client'

import { useState } from 'react'
import { templates, getTemplatesByCategory } from '@/lib/templates'
import { useCardStore } from '@/store/cardStore'
import TemplateCard from '@/components/Templates/TemplateCard'

type Category = 'all' | 'business' | 'creative' | 'minimal' | 'personal' | 'artistic'

const categories: { id: Category; name: string; count: number }[] = [
  { id: 'all', name: '全部', count: templates.length },
  { id: 'business', name: '商务', count: templates.filter(t => t.category === 'business').length },
  { id: 'creative', name: '创意', count: templates.filter(t => t.category === 'creative').length },
  { id: 'minimal', name: '极简', count: templates.filter(t => t.category === 'minimal').length },
  { id: 'personal', name: '个人', count: templates.filter(t => t.category === 'personal').length },
  { id: 'artistic', name: '艺术', count: templates.filter(t => t.category === 'artistic').length },
]

interface TemplateSelectorProps {
  onSelect: () => void
  onClose: () => void
}

export default function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const { config } = useCardStore()
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
        <div>
          <h2 className="text-lg font-semibold text-gray-900">选择模板</h2>
          <p className="text-sm text-gray-500 mt-1">
            共 {filteredTemplates.length} 个模板
          </p>
        </div>
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
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm rounded-full transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.name}
            <span className={`text-xs ${
              selectedCategory === cat.id ? 'bg-blue-600' : 'bg-gray-200'
            } px-2 py-0.5 rounded-full`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* 模板网格 */}
      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={() => handleSelectTemplate(template.id)}
            isSelected={config?.id === template.id}
          />
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
