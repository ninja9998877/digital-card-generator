'use client'

import { useEffect, useState } from 'react'
import { useAnalyticsStore } from '@/store/analyticsStore'
import { BarChart, LineChart, TrendingUp, Eye, MousePointer, Download, RefreshCw, Play, Square } from 'lucide-react'

interface AnalyticsPanelProps {
  onClose: () => void
}

export default function AnalyticsPanel({ onClose }: AnalyticsPanelProps) {
  const { currentData, historyData, abTests, startABTest, stopABTest, getABTestData, calculateWinner, clearHistory } =
    useAnalyticsStore()

  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  // 模拟实时数据更新（演示用）
  useEffect(() => {
    if (currentData) {
      const timer = setTimeout(() => {
        // 实际应用中，这里会从后端API获取实时数据
        console.log('Fetching real-time analytics...')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [currentData])

  const testData = selectedTest ? getABTestData(selectedTest) : []
  const winnerId = selectedTest ? testData.find(t => t.isWinner)?.variantId : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <BarChart className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">实时数据分析 & A/B测试</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearHistory()
                alert('历史数据已清除')
              }}
              className="p-2 hover:bg-gray-100 rounded"
              title="清除历史数据"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 实时数据概览 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              实时数据概览
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="总浏览量"
                value={currentData?.views || 0}
                icon={Eye}
                color="blue"
                change="+12.5%"
                changePositive={true}
              />
              <MetricCard
                label="总点击数"
                value={currentData?.clicks || 0}
                icon={MousePointer}
                color="green"
                change="+8.3%"
                changePositive={true}
              />
              <MetricCard
                label="转化数"
                value={currentData?.conversions || 0}
                icon={TrendingUp}
                color="purple"
                change="+5.2%"
                changePositive={true}
              />
              <MetricCard
                label="平均停留"
                value={currentData?.avgTime ? `${currentData.avgTime}s` : '0s'}
                icon={BarChart}
                color="orange"
                change="+2.1%"
                changePositive={true}
              />
            </div>
          </div>

          {/* 详细指标 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">关键指标</h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailMetricCard
                label="点击率 (CTR)"
                value={currentData?.ctr ? `${currentData.ctr.toFixed(2)}%` : '0%'}
                description="点击数 / 浏览数"
              />
              <DetailMetricCard
                label="转化率"
                value={currentData?.conversionRate ? `${currentData.conversionRate.toFixed(2)}%` : '0%'}
                description="转化数 / 浏览数"
              />
            </div>
          </div>

          {/* A/B测试管理 */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Square className="w-4 h-4 text-purple-500" />
              A/B测试管理
            </h3>

            {/* 创建新测试 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">创建新的A/B测试</p>
                  <p className="text-xs text-gray-500">对比不同版本的效果</p>
                </div>
                <button
                  onClick={() => {
                    const testId = `test-${Date.now()}`
                    startABTest(testId)
                    setSelectedTest(testId)
                    alert('新的A/B测试已创建')
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-sm"
                >
                  <Play size={16} className="inline mr-2" />
                  开始测试
                </button>
              </div>
            </div>

            {/* 测试列表 */}
            <div className="space-y-3">
              {abTests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无A/B测试数据
                </div>
              ) : (
                abTests.map((test) => (
                  <div
                    key={test.variantId}
                    onClick={() => setSelectedTest(test.variantId.split('-')[0])}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedTest === test.variantId.split('-')[0]
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{test.variantName}</span>
                        {test.isWinner && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            🏆 获胜
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {test.analytics.views} 浏览
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">点击</p>
                        <p className="text-sm font-medium">{test.analytics.clicks}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">转化</p>
                        <p className="text-sm font-medium">{test.analytics.conversions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">CTR</p>
                        <p className="text-sm font-medium">{test.analytics.ctr.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">转化率</p>
                        <p className="text-sm font-medium">{test.analytics.conversionRate.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 测试操作 */}
            {selectedTest && testData.length >= 2 && (
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => {
                    const winnerId = calculateWinner(selectedTest)
                    alert(`测试已完成！获胜者：${winnerId}`)
                  }}
                  className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
                >
                  📊 完成测试并分析获胜者
                </button>
                <button
                  onClick={() => {
                    stopABTest()
                    setSelectedTest(null)
                  }}
                  className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                >
                  停止测试
                </button>
              </div>
            )}
          </div>

          {/* 历史趋势 */}
          {historyData.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LineChart className="w-4 h-4 text-blue-500" />
                历史趋势 (最近{historyData.length}天）
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-end gap-1 h-32">
                  {historyData.map((data, index) => {
                    const height = Math.max(10, (data.views / Math.max(...historyData.map(d => d.views))) * 100)
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-blue-500 rounded-t relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.views} 浏览
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-3 text-xs text-gray-600">
                  <span>最早: {historyData[historyData.length - 1]?.views || 0} 浏览</span>
                  <span>最新: {historyData[0]?.views || 0} 浏览</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => {
              const dataStr = JSON.stringify({ currentData, historyData, abTests }, null, 2)
              const blob = new Blob([dataStr], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const link = document.createElement('a')
              link.href = url
              link.download = `analytics-${new Date().toISOString().slice(0, 10)}.json`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            <Download size={18} className="inline mr-2" />
            导出数据
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

// 指标卡片组件
function MetricCard({
  label,
  value,
  icon: Icon,
  color,
  change,
  changePositive,
}: {
  label: string
  value: number | string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  change: string
  changePositive: boolean
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  } as const

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={20} />
        </div>
        <span className={`text-sm font-medium ${changePositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </div>
  )
}

// 详细指标卡片
function DetailMetricCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  )
}
