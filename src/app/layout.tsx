import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '电子名片生成器 | Digital Card Generator',
  description: '快速创建专业电子名片，拖拽式设计器，多种模板可选',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
