'use client'

import React from 'react'
import { QrCodeIcon, Download } from 'lucide-react'
import { useCardStore } from '@/store/cardStore'

// 生成二维码URL（使用公共API）
const generateQRCode = async (text: string, size: number = 200) => {
  const response = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`)
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

interface QRCodeGeneratorProps {
  onClose: () => void
}

export default function QRCodeGenerator({ onClose }: QRCodeGeneratorProps) {
  const { config } = useCardStore()
  const [qrCodeUrl, setQrCodeUrl] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [qrText, setQrText] = React.useState('')

  const handleGenerate = async () => {
    if (!qrText.trim()) {
      alert('请输入要生成二维码的内容')
      return
    }

    setIsLoading(true)
    try {
      const url = await generateQRCode(qrText, 300)
      setQrCodeUrl(url)
    } catch (error) {
      console.error('QR Code generation failed:', error)
      alert('二维码生成失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!qrCodeUrl) return

    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = 'qrcode.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleAddToCard = () => {
    if (!qrCodeUrl) return

    const { addElement } = useCardStore.getState()
    addElement({
      id: `qrcode-${Date.now()}`,
      type: 'image',
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      zIndex: config?.elements.length || 0,
      src: qrCodeUrl,
      alt: '二维码',
      borderRadius: 10,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <QrCodeIcon className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">生成二维码</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 输入框 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            二维码内容
          </label>
          <textarea
            value={qrText}
            onChange={(e) => setQrText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
            placeholder="输入URL、文本或联系信息"
          />
        </div>

        {/* 预设选项 */}
        <div className="mb-6 space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            快速预设
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setQrText(window.location.href)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              当前页面URL
            </button>
            <button
              onClick={() => {
                if (config) {
                  setQrText(`${config.name}\n${config.elements.find(e => e.type === 'text')?.type === 'text' ? (config.elements[0] as any).content : ''}`)
                }
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              名片信息
            </button>
            <button
              onClick={() => setQrText('mailto:your@email.com')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              邮箱地址
            </button>
            <button
              onClick={() => setQrText('tel:+1234567890')}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              电话号码
            </button>
          </div>
        </div>

        {/* 二维码预览 */}
        {qrCodeUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预览
            </label>
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-6">
              <img src={qrCodeUrl} alt="QR Code" className="max-w-full" />
            </div>
          </div>
        )}

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !qrText.trim()}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? '生成中...' : '生成二维码'}
          </button>

          {qrCodeUrl && (
            <>
              <button
                onClick={handleDownload}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Download size={18} />
              </button>
              <button
                onClick={handleAddToCard}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
              >
                添加到名片
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
