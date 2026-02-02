'use client'

import React from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { CardConfig } from '@/types/card'

export interface ExportOptions {
  scale?: number
  useCORS?: boolean
  backgroundColor?: string
}

export interface ExportResult {
  success: boolean
  error?: string
}

export interface UseExportReturn {
  isExporting: boolean
  error: string | null
  exportAsPNG: () => Promise<ExportResult>
  exportAsPDF: () => Promise<ExportResult>
  exportAsSVG: () => Promise<ExportResult>
}

export function useExport(canvasElement: HTMLDivElement | null): UseExportReturn {
  const [isExporting, setIsExporting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const exportAsPNG = async (): Promise<ExportResult> => {
    if (!canvasElement) return { success: false, error: 'Canvas not found' }

    try {
      setIsExporting(true)
      setError(null)

      const canvas = await html2canvas(canvasElement, {
        scale: 2, // 高清
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const dataUrl = canvas.toDataURL('image/png')
      
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `digital-card-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return { success: true }
    } catch (err) {
      console.error('Export to PNG failed:', err)
      const errorMsg = err instanceof Error ? err.message : '导出PNG失败'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPDF = async (): Promise<ExportResult> => {
    if (!canvasElement) return { success: false, error: 'Canvas not found' }

    try {
      setIsExporting(true)
      setError(null)

      const canvas = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const dataUrl = canvas.toDataURL('image/png')
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [800, 600],
      })

      pdf.addImage(dataUrl, 'PNG', 0, 0, 800, 600)
      pdf.save(`digital-card-${Date.now()}.pdf`)

      return { success: true }
    } catch (err) {
      console.error('Export to PDF failed:', err)
      const errorMsg = err instanceof Error ? err.message : '导出PDF失败'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsSVG = async (): Promise<ExportResult> => {
    if (!canvasElement) return { success: false, error: 'Canvas not found' }

    try {
      setIsExporting(true)
      setError(null)

      // 使用 html2canvas 获取 HTML 内容
      const canvas = await html2canvas(canvasElement, {
        scale: 1,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      // 创建 SVG 包装
      const width = canvasElement.offsetWidth
      const height = canvasElement.offsetHeight

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml" style="width:100%;height:100%">
              <img src="${canvas.toDataURL('image/png')}" width="${width}" height="${height}" />
            </div>
          </foreignObject>
        </svg>
      `

      // 转换为 base64
      const base64Data = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))

      // 下载
      const link = document.createElement('a')
      link.href = base64Data
      link.download = `digital-card-${Date.now()}.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      return { success: true }
    } catch (err) {
      console.error('Export to SVG failed:', err)
      const errorMsg = err instanceof Error ? err.message : '导出SVG失败'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setIsExporting(false)
    }
  }

  return {
    isExporting,
    error,
    exportAsPNG,
    exportAsPDF,
    exportAsSVG,
  }
}
