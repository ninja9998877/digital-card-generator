'use client'

import { CardElement } from '@/types/card'
import { cn } from '@/lib/utils'
import {
  Linkedin,
  Twitter,
  Github,
  Mail,
  Globe,
  Instagram,
  Youtube,
} from 'lucide-react'

interface ElementRendererProps {
  element: CardElement
  isSelected: boolean
  onMouseDown: (e: React.MouseEvent) => void
}

export default function ElementRenderer({
  element,
  isSelected,
  onMouseDown,
}: ElementRendererProps) {
  const commonStyle = {
    position: 'absolute' as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    cursor: 'move',
  }

  switch (element.type) {
    case 'text':
      return (
        <div
          style={{
            ...commonStyle,
            fontSize: element.fontSize,
            fontWeight: element.fontWeight,
            color: element.color,
            textAlign: element.textAlign,
            userSelect: 'none',
          }}
          onMouseDown={onMouseDown}
        >
          {element.content}
        </div>
      )

    case 'image':
      return (
        <div
          style={{
            ...commonStyle,
            borderRadius: `${element.borderRadius}px`,
            overflow: 'hidden',
          }}
          onMouseDown={onMouseDown}
        >
          <img
            src={element.src}
            alt={element.alt}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      )

    case 'button':
      return (
        <button
          style={{
            ...commonStyle,
            backgroundColor: element.backgroundColor,
            color: element.textColor,
            borderRadius: `${element.borderRadius}px`,
            cursor: 'pointer',
            border: 'none',
            userSelect: 'none',
          }}
          onMouseDown={onMouseDown}
        >
          {element.text}
        </button>
      )

    case 'icon':
      const IconComponent = getIconComponent(element.iconName)
      return (
        <div
          style={{
            ...commonStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: element.color,
          }}
          onMouseDown={onMouseDown}
        >
          {IconComponent && <IconComponent size={element.size} />}
        </div>
      )

    case 'divider':
      return (
        <div
          style={{
            ...commonStyle,
            borderTop: `${element.thickness}px solid ${element.color}`,
          }}
          onMouseDown={onMouseDown}
        />
      )

    case 'social':
      return (
        <div
          style={{
            ...commonStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              element.alignment === 'left'
                ? 'flex-start'
                : element.alignment === 'right'
                ? 'flex-end'
                : 'center',
            gap: `${element.iconSpacing}px`,
            userSelect: 'none',
          }}
          onMouseDown={onMouseDown}
        >
          {element.platforms.map((platform, index) => {
            const IconComponent = getSocialIcon(platform.platform)
            return IconComponent ? (
              <a
                key={index}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconComponent size={element.iconSize} />
              </a>
            ) : null
          })}
        </div>
      )

    default:
      return null
  }
}

function getIconComponent(name: string) {
  const icons: Record<string, React.ComponentType<{ size?: number }>> = {
    linkedin: Linkedin,
    twitter: Twitter,
    github: Github,
    email: Mail,
    website: Globe,
    instagram: Instagram,
    youtube: Youtube,
  }
  return icons[name]
}

function getSocialIcon(platform: string) {
  return getIconComponent(platform)
}
