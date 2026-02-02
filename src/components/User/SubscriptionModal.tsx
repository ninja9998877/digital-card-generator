'use client'

import { useState } from 'react'
import { useUserStore, SubscriptionPlan } from '@/store/userStore'
import { Crown, Check, Loader2, AlertTriangle, Download } from 'lucide-react'

interface SubscriptionModalProps {
  onClose: () => void
}

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const { user, currentPlan, plans, subscribe, cancelSubscription, isLoading, error } =
    useUserStore()
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month')

  const handleSubscribe = async (planId: string) => {
    try {
      await subscribe(planId)
      alert(`成功订阅${plans.find(p => p.id === planId)?.name}！`)
      onClose()
    } catch (err) {
      // 错误已经在 store 中处理
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('确定要取消订阅吗？取消后，您将在当前计费周期结束后降级到免费版。')) {
      return
    }

    try {
      await cancelSubscription()
      alert('订阅已取消')
      onClose()
    } catch (err) {
      // 错误已经在 store 中处理
    }
  }

  const calculateAnnualPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 12 * 0.8) // 年付8折
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl m-4">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-yellow-500" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">升级您的订阅</h2>
              <p className="text-sm text-gray-500">选择最适合您的计划</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-2">
            <AlertTriangle size={20} className="mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 计费周期选择 */}
        <div className="px-6 mb-6">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setBillingCycle('month')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                billingCycle === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              月付
            </button>
            <button
              onClick={() => setBillingCycle('year')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                billingCycle === 'year'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              年付
            </button>
            <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
              年付立省 20%
            </span>
          </div>
        </div>

        {/* 订阅计划 */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id
              const price = billingCycle === 'year' ? calculateAnnualPrice(plan.price) : plan.price
              const savings = billingCycle === 'year' && plan.price > 0
                ? Math.round((1 - calculateAnnualPrice(plan.price) / (plan.price * 12)) * 100)
                : 0

              return (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-xl p-6 transition-all ${
                    plan.popular
                      ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50'
                      : isCurrentPlan
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* 推荐标签 */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                      最受欢迎
                    </div>
                  )}

                  {/* 计划标题 */}
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {price === 0 ? '免费' : `¥${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-sm text-gray-500">/{billingCycle === 'year' ? '年' : '月'}</span>
                      )}
                    </div>
                    {savings > 0 && (
                      <p className="text-sm text-green-600 mt-1">年付省 {savings}%</p>
                    )}
                  </div>

                  {/* 功能列表 */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* 订阅/取消按钮 */}
                  {isCurrentPlan ? (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={isLoading || plan.id === 'free'}
                      className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      取消订阅
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isLoading || (plan.id === 'free' && user?.subscription !== 'free')}
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin inline mr-2" size={18} />
                          处理中...
                        </>
                      ) : plan.id === 'free' ? '降级到免费版' : '升级到' + plan.name}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 发票历史 */}
        {user && user.subscription !== 'free' && (
          <div className="px-6 pb-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">发票历史</h3>
              <button className="text-sm text-blue-500 hover:text-blue-600">
                查看全部
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                {[
                  { date: '2026-02-01', amount: '¥99', status: '已支付' },
                  { date: '2026-01-01', amount: '¥99', status: '已支付' },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <Download size={16} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">订阅费用</p>
                        <p className="text-xs text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{invoice.amount}</p>
                      <p className="text-xs text-green-600">{invoice.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>所有计划均可随时取消，取消后您将在当前计费周期结束后降级到免费版。</p>
            <p>订阅会自动续费，您可以随时在设置中关闭自动续费。</p>
            <p>如有任何问题，请联系我们的客服团队。</p>
          </div>
        </div>
      </div>
    </div>
  )
}
