'use client'

import { useState } from 'react'
import { useCardStore } from '@/store/cardStore'
import { CardElement, ElementType } from '@/types/card'
import {
  Type,
  Image as ImageIcon,
  Link2,
  Plus,
  Minus,
  Layout,
  Palette,
  MapPin,
  QrCodeIcon,
  Wand2,
} from 'lucide-react'
import QRCodeGenerator from '@/components/Editor/QRCodeGenerator'
import AIRecommendation from '@/components/Editor/AIRecommendation'

export default function ElementSidebar() {
  const [activeTab, setActiveTab] = useState<'add' | 'style'>('add')
  const [showQRCodeGenerator, setShowQRCodeGenerator] = useState(false)
  const [showAIRecommendation, setShowAIRecommendation] = useState(false)
  const { config, addElement, setBackgroundColor, setBackgroundImage } =
    useCardStore()

  const handleAddElement = (type: ElementType) => {
    if (!config) return

    const newElement: CardElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      zIndex: config.elements.length + 1,
      ...getDefaultElementProps(type),
    }

    addElement(newElement)
  }

  const getDefaultElementProps = (type: ElementType) => {
    switch (type) {
      case 'text':
        return {
          content: '双击编辑文本',
          fontSize: 16,
          fontWeight: 'normal' as const,
          color: '#000000',
          textAlign: 'left' as const,
        }
      case 'image':
        return {
          src: 'https://via.placeholder.com/100',
          alt: '图片',
          borderRadius: 0,
        }
      case 'button':
        return {
          text: '按钮',
          backgroundColor: '#0ea5e9',
          textColor: '#ffffff',
          borderRadius: 8,
          url: '',
        }
      case 'icon':
        return {
          iconName: 'link',
          color: '#000000',
          size: 24,
          url: '',
        }
      case 'divider':
        return {
          color: '#e5e7eb',
          thickness: 1,
        }
      case 'social':
        return {
          platforms: [
            { platform: 'twitter' as const, url: '' },
            { platform: 'linkedin' as const, url: '' },
            { platform: 'github' as const, url: '' },
          ],
          iconSize: 32,
          iconSpacing: 20,
          alignment: 'center' as const,
        }
      default:
        return {}
    }
  }

  const elementTypes: { type: ElementType; label: string; icon: React.ReactNode }[] = [
    { type: 'text', label: '文本', icon: <Type size={20} /> },
    { type: 'image', label: '图片', icon: <ImageIcon size={20} /> },
    { type: 'button', label: '按钮', icon: <Link2 size={20} /> },
    { type: 'icon', label: '图标', icon: <MapPin size={20} /> },
    { type: 'divider', label: '分隔符', icon: <Minus size={20} /> },
  ]

  if (!config) return null

  return (
    <div className="p-4">
      {/* 标签页 */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'add'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          添加元素
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'style'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          画布样式
        </button>
      </div>

      {/* 添加元素面板 */}
      {activeTab === 'add' && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 mb-3">选择元素类型</h3>
          {elementTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => handleAddElement(type)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {icon}
              </div>
              <span className="text-sm font-medium text-gray-900">{label}</span>
            </button>
          ))}

          {/* 社交媒体按钮 */}
          <button
            onClick={() => handleAddElement('social')}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Layout size={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">社交媒体</span>
          </button>

          {/* 二维码生成按钮 */}
          <button
            onClick={() => setShowQRCodeGenerator(true)}
            className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <QrCodeIcon size={20} />
            </div>
            <span className="text-sm font-medium text-gray-900">生成二维码</span>
          </button>
        </div>
      )}

      {/* 画布样式面板 */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">画布样式</h3>

          {/* 背景颜色 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              背景颜色
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={config.backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>

          {/* 背景图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              背景图片 URL
            </label>
            <input
              type="text"
              value={config.backgroundImage || ''}
              onChange={(e) => setBackgroundImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      )}

      {/* 二维码生成器对话框 */}
      {showQRCodeGenerator && (
        <QRCodeGenerator onClose={() => setShowQRCodeGenerator(false)} />
      )}

      {/* AI智能推荐对话框 */}
      {showAIRecommendation && (
        <AIRecommendation onClose={() => setShowAIRecommendation(false)} />
      )}
    </div>
  )
}
