// 元素类型
export type ElementType = 'text' | 'image' | 'button' | 'icon' | 'divider' | 'social'

// 基础元素接口
export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  zIndex: number
}

// 文本元素
export interface TextElement extends BaseElement {
  type: 'text'
  content: string
  fontSize: number
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  color: string
  textAlign: 'left' | 'center' | 'right'
}

// 图片元素
export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
  alt: string
  borderRadius: number
}

// 按钮元素
export interface ButtonElement extends BaseElement {
  type: 'button'
  text: string
  backgroundColor: string
  textColor: string
  borderRadius: number
  url: string
}

// 图标元素
export interface IconElement extends BaseElement {
  type: 'icon'
  iconName: string
  color: string
  size: number
  url: string
}

// 分隔符元素
export interface DividerElement extends BaseElement {
  type: 'divider'
  color: string
  thickness: number
}

// 社交媒体元素
export interface SocialElement extends BaseElement {
  type: 'social'
  platforms: SocialPlatform[]
  iconSize: number
  iconSpacing: number
  alignment: 'left' | 'center' | 'right'
}

export interface SocialPlatform {
  platform: 'twitter' | 'linkedin' | 'github' | 'email' | 'website' | 'instagram' | 'youtube'
  url: string
}

// 元素联合类型
export type CardElement = TextElement | ImageElement | ButtonElement | IconElement | DividerElement | SocialElement

// 名片配置
export interface CardConfig {
  id: string
  name: string
  width: number
  height: number
  backgroundColor: string
  backgroundImage?: string
  elements: CardElement[]
}

// 模板类型
export interface Template {
  id: string
  name: string
  category: 'business' | 'creative' | 'minimal' | 'personal' | 'artistic'
  thumbnail: string
  preview: string
  config: CardConfig
}

// 导出格式
export type ExportFormat = 'png' | 'pdf' | 'svg'
