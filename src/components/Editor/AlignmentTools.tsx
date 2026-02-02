'use client'

import { useCardStore } from '@/store/cardStore'
import { CardElement } from '@/types/card'
import { AlignLeft, AlignCenter, AlignRight, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from 'lucide-react'

interface AlignmentToolsProps {
  element: CardElement
  config: { width: number; height: number }
}

export default function AlignmentTools({ element, config }: AlignmentToolsProps) {
  const { updateElement } = useCardStore()

  const alignLeft = () => {
    updateElement(element.id, { x: 0 })
  }

  const alignCenter = () => {
    updateElement(element.id, {
      x: (config.width - element.width) / 2,
    })
  }

  const alignRight = () => {
    updateElement(element.id, {
      x: config.width - element.width,
    })
  }

  const alignTop = () => {
    updateElement(element.id, { y: 0 })
  }

  const alignMiddle = () => {
    updateElement(element.id, {
      y: (config.height - element.height) / 2,
    })
  }

  const alignBottom = () => {
    updateElement(element.id, {
      y: config.height - element.height,
    })
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600 uppercase">
        快速对齐
      </label>

      {/* 水平对齐 */}
      <div className="space-y-1">
        <span className="text-xs text-gray-500">水平对齐</span>
        <div className="flex gap-2">
          <button
            onClick={alignLeft}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
            title="左对齐"
          >
            <AlignLeft size={14} />
            左
          </button>
          <button
            onClick={alignCenter}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
            title="居中"
          >
            <AlignCenter size={14} />
            中
          </button>
          <button
            onClick={alignRight}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
            title="右对齐"
          >
            <AlignRight size={14} />
            右
          </button>
        </div>
      </div>

      {/* 垂直对齐 */}
      <div className="space-y-1">
        <span className="text-xs text-gray-500">垂直对齐</span>
        <div className="flex gap-2">
          <button
            onClick={alignTop}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
            title="顶对齐"
          >
            上
          </button>
          <button
            onClick={alignMiddle}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
            title="垂直居中"
          >
            中
          </button>
          <button
            onClick={alignBottom}
            className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center"
            title="底对齐"
          >
            下
          </button>
        </div>
      </div>
    </div>
  )
}
