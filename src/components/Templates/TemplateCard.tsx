'use client'

import { Template } from '@/types/card'
import { useCardStore } from '@/store/cardStore'
import { Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface TemplateCardProps {
  template: Template
  onSelect: () => void
  isSelected?: boolean
}

function TemplateCard({ template, onSelect, isSelected }: TemplateCardProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // 生成模板缩略图
    const generateThumbnail = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scale = 0.2 // 缩小到20%
        canvas.width = template.config.width * scale
        canvas.height = template.config.height * scale

        // 绘制背景
        if (template.config.backgroundColor.includes('gradient')) {
          // 渐变背景
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          gradient.addColorStop(0, '#667eea')
          gradient.addColorStop(1, '#764ba2')
          ctx.fillStyle = gradient
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        } else {
          ctx.fillStyle = template.config.backgroundColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // 简化绘制元素
        template.config.elements.forEach((element) => {
          const x = element.x * scale
          const y = element.y * scale
          const width = element.width * scale
          const height = element.height * scale

          ctx.save()
          ctx.fillStyle = element.type === 'button' ? '#0ea5e9' : '#333'
          ctx.strokeStyle = '#666'
          ctx.lineWidth = 1

          if (element.type === 'text') {
            ctx.font = `${Math.max(8, (element as any).fontSize * scale)}px sans-serif`
            ctx.fillStyle = (element as any).color || '#333'
            ctx.textAlign = (element as any).textAlign || 'left'
            ctx.fillText(
              (element as any).content || '',
              x + width / 2,
              y + height / 2 + Math.max(8, (element as any).fontSize * scale) / 3
            )
          } else if (element.type === 'image') {
            ctx.fillRect(x, y, width, height)
            ctx.fillStyle = '#ccc'
            ctx.fillText('IMG', x + width / 2 - 15, y + height / 2 + 5)
          } else if (element.type === 'button') {
            ctx.fillStyle = (element as any).backgroundColor || '#0ea5e9'
            ctx.fillRect(x, y, width, height)
            ctx.fillStyle = (element as any).textColor || '#fff'
            ctx.font = `${Math.max(8, 12 * scale)}px sans-serif`
            ctx.textAlign = 'center'
            ctx.fillText(
              (element as any).text || '按钮',
              x + width / 2,
              y + height / 2 + 8
            )
          } else if (element.type === 'divider') {
            ctx.strokeStyle = (element as any).color || '#e5e7eb'
            ctx.lineWidth = (element as any).thickness || 1
            ctx.beginPath()
            ctx.moveTo(x, y + height / 2)
            ctx.lineTo(x + width, y + height / 2)
            ctx.stroke()
          } else if (element.type === 'social') {
            ctx.fillStyle = '#333'
            ctx.font = `${Math.max(8, 24 * scale)}px sans-serif`
            ctx.textAlign = 'center'
            ;(element as any).platforms.forEach((_: any, i: number) => {
              ctx.fillText('●', x + (width / (element as any).platforms.length) * (i + 0.5), y + height / 2 + 8)
            })
          }

          ctx.restore()
        })

        setThumbnailUrl(canvas.toDataURL('image/jpeg', 0.7))
      } catch (error) {
        console.error('Failed to generate thumbnail:', error)
      }
    }

    // 延迟生成，避免阻塞
    const timer = setTimeout(generateThumbnail, 100)
    return () => clearTimeout(timer)
  }, [template])

  return (
    <div
      onClick={onSelect}
      className={`
        relative cursor-pointer group rounded-lg overflow-hidden
        transition-all duration-200 hover:shadow-lg
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'card-shadow hover:shadow-md'}
      `}
    >
      {/* 缩略图 */}
      <div
        className="aspect-[2/3] bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden"
      >
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={template.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full"></div>
              <div className="h-4 bg-gray-300 rounded mb-2 w-20 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded mb-1 w-16 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
            </div>
          </div>
        )}

        {/* 悬浮遮罩 */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isSelected && (
              <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-medium">
                已选择
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 模板信息 */}
      <div className="p-3 bg-white border-t border-gray-100">
        <p className="text-sm font-medium text-gray-900">{template.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500">
            {template.config.elements.length} 元素
          </span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-500">
            {template.config.category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TemplateCard
