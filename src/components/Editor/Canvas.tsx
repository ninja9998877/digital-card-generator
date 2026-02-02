'use client'

import { useCardStore } from '@/store/cardStore'
import ElementRenderer from '@/components/Elements/ElementRenderer'
import { useRef, useState } from 'react'

export default function Canvas() {
  const { config, selectedElementId, setSelectedElementId, moveElement } =
    useCardStore()
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedElementId) return

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const x = e.clientX - canvasRect.left - dragOffset.x
    const y = e.clientY - canvasRect.top - dragOffset.y

    moveElement(selectedElementId, x, y)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
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
          <ElementRenderer
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            onMouseDown={(e) => handleMouseDown(e, element.id)}
          />
        ))}
    </div>
  )
}
