'use client'

import { useCardStore } from '@/store/cardStore'
import ElementRenderer from '@/components/Elements/ElementRenderer'
import SelectionBox from '@/components/Editor/SelectionBox'
import { useRef, useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'

export interface CanvasRef {
  exportCard: (format: 'png' | 'pdf' | 'svg') => Promise<boolean>
}

type ResizeHandle =
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w'

const Canvas = forwardRef<CanvasRef>((props, ref) => {
  const { config, selectedElementId, setSelectedElementId, moveElement, resizeElement } =
    useCardStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null)
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // 暴露 canvas 元素给父组件
  useImperativeHandle(ref, () => ({
    get canvasElement() {
      return canvasRef.current
    },
  }), [])

  if (!config) return null

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation()
    setSelectedElementId(elementId)
    setIsDragging(true)

    const element = config.elements.find((el) => el.id === elementId)
    if (element) {
      setDragOffset({
        x: e.clientX - element.x,
        y: e.clientY - element.y,
      })
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation()
    e.preventDefault()
    setIsResizing(true)
    setResizeHandle(handle)

    const element = config.elements.find((el) => el.id === selectedElementId)
    if (element) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.width,
        height: element.height,
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElementId) {
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (!canvasRect) return

      const x = e.clientX - canvasRect.left - dragOffset.x
      const y = e.clientY - canvasRect.top - dragOffset.y

      // 边界检测
      const clampedX = Math.max(0, Math.min(x, config.width - 50))
      const clampedY = Math.max(0, Math.min(y, config.height - 50))

      moveElement(selectedElementId, clampedX, clampedY)
    }

    if (isResizing && selectedElementId && resizeHandle) {
      const dx = e.clientX - resizeStart.x
      const dy = e.clientY - resizeStart.y

      let newWidth = resizeStart.width
      let newHeight = resizeStart.height

      // 根据手柄位置调整大小
      if (resizeHandle.includes('e')) {
        newWidth = Math.max(50, resizeStart.width + dx)
      }
      if (resizeHandle.includes('w')) {
        newWidth = Math.max(50, resizeStart.width - dx)
      }
      if (resizeHandle.includes('s')) {
        newHeight = Math.max(30, resizeStart.height + dy)
      }
      if (resizeHandle.includes('n')) {
        newHeight = Math.max(30, resizeStart.height - dy)
      }

      resizeElement(selectedElementId, newWidth, newHeight)
    }
  }

  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      const { saveToHistory } = useCardStore.getState()
      saveToHistory()
    }
    setIsDragging(false)
    setIsResizing(false)
    setResizeHandle(null)
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null)
    }
  }

  return (
    <div
      ref={canvasRef}
      className="relative shadow-2xl"
      style={{
        width: config.width,
        height: config.height,
        backgroundColor: config.backgroundColor,
        backgroundImage: config.backgroundImage
          ? `url(${config.backgroundImage})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* 渲染所有元素 */}
      {config.elements
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((element) => (
          <div key={element.id} className="relative">
            <ElementRenderer
              element={element}
              isSelected={element.id === selectedElementId}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            />
            <SelectionBox
              element={element}
              isSelected={element.id === selectedElementId}
              onMouseDown={handleResizeMouseDown}
            />
          </div>
        ))}
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas
