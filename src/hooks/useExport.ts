'use client'

import React from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { CardConfig } from '@/types/card'

export function useExport(canvasElement: HTMLDivElement | null) {
  const [isExporting, setIsExporting] = React.useState(false)

  const exportToPNG = async (config: CardConfig): Promise<string> => {
    if (!canvasElement) throw new Error('Canvas not found')

    const canvas = await html2canvas(canvasElement, {
      scale: 2, // 高清
      useCORS: true,
      backgroundColor: config.backgroundColor,
    })

    return canvas.toDataURL('image/png')
  }

  const exportToPDF = async (config: CardConfig): Promise<Blob> => {
    const pngDataUrl = await exportToPNG(config)
    const pdf = new jsPDF({
      orientation: config.width > config.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [config.width, config.height],
    })

    pdf.addImage(pngDataUrl, 'PNG', 0, 0, config.width, config.height)
    return pdf.output('blob')
  }

  const exportToSVG = async (config: CardConfig): Promise<string> => {
    if (!canvasElement) throw new Error('Canvas not found')

    // 使用 html2canvas 获取 HTML 内容
    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: config.backgroundColor,
    })

    // 简单的 SVG 包装
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <img src="${canvas.toDataURL('image/png')}" width="${config.width}" height="${config.height}" />
          </div>
        </foreignObject>
      </svg>
    `

    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  const downloadFile = (data: string | Blob, filename: string) => {
    const link = document.createElement('a')
    link.href = typeof data === 'string' ? data : URL.createObjectURL(data)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    if (typeof data !== 'string') {
      URL.revokeObjectURL(link.href)
    }
  }

  const exportCard = async (
    config: CardConfig,
    format: 'png' | 'pdf' | 'svg'
  ) => {
    setIsExporting(true)

    try {
      const timestamp = new Date().toISOString().slice(0, 10)
      const filename = `digital-card-${timestamp}`

      switch (format) {
        case 'png':
          const pngData = await exportToPNG(config)
          downloadFile(pngData, `${filename}.png`)
          break

        case 'pdf':
          const pdfBlob = await exportToPDF(config)
          downloadFile(pdfBlob, `${filename}.pdf`)
          break

        case 'svg':
          const svgData = await exportToSVG(config)
          downloadFile(svgData, `${filename}.svg`)
          break
      }

      return true
    } catch (error) {
      console.error('Export failed:', error)
      throw error
    } finally {
      setIsExporting(false)
    }
  }

  return {
    isExporting,
    exportCard,
  }
}
