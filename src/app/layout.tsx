import './globals.css'
import type { Metadata } from 'next'
import { ToastProvider } from '@/contexts/ToastContext'
import { Toast } from '@/components/Common/Toast'

export const metadata: Metadata = {
  title: '电子名片生成器 | Digital Card Generator',
  description: '快速创建专业电子名片，拖拽式设计器，多种模板可选，AI智能推荐，数据分析',
  keywords: '电子名片,名片设计,名片生成器,数字名片,个人品牌',
  openGraph: {
    title: '电子名片生成器',
    description: '快速创建专业电子名片，拖拽式设计器，多种模板可选',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '电子名片生成器',
    description: '快速创建专业电子名片，拖拽式设计器，多种模板可选',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  )
}
