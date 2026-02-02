'use client'

import React from 'react'
import Head from 'next/head'

interface SEODefaultsProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

export function SEODefaults({
  title = '电子名片生成器 | Digital Card Generator',
  description = '快速创建专业电子名片，拖拽式设计器，多种模板可选，AI智能推荐，数据分析',
  image = '/og-image.jpg',
  url = '',
}: SEODefaultsProps) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://digitalcard.app')

  return (
    <Head>
      {/* 基础 Meta 标签 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="电子名片,名片设计,名片生成器,数字名片,个人品牌" />
      <meta name="author" content="Digital Card Generator Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Open Graph 标签 */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card 标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* 其他 Meta 标签 */}
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#0ea5e9" />

      {/* 预连接 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
    </Head>
  )
}
