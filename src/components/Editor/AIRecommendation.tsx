'use client'

import { useState } from 'react'
import { useCardStore } from '@/store/cardStore'
import { Wand2, Sparkles, Download, RefreshCw } from 'lucide-react'

interface AIRecommendationProps {
  onClose: () => void
}

export default function AIRecommendation({ onClose }: AIRecommendationProps) {
  const { config, addElement, setBackgroundColor, updateElement } = useCardStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedType, setSelectedType] = useState<'color' | 'content' | 'template'>('content')

  // AI配色推荐
  const colorPalettes = [
    { name: '专业蓝', colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'] },
    { name: '温暖橙', colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74'] },
    { name: '活力红', colors: ['#b91c1c', '#dc2626', '#ef4444', '#f87171'] },
    { name: '清新绿', colors: ['#166534', '#15803d', '#22c55e', '#4ade80'] },
    { name: '优雅紫', colors: ['#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa'] },
    { name: '极简灰', colors: ['#1f2937', '#374151', '#6b7280', '#9ca3af'] },
  ]

  // AI内容建议
  const contentSuggestions = [
    { type: 'bio', label: '个人简介', text: '专注于[行业]领域的[专业角色]，拥有[数字]年经验。热爱[核心能力]。' },
    { type: 'title', label: '职业头衔', text: '[职业] | [核心技能] | [专业领域]' },
    { type: 'achievement', label: '成就亮点', text: '• [成就1]（量化成果）\n• [成就2]（影响范围）\n• [成就3]（领导力）' },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      switch (selectedType) {
        case 'color':
          const randomPalette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)]
          setBackgroundColor(randomPalette.colors[0])
          alert(`已应用配色方案：${randomPalette.name}`)
          break

        case 'content':
          const randomContent = contentSuggestions[Math.floor(Math.random() * contentSuggestions.length)]
          // 添加新文本元素
          if (config) {
            addElement({
              id: `ai-content-${Date.now()}`,
              type: 'text',
              x: 50,
              y: 50,
              width: 300,
              height: 100,
              zIndex: config.elements.length + 1,
              content: randomContent.text,
              fontSize: 14,
              fontWeight: 'normal',
              color: '#000000',
              textAlign: 'left',
            })
          }
          alert(`已添加${randomContent.label}建议`)
          break

        case 'template':
          // 随机选择一个现有模板
          const { templates } = require('@/lib/templates')
          const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
          const { loadTemplate } = useCardStore.getState()
          loadTemplate(randomTemplate)
          alert(`已应用AI推荐模板：${randomTemplate.name}`)
          break
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      alert('AI生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-semibold">AI智能推荐</h2>
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

        {/* 类型选择 */}
        <div className="space-y-3 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            推荐类型
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedType('color')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedType === 'color'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Wand2 className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium">配色</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedType('content')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedType === 'content'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-medium">内容</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedType('template')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                selectedType === 'template'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 text-green-500" />
                <span className="text-sm font-medium">模板</span>
              </div>
            </button>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          {selectedType === 'color' && (
            <div>
              <p className="text-sm text-gray-700 mb-3">AI智能配色方案</p>
              <div className="space-y-2">
                {colorPalettes.slice(0, 3).map((palette) => (
                  <div key={palette.name} className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {palette.colors.map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700">{palette.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedType === 'content' && (
            <div>
              <p className="text-sm text-gray-700 mb-3">AI内容创作建议</p>
              <div className="space-y-2">
                {contentSuggestions.slice(0, 3).map((suggestion) => (
                  <div key={suggestion.type} className="bg-white p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">{suggestion.label}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-mono">{suggestion.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedType === 'template' && (
            <div>
              <p className="text-sm text-gray-700 mb-3">AI模板智能匹配</p>
              <div className="text-sm text-gray-600">
                根据您的当前设计风格，AI会智能匹配最适合的模板。
              </div>
            </div>
          )}
        </div>

        {/* 生成按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 transition-all font-medium"
          >
            <Sparkles size={18} />
            {isGenerating ? 'AI分析中...' : 'AI生成推荐'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            取消
          </button>
        </div>

        {/* 提示信息 */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>AI功能基于机器学习模型，为您提供智能建议。</p>
          <p>所有推荐均可手动调整，您可以完全掌控最终效果。</p>
        </div>
      </div>
    </div>
  )
}
