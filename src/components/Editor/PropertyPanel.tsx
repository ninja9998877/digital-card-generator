'use client'

import { useCardStore } from '@/store/cardStore'
import { CardElement, TextElement, ButtonElement, ImageElement, IconElement, DividerElement, SocialElement } from '@/types/card'
import { X, Type, Image as ImageIcon, Link2, MapPin, Minus, Layers, Copy, Trash2 } from 'lucide-react'
import AlignmentTools from '@/components/Editor/AlignmentTools'

interface PropertyPanelProps {
  element: CardElement
}

export default function PropertyPanel({ element }: PropertyPanelProps) {
  const { updateElement, removeElement, config } = useCardStore()

  const handleDelete = () => {
    if (confirm('确定要删除这个元素吗？')) {
      removeElement(element.id)
    }
  }

  const handleDuplicate = () => {
    const { duplicateElement } = useCardStore.getState()
    duplicateElement(element.id)
  }

  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">元素属性</h3>
        <div className="flex gap-1">
          <button
            onClick={handleDuplicate}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="复制"
          >
            <Copy size={16} className="text-gray-600" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="删除"
          >
            <Trash2 size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* 快速对齐 */}
      {config && (
        <AlignmentTools element={element} config={{ width: config.width, height: config.height }} />
      )}

      {/* 位置和大小 */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-600 uppercase">
          位置和大小
        </label>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => updateElement(element.id, { x: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => updateElement(element.id, { y: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">宽度</label>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => updateElement(element.id, { width: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">高度</label>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => updateElement(element.id, { height: Number(e.target.value) })}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* 图层控制 */}
      <div className="space-y-3">
        <label className="block text-xs font-medium text-gray-600 uppercase">
          图层
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => updateElement(element.id, { zIndex: element.zIndex - 1 })}
            disabled={element.zIndex <= 0}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            后移
          </button>
          <button
            onClick={() => updateElement(element.id, { zIndex: element.zIndex + 1 })}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            前移
          </button>
        </div>
      </div>

      {/* 元素特定属性 */}
      {element.type === 'text' && <TextProperties element={element} />}
      {element.type === 'image' && <ImageProperties element={element} />}
      {element.type === 'button' && <ButtonProperties element={element} />}
      {element.type === 'icon' && <IconProperties element={element} />}
      {element.type === 'divider' && <DividerProperties element={element} />}
      {element.type === 'social' && <SocialProperties element={element} />}
    </div>
  )
}

function TextProperties({ element }: { element: TextElement }) {
  const { updateElement } = useCardStore()

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        文本属性
      </label>

      <div>
        <label className="block text-xs text-gray-500 mb-1">内容</label>
        <textarea
          value={element.content}
          onChange={(e) => updateElement(element.id, { content: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">字体大小</label>
        <input
          type="number"
          value={element.fontSize}
          onChange={(e) => updateElement(element.id, { fontSize: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">字重</label>
        <select
          value={element.fontWeight}
          onChange={(e) => updateElement(element.id, { fontWeight: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="normal">正常</option>
          <option value="medium">中等</option>
          <option value="semibold">半粗</option>
          <option value="bold">粗体</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">对齐方式</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateElement(element.id, { textAlign: 'left' })}
            className={`flex-1 px-3 py-2 text-sm border rounded ${
              element.textAlign === 'left' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            左
          </button>
          <button
            onClick={() => updateElement(element.id, { textAlign: 'center' })}
            className={`flex-1 px-3 py-2 text-sm border rounded ${
              element.textAlign === 'center' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            中
          </button>
          <button
            onClick={() => updateElement(element.id, { textAlign: 'right' })}
            className={`flex-1 px-3 py-2 text-sm border rounded ${
              element.textAlign === 'right' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            右
          </button>
        </div>
      </div>
    </div>
  )
}

function ImageProperties({ element }: { element: ImageElement }) {
  const { updateElement } = useCardStore()

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        图片属性
      </label>

      <div>
        <label className="block text-xs text-gray-500 mb-1">图片 URL</label>
        <input
          type="text"
          value={element.src}
          onChange={(e) => updateElement(element.id, { src: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">圆角</label>
        <input
          type="number"
          value={element.borderRadius}
          onChange={(e) => updateElement(element.id, { borderRadius: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

function ButtonProperties({ element }: { element: ButtonElement }) {
  const { updateElement } = useCardStore()

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        按钮属性
      </label>

      <div>
        <label className="block text-xs text-gray-500 mb-1">文字</label>
        <input
          type="text"
          value={element.text}
          onChange={(e) => updateElement(element.id, { text: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">链接 URL</label>
        <input
          type="text"
          value={element.url}
          onChange={(e) => updateElement(element.id, { url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">背景颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.backgroundColor}
            onChange={(e) => updateElement(element.id, { backgroundColor: e.target.value })}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={element.backgroundColor}
            onChange={(e) => updateElement(element.id, { backgroundColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">文字颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.textColor}
            onChange={(e) => updateElement(element.id, { textColor: e.target.value })}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={element.textColor}
            onChange={(e) => updateElement(element.id, { textColor: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">圆角</label>
        <input
          type="number"
          value={element.borderRadius}
          onChange={(e) => updateElement(element.id, { borderRadius: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

function IconProperties({ element }: { element: IconElement }) {
  const { updateElement } = useCardStore()

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        图标属性
      </label>

      <div>
        <label className="block text-xs text-gray-500 mb-1">链接 URL</label>
        <input
          type="text"
          value={element.url}
          onChange={(e) => updateElement(element.id, { url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">大小</label>
        <input
          type="number"
          value={element.size}
          onChange={(e) => updateElement(element.id, { size: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

function DividerProperties({ element }: { element: DividerElement }) {
  const { updateElement } = useCardStore()

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        分隔符属性
      </label>

      <div>
        <label className="block text-xs text-gray-500 mb-1">颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
            className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => updateElement(element.id, { color: e.target.value })}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">粗细</label>
        <input
          type="number"
          value={element.thickness}
          onChange={(e) => updateElement(element.id, { thickness: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>
    </div>
  )
}

function SocialProperties({ element }: { element: SocialElement }) {
  const { updateElement } = useCardStore()

  const platforms = [
    { platform: 'twitter' as const, label: 'Twitter' },
    { platform: 'linkedin' as const, label: 'LinkedIn' },
    { platform: 'github' as const, label: 'GitHub' },
    { platform: 'instagram' as const, label: 'Instagram' },
    { platform: 'youtube' as const, label: 'YouTube' },
    { platform: 'email' as const, label: 'Email' },
    { platform: 'website' as const, label: 'Website' },
  ]

  const handleTogglePlatform = (platform: SocialElement['platforms'][0]['platform']) => {
    const exists = element.platforms.some(p => p.platform === platform)
    const newPlatforms = exists
      ? element.platforms.filter(p => p.platform !== platform)
      : [...element.platforms, { platform, url: '' }]
    updateElement(element.id, { platforms: newPlatforms })
  }

  const handleUpdateUrl = (index: number, url: string) => {
    const newPlatforms = [...element.platforms]
    newPlatforms[index].url = url
    updateElement(element.id, { platforms: newPlatforms })
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        社交媒体属性
      </label>

      {/* 平台选择 */}
      <div>
        <label className="block text-xs text-gray-500 mb-2">选择平台</label>
        <div className="flex flex-wrap gap-2">
          {platforms.map(({ platform, label }) => {
            const isActive = element.platforms.some(p => p.platform === platform)
            return (
              <button
                key={platform}
                onClick={() => handleTogglePlatform(platform)}
                className={`px-3 py-1.5 text-xs border rounded-full transition-colors ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* URL 输入 */}
      {element.platforms.map((p, index) => (
        <div key={index}>
          <label className="block text-xs text-gray-500 mb-1">
            {p.platform.charAt(0).toUpperCase() + p.platform.slice(1)} URL
          </label>
          <input
            type="text"
            value={p.url}
            onChange={(e) => handleUpdateUrl(index, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder={`https://${p.platform}.com/...`}
          />
        </div>
      ))}

      {/* 图标大小和间距 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">图标大小</label>
          <input
            type="number"
            value={element.iconSize}
            onChange={(e) => updateElement(element.id, { iconSize: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">图标间距</label>
          <input
            type="number"
            value={element.iconSpacing}
            onChange={(e) => updateElement(element.id, { iconSpacing: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* 对齐方式 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">对齐方式</label>
        <div className="flex gap-2">
          <button
            onClick={() => updateElement(element.id, { alignment: 'left' })}
            className={`flex-1 px-3 py-2 text-sm border rounded ${
              element.alignment === 'left' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            左对齐
          </button>
          <button
            onClick={() => updateElement(element.id, { alignment: 'center' })}
            className={`flex-1 px-3 py-2 text-sm border rounded ${
              element.alignment === 'center' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            居中
          </button>
          <button
            onClick={() => updateElement(element.id, { alignment: 'right' })}
            className={`flex-1 px-3 py-2 text-sm border rounded ${
              element.alignment === 'right' ? 'bg-blue-50 border-blue-500' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            右对齐
          </button>
        </div>
      </div>
    </div>
  )
}
