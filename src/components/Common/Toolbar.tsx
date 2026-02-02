'use client'

import { CardConfig } from '@/types/card'
import { Undo, Redo, Download, Layers, Sparkles, Menu, BarChart, User as UserIcon, Crown } from 'lucide-react'
import { useCardStore } from '@/store/cardStore'
import { useUser } from '@/contexts/UserContext'
import AuthModal from '@/components/User/AuthModal'
import SubscriptionModal from '@/components/User/SubscriptionModal'
import { useState } from 'react'

interface ToolbarProps {
  onShowTemplates: () => void
  config: CardConfig | null
}

export default function Toolbar({ onShowTemplates, config }: ToolbarProps) {
  const { undo, redo, canUndo, canRedo } = useCardStore()
  const { user, isAuthenticated, showAuthModal, showSubscriptionModal, setShowAuthModal, setShowSubscriptionModal } =
    useUser()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSubscribe = () => {
    setShowSubscriptionModal(true)
    setShowUserMenu(false)
  }

  const handleProfile = () => {
    setShowUserMenu(false)
    window.location.href = '/profile'
  }

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      window.location.href = '/auth'
    }
  }

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        {/* 左侧：Logo 和 模板按钮 */}
        <div className="flex items-center gap-4">
          <button
            onClick={onShowTemplates}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
            <span className="font-semibold text-gray-900">模板</span>
          </button>

          <div className="h-6 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="font-semibold text-gray-900">电子名片生成器</span>
          </div>
        </div>

        {/* 中间：操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="撤销 (Ctrl+Z)"
          >
            <Undo size={20} className={canUndo() ? 'text-gray-700' : 'text-gray-300'} />
          </button>

          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="重做 (Ctrl+Y)"
          >
            <Redo size={20} className={canRedo() ? 'text-gray-700' : 'text-gray-300'} />
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="图层"
            disabled
          >
            <Layers size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 右侧：用户信息和导出 */}
        <div className="flex items-center gap-3">
          {config && (
            <>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{config.name}</span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
            </>
          )}

          {/* 用户菜单 */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${
                      user.subscription === 'pro'
                        ? 'text-purple-600'
                        : user.subscription === 'basic'
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`}>
                      {user.subscription === 'pro' && '专业版'}
                      {user.subscription === 'basic' && '基础版'}
                      {user.subscription === 'free' && '免费版'}
                    </span>
                    <Crown size={12} className={user.subscription !== 'free' ? 'text-yellow-500' : 'text-gray-300'} />
                  </div>
                </div>
              </button>

              {/* 下拉菜单 */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    个人资料
                  </button>
                  <button
                    onClick={handleSubscribe}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    升级订阅
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <UserIcon size={18} />
              <span>登录</span>
            </button>
          )}

          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            onClick={() => {
              // TODO: 实现导出功能
              alert('导出功能即将上线')
            }}
          >
            <Download size={18} />
            <span>导出</span>
          </button>
        </div>
      </div>

      {/* 认证对话框 */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAuthModal(false)
          }
        }}>
          <AuthModal />
        </div>
      )}

      {/* 订阅对话框 */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowSubscriptionModal(false)
          }
        }}>
          <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />
        </div>
      )}
    </>
  )
}
