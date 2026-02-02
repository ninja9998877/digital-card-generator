'use client'

import { useCardStore } from '@/store/cardStore'
import { CardConfig } from '@/types/card'
import { Download, FileText, Image as ImageIcon } from 'lucide-react'
import { ExportFormat } from '@/types/card'
import { useExport } from '@/hooks/useExport'
import { forwardRef, useImperativeHandle } from 'react'

export interface ExportPanelRef {
  exportCard: (config: CardConfig, format: ExportFormat) => Promise<boolean>
}

interface ExportPanelProps {
  canvasElement: HTMLDivElement | null
}

const ExportPanel = forwardRef<ExportPanelRef, ExportPanelProps>(
  ({ canvasElement }, ref) => {
    const [format, setFormat] = React.useState<ExportFormat>('png')
    const { config } = useCardStore()
    const { isExporting, exportCard } = useExport(canvasElement)

    // 暴露 exportCard 方法给父组件
    useImperativeHandle(ref, () => ({
      exportCard,
    }))

    const handleExport = async () => {
      if (!config) return

      try {
        await exportCard(config, format)
      } catch (error) {
        alert('导出失败，请重试')
      }
    }

    if (!config) {
      return (
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">导出名片</h3>
          <div className="text-center py-8 text-gray-500 text-sm">
            请先选择模板或添加元素
          </div>
        </div>
      )
    }

    return (
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-4">导出名片</h3>

        {/* 导出格式选择 */}
        <div className="space-y-2 mb-6">
          <label className="block text-sm font-medium text-gray-700">
            选择格式
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFormat('png')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                format === 'png'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ImageIcon size={24} className="text-blue-500" />
              <span className="text-sm font-medium">PNG</span>
            </button>

            <button
              onClick={() => setFormat('pdf')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                format === 'pdf'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText size={24} className="text-red-500" />
              <span className="text-sm font-medium">PDF</span>
            </button>

            <button
              onClick={() => setFormat('svg')}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                format === 'svg'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <FileText size={24} className="text-purple-500" />
              <span className="text-sm font-medium">SVG</span>
            </button>
          </div>
        </div>

        {/* 导出信息 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">尺寸</span>
              <span className="font-medium">{config.width} x {config.height}px</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">元素数量</span>
              <span className="font-medium">{config.elements.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">格式</span>
              <span className="font-medium uppercase">{format}</span>
            </div>
          </div>
        </div>

        {/* 导出按钮 */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          {isExporting ? '导出中...' : '导出名片'}
        </button>

        {/* 提示信息 */}
        <div className="mt-4 text-xs text-gray-500">
          <p>免费版支持 PNG 和 PDF 导出</p>
          <p>升级专业版解锁 SVG 导出</p>
        </div>
      </div>
    )
  }
)

ExportPanel.displayName = 'ExportPanel'

export default ExportPanel
