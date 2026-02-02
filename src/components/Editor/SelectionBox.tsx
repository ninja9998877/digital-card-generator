'use client'

import React from 'react'
import { CardElement } from '@/types/card'
import { X } from 'lucide-react'

export interface SelectionBoxProps {
  element: CardElement
  isSelected: boolean
  onMouseDown?: (e: React.MouseEvent, handle: string) => void
}

export default function SelectionBox({ element, isSelected, onMouseDown }: SelectionBoxProps) {
  if (!isSelected) return null

  const handleSize = 8 // 手柄大小

  return (
    <div
      className="absolute border-2 border-blue-500 pointer-events-none"
      style={{
        left: element.x - 2,
        top: element.y - 2,
        width: element.width + 4,
        height: element.height + 4,
      }}
    >
      {/* 四角手柄 */}
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-nwse-resize pointer-events-auto -top-1 -left-1"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'nw')}
      />
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-nesw-resize pointer-events-auto -top-1 -right-1"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'ne')}
      />
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-swse-resize pointer-events-auto -bottom-1 -right-1"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'se')}
      />
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-swnw-resize pointer-events-auto -bottom-1 -left-1"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'sw')}
      />

      {/* 四边中点手柄 */}
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-n-resize pointer-events-auto -top-1 left-1/2 -translate-x-1/2"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'n')}
      />
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-e-resize pointer-events-auto top-1/2 -translate-y-1/2 -right-1"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'e')}
      />
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-s-resize pointer-events-auto -bottom-1 left-1/2 -translate-x-1/2"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 's')}
      />
      <div
        className="absolute w-2 h-2 bg-white border-2 border-blue-500 cursor-w-resize pointer-events-auto bottom-1/2 -translate-y-1/2 -left-1"
        style={{ width: handleSize, height: handleSize }}
        onMouseDown={(e) => onMouseDown?.(e, 'w')}
      />

      {/* 元素信息标签 */}
      <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-auto flex items-center gap-2">
        <span>{element.type}</span>
        <span className="text-blue-100">
          {Math.round(element.width)} × {Math.round(element.height)}
        </span>
      </div>
    </div>
  )
}
